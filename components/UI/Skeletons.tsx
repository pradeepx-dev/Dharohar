import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`} />
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0F0F0F] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-lg dark:shadow-none">
      {/* Image Skeleton */}
      <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-5 space-y-4">
        <div className="flex justify-between items-start gap-4">
           <Skeleton className="h-6 w-3/4" />
           <Skeleton className="h-6 w-8 rounded-md" />
        </div>
        
        <div className="space-y-2">
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="flex gap-2">
           <Skeleton className="h-6 w-16" />
           <Skeleton className="h-6 w-16" />
           <Skeleton className="h-6 w-16" />
        </div>

        <Skeleton className="h-10 w-full mt-auto rounded-lg" />
      </div>
    </div>
  );
};

export const ProjectDetailsSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 flex flex-col gap-6">
                <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-8">
                <div>
                    <div className="flex gap-3 mb-4">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-12 w-3/4 mb-6" />
                    <Skeleton className="h-20 w-full rounded-xl mb-8" />
                    <div className="space-y-3">
                        <Skeleton className="h-14 w-full rounded-xl" />
                        <Skeleton className="h-14 w-full rounded-xl" />
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-200 dark:border-white/10">
                    <Skeleton className="h-8 w-40 mb-4" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProfileHeaderSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 mb-10 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />
            <div className="flex-1 w-full flex flex-col items-center md:items-start space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-32 rounded-xl" />
                    <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
            </div>
             <div className="flex gap-6 pt-6 md:pt-0">
                 <div className="flex flex-col items-center gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-3 w-16" />
                 </div>
                 <div className="flex flex-col items-center gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-3 w-16" />
                 </div>
            </div>
          </div>
        </div>
    );
};
