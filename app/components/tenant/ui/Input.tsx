import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2">
      <label className="text-sm font-medium text-gray-300 ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          className={`
            w-full bg-zinc-900 text-white border border-zinc-800 rounded-xl px-4 py-3.5 pl-11
            focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
            placeholder-zinc-600 transition-all duration-200
            hover:border-zinc-700
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};