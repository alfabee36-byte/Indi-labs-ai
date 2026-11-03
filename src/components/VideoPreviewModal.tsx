import React, { useState, useEffect } from 'react';
import { BatchVideoItem, Language } from '../types';
import { translations } from '../i18n';
import { Play, Pause, Volume2, VolumeX, Download, Check, X, Maximize2, Sparkles } from 'lucide-react';

interface VideoPreviewModalProps {
  video: BatchVideoItem;
  onClose: () => void;
  language: Language;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  video,
  onClose,
  language,
}) => {
  const t = translations[language];
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCaptionIdx, setActiveCaptionIdx] = useState(0);

  const durationSec = 54;

  const sampleCaptions = [
    { start: 0, end: 4, text: 'STOP SCROLLING.', highlight: 'STOP' },
    { start: 4, end: 11, text: '99% of people have NO IDEA where billionaires store physical gold.', highlight: 'NO IDEA' },
    { start: 11, end: 25, text: 'Deep inside the Swiss Alps, fortified decommissioned nuclear vaults...', highlight: 'SWISS ALPS' },
    { start: 25, end: 40, text: 'Over 420 metric tons of unencumbered physical bullion are securely locked.', highlight: '420 METRIC TONS' },
    { start: 40, end: 54, text: 'Save this breakdown before the institutional markets shift permanently.', highlight: 'SAVE THIS' }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= durationSec) return 0;
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    const found = sampleCaptions.findIndex(
      (c) => currentTime >= c.start && currentTime < c.end
    );
    if (found !== -1) setActiveCaptionIdx(found);
  }, [currentTime]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentCaption = sampleCaptions[activeCaptionIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative bg-[#090d16] border border-[#1e293b] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 text-slate-400 hover:text-white bg-slate-900/80 rounded-full border border-slate-700/60"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Video Player Container (9:16 vertical representation) */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[380px] md:min-h-[520px] overflow-hidden">
          <div className="relative w-full max-w-[300px] h-[480px] bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between">
            {/* Simulated Frame Asset */}
            <img
              src={video.thumbnailUrl || '/src/assets/images/thumbnail_high_rpm_luxury_1793709423072.jpg'}
              alt="Video Scene Preview"
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${
                isPlaying ? 'scale-105 filter contrast-115' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

            {/* Top Bar Overlay */}
            <div className="relative z-10 p-3 flex items-center justify-between text-xs text-white">
              <span className="font-mono text-[10px] bg-blue-600/80 px-2 py-0.5 rounded font-bold uppercase">
                {video.format}
              </span>
              <span className="font-mono text-xs tabular-nums text-emerald-400 font-bold">
                {formatTime(currentTime)} / {formatTime(durationSec)}
              </span>
            </div>

            {/* Kinetic Subtitles Overlay (Dynamic Yellow Text) */}
            <div className="relative z-10 px-4 pb-12 text-center">
              {currentCaption && (
                <div className="font-display font-black text-xl text-white tracking-wide uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] transition-all transform animate-in">
                  <span>{currentCaption.text.split(currentCaption.highlight)[0]}</span>
                  <span className="text-yellow-400 font-black underline decoration-yellow-400 underline-offset-4 mx-1">
                    {currentCaption.highlight}
                  </span>
                  <span>{currentCaption.text.split(currentCaption.highlight)[1]}</span>
                </div>
              )}
            </div>

            {/* Bottom Player Scrub Controls */}
            <div className="relative z-10 p-3 bg-black/70 backdrop-blur-sm border-t border-slate-800/80 flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:text-blue-400"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <div className="flex-1 bg-slate-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all"
                  style={{ width: `${(currentTime / durationSec) * 100}%` }}
                />
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-400 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Info Panel (Metadata & QA Verification) */}
        <div className="w-full md:w-80 bg-[#0f1422] p-5 space-y-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#1e293b]">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded font-bold">
                QA VERIFIED · 60FPS MASTER
              </span>
              <h3 className="text-base font-bold text-white font-display mt-2">
                {video.title}
              </h3>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {video.channelName} ({video.market})
              </div>
            </div>

            <div className="bg-[#090d16] p-3 rounded-lg border border-[#1e293b] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Video Resolution</span>
                <span className="font-mono text-slate-200">1080 × 1920 (9:16)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Audio Standard</span>
                <span className="font-mono text-slate-200">48kHz / -14 LUFS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Codec & Frame</span>
                <span className="font-mono text-slate-200">H.265 · 60.00 FPS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tested CTR Potential</span>
                <span className="font-mono text-emerald-400 font-bold">14.8% (High)</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">
                Optimized Release Tags
              </div>
              <div className="flex flex-wrap gap-1">
                {['#AdSenseHighRPM', '#FacelessStudio', '#WealthAllocation', '#GlobalMarkets'].map((tag) => (
                  <span key={tag} className="text-[10px] font-mono text-blue-300 bg-blue-950/40 px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1e293b] space-y-2">
            <button
              onClick={() => {
                alert('Release Archive (MP4 Video, WAV Audio Master, 1080p Thumbnail, and SEO Metadata JSON) downloaded.');
              }}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.pipeline.downloadPackage}</span>
            </button>
            <div className="text-[10px] font-mono text-slate-500 text-center">
              Includes MP4, WAV, Thumbnail & Metadata
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
