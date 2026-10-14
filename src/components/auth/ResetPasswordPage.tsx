import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  Check 
} from 'lucide-react';

interface ResetPasswordPageProps {
  onNavigate: (page: 'sign_in' | 'welcome') => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password Strength Criteria
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(newPassword);
  const strengthScore = [hasMinLength, hasUpperCase, hasNumber, hasSymbol].filter(Boolean).length;

  const passwordsMatch = newPassword !== '' && newPassword === confirmPassword;
  const isFormValid = strengthScore >= 3 && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isFormValid) {
      setErrorMessage('Please ensure your new password satisfies security criteria and passwords match.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        {isSuccess ? (
          /* Success Card */
          <div className="text-center space-y-5 animate-fade-in py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Password Reset Successful
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Your account credentials have been updated securely. You can now log in with your new password.
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
          /* Reset Form */
          <>
            <div className="space-y-1.5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Set New Password
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Choose a strong password for your account.
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
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    id="reset-new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
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

              {/* Password Strength Checklist */}
              {newPassword.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password Strength</span>
                    <span className={`text-[10px] font-bold ${
                      strengthScore <= 1 ? 'text-rose-500' : strengthScore === 2 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {strengthScore <= 1 ? 'Weak' : strengthScore === 2 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-500' : 'text-slate-400'}`}>
                      <Check className={`w-3 h-3 ${hasMinLength ? 'opacity-100' : 'opacity-30'}`} />
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-500' : 'text-slate-400'}`}>
                      <Check className={`w-3 h-3 ${hasUpperCase ? 'opacity-100' : 'opacity-30'}`} />
                      <span>Uppercase letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-500' : 'text-slate-400'}`}>
                      <Check className={`w-3 h-3 ${hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                      <span>Number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasSymbol ? 'text-emerald-500' : 'text-slate-400'}`}>
                      <Check className={`w-3 h-3 ${hasSymbol ? 'opacity-100' : 'opacity-30'}`} />
                      <span>Special symbol</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    id="reset-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <button
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
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
