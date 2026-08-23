import React, { useState } from 'react';
import { Copy, Trash2, Clock, Volume2, AlignLeft, Sparkles, FileText } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';

export const WordCounter: React.FC = () => {
  const { success } = useToast();
  const [text, setText] = useState<string>(
    'ToolBox is an extraordinary browser-based powerhouse for creators, developers, and designers. Everything runs seamlessly in your browser with privacy by design.'
  );

  // Metrics
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s+/g, '').length;
  const sentences = text.trim() ? (text.match(/[.!?]+(?:\s+|$)/g) || []).length || 1 : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;

  // Reading time (avg 200 words/min)
  const readingMinutes = Math.ceil(words / 200);
  // Speaking time (avg 130 words/min)
  const speakingMinutes = Math.ceil(words / 130);

  // Keyword density
  const wordTokens = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const freqMap: Record<string, number> = {};
  wordTokens.forEach((w) => {
    freqMap[w] = (freqMap[w] || 0) + 1;
  });

  const topKeywords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    success('Text copied to clipboard');
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Words', value: words, highlight: true },
          { label: 'Characters', value: characters },
          { label: 'No Spaces', value: charactersNoSpaces },
          { label: 'Sentences', value: sentences },
          { label: 'Paragraphs', value: paragraphs },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${
              stat.highlight
                ? 'bg-purple-950/40 border-purple-800/60 shadow-lg shadow-purple-950/20'
                : 'bg-zinc-950 border-zinc-800'
            }`}
          >
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Main Textarea */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> ~{readingMinutes} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-purple-400" /> ~{speakingMinutes} min speak
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs text-zinc-300">
              <Copy className="w-3.5 h-3.5 mr-1" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs text-zinc-500 hover:text-rose-400">
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to analyze statistics..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 leading-relaxed font-sans"
        />
      </div>

      {/* Keyword density breakdown */}
      {topKeywords.length > 0 && (
        <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2.5">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Top Keyword Frequency
          </h4>
          <div className="flex flex-wrap gap-2">
            {topKeywords.map(([word, count]) => {
              const density = ((count / (words || 1)) * 100).toFixed(1);
              return (
                <div
                  key={word}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs flex items-center gap-2"
                >
                  <span className="font-semibold text-zinc-200">{word}</span>
                  <span className="text-purple-400 font-mono text-[11px]">
                    {count}× ({density}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
