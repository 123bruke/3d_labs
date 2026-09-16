import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  dense?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  dense = false,
}) => {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        dense
          ? 'bg-[rgba(7,16,12,0.85)] border-emerald-500/25 shadow-2xl backdrop-blur-xl'
          : 'bg-[rgba(10,22,17,0.72)] border-emerald-500/20 shadow-xl backdrop-blur-md'
      } ${glow ? 'shadow-[0_0_30px_rgba(16,185,129,0.2)] border-emerald-500/40' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'cyan' | 'amber' | 'slate';
  className?: string;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'emerald',
  className = '',
}) => {
  const styles = {
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
    slate: 'bg-slate-900/60 text-slate-300 border-slate-700/40',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm whitespace-nowrap ${styles} ${className}`}
    >
      {children}
    </span>
  );
};
