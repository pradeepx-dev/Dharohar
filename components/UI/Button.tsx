import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'custom';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon,
  className = '', 
  ...props 
}) => {
  
  const baseStyles = "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 border border-transparent",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 shadow-lg",
    outline: "border-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600",
    ghost: "text-slate-400 hover:bg-white/5 hover:text-white",
    custom: "", // No default styling, allows full control via className
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};