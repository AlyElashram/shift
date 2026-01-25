"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-[var(--font-oswald)] font-semibold uppercase tracking-wider
      border-none rounded-sm cursor-pointer
      transition-all duration-150 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed
      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shift-yellow)]
    `;

    const variants = {
      primary: `
        bg-[var(--shift-yellow)] text-[var(--shift-black)]
        hover:bg-[var(--shift-yellow-dark)] hover:-translate-y-px
        hover:shadow-[0_2px_12px_rgba(255,214,40,0.15)]
        active:translate-y-0
      `,
      secondary: `
        bg-transparent text-[var(--shift-cream)]
        border border-[var(--shift-cream)]
        hover:bg-[var(--shift-cream)] hover:text-[var(--shift-black)]
      `,
      ghost: `
        bg-transparent text-[var(--shift-cream)]
        hover:text-[var(--shift-yellow)]
      `,
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
