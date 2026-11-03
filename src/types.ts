export type Language = 'id' | 'en';

export type TargetMarket = 'USA' | 'UK' | 'CA' | 'AU' | 'JP' | 'Arab Gulf';

export type VideoFormat = 'Shorts 9:16' | 'Long-form 16:9';

export type ScriptTone = 
  | 'Authoritative Swiss Documentary'
  | 'High-Energy Fast-Paced'
  | 'Mysterious Noir'
  | 'Warm Explainer'
  | 'Cinematic Investigative';

export interface Channel {
  id: string;
  name: string;
  handle: string;
  market: TargetMarket;
  currency: string;
  rpmRange: string;
  avgRPM: number;
  subscribers: number;
  totalViews: number;
  niche: string;
  language: string;
  weeklyTarget: number;
  status: 'active' | 'syncing' | 'scaling';
  estMonthlyRevenueUSD: number;
  avatarSeed: string;
  createdDate: string;
}

export interface NicheData {
  id: string;
  niche: string;
  category: string;
  markets: {
    [key in TargetMarket]?: {
      rpm: number;
      searchVolume: 'High' | 'Very High' | 'Moderate';
      competition: 'Low' | 'Medium' | 'High';
      trend: '+12%' | '+28%' | '+45%' | '+8%' | '+64%';
    };
  };
  audienceAge: string;
  monetizationMultiplier: string; // e.g., 'AdSense + SaaS Affiliates (3.4x)'
  advertisers: string[];
  recommendedHook: string;
}

export interface StoryboardScene {
  id: string;
  sceneNumber: number;
  timestamp: string;
  durationSec: number;
  visualPrompt: string;
  voiceover: string;
  soundEffect: string;
  bRollAction: string;
  voiceTone: string;
  imagePreview?: string;
}

export interface ScriptProject {
  id: string;
  title: string;
  channelId: string;
  market: TargetMarket;
  niche: string;
  format: VideoFormat;
  tone: ScriptTone;
  hook: string;
  targetRPM: string;
  estimatedDuration: string;
  wordCount: number;
  retentionStrategy: string;
  scenes: StoryboardScene[];
  highRpmKeywords: string[];
  pinnedComment: string;
  createdAt: string;
  updatedAt: string;
  voiceStyle: string;
}

export type PipelineStage = 1 | 2 | 3 | 4 | 5 | 6;

export interface PipelineStageInfo {
  stage: PipelineStage;
  nameKey: string;
  status: 'idle' | 'processing' | 'completed' | 'failed';
  progress: number;
  details: string;
}

export interface BatchVideoItem {
  id: string;
  title: string;
  channelName: string;
  market: TargetMarket;
  format: VideoFormat;
  currentStage: PipelineStage;
  overallProgress: number;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  stages: PipelineStageInfo[];
  scriptId?: string;
  createdAt: string;
  completedAt?: string;
  thumbnailUrl?: string;
  duration: string;
  videoUrl?: string;
  logs: string[];
}

export type SocialPlatform = 'YouTube' | 'Instagram' | 'TikTok' | 'Facebook';

export interface ScheduledPost {
  id: string;
  videoTitle: string;
  channelName: string;
  market: TargetMarket;
  platforms: SocialPlatform[];
  scheduledTime: string; // ISO string
  timezone: string;
  status: 'scheduled' | 'queued' | 'published' | 'failed' | 'draft';
  description: string;
  tags: string[];
  targetAudiencePeak: string;
  format: VideoFormat;
  thumbnailUrl?: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  language: string;
  langCode: string;
  market: TargetMarket | 'Global' | 'Indonesia';
  gender: 'Male' | 'Female' | 'Neutral';
  style: string;
  sampleText: string;
}

export interface DailyQuota {
  maxDaily: number;
  usedToday: number;
  lastResetDate: string; // YYYY-MM-DD
}
