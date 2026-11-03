import React from 'react';
import { WorkflowTab } from './Sidebar';
import { Language, Channel, DailyQuota } from '../types';
import { translations } from '../i18n';
import { User } from 'firebase/auth';
import { 
  Tv, 
  Radar, 
  FileText, 
  Mic2, 
  Layers, 
  CalendarClock, 
  X,
  Clock,
  ShieldAlert,
  User as UserIcon,
  LogOut,
  CheckCircle2
} from 'lucide-react';

interface MobileNavProps {
  currentTab: WorkflowTab;
  onSelectTab: (tab: WorkflowTab) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  channels: Channel[];
  activeChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  quota: DailyQuota;
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  language,
  onLanguageChange,
  channels,
  activeChannel,
  onSelectChannel,
  quota,
  isDrawerOpen,
  onCloseDrawer,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const t = translations[language];

  const items = [
    { id: 'channels' as WorkflowTab, label: language === 'id' ? 'Saluran' : 'Channels', icon: Tv, testId: 'mobile-tab-channels' },
    { id: 'nicheRadar' as WorkflowTab, label: 'Radar', icon: Radar, testId: 'mobile-tab-radar' },
    { id: 'scriptStudio' as WorkflowTab, label: language === 'id' ? 'Naskah' : 'Script', icon: FileText, testId: 'mobile-tab-script' },
    { id: 'voiceover' as WorkflowTab, label: language === 'id' ? 'Suara' : 'Voice', icon: Mic2, testId: 'mobile-tab-voice' },
    { id: 'pipeline' as WorkflowTab, label: 'Pipeline', icon: Layers, testId: 'mobile-tab-pipeline' },
    { id: 'scheduler' as WorkflowTab, label: language === 'id' ? 'Jadwal' : 'Schedule', icon: CalendarClock, testId: 'mobile-tab-scheduler' },
  ];

  const quotaRemaining = Math.max(0, quota.maxDaily - quota.usedToday);

  return (
    <>
      {/* Fixed Bottom Navigation Bar for Mobile */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0c101a]/95 backdrop-blur-md border-t border-[#1e293b] px-2 py-1.5 flex items-center justify-around"
        aria-label="Mobile Bottom Navigation"
        data-testid="mobile-bottom-nav"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              data-testid={item.testId}
              className={`flex flex-col items-center justify-center py-1 px-1.5 min-w-[48px] rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-400 font-medium' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Slide-over Drawer for Mobile */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseDrawer}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-[#090d16] border-r border-[#1e293b] h-full flex flex-col justify-between p-5 z-10 shadow-2xl overflow-y-auto">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                <div>
                  <div className="text-lg font-bold font-display text-white">Indi Labs</div>
                  <div className="text-xs text-slate-400">{t.brandTag}</div>
                </div>
                <button
                  onClick={onCloseDrawer}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  aria-label="Close Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile / Auth State in Drawer */}
              <div className="bg-[#121826] border border-[#1e293b] rounded-xl p-3">
                {currentUser ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || 'User'}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 font-bold text-xs">
                          {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">
                          {currentUser.displayName || 'Studio Member'}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onLogout();
                        onCloseDrawer();
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs flex items-center justify-center gap-1.5 font-medium hover:bg-rose-900/50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.auth.logout}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onCloseDrawer();
                      onOpenAuth();
                    }}
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>{t.auth.login} / {t.auth.signup}</span>
                  </button>
                )}
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-1">
                <span className="text-xs text-slate-400 px-2">{t.common.languageSwitch}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onLanguageChange('id')}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                      language === 'id' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    ID
                  </button>
                  <button
                    onClick={() => onLanguageChange('en')}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                      language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Channel Selector */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium">
                  {language === 'id' ? 'Pilih Saluran Aktif' : 'Active Channel'}
                </label>
                <select
                  value={activeChannel?.id || ''}
                  onChange={(e) => {
                    const found = channels.find((c) => c.id === e.target.value);
                    if (found) {
                      onSelectChannel(found);
                      onCloseDrawer();
                    }
                  }}
                  className="w-full bg-[#121826] border border-[#1e293b] text-slate-200 text-xs rounded-lg px-3 py-2.5"
                >
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.name} ({ch.market} · ${ch.avgRPM.toFixed(1)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Nav links */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-slate-500 uppercase px-1 mb-2">
                  {language === 'id' ? 'NAVIGASI STUDIO' : 'STUDIO NAVIGATION'}
                </div>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseDrawer();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-medium'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{t.nav[item.id as keyof typeof t.nav]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quota in Drawer */}
            <div className="pt-4 border-t border-[#1e293b] space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{t.quota.badge}</span>
                <span className="font-mono text-emerald-400 tabular-nums">
                  {quota.usedToday}/{quota.maxDaily}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: `${(quota.usedToday / quota.maxDaily) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500">
                {quotaRemaining} {t.quota.remaining}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
