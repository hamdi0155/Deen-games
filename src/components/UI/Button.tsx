import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/30 border border-brand-400/30',
  secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm',
  ghost: 'bg-transparent hover:bg-white/8 text-white/70 hover:text-white border border-transparent',
  danger: 'bg-red-500/80 hover:bg-red-500 text-white border border-red-400/30',
  glass: 'bg-white/10 hover:bg-white/18 text-white border border-white/20 backdrop-blur-md shadow-lg',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3.5 text-base gap-2.5',
};

export default function Button({
  children, onClick, variant = 'primary', size = 'md', disabled, className = '', icon, fullWidth,
}: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`
        inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200
        ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
