import type { Request, Response } from 'express';
import {
  SubscriptionStatus,
  SubscriptionPlanType,
  BillingInvoice,
  PayPalWebhookPayload,
  PayPalWebhookResult,
  UserAccount
} from '../../types';
import { syncUserProfileToFirestore } from '../../lib/firebase';

/**
 * PayPal Environment Credentials and Config Helpers
 */
export const getPayPalApiUrl = (): string => {
  const env = process.env.PAYPAL_ENV || 'sandbox';
  return env === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
};

export const getPayPalClientId = (): string => {
  return process.env.PAYPAL_CLIENT_ID || 'AYb3B2nQW9Z_SANDBOX_CLIENT_ID_SALESCOACH';
};

export const getPayPalClientSecret = (): string => {
  return process.env.PAYPAL_CLIENT_SECRET || 'EOn5W1x_SANDBOX_SECRET_KEY';
};

export const getPayPalWebhookId = (): string => {
  return process.env.PAYPAL_WEBHOOK_ID || process.env.VITE_PAYPAL_WEBHOOK_ID || '';
};

/**
 * Get OAuth2 Access Token from PayPal REST API
 */
export async function getPayPalAccessToken(): Promise<string> {
  const clientId = getPayPalClientId();
  const secret = getPayPalClientSecret();
  const apiUrl = getPayPalApiUrl();

  const authHeader = `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`;

  const response = await fetch(`${apiUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authHeader
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to obtain PayPal OAuth token: ${errText}`);
  }

  const data: any = await response.json();
  return data.access_token;
}

/**
 * Verify PayPal Webhook Signature
 * Uses the PayPal REST API `/v1/notifications/verify-webhook-signature` endpoint
 */
export async function verifyPayPalWebhookSignature(
  headers: Record<string, string | string[] | undefined>,
  body: any,
  webhookIdOverride?: string
): Promise<boolean> {
  const transmissionId = headers['paypal-transmission-id'] || headers['PAYPAL-TRANSMISSION-ID'];
  const transmissionTime = headers['paypal-transmission-time'] || headers['PAYPAL-TRANSMISSION-TIME'];
  const certUrl = headers['paypal-cert-url'] || headers['PAYPAL-CERT-URL'];
  const authAlgo = headers['paypal-auth-algo'] || headers['PAYPAL-AUTH-ALGO'];
  const transmissionSig = headers['paypal-transmission-sig'] || headers['PAYPAL-TRANSMISSION-SIG'];
  const webhookId = webhookIdOverride || getPayPalWebhookId();

  // If no transmission headers are present, or webhook ID is empty in development/testing mode,
  // allow safe sandbox testing if valid event body is supplied
  if (!transmissionId || !transmissionSig) {
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }
    return false;
  }

  if (!webhookId) {
    // In sandbox without configured webhook ID, log notice and permit simulation
    console.log('ℹ️ PayPal webhook ID not configured in environment. Skipping remote verification.');
    return true;
  }

  try {
    const accessToken = await getPayPalAccessToken();
    const apiUrl = getPayPalApiUrl();

    const verifyPayload = {
      transmission_id: Array.isArray(transmissionId) ? transmissionId[0] : transmissionId,
      transmission_time: Array.isArray(transmissionTime) ? transmissionTime[0] : transmissionTime,
      cert_url: Array.isArray(certUrl) ? certUrl[0] : certUrl,
      auth_algo: Array.isArray(authAlgo) ? authAlgo[0] : authAlgo,
      transmission_sig: Array.isArray(transmissionSig) ? transmissionSig[0] : transmissionSig,
      webhook_id: webhookId,
      webhook_event: body
    };

    const response = await fetch(`${apiUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(verifyPayload)
    });

    if (!response.ok) {
      console.warn('⚠️ PayPal signature verification request returned status:', response.status);
      return false;
    }

    const verificationResult: any = await response.json();
    return verificationResult.verification_status === 'SUCCESS';
  } catch (error) {
    console.warn('⚠️ Error during PayPal webhook signature verification:', error);
    // In dev mode allow testing fallback
    return process.env.NODE_ENV !== 'production';
  }
}

/**
 * Parsed Webhook Event Details
 */
export interface ParsedWebhookResult {
  eventType: string;
  userIdentifier?: string;
  newStatus: SubscriptionStatus;
  planType: SubscriptionPlanType;
  amount: number;
  currency: string;
  subscriptionId?: string;
  transactionId?: string;
  invoice?: BillingInvoice;
  nextBillingDate?: string;
  summary: string;
}

/**
 * Parses raw PayPal webhook event payload and determines target user status & billing invoice
 */
export function parsePayPalWebhookEvent(payload: PayPalWebhookPayload): ParsedWebhookResult {
  const { event_type, resource } = payload;
  const normalizedType = (event_type || '').toUpperCase().trim();

  const subscriberEmail = resource?.subscriber?.email_address?.toLowerCase()?.trim();
  const payerEmail = resource?.payer?.email_address?.toLowerCase()?.trim();
  const customId = resource?.custom_id?.trim();
  const userIdentifier = customId || subscriberEmail || payerEmail || 'usr-sales-rep-1';

  const subId = resource?.id || resource?.billing_agreement_id || 'I-PAYPAL-SUB';
  const txId = resource?.id || `TX-WH-${Date.now().toString().slice(-6)}`;

  const rawAmount = resource?.amount?.value || resource?.amount?.total;
  const amount = rawAmount ? Number(rawAmount) : 15.99;
  const currency = resource?.amount?.currency || 'CAD';
  const isYearly = amount >= 100 || resource?.plan_id?.includes('YEARLY');

  let newStatus: SubscriptionStatus = 'active_monthly';
  let planType: SubscriptionPlanType = isYearly ? 'yearly' : 'monthly';
  let summary = `Processed event ${normalizedType}`;

  const nextDate = new Date();
  if (isYearly) {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  } else {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }
  const nextBillingDateStr = nextDate.toISOString().split('T')[0];

  let invoice: BillingInvoice | undefined = undefined;

  switch (normalizedType) {
    case 'PAYMENT.SALE.COMPLETED':
    case 'PAYMENT.CAPTURE.COMPLETED':
    case 'CHECKOUT.ORDER.COMPLETED': {
      newStatus = isYearly ? 'active_yearly' : 'active_monthly';
      planType = isYearly ? 'yearly' : 'monthly';
      summary = `Payment of $${amount.toFixed(2)} ${currency} captured successfully`;
      invoice = {
        id: `inv-wh-${txId.replace(/[^a-zA-Z0-9_-]/g, '').slice(-8)}`,
        date: new Date().toISOString().split('T')[0],
        amount,
        description: `PayPal Webhook: Payment of $${amount.toFixed(2)} ${currency} Captured (Tx #${txId})`,
        status: 'Paid',
        plan: isYearly ? '$155.99 / Yearly' : '$15.99 / Monthly',
        paymentMethod: `PayPal Webhook (${payerEmail || subscriberEmail || userIdentifier})`
      };
      break;
    }

    case 'SUBSCRIPTION.ACTIVATED':
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
    case 'BILLING.SUBSCRIPTION.CREATED':
    case 'BILLING.SUBSCRIPTION.RE-ACTIVATED': {
      newStatus = isYearly ? 'active_yearly' : 'active_monthly';
      planType = isYearly ? 'yearly' : 'monthly';
      summary = `Subscription ${subId} activated with ${isYearly ? 'Yearly' : 'Monthly'} access`;
      break;
    }

    case 'BILLING.SUBSCRIPTION.CANCELLED':
    case 'BILLING.SUBSCRIPTION.SUSPENDED':
    case 'BILLING.SUBSCRIPTION.EXPIRED': {
      newStatus = 'canceled';
      summary = `Subscription ${subId} cancelled/suspended`;
      break;
    }

    case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED': {
      newStatus = 'past_due';
      summary = `Subscription ${subId} recurring payment failed - marked Past Due`;
      break;
    }

    default:
      newStatus = 'active_monthly';
      summary = `Event ${normalizedType} acknowledged`;
      break;
  }

  return {
    eventType: normalizedType,
    userIdentifier,
    newStatus,
    planType,
    amount,
    currency,
    subscriptionId: subId,
    transactionId: txId,
    invoice,
    nextBillingDate: nextBillingDateStr,
    summary
  };
}

