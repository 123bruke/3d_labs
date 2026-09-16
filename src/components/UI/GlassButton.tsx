import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  active?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  active = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-[rgba(10,26,19,0.7)] text-emerald-100 border border-emerald-500/30 hover:bg-[rgba(16,42,30,0.85)] hover:border-emerald-400/60 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]',
    secondary:
      'bg-[rgba(10,18,14,0.6)] text-slate-300 border border-slate-700/50 hover:bg-[rgba(16,28,22,0.8)] hover:text-emerald-200 hover:border-emerald-500/40',
    accent:
      'bg-[rgba(16,185,129,0.22)] text-emerald-50 border border-emerald-400/50 shadow-[0_0_18px_rgba(16,185,129,0.3)] hover:bg-[rgba(16,185,129,0.35)] hover:border-emerald-300 hover:shadow-[0_0_24px_rgba(52,211,153,0.5)]',
    danger:
      'bg-[rgba(40,12,12,0.65)] text-rose-200 border border-rose-500/30 hover:bg-[rgba(60,16,16,0.8)] hover:border-rose-400/60',
    ghost:
      'bg-transparent text-slate-300 border border-transparent hover:bg-emerald-950/30 hover:text-emerald-300',
  }[variant];

  const activeClass = active
    ? 'ring-1 ring-emerald-400 bg-[rgba(16,46,32,0.9)] text-emerald-200 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
    : '';

  const disabledClass = disabled
    ? 'opacity-40 cursor-not-allowed pointer-events-none hover:shadow-none'
    : 'cursor-pointer active:scale-[0.98]';

  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-xl backdrop-blur-md transition-all duration-200 select-none ${sizeClasses} ${variantClasses} ${activeClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children && <span className="whitespace-nowrap tracking-wide">{children}</span>}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};
