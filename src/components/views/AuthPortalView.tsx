import React, { useState } from 'react';
import { WelcomePage } from '../auth/WelcomePage';
import { SignInPage } from '../auth/SignInPage';
import { SignUpPage } from '../auth/SignUpPage';
import { ForgotPasswordPage } from '../auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../auth/ResetPasswordPage';
import { VerifyEmailPage } from '../auth/VerifyEmailPage';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';
import { SupportedLanguage } from '../../types';

export type AuthPageType = 'welcome' | 'sign_in' | 'sign_up' | 'forgot_password' | 'reset_password' | 'verify_email';

interface AuthPortalViewProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export const AuthPortalView: React.FC<AuthPortalViewProps> = ({
  isDarkMode = false,
  onToggleDarkMode,
  language = 'English',
  onLanguageChange
}) => {
  const { signInWithEmail } = useSupabaseAuth();
  const [currentPage, setCurrentPage] = useState<AuthPageType>('welcome');
  const [lastRegisteredEmail, setLastRegisteredEmail] = useState<string>('member@example.com');

  return (
    <div className="w-full min-h-screen flex flex-col justify-center font-sans">
      <div className="w-full">
        {currentPage === 'welcome' && (
          <WelcomePage
            onNavigate={(page) => setCurrentPage(page)}
            onContinueGuest={() => signInWithEmail('guest.explorer@bneimenashe.org')}
            language={language}
            onLanguageChange={onLanguageChange}
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
          />
        )}

        {currentPage === 'sign_in' && (
          <SignInPage
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}

        {currentPage === 'sign_up' && (
          <SignUpPage
            onNavigate={(page) => setCurrentPage(page)}
            onSuccessDemoSignUp={(email) => setLastRegisteredEmail(email)}
          />
        )}

        {currentPage === 'forgot_password' && (
          <ForgotPasswordPage
            onNavigate={(page) => setCurrentPage(page)}
            onDispatchReset={(email) => setLastRegisteredEmail(email)}
          />
        )}

        {currentPage === 'reset_password' && (
          <ResetPasswordPage
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}

        {currentPage === 'verify_email' && (
          <VerifyEmailPage
            onNavigate={(page) => setCurrentPage(page)}
            targetEmail={lastRegisteredEmail}
          />
        )}
      </div>
    </div>
  );
};
