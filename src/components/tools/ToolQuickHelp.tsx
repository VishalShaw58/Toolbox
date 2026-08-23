import React, { useState } from 'react';
import {
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  Command,
  HelpCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { ToolProTips, ToolTipItem } from '../../data/toolProTips';
import { cn } from '../../lib/utils';

interface ToolQuickHelpProps {
  proTips: ToolProTips;
  toolName: string;
  defaultExpanded?: boolean;
}

export const ToolQuickHelp: React.FC<ToolQuickHelpProps> = ({
  proTips,
  toolName,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [modalOpen, setModalOpen] = useState(false);

  const getTipIcon = (type?: ToolTipItem['type']) => {
    switch (type) {
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'spec':
        return <FileCode className="w-4 h-4 text-cyan-400" />;
      case 'shortcut':
        return <Command className="w-4 h-4 text-purple-400" />;
      default:
        return <Lightbulb className="w-4 h-4 text-purple-400" />;
    }
  };

  const getTipBorder = (type?: ToolTipItem['type']) => {
    switch (type) {
      case 'security':
        return 'border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/30';
      case 'warning':
        return 'border-amber-500/20 bg-amber-950/10 hover:border-amber-500/30';
      case 'spec':
        return 'border-cyan-500/20 bg-cyan-950/10 hover:border-cyan-500/30';
      default:
        return 'border-purple-500/20 bg-purple-950/10 hover:border-purple-500/30';
    }
  };

  const getBadgeStyle = (type?: ToolTipItem['type']) => {
    switch (type) {
      case 'security':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'spec':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      default:
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
    }
  };

  return (
    <div className="relative">
      {/* Collapsible Section Container */}
      <section
        aria-label="Tool pro tips and quick help"
        className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden transition-all duration-200"
      >
        {/* Header Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors select-none group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Pro Tips & Quick Guide
                </h3>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300">
                  {proTips.tips.length} tips
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {proTips.summary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
              title="Expand into full guide dialog"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Full View</span>
            </button>

            <button
              type="button"
              className="p-1 text-slate-400 group-hover:text-white transition-colors"
              aria-label={isExpanded ? 'Collapse pro tips' : 'Expand pro tips'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Body */}
        {isExpanded && (
          <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/5 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Quick Shortcuts pill strip if present */}
            {proTips.quickShortcuts && proTips.quickShortcuts.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Command className="w-3 h-3 text-purple-400" /> Shortcuts:
                </span>
                {proTips.quickShortcuts.map((item, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs"
                  >
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    {item.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="px-1.5 py-0.5 text-[10px] font-mono bg-white/10 text-purple-300 rounded border border-white/10"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Grid of Tip Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {proTips.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-between space-y-2.5',
                    getTipBorder(tip.type)
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {getTipIcon(tip.type)}
                        <h4 className="text-xs font-semibold text-zinc-100 leading-snug">
                          {tip.title}
                        </h4>
                      </div>
                      {tip.badge && (
                        <span
                          className={cn(
                            'text-[10px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap',
                            getBadgeStyle(tip.type)
                          )}
                        >
                          {tip.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQs if present */}
            {proTips.faqs && proTips.faqs.length > 0 && (
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Frequently Asked
                </div>
                {proTips.faqs.map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs"
                  >
                    <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                      {faq.question}
                    </p>
                    <p className="text-slate-400 pl-5 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Full Modal Dialog Option */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Lightbulb className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {toolName} — Complete Guide & Pro Tips
                  </h3>
                  <p className="text-xs text-slate-400">{proTips.headline}</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                aria-label="Close guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
                <p className="font-semibold mb-1 flex items-center gap-1.5 text-purple-300">
                  <Sparkles className="w-4 h-4" /> About this tool
                </p>
                {proTips.summary}
              </div>

              {proTips.quickShortcuts && proTips.quickShortcuts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Quick Key Bindings & Actions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {proTips.quickShortcuts.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs"
                      >
                        <span className="text-slate-300">{item.label}</span>
                        <div className="flex gap-1">
                          {item.keys.map((k, kIdx) => (
                            <kbd
                              key={kIdx}
                              className="px-2 py-0.5 text-[10px] font-mono bg-purple-500/20 text-purple-300 rounded border border-purple-500/30"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Expert Advice & Specifications ({proTips.tips.length})
                </h4>
                <div className="space-y-2.5">
                  {proTips.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'p-4 rounded-xl border flex flex-col space-y-2',
                        getTipBorder(tip.type)
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTipIcon(tip.type)}
                          <span className="text-sm font-semibold text-white">
                            {tip.title}
                          </span>
                        </div>
                        {tip.badge && (
                          <span
                            className={cn(
                              'text-[10px] font-medium px-2 py-0.5 rounded-full border',
                              getBadgeStyle(tip.type)
                            )}
                          >
                            {tip.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {proTips.faqs && proTips.faqs.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Frequently Asked Questions
                  </h4>
                  {proTips.faqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs"
                    >
                      <p className="font-semibold text-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {faq.question}
                      </p>
                      <p className="text-slate-400 pl-6 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% In-Browser Execution
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-1.5 bg-white text-black font-semibold text-xs rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
