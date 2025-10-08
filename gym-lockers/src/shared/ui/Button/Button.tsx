import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = '' 
}: ButtonProps) => {
  const baseClasses = 'px-3 py-2 rounded border cursor-pointer transition-all duration-200';
  const variantClasses = {
    primary: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 disabled:opacity-50',
    secondary: 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600 disabled:opacity-50',
    danger: 'bg-red-500 text-white border-red-500 hover:bg-red-600 disabled:opacity-50',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
