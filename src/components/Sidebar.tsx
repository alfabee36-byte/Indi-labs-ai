import React from 'react';
import { Language, Channel, DailyQuota } from '../types';
import { translations } from '../i18n';
import { 
  Tv, 
  Radar, 
  FileText, 
  Mic2, 
  Layers, 
  CalendarClock, 
  ChevronRight,
  TrendingUp,
  Flame,
  AlertTriangle,
  Clock
} from 'lucide-react';

export type WorkflowTab = 
  | 'channels' 
  | 'nicheRadar' 
  | 'scriptStudio' 
  | 'voiceover' 
  | 'pipeline' 
  | 'scheduler';

interface SidebarProps {
  currentTab: WorkflowTab;
  onSelectTab: (tab: WorkflowTab) => void;
  language: Language;
  channels: Channel[];
  activeChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  quota: DailyQuota;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  language,
  channels,
  activeChannel,
  onSelectChannel,
  quota,
}) => {
  const t = translations[language];

  const navItems = [
    {
      id: 'channels' as WorkflowTab,
      label: t.nav.channels,
      icon: Tv,
      testId: 'channel-hub-tab',
      badge: `${channels.length} ${language === 'id' ? 'Negara' : 'Mkts'}`
    },
    {
      id: 'nicheRadar' as WorkflowTab,
      label: t.nav.nicheRadar,
      icon: Radar,
      testId: 'niche-radar-tab',
      badge: 'High-RPM'
    },
    {
      id: 'scriptStudio' as WorkflowTab,
      label: t.nav.scriptStudio,
      icon: FileText,
      testId: 'script-studio-tab',
      badge: 'AI Script'
    },
    {
      id: 'voiceover' as WorkflowTab,
      label: t.nav.voiceover,
      icon: Mic2,
      testId: 'voiceover-studio-tab',
      badge: 'Natural TTS'
    },
    {
      id: 'pipeline' as WorkflowTab,
      label: t.nav.pipeline,
      icon: Layers,
      testId: 'batch-pipeline-tab',
      badge: '6-Stage'
    },
    {
      id: 'scheduler' as WorkflowTab,
      label: t.nav.scheduler,
      icon: CalendarClock,
      testId: 'platform-scheduler-tab',
      badge: 'YT·IG·TT·FB'
    },
  ];

  const quotaPercent = Math.min(100, Math.round((quota.usedToday / quota.maxDaily) * 100));
  const isQuotaFull = quota.usedToday >= quota.maxDaily;

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 bg-[#0c101a] border-r border-[#1e293b] min-h-[calc(100vh-57px)] p-4 justify-between">
      <div className="space-y-6">
        {/* Active Channel Quick Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
            <span>{language === 'id' ? 'SALURAN AKTIF' : 'ACTIVE CHANNEL'}</span>
            <span className="font-mono text-emerald-400 text-[11px]">
              {activeChannel?.rpmRange}
            </span>
          </div>

          <div className="relative">
            <select
              value={activeChannel?.id || ''}
              onChange={(e) => {
                const found = channels.find((c) => c.id === e.target.value);
                if (found) onSelectChannel(found);
              }}
              className="w-full bg-[#121826] border border-[#1e293b] text-slate-200 text-xs rounded-lg px-3 py-2.5 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer pr-8 font-sans"
              data-testid="channel-selector"
            >
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name} ({ch.market} · ${ch.avgRPM.toFixed(1)} RPM)
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▾
            </div>
          </div>
        </div>

        {/* 6 Core Studio Workflows */}
        <div className="space-y-1">
          <div className="text-[11px] font-mono tracking-wider text-slate-500 uppercase px-2 mb-2">
            {language === 'id' ? 'ALUR KERJA STUDIO' : 'STUDIO WORKFLOWS'}
          </div>

          <nav className="space-y-1" aria-label="Studio Workflows Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  data-testid={item.testId}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-all text-left group ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#121826] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-blue-500/20 text-blue-300' : 'text-slate-500 group-hover:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Strict 5 Videos/Day Quota Limiter Box */}
      <div className="pt-4 border-t border-[#1e293b]/70 space-y-3">
        <div className="bg-[#121826] border border-[#1e293b] rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.quota.badge}</span>
            </div>
            <span className={`text-xs font-mono tabular-nums font-semibold ${
              isQuotaFull ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {quota.usedToday} / {quota.maxDaily}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isQuotaFull ? 'bg-rose-500' : quotaPercent >= 80 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${quotaPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{isQuotaFull ? t.quota.limitReached : `${quota.maxDaily - quota.usedToday} ${t.quota.remaining}`}</span>
            <span className="font-mono text-slate-500">00:00 UTC</span>
          </div>

          {isQuotaFull && (
            <div className="flex items-start gap-1.5 text-[11px] text-rose-300/90 bg-rose-950/30 p-2 rounded border border-rose-900/40">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
              <span>{t.quota.limitDesc}</span>
            </div>
          )}
        </div>

        {/* Studio System Trust Footer */}
        <div className="text-[11px] text-slate-500 text-center font-mono">
          Indi Labs Studio · v2.4 Swiss Precision
        </div>
      </div>
    </aside>
  );
};
