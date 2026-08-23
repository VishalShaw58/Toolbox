import React, { useState } from 'react';
import {
  Heart,
  Share2,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowLeft,
  Lightbulb,
  MessageSquarePlus,
  MessageSquare,
} from 'lucide-react';
import { ToolDefinition } from '../../types/tools';
import { IconRenderer } from '../ui/IconRenderer';
import { ToolCard } from '../ui/ToolCard';
import { TOOLS } from '../../data/toolsRegistry';
import { getToolProTips } from '../../data/toolProTips';
import { ToolQuickHelp } from './ToolQuickHelp';
import { ToolFeedbackModal } from '../feedback/ToolFeedbackModal';
import { useToast } from '../../hooks/useToast';

interface ToolPageLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onNavigate: (path: string) => void;
}

export const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  tool,
  children,
  isFavorite,
  onToggleFavorite,
  onNavigate,
}) => {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    success('Link copied to clipboard', 'You can now share this tool directly.');
    setTimeout(() => setCopied(false), 2000);
  };

  const proTips = getToolProTips(tool.id);

  const scrollToTips = () => {
    const el = document.getElementById('tool-pro-tips');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const relatedTools = TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 4);

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto space-y-8">
      {/* Feedback Modal */}
      <ToolFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        tool={tool}
      />

      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all tools</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
          <span>{tool.category}</span>
          <span>/</span>
          <span className="text-slate-300">{tool.name}</span>
        </div>
      </div>

      {/* Tool Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <IconRenderer name={tool.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {tool.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
                {tool.category}
              </span>
              {tool.badge && (
                <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {tool.fullDescription || tool.shortDescription}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          {/* Quick Help button */}
          <button
            onClick={scrollToTips}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.15)]"
          >
            <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
            <span>Pro Tips</span>
          </button>

          {/* Feedback & Bug report button */}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 text-slate-300 hover:text-white border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            title="Report bug or request feature"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-purple-400" />
            <span>Feedback</span>
          </button>

          <button
            onClick={onToggleFavorite}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white border-white/10 hover:bg-white/10'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 text-slate-400 hover:text-white border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Local</span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="mb-6">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-8 backdrop-blur-md shadow-2xl">
          {children}
        </div>
      </main>

      {/* Tool Pro Tips & Quick Help Section */}
      <div id="tool-pro-tips" className="scroll-mt-24">
        <ToolQuickHelp proTips={proTips} toolName={tool.name} />
      </div>

      {/* Bottom Feedback Banner */}
      <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">
              Notice a bug or want a new option in {tool.name}?
            </p>
            <p className="text-[11px] text-slate-500">
              Submit feedback directly to your persistent local JSON diagnostic ledger.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsFeedbackOpen(true)}
          className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-purple-300 hover:text-white border border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer shrink-0"
        >
          Send Feedback for {tool.name}
        </button>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Related {tool.category}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((relTool) => (
              <ToolCard
                key={relTool.id}
                tool={relTool}
                onClick={() => onNavigate(`/${relTool.slug}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
