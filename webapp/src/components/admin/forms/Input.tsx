"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[var(--shift-gray-light)]">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-[var(--shift-black)] border
            ${error ? "border-red-500" : "border-[var(--shift-gray)]/50"}
            text-[var(--shift-cream)] placeholder:text-[var(--shift-gray)]
            focus:outline-none focus:border-[var(--shift-yellow)]
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-[var(--shift-gray)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
