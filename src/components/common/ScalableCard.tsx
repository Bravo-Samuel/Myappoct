import React, { ReactNode } from 'react';

interface ScalableCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  headerAction?: ReactNode;
  variant?: 'default' | 'glass' | 'highlight' | 'danger';
  className?: string;
}

export const ScalableCard: React.FC<ScalableCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  headerAction,
  variant = 'default',
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-slate-200/80 dark:border-slate-800/80 shadow-xl';
      case 'highlight':
        return 'bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-amber-500/10 border-indigo-500/30 dark:border-indigo-500/40 shadow-lg shadow-indigo-500/5';
      case 'danger':
        return 'bg-rose-500/10 border-rose-500/30 shadow-md';
      case 'default':
      default:
        return 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300';
    }
  };

  return (
    <div className={`rounded-3xl border p-5 sm:p-6 transition-all duration-200 ${getVariantStyles()} ${className}`}>
      {(title || icon) && (
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-inner">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};
