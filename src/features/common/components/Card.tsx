import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "yellow" | "white" | "bordered";
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "yellow",
  className = "",
  ...props
}) => {
  const variantStyles = {
    yellow: "bg-[#fff9db] border-2 border-[#ffe066] shadow-[0_4px_14px_rgba(217,119,6,0.08)]",
    white: "bg-white border border-stone-200 shadow-sm",
    bordered: "bg-[#fcfbf7] border border-amber-200 shadow-sm",
  };

  return (
    <div
      className={`rounded-xl p-5 transition-all duration-200 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
