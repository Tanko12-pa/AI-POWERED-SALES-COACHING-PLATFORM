import React, { useState } from 'react';
import {
  Search,
  Bell,
  Cpu,
  ShieldCheck,
  Download,
  UserCheck,
  Sparkles,
  LayoutDashboard,
  Megaphone,
  Target,
  Mail,
  Shield,
  Settings,
  Sun,
  Moon,
  Building2,
  Zap,
  LogIn,
  LogOut,
  UserPlus,
  CreditCard,
  ChevronDown,
  KeyRound,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { UserRole } from '../types';
import { useAuthSubscription } from '../context/AuthSubscriptionContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenPdfReport: () => void;
  onOpenChatbot: () => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  unreadCount,
  onOpenNotifications,
  onOpenPdfReport,
  onOpenChatbot,
  userRole,
  setUserRole,
  isDarkMode,
  onToggleTheme
}) => {
  const {
    currentUser,
    isAuthenticated,
    openAuthModal,
    openSubscriptionModal,
    signOut,
    trialNotification,
    dismissTrialNotification
  } = useAuthSubscription();

  const [showUserMenu, setShowUserMenu] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard & Coaching', icon: LayoutDashboard },
    { id: 'software', label: 'Software Directory & Guide', icon: Building2 },
    { id: 'marketing', label: 'Marketing Language', icon: Megaphone },
    { id: 'targeting', label: 'Audience Targeting', icon: Target },
    { id: 'email', label: 'Email & Automation', icon: Mail },
    { id: 'system', label: 'System Health & Security', icon: Shield },
    { id: 'settings', label: 'Settings & Playbooks', icon: Settings }
  ];

  const subscriptionStatus = currentUser?.subscription.status;
  const isTrial = subscriptionStatus === 'trialing';
  const trialDaysRemaining = currentUser?.subscription.trialDaysRemaining ?? 7;

  return (
    <header id="main-header" className={`${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'} border-b sticky top-0 z-40 shadow-sm transition-colors duration-200`}>
      
      {/* Dynamic Trial Auto-Transition / Welcome Banner */}
      {trialNotification && (
        <div className="bg-[#800000] text-white px-4 py-2 text-xs font-bold flex items-center justify-between gap-3 border-b border-[#A8C66C]/40 shadow-xs">
          <div className="flex items-center gap-2 max-w-5xl">
            <Zap className="w-4 h-4 text-[#A8C66C] shrink-0" />
            <span>{trialNotification}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openSubscriptionModal('plans')}
              className="px-2.5 py-0.5 rounded-lg bg-[#A8C66C] text-[#800000] text-[11px] font-black hover:bg-white transition-all cursor-pointer"
            >
              View Plans
            </button>
            <button
              onClick={dismissTrialNotification}
              className="text-white/80 hover:text-white text-xs px-1 font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#800000] flex items-center justify-center text-white shadow-md shrink-0">
            <Sparkles className="w-6 h-6 text-[#A8C66C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-lg sm:text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-red-400' : 'text-[#800000]'}`}>
                AI-Powered Sales Coaching Platform
              </h1>
              {isTrial && (
                <button
                  onClick={() => openSubscriptionModal('plans')}
                  className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3F8EA] dark:bg-slate-800 border border-[#A8C66C] text-[#800000] dark:text-lime-400 text-[10px] font-black hover:scale-105 transition-all cursor-pointer"
                  title="7-Day Free Trial active. Click to view auto-transition details."
                >
                  <Clock className="w-3 h-3 text-[#800000] dark:text-lime-400" />
                  <span>7-Day Trial: {trialDaysRemaining}d left</span>
                </button>
              )}
            </div>
            <p className={`text-xs font-medium hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Revenue intelligence, coaching, and marketing optimization in one AI workspace.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xs sm:max-w-sm relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns, system nodes, playbooks..."
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-[#A8C66C] focus:bg-slate-900'
                : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-[#A8C66C] focus:bg-white'
            }`}
          />
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* PRIMARY 7-DAY FREE TRIAL BUTTON */}
          <button
            id="header-7day-trial-btn"
            onClick={() => {
              if (isAuthenticated) {
                openSubscriptionModal('plans');
              } else {
                openAuthModal('trial');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-[#800000] text-white hover:bg-[#600000] border border-[#A8C66C] shadow-sm transition-all hover:scale-102 cursor-pointer shrink-0"
            title="Start 7-Day Free Trial ($0.00 today)"
          >
            <Zap className="w-3.5 h-3.5 text-[#A8C66C] animate-pulse" />
            <span>7-Day Free Trial</span>
          </button>

          {/* STANDALONE SUBSCRIPTION BUTTONS TRIGGER ($15.99 / $155.99) */}
          <button
            id="header-subscription-plans-btn"
            onClick={() => openSubscriptionModal('plans')}
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
            title="View Monthly ($15.99) and Yearly ($155.99) standalone plans"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#800000] dark:text-red-400" />
            <span>Plans ($15.99 / $155.99)</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isDarkMode
                ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 shadow-xs'
            }`}
            title={isDarkMode ? 'Switch to Sleek Light Theme' : 'Switch to High-Contrast Dark Theme'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden lg:inline">Dark</span>
              </>
            )}
          </button>

          {/* PDF Report Quick Button */}
          <button
            id="header-pdf-btn"
            onClick={onOpenPdfReport}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
            title="Download Formatted PDF Report"
          >
            <Download className="w-3.5 h-3.5 text-[#A8C66C]" />
            <span className="hidden md:inline">PDF Report</span>
          </button>

          {/* Chatbot Trigger */}
          <button
            id="header-ai-assistant-btn"
            onClick={onOpenChatbot}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#A8C66C] text-[#800000] hover:bg-[#8BA854] transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Assistant</span>
          </button>

          {/* Notifications Bell */}
          <button
            id="notifications-bell-btn"
            onClick={onOpenNotifications}
            className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
              isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#800000] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* AUTH SECTION: SIGN IN, SIGN UP, SIGN OUT & PROFILE */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                id="header-signin-btn"
                onClick={() => openAuthModal('signin')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="Sign In with password view & recovery"
              >
                <LogIn className="w-3.5 h-3.5 text-[#800000] dark:text-red-400" />
                <span>Sign In</span>
              </button>

              <button
                id="header-signup-btn"
                onClick={() => openAuthModal('signup')}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#800000] text-white hover:bg-[#600000] transition-all cursor-pointer shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#A8C66C]" />
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            <div className="relative flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              
              {/* User Avatar & Dropdown Button */}
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#800000] text-[#A8C66C] flex items-center justify-center font-black text-xs shadow-sm">
                    {currentUser.name[0]}
                  </div>
                  <div className="text-left hidden lg:block">
                    <span className="text-xs font-bold block text-slate-900 dark:text-slate-100 leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight font-medium">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
                      <strong className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">
                        {currentUser.name}
                      </strong>
                      <span className="text-[11px] text-slate-500 block truncate">{currentUser.email}</span>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-[#800000] text-white text-[9px] font-black">
                          {currentUser.role}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#F3F8EA] dark:bg-slate-800 text-[#800000] dark:text-lime-400 text-[9px] font-bold border border-[#A8C66C]">
                          {isTrial ? `Trial (${trialDaysRemaining}d)` : currentUser.subscription.status}
                        </span>
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs">
                      <button
                        onClick={() => {
                          openAuthModal('profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4 text-[#800000]" />
                        <span>View / Change Password</span>
                      </button>

                      <button
                        onClick={() => {
                          openSubscriptionModal('plans');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>Plans & Subscriptions</span>
                      </button>

                      <button
                        onClick={() => {
                          openSubscriptionModal('transition_settings');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                      >
                        <Zap className="w-4 h-4 text-[#A8C66C]" />
                        <span>7-Day Expiry Simulation</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        id="header-signout-btn"
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 font-extrabold text-xs cursor-pointer transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Sign Out Button */}
              <button
                id="quick-signout-btn"
                onClick={signOut}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Primary Nav Links */}
      <div className={`border-t ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-all
                  ${isActive
                    ? isDarkMode
                      ? 'bg-slate-800 text-red-400 border border-[#A8C66C]/60 shadow-xs'
                      : 'bg-white text-[#800000] border border-[#A8C66C] shadow-xs'
                    : isDarkMode
                      ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'}
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? (isDarkMode ? 'text-red-400' : 'text-[#800000]') : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
