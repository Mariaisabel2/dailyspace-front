import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = "", ...props }, ref) => {
    const inputId = id || props.name || undefined;

    return (
      <div className="flex flex-col mb-3 text-left w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[#292524] mb-1.5 flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`px-3.5 py-2.5 rounded-lg border bg-white text-[#292524] text-sm transition-colors duration-150 focus:outline-none focus:ring-2 placeholder:text-stone-400 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-stone-300 focus:border-amber-500 focus:ring-amber-200"
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
        />
        {error ? (
          <span
            id={inputId ? `${inputId}-error` : undefined}
            className="text-xs text-red-600 font-medium mt-1 min-h-[1.1rem]"
          >
            {error}
          </span>
        ) : helperText ? (
          <span className="text-xs text-stone-500 mt-1">{helperText}</span>
        ) : (
          <span className="min-h-[1.1rem]" aria-hidden="true" />
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
