import React from 'react';
import { Skeleton } from './Skeleton';
import { Sparkles, Loader2 } from 'lucide-react';

interface ToolSkeletonLoaderProps {
  toolName?: string;
  category?: string;
}

export const ToolSkeletonLoader: React.FC<ToolSkeletonLoaderProps> = ({
  toolName,
  category,
}) => {
  return (
    <div
      role="status"
      aria-label={toolName ? `Loading ${toolName}` : 'Loading tool'}
      className="space-y-6 animate-in fade-in duration-200"
    >
      {/* Top action/tabs placeholder bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-28 rounded-full bg-white/[0.06]" />
          <Skeleton className="h-9 w-24 rounded-full bg-white/[0.04] hidden sm:block" />
          <Skeleton className="h-9 w-24 rounded-full bg-white/[0.04] hidden md:block" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
            <span className="tracking-wide">Initializing local runtime...</span>
          </div>
          <Skeleton className="h-9 w-9 rounded-xl bg-white/[0.04]" />
        </div>
      </div>

      {/* Main Workspace Area: 2-column or full-width responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Primary Workspace Card (Dropzone / Editor Canvas / Input Area) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6 relative overflow-hidden">
            {/* Ambient subtle glow within placeholder */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-36 rounded-md bg-white/[0.07]" />
              <Skeleton className="h-4 w-20 rounded-md bg-white/[0.04]" />
            </div>

            {/* Simulated Interactive Dropzone / Viewport */}
            <div className="border border-dashed border-white/15 rounded-xl p-10 flex flex-col items-center justify-center space-y-3 bg-white/[0.01]">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400/50 animate-pulse" />
              </div>
              <Skeleton className="h-4 w-48 rounded-md bg-white/[0.08]" />
              <Skeleton className="h-3 w-64 rounded-md bg-white/[0.04]" />
              <Skeleton className="h-9 w-32 rounded-full bg-white/[0.06] mt-2" />
            </div>

            {/* Action Row */}
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-8 w-24 rounded-lg bg-white/[0.04]" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg bg-white/[0.04]" />
                <Skeleton className="h-8 w-28 rounded-lg bg-purple-600/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Right / Controls & Parameters Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <Skeleton className="h-5 w-28 rounded-md bg-white/[0.07]" />
              <Skeleton className="h-4 w-12 rounded-full bg-white/[0.04]" />
            </div>

            {/* Controls placeholders */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded bg-white/[0.05]" />
                <Skeleton className="h-10 w-full rounded-xl bg-white/[0.04]" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24 rounded bg-white/[0.05]" />
                  <Skeleton className="h-3 w-10 rounded bg-white/[0.05]" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full bg-white/[0.06]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10 rounded-xl bg-white/[0.04]" />
                <Skeleton className="h-10 rounded-xl bg-white/[0.04]" />
              </div>

              <div className="space-y-2 pt-2">
                <Skeleton className="h-3 w-28 rounded bg-white/[0.05]" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-lg bg-white/[0.04]" />
                  <Skeleton className="h-8 w-16 rounded-lg bg-white/[0.04]" />
                  <Skeleton className="h-8 w-16 rounded-lg bg-white/[0.04]" />
                </div>
              </div>
            </div>

            {/* Primary Action Button Placeholder */}
            <div className="pt-3 border-t border-white/5">
              <Skeleton className="h-11 w-full rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
