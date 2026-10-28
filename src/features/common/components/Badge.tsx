import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "public" | "private" | "admin" | "user" | "default";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variantStyles = {
    public: "bg-emerald-100 text-emerald-800 border-emerald-200",
    private: "bg-amber-100 text-amber-900 border-amber-200",
    admin: "bg-purple-100 text-purple-800 border-purple-200",
    user: "bg-blue-100 text-blue-800 border-blue-200",
    default: "bg-stone-100 text-stone-700 border-stone-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
