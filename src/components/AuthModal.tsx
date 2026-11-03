import React, { useState } from 'react';
import { 
  auth, 
  googleProvider, 
  syncUserProfile, 
  UserProfile 
} from '../lib/firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  User 
} from 'firebase/auth';
import { Language } from '../types';
import { translations } from '../i18n';
import { X, Lock, Mail, User as UserIcon, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAuthSuccess: (user: User, profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onAuthSuccess,
}) => {
  const t = translations[language];
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const profile = await syncUserProfile(res.user, language);
      onAuthSuccess(res.user, profile);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setErrorMessage(err?.message || 'Google sign-in error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      let user: User;
      if (mode === 'signup') {
        const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
        user = res.user;
        if (displayName.trim()) {
          await updateProfile(user, { displayName: displayName.trim() });
        }
      } else {
        const res = await signInWithEmailAndPassword(auth, email.trim(), password);
        user = res.user;
      }

      const profile = await syncUserProfile(user, language);
      onAuthSuccess(user, profile);
      onClose();
    } catch (err: any) {
      console.error('Email authentication failed:', err);
      let friendly = err.message;
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        friendly = language === 'id' ? 'Email atau kata sandi tidak cocok.' : 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendly = language === 'id' ? 'Email sudah terdaftar. Silakan masuk.' : 'Email is already in use. Please log in.';
      } else if (err.code === 'auth/weak-password') {
        friendly = language === 'id' ? 'Kata sandi minimal 6 karakter.' : 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendly = language === 'id' 
          ? 'Metode Email/Password belum diaktifkan di konsol Firebase. Gunakan tombol Google Sign-In.' 
          : 'Email/Password sign-in is not enabled in Firebase Console. Please use Google Sign-In.';
      }
      setErrorMessage(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in" data-testid="auth-modal">
      <div className="bg-[#0f1422] border border-[#1e293b] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white font-display">
              {mode === 'login' ? t.auth.modalTitleLogin : t.auth.modalTitleSignup}
            </h2>
            <div className="text-xs text-slate-400 font-sans">
              Indi Labs Studio · Faceless Content Cloud
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            data-testid="close-auth-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* 1-Click Google Sign In (Preconfigured in AI Studio) */}
        <div>
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            data-testid="google-login-btn"
          >
            {/* Google G Logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
            <span>{t.auth.googleBtn}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
          <div className="flex-1 h-px bg-slate-800" />
          <span>{t.auth.orDivider}</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.auth.nameLabel}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#090d16] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                  data-testid="name-input"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {t.auth.emailLabel}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="studio@indilabs.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                data-testid="email-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {t.auth.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-xl pl-9 pr-9 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                data-testid="password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            data-testid="auth-submit-btn"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'login' ? t.auth.login : t.auth.signup}</span>
            )}
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400">
          <span>
            {mode === 'login' ? t.auth.noAccount : t.auth.haveAccount}
          </span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setErrorMessage(null);
            }}
            className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
            data-testid="switch-auth-mode-btn"
          >
            {mode === 'login' ? t.auth.switchToSignup : t.auth.switchToLogin}
          </button>
        </div>

        {/* Security Trust Note */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.auth.cloudSyncNotice}</span>
        </div>
      </div>
    </div>
  );
};
