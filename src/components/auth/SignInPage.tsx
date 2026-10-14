import React, { useState } from 'react';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  KeyRound, 
  ArrowLeft 
} from 'lucide-react';

interface SignInPageProps {
  onNavigate: (page: 'welcome' | 'sign_up' | 'forgot_password') => void;
  onSuccessDemoLogin?: (email: string, role: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onNavigate, onSuccessDemoLogin }) => {
  const { signInWithEmail } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isEmailValid && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);

    const { error } = await signInWithEmail(email.trim(), password);

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message || 'Invalid email or password.');
    } else {
      setSuccessMessage('Successfully authenticated! Redirecting...');
      if (onSuccessDemoLogin) {
        onSuccessDemoLogin(email || 'member@bneimenashe.org', 'SYNAGOGUE_RABBI');
      }
    }
  };

  const handleSocialSignIn = (providerName: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Successfully connected with ${providerName}! Redirecting...`);
      if (onSuccessDemoLogin) {
        onSuccessDemoLogin(`sso_user@${providerName.toLowerCase()}.org`, 'SYNAGOGUE_RABBI');
      }
    }, 900);
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans">
      {/* Back Link */}
      <button
        onClick={() => onNavigate('welcome')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </button>

      {/* Glass Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Sign In
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Welcome back. Please enter your account credentials to continue.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Success Alert Box */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <div className="flex-1 font-bold">{successMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="signin-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="signin-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot_password')}
                className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>Remember Me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            id="signin-submit-btn"
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
              isFormValid && !isLoading
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 cursor-pointer transform hover:-translate-y-0.5'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-400">Or</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Social / SSO Auth Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => handleSocialSignIn('Google')}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-sm flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Continue with Apple */}
          <button
            type="button"
            onClick={() => handleSocialSignIn('Apple')}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-100 border border-slate-800 dark:border-slate-200 font-bold text-xs shadow-sm flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.72 1.4-.58.68-1.1 1.79-.95 2.85 1.04.08 2.08-.53 2.71-1.31z" />
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Footer Navigation to Sign Up */}
        <div className="text-center pt-2 text-xs text-slate-600 dark:text-slate-400">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('sign_up')}
            className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
