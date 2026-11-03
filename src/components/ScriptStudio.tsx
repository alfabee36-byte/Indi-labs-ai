import React, { useState } from 'react';
import { ScriptProject, StoryboardScene, Language, TargetMarket, ScriptTone, VideoFormat, BatchVideoItem } from '../types';
import { translations } from '../i18n';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  Play, 
  Send, 
  Eye, 
  Copy, 
  Check, 
  Clock, 
  Volume2, 
  Video, 
  HelpCircle,
  Loader2,
  CheckCircle2,
  Layers
} from 'lucide-react';

interface ScriptStudioProps {
  scriptProject: ScriptProject;
  onUpdateScript: (project: ScriptProject) => void;
  onPushToPipeline: (video: BatchVideoItem) => void;
  language: Language;
  targetMarket: TargetMarket;
}

export const ScriptStudio: React.FC<ScriptStudioProps> = ({
  scriptProject,
  onUpdateScript,
  onPushToPipeline,
  language,
  targetMarket,
}) => {
  const t = translations[language];

  // Generation Form State
  const [topic, setTopic] = useState(
    language === 'id' 
      ? 'Rahasia Mengapa Bankir Swiss Menyimpan Emas di Bunker Bawah Tanah' 
      : 'Why Swiss Private Bankers Store Physical Gold in Alpine Bunkers'
  );
  const [tone, setTone] = useState<ScriptTone>('Authoritative Swiss Documentary');
  const [format, setFormat] = useState<VideoFormat>('Shorts 9:16');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerateAiScript = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          market: targetMarket,
          niche: scriptProject.niche,
          tone,
          format,
          language,
        }),
      });
      const json = await res.json();
      if (json.data) {
        const d = json.data;
        const newScenes: StoryboardScene[] = (d.scenes || []).map((sc: any, idx: number) => ({
          id: `sc-ai-${Date.now()}-${idx}`,
          sceneNumber: idx + 1,
          timestamp: sc.timestamp || `00:${idx * 12} - 00:${(idx + 1) * 12}`,
          durationSec: 12,
          visualPrompt: sc.visualDescription || 'Cinematic documentary frame in 8k slow motion.',
          voiceover: sc.voiceover || '',
          soundEffect: sc.soundEffect || 'Subtle atmospheric riser and sub bass thud',
          bRollAction: sc.bRollAction || 'Kinetic text typography overlay',
          voiceTone: sc.voiceTone || 'Authoritative, calm',
          imagePreview: idx === 0 
            ? '/src/assets/images/storyboard_cyber_finance_1793709421434.jpg' 
            : idx === 1 
            ? '/src/assets/images/indilabs_channel_banner_1793709421890.jpg'
            : '/src/assets/images/thumbnail_high_rpm_luxury_1793709423072.jpg'
        }));

        const updated: ScriptProject = {
          ...scriptProject,
          title: d.title || topic,
          hook: d.hook || scriptProject.hook,
          targetRPM: d.targetRPM || scriptProject.targetRPM,
          estimatedDuration: d.estimatedDuration || '00:54',
          wordCount: d.wordCount || 140,
          retentionStrategy: d.retentionStrategy || scriptProject.retentionStrategy,
          scenes: newScenes.length ? newScenes : scriptProject.scenes,
          highRpmKeywords: d.highRpmKeywords || scriptProject.highRpmKeywords,
          pinnedComment: d.pinnedComment || scriptProject.pinnedComment,
          updatedAt: new Date().toISOString(),
        };

        onUpdateScript(updated);
      }
    } catch (e) {
      console.error('Failed to generate AI script:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateScene = (id: string, field: keyof StoryboardScene, val: any) => {
    const updatedScenes = scriptProject.scenes.map((sc) => {
      if (sc.id === id) {
        return { ...sc, [field]: val };
      }
      return sc;
    });
    onUpdateScript({ ...scriptProject, scenes: updatedScenes });
  };

  const handleAddScene = () => {
    const newIdx = scriptProject.scenes.length + 1;
    const newScene: StoryboardScene = {
      id: `sc-custom-${Date.now()}`,
      sceneNumber: newIdx,
      timestamp: `00:${(newIdx - 1) * 12} - 00:${newIdx * 12}`,
      durationSec: 12,
      visualPrompt: 'High-contrast cinematic macro shot with soft moody rim light',
      voiceover: 'Tuliskan naskah narasi untuk adegan ini...',
      soundEffect: 'Atmospheric bass swell',
      bRollAction: 'Slow pan across architectural structure',
      voiceTone: 'Measured, confident',
      imagePreview: '/src/assets/images/storyboard_cyber_finance_1793709421434.jpg'
    };
    onUpdateScript({
      ...scriptProject,
      scenes: [...scriptProject.scenes, newScene],
    });
  };

  const handleDeleteScene = (id: string) => {
    if (scriptProject.scenes.length <= 1) return;
    const filtered = scriptProject.scenes.filter((s) => s.id !== id).map((s, idx) => ({
      ...s,
      sceneNumber: idx + 1,
    }));
    onUpdateScript({ ...scriptProject, scenes: filtered });
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePushPipeline = () => {
    const newBatchItem: BatchVideoItem = {
      id: `vid-batch-${Date.now()}`,
      title: scriptProject.title,
      channelName: targetMarket === 'UK' ? 'The London Reserve' : targetMarket === 'Arab Gulf' ? 'Khaleeji Horizon' : targetMarket === 'JP' ? 'Tokyo Future Labs' : 'Apex Capital Files',
      market: targetMarket,
      format,
      currentStage: 1,
      overallProgress: 16,
      status: 'queued',
      stages: [
        { stage: 1, nameKey: 's1', status: 'completed', progress: 100, details: 'Script & Storyboard locked from Studio' },
        { stage: 2, nameKey: 's2', status: 'idle', progress: 0, details: 'Queued for voice mastering' },
        { stage: 3, nameKey: 's3', status: 'idle', progress: 0, details: 'Queued for AI media render' },
        { stage: 4, nameKey: 's4', status: 'idle', progress: 0, details: 'Queued for kinetic typography' },
        { stage: 5, nameKey: 's5', status: 'idle', progress: 0, details: 'Queued for 60fps render' },
        { stage: 6, nameKey: 's6', status: 'idle', progress: 0, details: 'Queued for QA thumbnail pack' },
      ],
      scriptId: scriptProject.id,
      createdAt: new Date().toISOString(),
      thumbnailUrl: '/src/assets/images/thumbnail_high_rpm_luxury_1793709423072.jpg',
      duration: scriptProject.estimatedDuration,
      logs: [
        `[Stage 1] Script enqueued: "${scriptProject.title}" with ${scriptProject.scenes.length} storyboard frames.`,
      ]
    };
    onPushToPipeline(newBatchItem);
  };

  return (
    <div className="space-y-6" data-testid="script-studio">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono tracking-wider uppercase mb-1">
            <span>WORKFLOW 03</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'id' ? 'ARSITEKTUR NASKAH & STORYBOARD' : 'RETENTION SCRIPT & STORYBOARD'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            {t.scriptStudio.title}
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            {t.scriptStudio.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsTeleprompterOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-[#121826] hover:bg-slate-800 text-slate-200 border border-[#1e293b] cursor-pointer"
            data-testid="teleprompter-btn"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.scriptStudio.teleprompter}</span>
          </button>

          <button
            onClick={handlePushPipeline}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-600/20 cursor-pointer whitespace-nowrap"
            data-testid="push-to-pipeline-btn"
          >
            <Layers className="w-4 h-4" />
            <span>{t.scriptStudio.pushToPipeline}</span>
          </button>
        </div>
      </div>

      {/* AI Script Generator Configuration Box */}
      <div className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              {t.scriptStudio.topicLabel}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t.scriptStudio.topicPlaceholder}
              className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              data-testid="topic-input"
            />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              {t.scriptStudio.toneLabel}
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ScriptTone)}
              className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Authoritative Swiss Documentary">Authoritative Swiss Documentary</option>
              <option value="High-Energy Fast-Paced">High-Energy Fast-Paced</option>
              <option value="Mysterious Noir">Mysterious Noir</option>
              <option value="Warm Explainer">Warm Explainer</option>
              <option value="Cinematic Investigative">Cinematic Investigative</option>
            </select>
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              {t.scriptStudio.formatLabel}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormat('Shorts 9:16')}
                className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  format === 'Shorts 9:16'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-[#090d16] text-slate-400 border-[#1e293b] hover:text-white'
                }`}
              >
                Shorts 9:16
              </button>
              <button
                type="button"
                onClick={() => setFormat('Long-form 16:9')}
                className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  format === 'Long-form 16:9'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-[#090d16] text-slate-400 border-[#1e293b] hover:text-white'
                }`}
              >
                16:9 Video
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#1e293b]/60">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>Market: <strong className="text-slate-200">{targetMarket}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Target RPM: <strong className="text-emerald-400 font-semibold">{scriptProject.targetRPM}</strong></span>
          </div>

          <button
            onClick={handleGenerateAiScript}
            disabled={isGenerating || !topic.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
            data-testid="generate-script-btn"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.scriptStudio.generating}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>{t.scriptStudio.generateBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Script Project Overview: Hook & Retention Formula */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Hook Card */}
        <div className="md:col-span-7 bg-[#0f1422] border border-[#1e293b] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
              0-3s Pattern Interrupt Hook (Target &gt;80% Hook Retention)
            </span>
            <button
              onClick={() => handleCopy(scriptProject.hook, 'hook')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedKey === 'hook' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-sm text-slate-100 font-medium leading-relaxed italic bg-[#090d16] p-3 rounded-lg border border-[#1e293b]">
            "{scriptProject.hook}"
          </p>
        </div>

        {/* Script Metrics */}
        <div className="md:col-span-5 bg-[#0f1422] border border-[#1e293b] rounded-xl p-4 space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            {t.scriptStudio.retentionStrategy}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {scriptProject.retentionStrategy}
          </p>
          <div className="flex items-center gap-4 text-xs font-mono pt-2 text-slate-400">
            <div>
              {t.scriptStudio.totalScenes}: <span className="text-white font-bold">{scriptProject.scenes.length}</span>
            </div>
            <div>
              {t.scriptStudio.estDuration}: <span className="text-white font-bold">{scriptProject.estimatedDuration}</span>
            </div>
            <div>
              {t.scriptStudio.wordCount}: <span className="text-white font-bold">{scriptProject.wordCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scene-by-Scene Visual Storyboard Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
            <span>{t.scriptStudio.scenesTitle}</span>
            <span className="text-xs text-slate-400 font-mono">({scriptProject.scenes.length} {language === 'id' ? 'Adegan' : 'Scenes'})</span>
          </h2>

          <button
            onClick={handleAddScene}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121826] hover:bg-slate-800 text-blue-400 rounded-lg text-xs font-semibold border border-blue-500/30 cursor-pointer"
            data-testid="add-scene-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.scriptStudio.addScene}</span>
          </button>
        </div>

        <div className="space-y-4">
          {scriptProject.scenes.map((scene) => (
            <div
              key={scene.id}
              className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-4 md:p-5 space-y-4 transition-all"
              data-testid={`scene-card-${scene.id}`}
            >
              {/* Scene Header */}
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/60 font-mono text-xs font-bold text-blue-400">
                    {t.scriptStudio.sceneNumber} 0{scene.sceneNumber}
                  </span>
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {scene.timestamp} ({scene.durationSec}s)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteScene(scene.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-950/30 transition-colors"
                    title="Delete Scene"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scene Content Layout: 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Visual Generator Prompt (Left Col 5) */}
                <div className="md:col-span-5 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>{t.scriptStudio.visualPrompt}</span>
                    <button
                      onClick={() => handleCopy(scene.visualPrompt, `vp-${scene.id}`)}
                      className="text-slate-400 hover:text-white"
                      title="Copy Midjourney Prompt"
                    >
                      {copiedKey === `vp-${scene.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="relative group rounded-lg overflow-hidden border border-[#1e293b]">
                    <img
                      src={scene.imagePreview || '/src/assets/images/storyboard_cyber_finance_1793709421434.jpg'}
                      alt="Storyboard Scene Frame"
                      referrerPolicy="no-referrer"
                      className="w-full h-32 object-cover filter contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                      <div className="text-[11px] text-slate-200 line-clamp-2 font-mono">
                        {scene.visualPrompt}
                      </div>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={scene.visualPrompt}
                    onChange={(e) => handleUpdateScene(scene.id, 'visualPrompt', e.target.value)}
                    className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-mono resize-none"
                    placeholder="Enter visual prompt for Runway/Kling/Midjourney..."
                  />
                </div>

                {/* Voiceover Script & Audio Design (Right Col 7) */}
                <div className="md:col-span-7 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      <span>{t.scriptStudio.voiceover}</span>
                      <span className="text-slate-500 text-[10px]">Tone: {scene.voiceTone}</span>
                    </div>
                    <textarea
                      rows={3}
                      value={scene.voiceover}
                      onChange={(e) => handleUpdateScene(scene.id, 'voiceover', e.target.value)}
                      className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                    />
                  </div>

                  {/* Sound & B-Roll Strip */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#090d16] p-2.5 rounded-lg border border-[#1e293b]/70 space-y-1">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">
                        {t.scriptStudio.soundEffect}
                      </div>
                      <input
                        type="text"
                        value={scene.soundEffect}
                        onChange={(e) => handleUpdateScene(scene.id, 'soundEffect', e.target.value)}
                        className="w-full bg-transparent text-slate-300 text-xs focus:outline-none font-mono"
                      />
                    </div>

                    <div className="bg-[#090d16] p-2.5 rounded-lg border border-[#1e293b]/70 space-y-1">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">
                        {t.scriptStudio.bRollAction}
                      </div>
                      <input
                        type="text"
                        value={scene.bRollAction}
                        onChange={(e) => handleUpdateScene(scene.id, 'bRollAction', e.target.value)}
                        className="w-full bg-transparent text-slate-300 text-xs focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-RPM Tags & Pinned Comment Drawer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-300">
            {t.scriptStudio.keywordsLabel}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {scriptProject.highRpmKeywords.map((kw, i) => (
              <span key={i} className="text-xs font-mono text-blue-300 bg-blue-950/40 border border-blue-900/40 px-2.5 py-1 rounded">
                #{kw.replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#0f1422] border border-[#1e293b] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>{t.scriptStudio.pinnedCommentLabel}</span>
            <button
              onClick={() => handleCopy(scriptProject.pinnedComment, 'pinned')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedKey === 'pinned' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-xs text-slate-300 bg-[#090d16] p-2.5 rounded-lg border border-[#1e293b] italic">
            {scriptProject.pinnedComment}
          </p>
        </div>
      </div>

      {/* Teleprompter Reader Modal */}
      {isTeleprompterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#090d16] border border-[#1e293b] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div>
                <h2 className="text-lg font-bold text-white font-display">
                  {scriptProject.title}
                </h2>
                <div className="text-xs text-slate-400 font-mono">
                  {scriptProject.wordCount} {language === 'id' ? 'kata' : 'words'} · {scriptProject.estimatedDuration}
                </div>
              </div>
              <button
                onClick={() => setIsTeleprompterOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 rounded-lg"
              >
                {t.scriptStudio.teleprompterClose}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 py-4">
              <div className="text-amber-400 text-lg font-bold font-display border-l-2 border-amber-400 pl-3">
                [HOOK] {scriptProject.hook}
              </div>

              {scriptProject.scenes.map((sc) => (
                <div key={sc.id} className="space-y-1">
                  <div className="text-[11px] font-mono text-slate-500">
                    SCENE {sc.sceneNumber} ({sc.timestamp}) · {sc.voiceTone}
                  </div>
                  <div className="text-base text-slate-100 font-sans leading-relaxed">
                    {sc.voiceover}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
