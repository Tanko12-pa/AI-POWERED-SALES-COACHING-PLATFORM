import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  KeyRound,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Check
} from 'lucide-react';
import { useAuthSubscription } from '../context/AuthSubscriptionContext';
import { SubscriptionPlanType, UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    signIn,
    signUp,
    signOut,
    updateUserPassword,
    resetPasswordByEmail,
    getUserByEmail,
    startSevenDayFreeTrial,
    registeredUsers
  } = useAuthSubscription();

  const [tab, setTab] = useState<'signin' | 'signup' | 'trial' | 'reset' | 'profile'>(authModalMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Sales Rep');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanType>('monthly');
  
  // Password Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Reset password states
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  
  // Feedback messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode with prop
  useEffect(() => {
    setTab(authModalMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    setRevealedPassword(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = signIn(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to sign in');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = signUp(name, email, password, role, selectedPlan);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to sign up');
    } else {
      setName('');
      setEmail('');
      setPassword('');
    }
  };

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (isAuthenticated) {
      startSevenDayFreeTrial(selectedPlan);
      closeAuthModal();
    } else {
      const res = signUp(name, email, password, role, selectedPlan);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create trial account');
      }
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const res = resetPasswordByEmail(resetEmail, newPassword);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to reset password');
    } else {
      setSuccessMsg('Password updated successfully! You can now sign in with your new password.');
      setNewPassword('');
    }
  };

  const handleRevealPassword = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const targetEmail = (resetEmail || email).trim();
    if (!targetEmail) {
      setErrorMsg('Please enter your email above to look up your password.');
      return;
    }
    const user = getUserByEmail(targetEmail);
    if (user) {
      setRevealedPassword(user.password);
      setSuccessMsg(`Account found for ${user.name}! Password revealed below.`);
    } else {
      setErrorMsg('No account found with this email.');
      setRevealedPassword(null);
    }
  };

  const handleUpdatePasswordInProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const res = updateUserPassword(newPassword);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to update password');
    } else {
      setSuccessMsg('Password successfully changed!');
      setNewPassword('');
    }
  };

  const autofillDemoAccount = (user: typeof registeredUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#800000] text-[#A8C66C] shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {tab === 'signin' && 'Sign In to Your Account'}
                {tab === 'signup' && 'Create Account & Start 7-Day Trial'}
                {tab === 'trial' && 'Start 7-Day Free Trial ($0 Today)'}
                {tab === 'reset' && 'Password Recovery & Lookup'}
                {tab === 'profile' && 'User Account & Password Security'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {tab === 'signin' && 'Access your coaching feed, deal scorecards, and playbooks.'}
                {tab === 'signup' && 'Full AI platform access. Instant enterprise workspace.'}
                {tab === 'reset' && 'View, verify, or change your password at any time.'}
                {tab === 'profile' && 'Manage your credentials, role, and profile settings.'}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Pill Row */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1.5 justify-center">
          <button
            onClick={() => { setTab('signin'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'signin'
                ? 'bg-[#800000] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Sign In
          </button>
          
          <button
            onClick={() => { setTab('signup'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-[#800000] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Sign Up
          </button>

          <button
            onClick={() => { setTab('reset'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'reset'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Password Lookup
          </button>

          {isAuthenticated && (
            <button
              onClick={() => { setTab('profile'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'profile'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950'
              }`}
            >
              My Account
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          
          {/* Notifications / Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.morgan@enterprise.ai"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#A8C66C]"
                  />
                </div>
              </div>

              {/* Password Input with Eye Visibility Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setTab('reset');
                    }}
                    className="text-[11px] font-bold text-[#800000] dark:text-red-400 hover:underline cursor-pointer"
                  >
                    Forgot / View Password?
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full pl-9 pr-10 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#A8C66C]"
                  />
                  {/* Eye Toggle to view password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'View password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#800000]" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Toggle the eye icon to verify or view your password anytime.</span>
                </div>
              </div>

              {/* Submit Sign In Button */}
              <button
                type="submit"
                id="modal-signin-submit-btn"
                className="w-full py-2.5 rounded-xl bg-[#800000] hover:bg-[#600000] text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-[#A8C66C]" />
              </button>

              {/* Demo Accounts Quick-Click Pill Fillers */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block text-center">
                  Quick Autofill Demo Accounts (Password: Password123!)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {registeredUsers.slice(0, 3).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => autofillDemoAccount(u)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#F3F8EA] dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left text-[11px] transition-all cursor-pointer"
                    >
                      <strong className="block text-slate-800 dark:text-slate-200 font-bold truncate">{u.name}</strong>
                      <span className="text-[10px] text-slate-500 block truncate">{u.role}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign Up Callout */}
              <div className="p-3 rounded-xl bg-[#F3F8EA] dark:bg-slate-800/80 border border-[#A8C66C] flex items-center justify-between gap-2">
                <div>
                  <strong className="text-xs font-bold text-[#800000] dark:text-lime-300 block">
                    Don't have an account yet?
                  </strong>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    Create an account for full AI platform access.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className="px-3 py-1.5 rounded-lg bg-[#800000] text-white text-xs font-extrabold hover:bg-[#600000] transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#A8C66C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.smith@enterprise.ai"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#A8C66C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Create Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-bold text-[#800000] dark:text-red-400 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-[#800000]" />}
                    <span>{showPassword ? 'Hide' : 'Show Password'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters..."
                    className="w-full pl-9 pr-10 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#A8C66C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select User Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#A8C66C]"
                >
                  <option value="Sales Rep">Sales Rep (Individual Contributor)</option>
                  <option value="Sales Manager">Sales Manager (Team Leader)</option>
                  <option value="Admin">Admin (Full System Control)</option>
                </select>
              </div>

              <button
                type="submit"
                id="modal-signup-submit-btn"
                className="w-full py-2.5 rounded-xl bg-[#800000] hover:bg-[#600000] text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Create Account</span>
                <Sparkles className="w-4 h-4 text-[#A8C66C]" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setTab('signin')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Already have an account? <strong className="text-[#800000] dark:text-red-400 underline">Sign In</strong>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PASSWORD LOOKUP, REVEAL & RESET */}
          {tab === 'reset' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <span>On-Demand Password Lookup & Instant Reset</span>
                </div>
                <p>
                  Every user can view their current password or set a new password at any time.
                </p>
              </div>

              {/* Step 1: Lookup Email */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enter Your Registered Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="alex.morgan@enterprise.ai"
                    className="flex-1 p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleRevealPassword}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 text-white font-extrabold text-xs hover:bg-slate-700 transition-all shrink-0 cursor-pointer"
                  >
                    Reveal Password
                  </button>
                </div>
              </div>

              {/* Revealed Password Box */}
              {revealedPassword && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-700 space-y-2">
                  <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 block">
                    Current Stored Password for {resetEmail}:
                  </span>
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800 font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                    <span>{revealedPassword}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(revealedPassword);
                        setSuccessMsg('Password copied to clipboard!');
                      }}
                      className="text-xs font-bold text-[#800000] dark:text-red-400 hover:underline cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(resetEmail);
                      setPassword(revealedPassword);
                      setTab('signin');
                    }}
                    className="w-full py-1.5 rounded-lg bg-[#800000] text-white text-xs font-extrabold hover:bg-[#600000] cursor-pointer"
                  >
                    Fill into Sign In Form & Log In
                  </button>
                </div>
              )}

              {/* Step 2: Reset to a New Password */}
              <form onSubmit={handleResetPassword} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Or Set a New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)..."
                    className="w-full p-2 pr-10 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-slate-400"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#800000]" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer"
                >
                  Save New Password
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: USER PROFILE & PASSWORD SECURITY */}
          {tab === 'profile' && currentUser && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[#800000] text-[#A8C66C] flex items-center justify-center font-black text-sm">
                      {currentUser.name[0]}
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 block">{currentUser.name}</strong>
                      <span className="text-[11px] text-slate-500">{currentUser.email}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#800000] text-white text-[10px] font-bold">
                    {currentUser.role}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Subscription Status:</span>
                  <span className="font-extrabold text-[#800000] dark:text-red-400">
                    {currentUser.subscription.status === 'trialing' && `✨ 7-Day Free Trial (${currentUser.subscription.trialDaysRemaining} days remaining)`}
                    {currentUser.subscription.status === 'active_monthly' && '💳 Monthly Pro Plan ($15.99/mo)'}
                    {currentUser.subscription.status === 'active_yearly' && '💎 Yearly Pro Plan ($155.99/yr)'}
                    {currentUser.subscription.status === 'canceled' && '⚠️ Canceled'}
                  </span>
                </div>
              </div>

              {/* Password View & Change Section */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#800000]" />
                    <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Saved Password</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-bold text-[#800000] dark:text-red-400 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide Password' : 'Show Password'}</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                  {showPassword ? currentUser.password : '••••••••••••'}
                </div>

                {/* Change password form */}
                <form onSubmit={handleUpdatePasswordInProfile} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Change to a New Password
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password..."
                      className="flex-1 p-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-[#800000] text-white font-extrabold text-xs hover:bg-[#600000] transition-all cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>

              {/* Sign Out Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    closeAuthModal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-950 text-slate-800 dark:text-slate-200 hover:text-red-700 dark:hover:text-red-400 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Sign Out of Account
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
