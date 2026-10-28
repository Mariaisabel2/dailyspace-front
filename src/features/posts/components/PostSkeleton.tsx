import React from "react";
import { Skeleton } from "../../common/components/Skeleton";

export const PostSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between bg-[#fff9db]/60 border-2 border-[#ffe066]/60 rounded-2xl p-5 shadow-sm">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-1.5" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <Skeleton className="h-48 w-full rounded-xl mb-4" />
      </div>
      <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-40" />
      </div>
    </div>
  );
};
