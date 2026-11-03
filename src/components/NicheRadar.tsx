import React, { useState } from 'react';
import { NicheData, Language, TargetMarket } from '../types';
import { translations } from '../i18n';
import { 
  Radar, 
  Sparkles, 
  TrendingUp, 
  Search, 
  Layers, 
  ArrowUpRight, 
  Target, 
  DollarSign, 
  Check, 
  ChevronRight,
  Loader2
} from 'lucide-react';

interface NicheRadarProps {
  niches: NicheData[];
  language: Language;
  onUseNicheInScript: (nicheName: string, market: TargetMarket) => void;
}

export const NicheRadar: React.FC<NicheRadarProps> = ({
  niches,
  language,
  onUseNicheInScript,
}) => {
  const t = translations[language];
  const [selectedMarket, setSelectedMarket] = useState<TargetMarket>('USA');
  const [minRpm, setMinRpm] = useState<number>(25);
  const [competitionFilter, setCompetitionFilter] = useState<string>('all');
  const [activeNicheDetail, setActiveNicheDetail] = useState<NicheData | null>(niches[0]);
  
  // AI Insights State
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const marketsList: TargetMarket[] = ['USA', 'UK', 'CA', 'AU', 'JP', 'Arab Gulf'];

  const filteredNiches = niches.filter((n) => {
    const marketData = n.markets[selectedMarket];
    if (!marketData) return false;
    if (marketData.rpm < minRpm) return false;
    if (competitionFilter !== 'all' && marketData.competition !== competitionFilter) return false;
    return true;
  });

  const handleFetchAiInsights = async (niche: NicheData) => {
    setActiveNicheDetail(niche);
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/niche-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: selectedMarket,
          niche: niche.niche,
          language,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setAiInsights(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch AI insights:', e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="niche-radar">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono tracking-wider uppercase mb-1">
            <span>WORKFLOW 02</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'id' ? 'INTELIJEN ADSENSE GLOBAL' : 'GLOBAL ADSENSE INTELLIGENCE'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            {t.nicheRadar.title}
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            {t.nicheRadar.subtitle}
          </p>
        </div>

        {/* Market Quick Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#121826] border border-[#1e293b] rounded-xl overflow-x-auto">
          {marketsList.map((m) => (
            <button
              key={m}
              onClick={() => {
                setSelectedMarket(m);
                setAiInsights(null);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedMarket === m
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-[#0f1422] border border-[#1e293b] rounded-xl">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            {t.nicheRadar.selectMarket}
          </label>
          <div className="font-mono text-sm font-semibold text-blue-400 bg-[#090d16] px-3 py-2 rounded-lg border border-[#1e293b]">
            {selectedMarket} ({selectedMarket === 'UK' ? 'GBP' : selectedMarket === 'Arab Gulf' ? 'AED/SAR' : selectedMarket === 'JP' ? 'JPY' : 'USD'})
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
            <span>{t.nicheRadar.minRpmFilter}</span>
            <span className="font-mono text-emerald-400 font-semibold tabular-nums">${minRpm}.00</span>
          </div>
          <input
            type="range"
            min="20"
            max="45"
            step="1"
            value={minRpm}
            onChange={(e) => setMinRpm(parseInt(e.target.value, 10))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            {t.nicheRadar.competitionFilter}
          </label>
          <select
            value={competitionFilter}
            onChange={(e) => setCompetitionFilter(e.target.value)}
            className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">{t.nicheRadar.allCompetition}</option>
            <option value="Low">Low Competition (Fastest Ranking)</option>
            <option value="Medium">Medium Competition</option>
            <option value="High">High Competition (Peak Bids)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Niche Table + Deep-Dive Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Niche Table (8 cols on lg) */}
        <div className="lg:col-span-8 bg-[#0f1422] border border-[#1e293b] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
            <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
              {filteredNiches.length} {language === 'id' ? 'Kategori Niche Terdeteksi' : 'High-RPM Niches Tracked'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              AdSense CPM Benchmark 2026
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e293b] text-[11px] font-mono text-slate-400 uppercase tracking-wider bg-[#090d16]/60">
                  <th className="py-3 px-4">{t.nicheRadar.tableHeader.niche}</th>
                  <th className="py-3 px-4 text-right">{t.nicheRadar.tableHeader.estRpm}</th>
                  <th className="py-3 px-4 text-center">{t.nicheRadar.tableHeader.demand}</th>
                  <th className="py-3 px-4 text-center">{t.nicheRadar.tableHeader.competition}</th>
                  <th className="py-3 px-4 text-right">{t.nicheRadar.tableHeader.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60 text-xs">
                {filteredNiches.map((item) => {
                  const mData = item.markets[selectedMarket]!;
                  const isSelected = activeNicheDetail?.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setActiveNicheDetail(item)}
                      className={`hover:bg-[#121826] transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white font-display text-sm">
                          {item.niche}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {item.category}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-emerald-400 text-sm">
                        ${mData.rpm.toFixed(2)}
                        <span className="text-[10px] text-slate-500 font-normal ml-1">/1k</span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="text-slate-300 font-mono text-xs">
                          {mData.searchVolume}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`font-mono text-[11px] px-2 py-0.5 rounded ${
                          mData.competition === 'Low'
                            ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/40'
                            : mData.competition === 'Medium'
                            ? 'text-blue-400 bg-blue-950/40 border border-blue-900/40'
                            : 'text-amber-400 bg-amber-950/40 border border-amber-900/40'
                        }`}>
                          {mData.competition}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFetchAiInsights(item);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white rounded border border-slate-700 text-xs font-medium transition-colors"
                        >
                          Deep-Dive
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Deep-Dive & Action Blueprint Card (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          {activeNicheDetail ? (
            <div className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-5 space-y-4">
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.nicheRadar.aiDeepDiveTitle}</span>
                </div>
                <h3 className="text-base font-bold text-white font-display">
                  {activeNicheDetail.niche}
                </h3>
                <div className="text-xs text-slate-400">
                  Target: <span className="text-slate-200 font-mono">{selectedMarket}</span> · Age: <span className="text-slate-200">{activeNicheDetail.audienceAge}</span>
                </div>
              </div>

              {/* Monetization formula */}
              <div className="bg-[#090d16] p-3 rounded-lg border border-[#1e293b]/70 space-y-1">
                <div className="text-[11px] text-slate-500 font-medium">Monetization Multiplier</div>
                <div className="text-xs font-mono text-emerald-400 font-medium">
                  {activeNicheDetail.monetizationMultiplier}
                </div>
              </div>

              {/* Top Institutional Advertisers */}
              <div className="space-y-1.5">
                <div className="text-xs text-slate-400 font-medium">{t.nicheRadar.topAdvertisers}</div>
                <div className="flex flex-wrap gap-1.5">
                  {(aiInsights?.topAdvertisers || activeNicheDetail.advertisers).map((adv: string, i: number) => (
                    <span key={i} className="text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                      {adv}
                    </span>
                  ))}
                </div>
              </div>

              {/* High-Converting Viral Hook Suggestion */}
              <div className="space-y-1.5">
                <div className="text-xs text-slate-400 font-medium">
                  {language === 'id' ? 'Contoh Hook Pola Interupsi' : 'Sample Pattern Interrupt Hook'}
                </div>
                <div className="text-xs text-slate-300 italic bg-[#090d16] p-3 rounded-lg border border-[#1e293b]/60 leading-relaxed">
                  "{activeNicheDetail.recommendedHook}"
                </div>
              </div>

              {/* AI Deep Insights if fetched */}
              {isLoadingAi ? (
                <div className="p-4 bg-blue-950/20 border border-blue-900/40 rounded-lg flex items-center justify-center gap-2 text-xs text-blue-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.nicheRadar.generatingInsights}</span>
                </div>
              ) : aiInsights ? (
                <div className="p-3.5 bg-blue-950/20 border border-blue-900/30 rounded-lg space-y-2 text-xs">
                  <div className="text-blue-300 font-medium leading-relaxed">
                    {aiInsights.summary}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">{t.nicheRadar.retentionAdvice}: </span>
                    {aiInsights.retentionRecommendation}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleFetchAiInsights(activeNicheDetail)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.nicheRadar.aiDeepDiveBtn}</span>
                </button>
              )}

              {/* One-click Action: Push to Script Studio */}
              <div className="pt-2 border-t border-[#1e293b]">
                <button
                  onClick={() => onUseNicheInScript(activeNicheDetail.niche, selectedMarket)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  data-testid="use-niche-btn"
                >
                  <span>{t.nicheRadar.createScriptWithNiche}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-[#1e293b] rounded-xl">
              Select a niche to view the institutional advertiser deep-dive.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
