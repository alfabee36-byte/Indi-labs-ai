import React, { useState } from 'react';
import { Channel, Language, TargetMarket } from '../types';
import { translations } from '../i18n';
import { 
  Plus, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Tv, 
  Check, 
  ExternalLink, 
  Filter,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface ChannelHubProps {
  channels: Channel[];
  activeChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  onAddChannel: (channel: Channel) => void;
  language: Language;
}

export const ChannelHub: React.FC<ChannelHubProps> = ({
  channels,
  activeChannel,
  onSelectChannel,
  onAddChannel,
  language,
}) => {
  const t = translations[language];
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New channel form state
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    market: 'USA' as TargetMarket,
    currency: 'USD ($)',
    niche: 'FinTech, Wealth & Offshore Banking',
    language: 'English (US)',
    weeklyTarget: 5,
  });

  const marketsList: (TargetMarket | 'all')[] = ['all', 'USA', 'UK', 'CA', 'AU', 'JP', 'Arab Gulf'];

  const filteredChannels = selectedMarket === 'all' 
    ? channels 
    : channels.filter((c) => c.market === selectedMarket);

  const totalRev = channels.reduce((acc, c) => acc + c.estMonthlyRevenueUSD, 0);
  const avgBlendedRPM = channels.length 
    ? (channels.reduce((acc, c) => acc + c.avgRPM, 0) / channels.length).toFixed(1)
    : '0.0';
  const totalSubscribers = channels.reduce((acc, c) => acc + c.subscribers, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const baseRPM = formData.market === 'USA' ? 38.0 : formData.market === 'Arab Gulf' ? 35.0 : formData.market === 'UK' ? 32.0 : 28.0;
    const newChan: Channel = {
      id: `ch-${Date.now()}`,
      name: formData.name.trim(),
      handle: formData.handle.startsWith('@') ? formData.handle : `@${formData.handle}`,
      market: formData.market,
      currency: formData.currency,
      rpmRange: `$${(baseRPM - 6).toFixed(1)} - $${(baseRPM + 10).toFixed(1)}`,
      avgRPM: baseRPM,
      subscribers: 0,
      totalViews: 0,
      niche: formData.niche,
      language: formData.language,
      weeklyTarget: formData.weeklyTarget,
      status: 'syncing',
      estMonthlyRevenueUSD: 0,
      avatarSeed: formData.name.slice(0, 3).toUpperCase(),
      createdDate: new Date().toISOString().split('T')[0],
    };

    onAddChannel(newChan);
    setIsModalOpen(false);
    setFormData({
      name: '',
      handle: '',
      market: 'USA',
      currency: 'USD ($)',
      niche: 'FinTech, Wealth & Offshore Banking',
      language: 'English (US)',
      weeklyTarget: 5,
    });
  };

  return (
    <div className="space-y-6" data-testid="channel-hub">
      {/* Editorial Header Banner with High-Fidelity Asset */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1e293b] bg-[#0c101a]">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/indilabs_channel_banner_1793709421890.jpg"
            alt="Global Faceless Studio"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090d16] via-[#090d16]/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs text-blue-400 font-mono tracking-wider uppercase">
              <span>{language === 'id' ? 'WORKFLOW 01' : 'WORKFLOW 01'}</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'id' ? 'PENGELOLA PORTOFOLIO ADSENSE' : 'ADSENSE PORTFOLIO MANAGER'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
              {t.channels.title}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              {t.channels.subtitle}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all cursor-pointer whitespace-nowrap"
              data-testid="add-channel-btn"
            >
              <Plus className="w-4 h-4" />
              <span>{t.channels.addChannel}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid (Swiss Tabular Numerals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400 font-medium">{t.channels.totalEstimatedRev}</div>
          <div className="text-xl md:text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
            ${totalRev.toLocaleString()}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">/mo</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+24.8% {language === 'id' ? 'bulan ini' : 'this month'}</span>
          </div>
        </div>

        <div className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400 font-medium">{t.channels.blendedRPM}</div>
          <div className="text-xl md:text-2xl font-bold text-emerald-400 font-mono tabular-nums tracking-tight">
            ${avgBlendedRPM}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">/1k views</span>
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            Tier-1 USA & Arab Gulf
          </div>
        </div>

        <div className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400 font-medium">{t.channels.totalSubs}</div>
          <div className="text-xl md:text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
            {totalSubscribers.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            Across 6 Channels
          </div>
        </div>

        <div className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400 font-medium">{t.channels.queueCount}</div>
          <div className="text-xl md:text-2xl font-bold text-blue-400 font-mono tabular-nums tracking-tight">
            4 Videos
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            Ready for Publishing
          </div>
        </div>
      </div>

      {/* Filter Segmented Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0" aria-label="Market Filter">
          {marketsList.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMarket(m)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedMarket === m
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#121826] text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-[#1e293b]'
              }`}
            >
              {m === 'all' ? t.markets.all : m}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono tabular-nums">
          {filteredChannels.length} {language === 'id' ? 'Saluran Terdaftar' : 'Channels Registered'}
        </div>
      </div>

      {/* Channels Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChannels.map((channel) => {
          const isActive = activeChannel?.id === channel.id;
          return (
            <div
              key={channel.id}
              className={`flex flex-col justify-between p-5 rounded-xl border transition-all ${
                isActive
                  ? 'bg-[#121826] border-blue-500/60 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/30'
                  : 'bg-[#0f1422] border-[#1e293b] hover:border-slate-700'
              }`}
              data-testid={`channel-card-${channel.id}`}
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900/60 to-slate-900 border border-blue-500/30 flex items-center justify-center font-bold text-white font-display text-sm">
                      {channel.avatarSeed}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                        {channel.name}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Active Channel" />
                        )}
                      </h3>
                      <div className="text-xs text-slate-400 font-mono">
                        {channel.handle}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-xs text-blue-400 bg-blue-950/40 border border-blue-800/40 px-2 py-0.5 rounded">
                    {channel.market}
                  </span>
                </div>

                {/* Metadata row (Clean unboxed text) */}
                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 border-t border-[#1e293b]/70">
                  <span className="text-slate-300 truncate max-w-[170px]">{channel.niche}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono">{channel.currency}</span>
                </div>

                {/* Stats breakdown */}
                <div className="grid grid-cols-2 gap-2 bg-[#090d16] p-3 rounded-lg border border-[#1e293b]/60">
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Est. AdSense RPM</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                      {channel.rpmRange}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Monthly Rev (Est.)</div>
                    <div className="text-sm font-bold text-white font-mono tabular-nums">
                      ${channel.estMonthlyRevenueUSD.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Subscribers & Target */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono text-slate-300 tabular-nums">
                      {channel.subscribers.toLocaleString()} {language === 'id' ? 'subs' : 'subs'}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">
                    {channel.weeklyTarget} {language === 'id' ? 'vid/minggu' : 'vid/wk'}
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="pt-4 mt-4 border-t border-[#1e293b]/60">
                <button
                  onClick={() => onSelectChannel(channel)}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 cursor-default'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
                  }`}
                  data-testid={`select-channel-${channel.id}`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-blue-400" />
                      <span>{t.channels.currentActive}</span>
                    </>
                  ) : (
                    <span>{t.channels.switchActive}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Channel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f1422] border border-[#1e293b] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <h2 className="text-lg font-bold text-white font-display">
                {t.channels.modal.title}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.channels.modal.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Wealth Chronicles"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.channels.modal.handleLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder="@apexwealth"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.channels.modal.marketLabel}
                  </label>
                  <select
                    value={formData.market}
                    onChange={(e) => {
                      const m = e.target.value as TargetMarket;
                      const curr = m === 'UK' ? 'GBP (£)' : m === 'Arab Gulf' ? 'AED / SAR' : m === 'JP' ? 'JPY (¥)' : m === 'CA' ? 'CAD (C$)' : m === 'AU' ? 'AUD (A$)' : 'USD ($)';
                      setFormData({ ...formData, market: m, currency: curr });
                    }}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="USA">USA (USD)</option>
                    <option value="UK">UK (GBP)</option>
                    <option value="Arab Gulf">Arab Gulf (AED/SAR)</option>
                    <option value="CA">Canada (CAD)</option>
                    <option value="AU">Australia (AUD)</option>
                    <option value="JP">Japan (JPY)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.channels.modal.weeklyTargetLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={formData.weeklyTarget}
                    onChange={(e) => setFormData({ ...formData, weeklyTarget: parseInt(e.target.value, 10) || 5 })}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.channels.modal.nicheLabel}
                </label>
                <select
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="FinTech, Wealth & Offshore Banking">FinTech, Wealth & Offshore Banking ($38+ RPM)</option>
                  <option value="SaaS & Enterprise AI Automation">SaaS & Enterprise AI Automation ($34+ RPM)</option>
                  <option value="Luxury Real Estate & Superyachts">Luxury Real Estate & Superyachts ($42+ RPM)</option>
                  <option value="Solar, Clean Tech & Megaprojects">Solar, Clean Tech & Megaprojects ($30+ RPM)</option>
                  <option value="Longevity, Bio-hacking & Health Tech">Longevity, Bio-hacking & Health Tech ($28+ RPM)</option>
                  <option value="Personal Finance & High-Yield Debt">Personal Finance & High-Yield Debt ($26+ RPM)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  {t.channels.modal.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  {t.channels.modal.createBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
