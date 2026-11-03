import React, { useState, useEffect } from 'react';
import { 
  Language, 
  Channel, 
  NicheData, 
  ScriptProject, 
  BatchVideoItem, 
  ScheduledPost, 
  DailyQuota, 
  TargetMarket 
} from './types';
import { 
  INITIAL_CHANNELS, 
  INITIAL_NICHES, 
  INITIAL_VOICES, 
  INITIAL_SCRIPT_PROJECT, 
  INITIAL_BATCH_VIDEOS, 
  INITIAL_SCHEDULED_POSTS, 
  INITIAL_QUOTA 
} from './constants/initialData';
import { translations } from './i18n';
import { TopBar } from './components/TopBar';
import { Sidebar, WorkflowTab } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { ChannelHub } from './components/ChannelHub';
import { NicheRadar } from './components/NicheRadar';
import { ScriptStudio } from './components/ScriptStudio';
import { VoiceoverStudio } from './components/VoiceoverStudio';
import { BatchPipeline } from './components/BatchPipeline';
import { PlatformScheduler } from './components/PlatformScheduler';
import { VideoPreviewModal } from './components/VideoPreviewModal';
import { AuthModal } from './components/AuthModal';
import { 
  auth, 
  onAuthStateChanged, 
  signOut, 
  syncUserProfile, 
  UserProfile, 
  testFirestoreConnection,
  User 
} from './lib/firebase';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Bilingual State (default: 'id' as requested)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('indilabs_lang');
    return (saved === 'en' || saved === 'id') ? saved : 'id';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('indilabs_lang', lang);
    document.documentElement.lang = lang;
    if (currentUser) {
      syncUserProfile(currentUser, lang).catch(() => {});
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Firebase Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await syncUserProfile(user, language);
          setUserProfile(profile);
        } catch (e) {
          console.error('Error synchronizing profile:', e);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast(translations[language].auth.logoutSuccess);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Current Active Workflow Tab
  const [currentTab, setCurrentTab] = useState<WorkflowTab>('channels');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Channels State
  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem('indilabs_channels');
    return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
  });

  const [activeChannel, setActiveChannel] = useState<Channel>(() => {
    return channels[0] || INITIAL_CHANNELS[0];
  });

  useEffect(() => {
    localStorage.setItem('indilabs_channels', JSON.stringify(channels));
  }, [channels]);

  // Quota State (Strict 5 videos/day)
  const [quota, setQuota] = useState<DailyQuota>(() => {
    const saved = localStorage.getItem('indilabs_quota');
    const today = new Date().toISOString().split('T')[0];
    if (saved) {
      const parsed = JSON.parse(saved) as DailyQuota;
      if (parsed.lastResetDate === today) {
        return parsed;
      }
    }
    return { ...INITIAL_QUOTA, lastResetDate: today };
  });

  useEffect(() => {
    localStorage.setItem('indilabs_quota', JSON.stringify(quota));
  }, [quota]);

  const handleIncrementQuota = () => {
    setQuota((prev) => {
      const updated = {
        ...prev,
        usedToday: Math.min(prev.maxDaily, prev.usedToday + 1),
      };
      return updated;
    });
    showToast(language === 'id' ? 'Video berhasil dirender! Kuota harian terpakai.' : 'Video rendered successfully! Daily quota updated.');
  };

  // Script Studio State
  const [scriptProject, setScriptProject] = useState<ScriptProject>(() => {
    const saved = localStorage.getItem('indilabs_script');
    return saved ? JSON.parse(saved) : INITIAL_SCRIPT_PROJECT;
  });

  useEffect(() => {
    localStorage.setItem('indilabs_script', JSON.stringify(scriptProject));
  }, [scriptProject]);

  // Batch Videos State
  const [batchVideos, setBatchVideos] = useState<BatchVideoItem[]>(() => {
    const saved = localStorage.getItem('indilabs_batch');
    return saved ? JSON.parse(saved) : INITIAL_BATCH_VIDEOS;
  });

  useEffect(() => {
    localStorage.setItem('indilabs_batch', JSON.stringify(batchVideos));
  }, [batchVideos]);

  // Scheduled Posts State
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    const saved = localStorage.getItem('indilabs_scheduler');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_POSTS;
  });

  useEffect(() => {
    localStorage.setItem('indilabs_scheduler', JSON.stringify(scheduledPosts));
  }, [scheduledPosts]);

  // Preview Video Modal
  const [previewingVideo, setPreviewingVideo] = useState<BatchVideoItem | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Channel Creation
  const handleAddChannel = (newChan: Channel) => {
    setChannels((prev) => [newChan, ...prev]);
    setActiveChannel(newChan);
    showToast(language === 'id' ? `Saluran ${newChan.name} berhasil didaftarkan!` : `Channel ${newChan.name} registered!`);
  };

  // Niche to Script Hand-off
  const handleUseNicheInScript = (nicheName: string, market: TargetMarket) => {
    setScriptProject((prev) => ({
      ...prev,
      niche: nicheName,
      market,
      title: `${language === 'id' ? 'Analisis Mendalam' : 'The Truth About'}: ${nicheName}`,
      targetRPM: market === 'USA' ? '$42.50' : market === 'Arab Gulf' ? '$39.00' : '$34.00',
    }));
    setCurrentTab('scriptStudio');
    showToast(language === 'id' ? `Niche "${nicheName}" dimuat ke Studio Naskah!` : `Niche "${nicheName}" loaded into Script Studio!`);
  };

  // Push Script to Pipeline
  const handlePushToPipeline = (videoItem: BatchVideoItem) => {
    if (quota.usedToday >= quota.maxDaily) {
      showToast(language === 'id' ? 'Batas maksimal 5 video/hari tercapai! Tidak dapat menambah render.' : 'Daily limit of 5 videos reached! Cannot enqueue new renders.');
      return;
    }
    setBatchVideos((prev) => [videoItem, ...prev]);
    setCurrentTab('pipeline');
    showToast(language === 'id' ? 'Proyek naskah berhasil dikirim ke Batch Pipeline!' : 'Script project pushed to Batch Pipeline queue!');
  };

  // Scheduler Handlers
  const handleAddScheduledPost = (post: ScheduledPost) => {
    setScheduledPosts((prev) => [post, ...prev]);
    showToast(language === 'id' ? 'Unggahan berhasil dijadwalkan!' : 'Content release scheduled!');
  };

  const handleDeleteScheduledPost = (id: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
    showToast(language === 'id' ? 'Jadwal dihapus.' : 'Schedule removed.');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 3-Zone Top Bar */}
      <TopBar
        language={language}
        onLanguageChange={handleLanguageChange}
        activeChannel={activeChannel}
        quota={quota}
        onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
        currentUser={currentUser}
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Studio Body: Sidebar + Dynamic Workspace Viewport */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          language={language}
          channels={channels}
          activeChannel={activeChannel}
          onSelectChannel={(ch) => {
            setActiveChannel(ch);
            showToast(language === 'id' ? `Saluran aktif diubah: ${ch.name}` : `Active channel changed: ${ch.name}`);
          }}
          quota={quota}
        />

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-12 min-w-0 overflow-y-auto">
          {currentTab === 'channels' && (
            <ChannelHub
              channels={channels}
              activeChannel={activeChannel}
              onSelectChannel={(ch) => {
                setActiveChannel(ch);
                showToast(language === 'id' ? `Saluran aktif: ${ch.name}` : `Active channel: ${ch.name}`);
              }}
              onAddChannel={handleAddChannel}
              language={language}
            />
          )}

          {currentTab === 'nicheRadar' && (
            <NicheRadar
              niches={INITIAL_NICHES}
              language={language}
              onUseNicheInScript={handleUseNicheInScript}
            />
          )}

          {currentTab === 'scriptStudio' && (
            <ScriptStudio
              scriptProject={scriptProject}
              onUpdateScript={setScriptProject}
              onPushToPipeline={handlePushToPipeline}
              language={language}
              targetMarket={activeChannel.market}
            />
          )}

          {currentTab === 'voiceover' && (
            <VoiceoverStudio
              voices={INITIAL_VOICES}
              language={language}
            />
          )}

          {currentTab === 'pipeline' && (
            <BatchPipeline
              batchVideos={batchVideos}
              onUpdateBatchVideos={setBatchVideos}
              quota={quota}
              onIncrementQuota={handleIncrementQuota}
              onPreviewVideo={(vid) => setPreviewingVideo(vid)}
              language={language}
            />
          )}

          {currentTab === 'scheduler' && (
            <PlatformScheduler
              scheduledPosts={scheduledPosts}
              onAddPost={handleAddScheduledPost}
              onDeletePost={handleDeleteScheduledPost}
              language={language}
            />
          )}
        </main>
      </div>

      {/* Mobile Drawer & Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onLanguageChange={handleLanguageChange}
        channels={channels}
        activeChannel={activeChannel}
        onSelectChannel={setActiveChannel}
        quota={quota}
        isDrawerOpen={isMobileDrawerOpen}
        onCloseDrawer={() => setIsMobileDrawerOpen(false)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Video Preview Modal */}
      {previewingVideo && (
        <VideoPreviewModal
          video={previewingVideo}
          onClose={() => setPreviewingVideo(null)}
          language={language}
        />
      )}

      {/* Auth Modal for Sign Up / Log In */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onAuthSuccess={(user, profile) => {
          setCurrentUser(user);
          setUserProfile(profile);
          showToast(translations[language].auth.loginSuccess);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-6 z-50 bg-[#121826] border border-blue-500/60 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
