import React, { useState } from 'react';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Globe, 
  MapPin, 
  ArrowLeft 
} from 'lucide-react';

interface SignUpPageProps {
  onNavigate: (page: 'welcome' | 'sign_in') => void;
  onSuccessDemoSignUp?: (email: string, fullName: string, role: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate, onSuccessDemoSignUp }) => {
  const { signUpWithEmail } = useSupabaseAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [community, setCommunity] = useState('Beit Shalom Synagogue (Churachandpur Hub)');
  const [country, setCountry] = useState('India');
  const [agreedTerms, setAgreedTerms] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = password.length >= 6 && password === confirmPassword;
  const isFormValid = name.trim().length > 1 && isEmailValid && passwordsMatch && agreedTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (name.trim().length <= 1) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('You must accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);

    const { error } = await signUpWithEmail(email.trim(), password, {
      full_name: name.trim(),
      community,
      country
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message || 'Error creating account. Please try again.');
    } else {
      setSuccessMessage('Account created successfully! Redirecting...');
      if (onSuccessDemoSignUp) {
        onSuccessDemoSignUp(email, name, 'SYNAGOGUE_MEMBER');
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans">
      {/* Back Link */}
      <button
        onClick={() => onNavigate('welcome')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </button>

      {/* Main Glass Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Join the unified Bnei Menashe Diaspora ecosystem.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <div className="flex-1 font-bold">{successMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="signup-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="signup-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                id="signup-email"
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
            <label htmlFor="signup-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label htmlFor="signup-confirm-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                id="signup-confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Community Field */}
          <div className="space-y-1.5">
            <label htmlFor="signup-community" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Community
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                id="signup-community"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-8 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-50 appearance-none cursor-pointer"
              >
                <option value="Beit Shalom Synagogue (Churachandpur Hub)">Beit Shalom Synagogue (Churachandpur Hub)</option>
                <option value="Sha'arei Zion Synagogue (Aizawl Council)">Sha'arei Zion Synagogue (Aizawl Council)</option>
                <option value="Jerusalem Aliyah Center (Israel)">Jerusalem Aliyah Center (Israel)</option>
                <option value="Sderot Kehilla">Sderot Kehilla</option>
                <option value="Kiryat Arba Congregation">Kiryat Arba Congregation</option>
              </select>
            </div>
          </div>

          {/* Country Field */}
          <div className="space-y-1.5">
            <label htmlFor="signup-country" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                id="signup-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-8 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-50 appearance-none cursor-pointer"
              >
                <option value="India">India</option>
                <option value="Israel">Israel</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-600 dark:text-slate-400 leading-snug">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>
                I agree to the Bnei Menashe Portal Terms of Service and Privacy Policy.
              </span>
            </label>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-4 ${
              isFormValid && !isLoading
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 cursor-pointer transform hover:-translate-y-0.5'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation to Sign In */}
        <div className="text-center pt-2 text-xs text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('sign_in')}
            className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
