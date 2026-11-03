import React, { useState } from 'react';
import { Language, Channel, DailyQuota } from '../types';
import { translations } from '../i18n';
import { User } from 'firebase/auth';
import { UserProfile } from '../lib/firebase';
import { 
  Globe, 
  Menu, 
  ShieldAlert, 
  User as UserIcon, 
  LogOut, 
  CheckCircle2, 
  ChevronDown 
} from 'lucide-react';

interface TopBarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeChannel: Channel | null;
  quota: DailyQuota;
  onOpenMobileMenu: () => void;
  currentUser: User | null;
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  language,
  onLanguageChange,
  activeChannel,
  quota,
  onOpenMobileMenu,
  currentUser,
  userProfile,
  onOpenAuth,
  onLogout,
}) => {
  const t = translations[language];
  const quotaRemaining = Math.max(0, quota.maxDaily - quota.usedToday);
  const isQuotaFull = quotaRemaining === 0;

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 md:gap-8 px-4 md:px-8 py-3 bg-[#090d16]/95 backdrop-blur-md border-b border-[#1e293b]">
      {/* Zone 1: Single text element Brand Zone */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Open Navigation Drawer"
          data-testid="mobile-menu-btn"
        >
          <Menu className="w-5 h-5" />
        </button>

        <a 
          href="/" 
          className="flex items-baseline gap-2 text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display"
          data-testid="brand-logo"
        >
          <span>Indi Labs</span>
          <span className="hidden lg:inline text-xs font-normal text-slate-500 font-sans tracking-normal">
            · Studio Faceless AI
          </span>
        </a>
      </div>

      {/* Zone 2: Contextual Metadata (Active Channel & Market) */}
      <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 shrink-0">
        {activeChannel && (
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">{activeChannel.name}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-blue-400">{activeChannel.market} ({activeChannel.currency})</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-emerald-400 tabular-nums">Avg RPM: ${activeChannel.avgRPM.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Zone 3: Actions - Quota Limit Counter, Auth Profile, and Language Switcher */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Strict 5 Videos/Day Quota Indicator */}
        <div 
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono tabular-nums transition-colors ${
            isQuotaFull
              ? 'bg-rose-950/40 border-rose-800/80 text-rose-300'
              : quotaRemaining === 1
              ? 'bg-amber-950/30 border-amber-800/60 text-amber-300'
              : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}
          title={`${t.quota.used}: ${quota.usedToday}/${quota.maxDaily}. ${t.quota.resetIn} 07h 24m`}
          data-testid="quota-counter"
        >
          {isQuotaFull ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          )}
          <span className="whitespace-nowrap font-medium">
            {quota.usedToday}/{quota.maxDaily} {language === 'id' ? 'Video/Hari' : 'Videos/Day'}
          </span>
        </div>

        {/* User Authentication Control */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 md:px-2.5 md:py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-xs cursor-pointer"
              data-testid="user-profile-menu"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-6 h-6 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 font-bold text-[10px]">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                </div>
              )}
              <span className="hidden sm:inline font-medium text-slate-200 max-w-[100px] truncate">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:inline" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-[#0f1422] border border-[#1e293b] rounded-xl shadow-2xl py-2 z-50 animate-in"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-[#1e293b]">
                  <div className="text-xs font-bold text-white truncate">
                    {currentUser.displayName || 'Studio Member'}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                    {currentUser.email}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Firebase Auth Verified</span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={onLogout}
                    className="w-full px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 text-left transition-colors cursor-pointer"
                    data-testid="logout-btn"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.auth.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer whitespace-nowrap"
            data-testid="open-auth-btn"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{t.auth.login}</span>
          </button>
        )}

        {/* Bilingual Language Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5" data-testid="lang-toggle">
          <button
            type="button"
            onClick={() => onLanguageChange('id')}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              language === 'id'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            data-testid="lang-id-btn"
          >
            ID
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            data-testid="lang-en-btn"
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
};
