import React, { useState, useEffect, useRef } from 'react';
import { VoiceOption, Language } from '../types';
import { translations } from '../i18n';
import { 
  Mic2, 
  Play, 
  Square, 
  Volume2, 
  Sliders, 
  Download, 
  Check, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Radio
} from 'lucide-react';

interface VoiceoverStudioProps {
  voices: VoiceOption[];
  language: Language;
}

export const VoiceoverStudio: React.FC<VoiceoverStudioProps> = ({
  voices,
  language,
}) => {
  const t = translations[language];

  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(voices[0]);
  const [speechText, setSpeechText] = useState<string>(voices[0].sampleText);
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duckingEnabled, setDuckingEnabled] = useState<boolean>(true);
  const [exportedStatus, setExportedStatus] = useState<boolean>(false);

  // Audio Canvas visualizer ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setSpeechText(selectedVoice.sampleText);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [selectedVoice]);

  // Waveform animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 48;
      const barWidth = canvas.width / barCount;

      for (let i = 0; i < barCount; i++) {
        let height = 6;
        if (isPlaying) {
          // Dynamic undulating wave
          height = Math.sin(phase + i * 0.3) * 20 + Math.cos(phase * 1.5 + i * 0.5) * 15 + 24;
          height = Math.max(4, Math.min(canvas.height - 6, height));
        }
        
        const x = i * barWidth;
        const y = (canvas.height - height) / 2;

        ctx.fillStyle = isPlaying
          ? (i % 2 === 0 ? '#3b82f6' : '#60a5fa')
          : '#1e293b';
        ctx.fillRect(x + 1, y, barWidth - 2, height);
      }

      phase += 0.15;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handlePlayVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis API is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    // Clean marker tags like [pause: 500ms] before speaking
    const cleanedText = speechText
      .replace(/\[pause:?\s*\d*m?s?\]/gi, '...')
      .replace(/\[\w+\]/gi, '');

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Attempt to match browser voice
    const availableVoices = window.speechSynthesis.getVoices();
    const matchedVoice = availableVoices.find(
      (v) => v.lang.toLowerCase().includes(selectedVoice.langCode.toLowerCase().split('-')[0])
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const insertCue = (cue: string) => {
    setSpeechText((prev) => `${prev} ${cue} `);
  };

  const handleExportAudio = () => {
    setExportedStatus(true);
    setTimeout(() => setExportedStatus(false), 2500);
  };

  return (
    <div className="space-y-6" data-testid="voiceover-studio">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono tracking-wider uppercase mb-1">
            <span>WORKFLOW 04</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'id' ? 'MASTERING SULIH SUARA MULTI-BAHASA' : 'NATURAL VOICE SYNTHESIS & MASTERING'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            {t.voiceover.title}
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            {t.voiceover.subtitle}
          </p>
        </div>

        <button
          onClick={handleExportAudio}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-xs font-semibold border border-blue-500/30 transition-all cursor-pointer whitespace-nowrap"
          data-testid="export-audio-btn"
        >
          {exportedStatus ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">{language === 'id' ? 'Audio Berhasil Diekspor!' : 'Master Exported!'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>{t.voiceover.exportAudio}</span>
            </>
          )}
        </button>
      </div>

      {/* Voice Archetype Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {voices.map((v) => {
          const isSelected = selectedVoice.id === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setSelectedVoice(v)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#121826] border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30'
                  : 'bg-[#0f1422] border-[#1e293b] hover:border-slate-700'
              }`}
              data-testid={`voice-btn-${v.id}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded">
                  {v.langCode}
                </span>
                <span className="text-[10px] text-slate-500">{v.gender}</span>
              </div>
              <div className="text-xs font-bold text-white font-display truncate">
                {v.name}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {v.style}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Studio Viewport: Waveform + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Script Textarea + Cue Palette (Col 7) */}
        <div className="lg:col-span-7 bg-[#0f1422] border border-[#1e293b] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 font-display">
              {t.voiceover.sampleScript}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {speechText.length} {language === 'id' ? 'karakter' : 'characters'}
            </span>
          </div>

          <textarea
            rows={6}
            value={speechText}
            onChange={(e) => setSpeechText(e.target.value)}
            className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
            placeholder="Type or paste voiceover narration script here..."
            data-testid="voice-script-input"
          />

          {/* Script Intonation Markers Palette */}
          <div className="space-y-2 pt-2 border-t border-[#1e293b]/70">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">{t.voiceover.cueGuideTitle}</span>
              <span>Click to insert cue</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => insertCue('[pause: 400ms]')}
                className="px-2.5 py-1 bg-[#121826] hover:bg-slate-800 text-blue-400 border border-blue-900/40 rounded text-xs font-mono"
              >
                + [pause: 400ms]
              </button>
              <button
                type="button"
                onClick={() => insertCue('[whisper]')}
                className="px-2.5 py-1 bg-[#121826] hover:bg-slate-800 text-purple-400 border border-purple-900/40 rounded text-xs font-mono"
              >
                + [whisper]
              </button>
              <button
                type="button"
                onClick={() => insertCue('[authoritative]')}
                className="px-2.5 py-1 bg-[#121826] hover:bg-slate-800 text-amber-400 border border-amber-900/40 rounded text-xs font-mono"
              >
                + [authoritative]
              </button>
              <button
                type="button"
                onClick={() => insertCue('[emphasis]')}
                className="px-2.5 py-1 bg-[#121826] hover:bg-slate-800 text-emerald-400 border border-emerald-900/40 rounded text-xs font-mono"
              >
                + [emphasis]
              </button>
            </div>
            <div className="text-[11px] text-slate-500 italic">
              {t.voiceover.cueGuideDesc}
            </div>
          </div>
        </div>

        {/* Right Column: Audio Canvas + Modulation Sliders (Col 5) */}
        <div className="lg:col-span-5 bg-[#0f1422] border border-[#1e293b] rounded-xl p-5 space-y-5">
          {/* Waveform Visualizer Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{t.voiceover.waveform}</span>
              <span className={isPlaying ? 'text-emerald-400' : 'text-slate-500'}>
                {isPlaying ? 'ACTIVE STREAM' : 'STANDBY'}
              </span>
            </div>

            <div className="bg-[#090d16] p-3 rounded-lg border border-[#1e293b] flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={360}
                height={64}
                className="w-full h-16"
              />
            </div>
          </div>

          {/* Playback Trigger Buttons */}
          <div className="flex items-center gap-3">
            {isPlaying ? (
              <button
                onClick={handleStopVoice}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-600/20"
                data-testid="stop-voice-btn"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>{t.voiceover.stopVoice}</span>
              </button>
            ) : (
              <button
                onClick={handlePlayVoice}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
                data-testid="play-voice-btn"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t.voiceover.playVoice} ({selectedVoice.name.split(' ')[0]})</span>
              </button>
            )}
          </div>

          {/* Audio Sliders */}
          <div className="space-y-4 pt-3 border-t border-[#1e293b]/70">
            {/* Speaking Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{t.voiceover.rate}</span>
                <span className="font-mono text-white tabular-nums">{rate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.05"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Pitch Modulation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{t.voiceover.pitch}</span>
                <span className="font-mono text-white tabular-nums">{pitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Master Volume */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{t.voiceover.volume}</span>
                <span className="font-mono text-white tabular-nums">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Audio Ducking & Limiter Settings */}
          <div className="bg-[#090d16] p-3 rounded-lg border border-[#1e293b] flex items-center justify-between">
            <div className="text-xs text-slate-300">
              <div className="font-semibold">{t.voiceover.audioDucking}</div>
              <div className="text-[11px] text-slate-500">Master Limiter: -0.5dB True Peak</div>
            </div>
            <button
              onClick={() => setDuckingEnabled(!duckingEnabled)}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                duckingEnabled ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  duckingEnabled ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
