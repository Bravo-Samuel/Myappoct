import React, { useState } from 'react';
import { 
  Mail, 
  KeyRound, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (page: 'sign_in' | 'reset_password' | 'welcome') => void;
  onDispatchReset?: (email: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate, onDispatchReset }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsDispatched(true);
      if (onDispatchReset) {
        onDispatchReset(email);
      }
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans">
      {/* Back Link */}
      <button
        onClick={() => onNavigate('sign_in')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Sign In</span>
      </button>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        {isDispatched ? (
          /* Success State View */
          <div className="text-center space-y-5 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Check Your Email
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                If an account exists for <strong className="text-slate-900 dark:text-white font-mono">{email}</strong>, we have sent recovery instructions to your inbox.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <button
                onClick={() => onNavigate('sign_in')}
                className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Back to Sign In
              </button>

              <button
                onClick={() => setIsDispatched(false)}
                className="block w-full text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline underline-offset-4 cursor-pointer"
              >
                Enter a different email address
              </button>
            </div>
          </div>
        ) : (
          /* Recovery Request Form */
          <>
            <div className="space-y-1.5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Reset Password
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Enter your account email address and we will send you instructions to reset your password.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isEmailValid}
                className={`w-full py-3.5 rounded-2xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isEmailValid && !isLoading
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 cursor-pointer transform hover:-translate-y-0.5'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Instructions...</span>
                  </>
                ) : (
                  <span>Send Recovery Instructions</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
