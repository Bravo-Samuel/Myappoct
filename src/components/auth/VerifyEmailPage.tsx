import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  ArrowLeft 
} from 'lucide-react';

interface VerifyEmailPageProps {
  onNavigate: (page: 'sign_in' | 'welcome') => void;
  targetEmail?: string;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ onNavigate, targetEmail = 'member@example.com' }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const codeStr = otp.join('');
    if (codeStr.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
    }, 1000);
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(30);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans">
      <button
        onClick={() => onNavigate('welcome')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return</span>
      </button>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        {isVerified ? (
          /* Verified State */
          <div className="text-center space-y-5 animate-fade-in py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Sparkles className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Email Verified!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Your email address has been successfully verified. You can now access your account.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('sign_in')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Verification Form */
          <>
            <div className="space-y-1.5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Verify Email
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Enter the 6-digit verification code sent to <strong className="text-slate-900 dark:text-white font-mono">{targetEmail}</strong>
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-between gap-2 max-w-xs mx-auto">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    disabled={isLoading}
                    className="w-11 h-12 text-center text-lg font-black font-mono rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-50"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${cooldown > 0 ? 'animate-spin' : ''}`} />
                <span>
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Verification Code'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
