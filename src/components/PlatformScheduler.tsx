import React, { useState } from 'react';
import { ScheduledPost, Language, SocialPlatform, TargetMarket } from '../types';
import { translations } from '../i18n';
import { 
  CalendarClock, 
  Plus, 
  Share2, 
  Download, 
  Check, 
  Clock, 
  Globe, 
  Trash2, 
  ExternalLink,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface PlatformSchedulerProps {
  scheduledPosts: ScheduledPost[];
  onAddPost: (post: ScheduledPost) => void;
  onDeletePost: (id: string) => void;
  language: Language;
}

export const PlatformScheduler: React.FC<PlatformSchedulerProps> = ({
  scheduledPosts,
  onAddPost,
  onDeletePost,
  language,
}) => {
  const t = translations[language];
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [exportedStatus, setExportedStatus] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    videoTitle: '',
    channelName: 'Apex Capital Files',
    market: 'USA' as TargetMarket,
    platforms: ['YouTube', 'TikTok'] as SocialPlatform[],
    date: '2026-11-04',
    time: '18:00',
    timezone: 'EST (New York, USA)',
    description: '',
    autoCrossPost: true,
  });

  const platformsList: (SocialPlatform | 'all')[] = ['all', 'YouTube', 'Instagram', 'TikTok', 'Facebook'];

  const filteredPosts = scheduledPosts.filter((post) => {
    if (selectedPlatform === 'all') return true;
    return post.platforms.includes(selectedPlatform as SocialPlatform);
  });

  const handleTogglePlatform = (p: SocialPlatform) => {
    if (formData.platforms.includes(p)) {
      if (formData.platforms.length > 1) {
        setFormData({
          ...formData,
          platforms: formData.platforms.filter((x) => x !== p),
        });
      }
    } else {
      setFormData({
        ...formData,
        platforms: [...formData.platforms, p],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.videoTitle.trim()) return;

    const newPost: ScheduledPost = {
      id: `sch-${Date.now()}`,
      videoTitle: formData.videoTitle.trim(),
      channelName: formData.channelName,
      market: formData.market,
      platforms: formData.platforms,
      scheduledTime: `${formData.date}T${formData.time}:00Z`,
      timezone: formData.timezone,
      status: 'scheduled',
      description: formData.description || 'Optimized faceless release with high-retention hooks and AdSense monetized metadata.',
      tags: ['#IndiLabs', '#FacelessContent', '#AdSenseHighRPM', '#Trending'],
      targetAudiencePeak: 'Prime viewing window: 18:00 - 21:00 target local time',
      format: 'Shorts 9:16',
      thumbnailUrl: '/src/assets/images/thumbnail_high_rpm_luxury_1793709423072.jpg',
    };

    onAddPost(newPost);
    setIsModalOpen(false);
    setFormData({
      videoTitle: '',
      channelName: 'Apex Capital Files',
      market: 'USA',
      platforms: ['YouTube', 'TikTok'],
      date: '2026-11-04',
      time: '18:00',
      timezone: 'EST (New York, USA)',
      description: '',
      autoCrossPost: true,
    });
  };

  const handleExportIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Indi Labs//Studio Content Scheduler//EN',
      ...scheduledPosts.map((p) => [
        'BEGIN:VEVENT',
        `UID:${p.id}@indilabs.studio`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${new Date(p.scheduledTime).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `SUMMARY:[${p.platforms.join('+')}] ${p.videoTitle}`,
        `DESCRIPTION:${p.description}`,
        'END:VEVENT'
      ].join('\n')),
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'indilabs_production_schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportedStatus(true);
    setTimeout(() => setExportedStatus(false), 2500);
  };

  return (
    <div className="space-y-6" data-testid="platform-scheduler">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono tracking-wider uppercase mb-1">
            <span>WORKFLOW 06</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'id' ? 'DISTRIBUSI KONTEN MULTI-PLATFORM' : 'MULTI-PLATFORM AUTOMATION'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            {t.scheduler.title}
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            {t.scheduler.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportIcs}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#121826] hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold border border-[#1e293b] cursor-pointer"
            data-testid="export-ics-btn"
          >
            {exportedStatus ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">ICS Exported</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{t.scheduler.exportIcs}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-600/20 cursor-pointer whitespace-nowrap"
            data-testid="schedule-post-btn"
          >
            <Plus className="w-4 h-4" />
            <span>{t.scheduler.newPostBtn}</span>
          </button>
        </div>
      </div>

      {/* Target Prime Hours Matrix Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0f1422] border border-[#1e293b] p-4 rounded-xl">
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-blue-400 uppercase">USA (EST / EDT)</div>
          <div className="text-sm font-bold text-white font-mono tabular-nums">17:00 - 21:00</div>
          <div className="text-[11px] text-slate-500">Peak East Coast commute</div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-mono text-blue-400 uppercase">UK & EU (GMT / BST)</div>
          <div className="text-sm font-bold text-white font-mono tabular-nums">18:00 - 21:30</div>
          <div className="text-[11px] text-slate-500">London evening leisure</div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-mono text-blue-400 uppercase">ARAB GULF (GST)</div>
          <div className="text-sm font-bold text-white font-mono tabular-nums">20:00 - 23:30</div>
          <div className="text-[11px] text-slate-500">Dubai / Riyadh nighttime</div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-mono text-blue-400 uppercase">JAPAN (JST)</div>
          <div className="text-sm font-bold text-white font-mono tabular-nums">19:00 - 22:00</div>
          <div className="text-[11px] text-slate-500">Tokyo evening wind-down</div>
        </div>
      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {platformsList.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedPlatform === p
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-[#121826] text-slate-400 hover:text-slate-200 border border-[#1e293b]'
              }`}
            >
              {p === 'all' ? t.scheduler.filterPlatform : p}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          {filteredPosts.length} {language === 'id' ? 'Unggahan Terjadwal' : 'Scheduled Releases'}
        </div>
      </div>

      {/* Scheduled Posts Timeline/List */}
      <div className="space-y-3">
        {filteredPosts.map((post) => {
          const dateObj = new Date(post.scheduledTime);
          const formattedDate = dateObj.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });
          const formattedTime = dateObj.toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={post.id}
              className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-700"
              data-testid={`scheduled-post-${post.id}`}
            >
              <div className="flex items-start gap-4 min-w-0">
                <img
                  src={post.thumbnailUrl || '/src/assets/images/thumbnail_high_rpm_luxury_1793709423072.jpg'}
                  alt="Post Thumbnail"
                  referrerPolicy="no-referrer"
                  className="w-16 h-12 object-cover rounded-lg border border-[#1e293b] shrink-0"
                />

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-blue-400 font-semibold">
                      {formattedDate} · {formattedTime}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({post.timezone})
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-display truncate max-w-lg">
                    {post.videoTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">{post.channelName}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <div className="flex items-center gap-1">
                      {post.platforms.map((pl) => (
                        <span key={pl} className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#090d16] border border-[#1e293b] text-slate-300">
                          {pl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Delete Action */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <span className="text-[11px] font-mono text-blue-400 bg-blue-950/40 border border-blue-900/40 px-2.5 py-1 rounded">
                  {t.scheduler.statusScheduled}
                </span>

                <button
                  onClick={() => onDeletePost(post.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-950/30 transition-colors"
                  title="Remove Schedule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f1422] border border-[#1e293b] rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <h2 className="text-base font-bold text-white font-display">
                {t.scheduler.modalTitle}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Video Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inside the Offshore Banking Vaults of Zurich"
                  value={formData.videoTitle}
                  onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Channel Profile
                  </label>
                  <select
                    value={formData.channelName}
                    onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Apex Capital Files">Apex Capital Files (USA)</option>
                    <option value="The London Reserve">The London Reserve (UK)</option>
                    <option value="Khaleeji Horizon">Khaleeji Horizon (Gulf)</option>
                    <option value="Tokyo Future Labs">Tokyo Future Labs (JP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Target Market
                  </label>
                  <select
                    value={formData.market}
                    onChange={(e) => {
                      const m = e.target.value as TargetMarket;
                      const tz = m === 'UK' ? 'GMT (London, UK)' : m === 'Arab Gulf' ? 'GST (Dubai / Riyadh)' : m === 'JP' ? 'JST (Tokyo, Japan)' : 'EST (New York, USA)';
                      setFormData({ ...formData, market: m, timezone: tz });
                    }}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="USA">USA (EST / EDT)</option>
                    <option value="UK">UK (GMT / BST)</option>
                    <option value="Arab Gulf">Arab Gulf (GST)</option>
                    <option value="JP">Japan (JST)</option>
                  </select>
                </div>
              </div>

              {/* Target Platforms Multiselect */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  {t.scheduler.platformsLabel}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['YouTube', 'Instagram', 'TikTok', 'Facebook'] as SocialPlatform[]).map((p) => {
                    const isSelected = formData.platforms.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleTogglePlatform(p)}
                        className={`py-2 px-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-[#090d16] text-slate-400 border-[#1e293b]'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Publication Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Auto Cross-Post Checkbox */}
              <div className="bg-[#090d16] p-3 rounded-lg border border-[#1e293b] flex items-center gap-2">
                <input
                  type="checkbox"
                  id="crossPost"
                  checked={formData.autoCrossPost}
                  onChange={(e) => setFormData({ ...formData, autoCrossPost: e.target.checked })}
                  className="rounded text-blue-600 accent-blue-600"
                />
                <label htmlFor="crossPost" className="text-xs text-slate-300">
                  {t.scheduler.autoCrossPost}
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
                >
                  {t.scheduler.confirmSchedule}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
