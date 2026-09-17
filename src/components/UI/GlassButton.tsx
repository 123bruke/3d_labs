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
      'bg-white/95 text-slate-950 border border-white hover:bg-white hover:border-emerald-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.35)]',
    secondary:
      'bg-white/90 text-slate-900 border border-white/80 hover:bg-white hover:border-emerald-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]',
    accent:
      'bg-white text-slate-950 border border-white shadow-[0_0_18px_rgba(255,255,255,0.28)] hover:bg-white hover:border-emerald-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.5)]',
    danger:
      'bg-white/95 text-slate-950 border border-white hover:bg-white hover:border-rose-300',
    ghost:
      'bg-transparent text-slate-300 border border-transparent hover:bg-emerald-950/30 hover:text-emerald-300',
  }[variant];

  const activeClass = active
    ? 'ring-2 ring-blue-400 bg-white text-slate-950 border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)]'
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
