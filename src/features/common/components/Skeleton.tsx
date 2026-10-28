import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-amber-200/50 rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
};
