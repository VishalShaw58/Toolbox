import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Bug,
  Sparkles,
  Zap,
  HelpCircle,
  X,
  Send,
  Download,
  Trash2,
  CheckCircle2,
  Info,
  Clock,
  Laptop,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ToolDefinition } from '../../types/tools';
import {
  feedbackStore,
  ToolFeedbackItem,
  FeedbackType,
  FeedbackPriority,
} from '../../lib/feedbackStore';
import { downloadText } from '../../lib/utils';
import { useToast } from '../../hooks/useToast';
import confetti from 'canvas-confetti';

interface ToolFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: ToolDefinition;
}

export const ToolFeedbackModal: React.FC<ToolFeedbackModalProps> = ({
  isOpen,
  onClose,
  tool,
}) => {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');

  // Form State
  const [type, setType] = useState<FeedbackType>('bug');
  const [priority, setPriority] = useState<FeedbackPriority>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedItem, setSubmittedItem] = useState<ToolFeedbackItem | null>(null);

  // History State
  const [historyItems, setHistoryItems] = useState<ToolFeedbackItem[]>([]);
  const [filterToolOnly, setFilterToolOnly] = useState(true);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<ToolFeedbackItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
      setSubmittedItem(null);
    }
  }, [isOpen, filterToolOnly, tool.id]);

  const loadHistory = () => {
    const all = feedbackStore.getAll();
    if (filterToolOnly) {
      setHistoryItems(all.filter((item) => item.toolId === tool.id));
    } else {
      setHistoryItems(all);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      error('Title required', 'Please provide a short summary for your report.');
      return;
    }
    if (!description.trim()) {
      error('Details required', 'Please include descriptive details or steps.');
      return;
    }

    setIsSubmitting(true);

    try {
      const saved = feedbackStore.save({
        toolId: tool.id,
        toolName: tool.name,
        toolCategory: tool.category,
        type,
        priority: type === 'bug' ? priority : undefined,
        title: title.trim(),
        description: description.trim(),
        contactEmail: contactEmail.trim() || undefined,
      });

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
      });

      setSubmittedItem(saved);
      loadHistory();
      success(
        type === 'bug' ? 'Bug Report Saved' : 'Feature Request Saved',
        `Logged into local storage for ${tool.name}.`
      );

      // Reset form
      setTitle('');
      setDescription('');
      setContactEmail('');
    } catch {
      error('Storage Error', 'Could not save feedback to local store.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadJSON = () => {
    const jsonStr = feedbackStore.exportJSON();
    downloadText(`toolbox-feedback-export-${new Date().toISOString().slice(0, 10)}.json`, jsonStr);
    success('Feedback Exported', 'Saved all local feedback records to a JSON file.');
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    feedbackStore.delete(id);
    loadHistory();
    if (selectedHistoryItem?.id === id) {
      setSelectedHistoryItem(null);
    }
    success('Feedback Removed', 'Record was deleted from your local storage.');
  };

  const getTypeIcon = (t: FeedbackType) => {
    switch (t) {
      case 'bug':
        return <Bug className="w-4 h-4 text-rose-400" />;
      case 'feature':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'improvement':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'general':
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getTypeBadge = (t: FeedbackType) => {
    switch (t) {
      case 'bug':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      case 'feature':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      case 'improvement':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'general':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
    }
  };

  const getTypeLabel = (t: FeedbackType) => {
    switch (t) {
      case 'bug':
        return 'Bug Report';
      case 'feature':
        return 'Feature Request';
      case 'improvement':
        return 'Performance / UX';
      case 'general':
        return 'General Feedback';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Tool Feedback & Requests
                </h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  {tool.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Report bugs, suggest additions, and save feedback to local JSON.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center px-6 border-b border-white/5 bg-white/[0.01]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('submit');
              setSubmittedItem(null);
            }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'submit'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>New Submission</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Saved Records</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300 font-mono">
              {historyItems.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'submit' ? (
            submittedItem ? (
              // Success Screen
              <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">Feedback Logged Locally</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Your report for <span className="text-purple-300 font-medium">{tool.name}</span> has been stored in your browser's JSON storage with hardware & environment metadata.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-left max-w-md mx-auto font-mono text-[11px] space-y-1.5 text-slate-300">
                  <div className="flex justify-between text-slate-500">
                    <span>ID: {submittedItem.id}</span>
                    <span>{new Date(submittedItem.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-white font-sans font-semibold text-xs">{submittedItem.title}</p>
                  <p className="text-slate-400 font-sans text-xs truncate">{submittedItem.description}</p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmittedItem(null)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-full transition-colors cursor-pointer shadow-lg shadow-purple-600/30"
                  >
                    Submit Another Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold rounded-full border border-white/10 transition-colors cursor-pointer"
                  >
                    View Saved JSON
                  </button>
                </div>
              </div>
            ) : (
              // Submission Form
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Type selection pills */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Feedback Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['bug', 'feature', 'improvement', 'general'] as FeedbackType[]).map((t) => {
                      const isSelected = type === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-500/20 border-purple-500/40 text-white shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                              : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                          }`}
                        >
                          {getTypeIcon(t)}
                          <span className="truncate">{getTypeLabel(t)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bug Severity row */}
                {type === 'bug' && (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Bug Severity</span>
                      <span className="text-[11px] lowercase text-slate-500 font-normal">Impact level</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['low', 'medium', 'high', 'critical'] as FeedbackPriority[]).map((p) => {
                        const isSelected = priority === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`py-1.5 px-2 rounded-lg border text-xs capitalize font-medium transition-all cursor-pointer text-center ${
                              isSelected
                                ? p === 'critical'
                                  ? 'bg-rose-500/25 border-rose-500 text-rose-200'
                                  : p === 'high'
                                  ? 'bg-amber-500/25 border-amber-500 text-amber-200'
                                  : 'bg-purple-500/25 border-purple-500 text-purple-200'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {type === 'bug'
                      ? 'Issue Summary *'
                      : type === 'feature'
                      ? 'Feature Title *'
                      : 'Summary *'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      type === 'bug'
                        ? 'e.g. SVG download button does not trigger download on Safari'
                        : type === 'feature'
                        ? 'e.g. Add gradient color presets in QR generator'
                        : 'Brief summary of your feedback...'
                    }
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {type === 'bug' ? 'Steps to Reproduce & Expected Result *' : 'Details & Motivation *'}
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      type === 'bug'
                        ? '1. Open the QR tool\n2. Upload a custom logo\n3. Click export and see error...'
                        : 'Explain what you want to achieve and why it would be helpful...'
                    }
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 resize-y"
                  />
                </div>

                {/* Optional Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Contact / Identifier (Optional)</span>
                    <span className="text-[11px] text-slate-500">Stored locally only</span>
                  </label>
                  <input
                    type="text"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="user@domain.com or GitHub handle"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Diagnostics Badge */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-purple-400" />
                    Auto-attaches browser & screen info to JSON
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Local Storage
                  </span>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-full shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Feedback Record</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            // History Tab
            <div className="space-y-4">
              {/* History Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterToolOnly(true)}
                    className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                      filterToolOnly
                        ? 'bg-purple-500/20 text-white border-purple-500/40'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    This Tool ({tool.name})
                  </button>
                  <button
                    onClick={() => setFilterToolOnly(false)}
                    className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                      !filterToolOnly
                        ? 'bg-purple-500/20 text-white border-purple-500/40'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    All Tools
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadJSON}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-purple-400" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* Records List or Detailed Item View */}
              {selectedHistoryItem ? (
                // Detailed Inspector
                <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedHistoryItem(null)}
                      className="text-xs text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to list
                    </button>
                    <button
                      onClick={(e) => handleDeleteItem(selectedHistoryItem.id, e)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 p-1 hover:bg-rose-500/10 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getTypeBadge(
                          selectedHistoryItem.type
                        )}`}
                      >
                        {getTypeLabel(selectedHistoryItem.type)}
                      </span>
                      {selectedHistoryItem.priority && (
                        <span className="text-[10px] font-mono uppercase text-slate-400 px-1.5 py-0.2 bg-white/5 rounded border border-white/10">
                          {selectedHistoryItem.priority}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{selectedHistoryItem.toolName}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{selectedHistoryItem.title}</h4>
                    <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {selectedHistoryItem.description}
                    </p>
                  </div>

                  {/* Raw JSON viewer */}
                  <div className="space-y-1 pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Raw JSON Representation
                    </label>
                    <pre className="p-3 bg-black/60 rounded-lg text-[11px] font-mono text-purple-300 overflow-x-auto border border-white/5 max-h-48">
                      {JSON.stringify(selectedHistoryItem, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : historyItems.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-medium text-slate-400">No feedback submissions found</p>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Any bugs or features you log for {filterToolOnly ? tool.name : 'any tool'} will appear here as a persistent JSON history.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedHistoryItem(item)}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 shrink-0">{getTypeIcon(item.type)}</div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white truncate max-w-xs">
                              {item.title}
                            </span>
                            <span
                              className={`text-[9px] font-medium px-1.5 py-0.2 rounded-full border ${getTypeBadge(
                                item.type
                              )}`}
                            >
                              {item.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-md">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                            <span>{item.toolName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-3">
                        <button
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-slate-400">
            <Info className="w-3.5 h-3.5 text-purple-400" />
            Stored in browser `localStorage`
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white text-black font-semibold text-xs rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
