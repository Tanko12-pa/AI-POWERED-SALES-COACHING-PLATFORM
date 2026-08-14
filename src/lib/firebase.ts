import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(firebaseApp);

// Initialize Firestore with specific databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId)
  : getFirestore(firebaseApp);

// Firestore Collection Helpers
export const USERS_COLLECTION = 'users';

/**
 * Save or sync user profile and subscription in Firestore
 */
export async function syncUserProfileToFirestore(userId: string, profileData: any) {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userDocRef, {
      ...profileData,
      updatedAt: new Date().toISOString(),
      firestoreSyncedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.warn('⚠️ Firestore user profile sync notice:', error?.message);
    return { success: false, error: error?.message };
  }
}

/**
 * Fetch user profile from Firestore
 */
export async function getUserProfileFromFirestore(userId: string) {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return { success: true, data: snap.data() };
    }
    return { success: false, reason: 'Document does not exist' };
  } catch (error: any) {
    console.warn('⚠️ Firestore fetch notice:', error?.message);
    return { success: false, error: error?.message };
  }
}

/**
 * Save coaching session record in Firestore subcollection
 */
export async function saveCoachingSessionToFirestore(userId: string, sessionData: any) {
  try {
    const sessionId = sessionData.id || `session-${Date.now()}`;
    const sessionRef = doc(db, USERS_COLLECTION, userId, 'coachingSessions', sessionId);
    await setDoc(sessionRef, {
      ...sessionData,
      sessionId,
      userId,
      createdAt: sessionData.createdAt || new Date().toISOString()
    }, { merge: true });
    return { success: true, sessionId };
  } catch (error: any) {
    console.warn('⚠️ Firestore coaching session save notice:', error?.message);
    return { success: false, error: error?.message };
  }
}

/**
 * Save CRM pipeline opportunity in Firestore subcollection
 */
export async function saveOpportunityToFirestore(userId: string, oppData: any) {
  try {
    const oppId = oppData.id || `opp-${Date.now()}`;
    const oppRef = doc(db, USERS_COLLECTION, userId, 'opportunities', oppId);
    await setDoc(oppRef, {
      ...oppData,
      opportunityId: oppId,
      userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true, oppId };
  } catch (error: any) {
    console.warn('⚠️ Firestore opportunity save notice:', error?.message);
    return { success: false, error: error?.message };
  }
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  updateDoc
};
