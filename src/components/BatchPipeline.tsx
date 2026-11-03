import React, { useState } from 'react';
import { BatchVideoItem, DailyQuota, Language, PipelineStage, VideoFormat, TargetMarket } from '../types';
import { translations } from '../i18n';
import { 
  Layers, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Terminal, 
  Eye, 
  Download, 
  Plus, 
  RotateCw, 
  Film,
  Sparkles,
  Check
} from 'lucide-react';

interface BatchPipelineProps {
  batchVideos: BatchVideoItem[];
  onUpdateBatchVideos: (videos: BatchVideoItem[]) => void;
  quota: DailyQuota;
  onIncrementQuota: () => void;
  onPreviewVideo: (video: BatchVideoItem) => void;
  language: Language;
}

export const BatchPipeline: React.FC<BatchPipelineProps> = ({
  batchVideos,
  onUpdateBatchVideos,
  quota,
  onIncrementQuota,
  onPreviewVideo,
  language,
}) => {
  const t = translations[language];
  const [isRunning, setIsRunning] = useState(false);
  const [activeLogVideo, setActiveLogVideo] = useState<BatchVideoItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  // New video manual form
  const [newTitle, setNewTitle] = useState('');
  const [newFormat, setNewFormat] = useState<VideoFormat>('Shorts 9:16');
  const [newChannel, setNewChannel] = useState('Apex Capital Files');

  const quotaRemaining = Math.max(0, quota.maxDaily - quota.usedToday);
  const isQuotaFull = quota.usedToday >= quota.maxDaily;

  // Run Batch Simulation (step-by-step advancing stages)
  const handleRunBatch = () => {
    if (isQuotaFull) return;
    setIsRunning(true);

    const queuedItemIndex = batchVideos.findIndex(
      (v) => v.status === 'queued' || v.status === 'in_progress'
    );

    if (queuedItemIndex === -1) {
      setIsRunning(false);
      return;
    }

    let currentItem = { ...batchVideos[queuedItemIndex] };
    let currentStage = currentItem.currentStage;

    const interval = setInterval(() => {
      if (currentStage < 6) {
        currentStage = (currentStage + 1) as PipelineStage;
        const progress = Math.round((currentStage / 6) * 100);

        const updatedStages = currentItem.stages.map((st) => {
          if (st.stage <= currentStage) {
            return { ...st, status: 'completed' as const, progress: 100 };
          }
          return st;
        });

        const stageNames = [
          'Script verified',
          'Voiceover mastered in 48kHz',
          'AI 4K video frames synthesized',
          'Kinetic subtitles aligned',
          'H.265 60fps render finalized',
          'QA pass & thumbnail package sealed'
        ];

        const newLog = `[Stage ${currentStage}] ${stageNames[currentStage - 1]}`;

        currentItem = {
          ...currentItem,
          currentStage,
          overallProgress: progress,
          status: currentStage === 6 ? 'completed' : 'in_progress',
          stages: updatedStages,
          logs: [...currentItem.logs, newLog],
          completedAt: currentStage === 6 ? new Date().toISOString() : undefined,
        };

        const newVideos = [...batchVideos];
        newVideos[queuedItemIndex] = currentItem;
        onUpdateBatchVideos(newVideos);

        if (currentStage === 6) {
          clearInterval(interval);
          setIsRunning(false);
          onIncrementQuota();
        }
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 1200);
  };

  const handleAddVideoToQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (isQuotaFull) return;

    const newItem: BatchVideoItem = {
      id: `vid-batch-${Date.now()}`,
      title: newTitle.trim(),
      channelName: newChannel,
      market: 'USA',
      format: newFormat,
      currentStage: 1,
      overallProgress: 16,
      status: 'queued',
      stages: [
        { stage: 1, nameKey: 's1', status: 'completed', progress: 100, details: 'Script & storyboard verified' },
        { stage: 2, nameKey: 's2', status: 'idle', progress: 0, details: 'Queued for voiceover mastering' },
        { stage: 3, nameKey: 's3', status: 'idle', progress: 0, details: 'Queued for AI video generation' },
        { stage: 4, nameKey: 's4', status: 'idle', progress: 0, details: 'Queued for dynamic subtitles' },
        { stage: 5, nameKey: 's5', status: 'idle', progress: 0, details: 'Queued for 60fps render' },
        { stage: 6, nameKey: 's6', status: 'idle', progress: 0, details: 'Queued for QA thumbnail' },
      ],
      createdAt: new Date().toISOString(),
      thumbnailUrl: '/src/assets/images/thumbnail_high_rpm_luxury_1793709423072.jpg',
      duration: '00:54',
      logs: [
        `[Stage 1] Project registered in batch pipeline: "${newTitle.trim()}".`
      ]
    };

    onUpdateBatchVideos([newItem, ...batchVideos]);
    setIsAddModalOpen(false);
    setNewTitle('');
  };

  const handleDownload = (id: string) => {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  return (
    <div className="space-y-6" data-testid="batch-pipeline">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono tracking-wider uppercase mb-1">
            <span>WORKFLOW 05</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'id' ? 'PIPELINE MANUFAKTUR OTOMATIS' : 'AUTOMATED RENDERING PIPELINE'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            {t.pipeline.title}
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            {t.pipeline.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={isQuotaFull}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#121826] hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold border border-[#1e293b] disabled:opacity-40 cursor-pointer"
            data-testid="add-video-queue-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.pipeline.addVideoBtn}</span>
          </button>

          <button
            onClick={handleRunBatch}
            disabled={isRunning || isQuotaFull}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg cursor-pointer whitespace-nowrap ${
              isQuotaFull
                ? 'bg-rose-950/60 border border-rose-800 text-rose-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
            }`}
            data-testid="run-batch-btn"
          >
            {isRunning ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>{t.pipeline.runningBatch}</span>
              </>
            ) : isQuotaFull ? (
              <>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>{t.quota.limitReached}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{t.pipeline.runBatchBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* STRICT 5 VIDEOS/DAY QUOTA BANNER */}
      <div 
        className={`p-5 rounded-xl border transition-all ${
          isQuotaFull
            ? 'bg-rose-950/30 border-rose-800/80'
            : quotaRemaining === 1
            ? 'bg-amber-950/30 border-amber-800/70'
            : 'bg-[#0f1422] border-[#1e293b]'
        }`}
        data-testid="strict-quota-banner"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isQuotaFull ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-blue-400 shrink-0" />
              )}
              <h2 className="text-sm font-bold text-white font-display">
                {t.pipeline.quotaUsage}: <span className="font-mono text-emerald-400">{quota.usedToday} / {quota.maxDaily}</span> {language === 'id' ? 'Video Hari Ini' : 'Videos Today'}
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {isQuotaFull ? t.quota.limitDesc : t.quota.unlockNotice}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">{t.quota.resetIn}</div>
              <div className="text-sm font-bold text-white font-mono tabular-nums">
                07h 24m 12s
              </div>
            </div>

            {/* Visual Quota Indicator Rings */}
            <div className="flex items-center gap-1.5 p-2 bg-[#090d16] rounded-lg border border-[#1e293b]">
              {[1, 2, 3, 4, 5].map((slot) => {
                const isFilled = slot <= quota.usedToday;
                return (
                  <div
                    key={slot}
                    className={`w-3.5 h-7 rounded-sm transition-colors ${
                      isFilled
                        ? isQuotaFull
                          ? 'bg-rose-500'
                          : 'bg-blue-500'
                        : 'bg-slate-800 border border-slate-700/60'
                    }`}
                    title={`Video Slot ${slot}/5`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 6 Stages Industrial Architecture Pipeline Diagram */}
      <div className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
          <span>{language === 'id' ? 'URUTAN 6 TAHAP PRODUKSI' : '6 PRODUCTION STAGES'}</span>
          <span>Automated Quality Gates</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { num: 1, title: 'Script & Storyboard', sub: 'Psychological Hooks' },
            { num: 2, title: 'Voiceover Master', sub: '48kHz / -18dB Ducking' },
            { num: 3, title: 'AI Media Generation', sub: '4K B-Roll & Visuals' },
            { num: 4, title: 'Kinetic Subtitles', sub: 'Dynamic Color Highlights' },
            { num: 5, title: '60fps GPU Render', sub: 'Swiss LUT Color Grade' },
            { num: 6, title: 'QA & High-CTR Pack', sub: 'Thumbnails & Metadata' },
          ].map((st) => (
            <div
              key={st.num}
              className="bg-[#090d16] border border-[#1e293b] p-3 rounded-lg space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400">
                  0{st.num}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <div className="text-xs font-bold text-white font-display">
                {st.title}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {st.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Batch Videos Queue List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white font-display">
            {language === 'id' ? 'Daftar Video dalam Pipeline' : 'Pipeline Video Queue'}
            <span className="font-mono text-slate-500 text-xs ml-2">({batchVideos.length})</span>
          </h2>
        </div>

        <div className="space-y-3">
          {batchVideos.map((video) => {
            const isCompleted = video.status === 'completed';
            const isInProgress = video.status === 'in_progress';

            return (
              <div
                key={video.id}
                className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-4 md:p-5 space-y-4 transition-all"
                data-testid={`batch-video-${video.id}`}
              >
                {/* Title & Channel Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={video.thumbnailUrl || '/src/assets/images/thumbnail_high_rpm_luxury_1793709423072.jpg'}
                      alt="Thumbnail Frame"
                      referrerPolicy="no-referrer"
                      className="w-16 h-10 object-cover rounded-lg border border-[#1e293b] shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white font-display">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                        <span className="text-slate-300">{video.channelName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{video.market}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-blue-400">{video.format}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{video.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Pill */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                      isCompleted
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/50'
                        : isInProgress
                        ? 'text-blue-400 bg-blue-950/40 border border-blue-900/50'
                        : 'text-slate-400 bg-slate-900 border border-slate-800'
                    }`}>
                      {t.pipeline.itemStatus[video.status]}
                    </span>

                    <button
                      onClick={() => setActiveLogVideo(video)}
                      className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
                      title={t.pipeline.viewLogs}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                    </button>

                    {isCompleted && (
                      <>
                        <button
                          onClick={() => onPreviewVideo(video)}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                          data-testid={`preview-btn-${video.id}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.pipeline.previewVideo}</span>
                        </button>

                        <button
                          onClick={() => handleDownload(video.id)}
                          className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
                          title={t.pipeline.downloadPackage}
                        >
                          {downloadedId === video.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      {isCompleted ? 'Render Master Sealed (100%)' : `Executing Stage ${video.currentStage}/6`}
                    </span>
                    <span className="text-white font-bold tabular-nums">
                      {video.overallProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-[#090d16] rounded-full h-2 overflow-hidden border border-[#1e293b]">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${video.overallProgress}%` }}
                    />
                  </div>
                </div>

                {/* 6 Stages Micro-Indicators */}
                <div className="grid grid-cols-6 gap-1.5 pt-1">
                  {video.stages.map((st) => (
                    <div
                      key={st.stage}
                      className={`py-1 px-1.5 text-center rounded text-[10px] font-mono truncate transition-colors ${
                        st.status === 'completed'
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/40'
                          : st.status === 'processing'
                          ? 'bg-blue-950/50 text-blue-300 border border-blue-800/60 animate-pulse'
                          : 'bg-[#090d16] text-slate-600 border border-[#1e293b]'
                      }`}
                      title={`Stage ${st.stage}: ${st.details}`}
                    >
                      S{st.stage}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Render Logs Modal */}
      {activeLogVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#090d16] border border-[#1e293b] rounded-2xl w-full max-w-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  Render Log: {activeLogVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveLogVideo(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-black/90 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-1.5 max-h-64 overflow-y-auto">
              <div className="text-slate-500">--- INDI LABS STUDIO PIPELINE DAEMON ---</div>
              {activeLogVideo.logs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  {log}
                </div>
              ))}
              {activeLogVideo.status === 'completed' && (
                <div className="text-blue-400 pt-2">
                  [SUCCESS] Package verification: 0 errors. Target duration {activeLogVideo.duration}. Ready for multi-platform distribution.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Video to Queue Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f1422] border border-[#1e293b] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <h2 className="text-base font-bold text-white font-display">
                {t.pipeline.modalTitle}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVideoToQueue} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.pipeline.videoTitleInput}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inside the Offshore Banking Vaults of Zurich"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.pipeline.formatSelect}
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as VideoFormat)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Shorts 9:16">Shorts 9:16</option>
                    <option value="Long-form 16:9">Long-form 16:9</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.pipeline.channelSelect}
                  </label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Apex Capital Files">Apex Capital Files (USA)</option>
                    <option value="The London Reserve">The London Reserve (UK)</option>
                    <option value="Khaleeji Horizon">Khaleeji Horizon (Gulf)</option>
                    <option value="Tokyo Future Labs">Tokyo Future Labs (JP)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
                >
                  {t.pipeline.confirmAdd}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
