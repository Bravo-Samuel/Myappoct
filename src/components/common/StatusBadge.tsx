import React, { ReactNode } from 'react';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'purple' | 'amber' | 'slate';

interface StatusBadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  icon?: ReactNode;
  pulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'info',
  children,
  icon,
  pulse = false,
  className = ''
}) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'warning':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'error':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30';
      case 'purple':
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30';
      case 'amber':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'slate':
        return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';
      case 'info':
      default:
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeColors()} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