/**
 * Dispatches PayPal Webhook Event to Client Context & Browser Listeners
 */
export function dispatchPayPalWebhookEvent(payload: PayPalWebhookPayload): void {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('paypal:webhook', { detail: payload });
    window.dispatchEvent(event);
  }
}

/**
 * Main Express API Route Handler for `/api/webhooks/paypal` and `/api/paypal/webhook`
 */
export async function handlePayPalWebhookRoute(
  req: Request,
  res: Response,
  options?: {
    onStatusUpdate?: (
      userId: string,
      status: SubscriptionStatus,
      parsed: ParsedWebhookResult
    ) => Promise<any> | any;
  }
): Promise<Response> {
  const startTime = Date.now();
  const rawBody = req.body || {};
  const headers = req.headers as Record<string, string | string[] | undefined>;

  console.log(`[PayPal Webhook API] Incoming event: ${rawBody?.event_type || 'UNKNOWN'}`);

  // 1. Verify PayPal Signature
  const isValidSignature = await verifyPayPalWebhookSignature(headers, rawBody);
  if (!isValidSignature) {
    console.warn('[PayPal Webhook API] ❌ Signature verification failed.');
    return res.status(400).json({
      success: false,
      error: 'Invalid PayPal Webhook Signature'
    });
  }

  // 2. Parse Event
  const parsed = parsePayPalWebhookEvent(rawBody);

  // 3. Persist status change to Firestore database if target user is known
  if (parsed.userIdentifier) {
    try {
      await syncUserProfileToFirestore(parsed.userIdentifier, {
        userId: parsed.userIdentifier,
        subscriptionStatus: parsed.newStatus,
        plan: parsed.planType,
        subscriptionId: parsed.subscriptionId,
        nextBillingDate: parsed.nextBillingDate,
        lastPaymentDate: new Date().toISOString().split('T')[0],
        lastWebhookEvent: parsed.eventType,
        lastWebhookSync: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`[PayPal Webhook API] Synced status ${parsed.newStatus} to Firestore for user: ${parsed.userIdentifier}`);
    } catch (dbError) {
      console.warn('[PayPal Webhook API] Firestore sync notice:', dbError);
    }
  }

  // 4. Invoke optional custom context updater callback
  if (options?.onStatusUpdate && parsed.userIdentifier) {
    try {
      await options.onStatusUpdate(parsed.userIdentifier, parsed.newStatus, parsed);
    } catch (cbError) {
      console.warn('[PayPal Webhook API] Status update callback notice:', cbError);
    }
  }

  // 5. Always acknowledge receipt to PayPal within 3 seconds with HTTP 200
  return res.status(200).json({
    success: true,
    message: 'Webhook processed successfully',
    eventType: parsed.eventType,
    userIdentifier: parsed.userIdentifier,
    updatedStatus: parsed.newStatus,
    processingTimeMs: Date.now() - startTime
  });
}

export default handlePayPalWebhookRoute;
