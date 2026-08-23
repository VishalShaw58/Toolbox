import React, { useState } from 'react';
import { Copy, Trash2, Check, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';

export const TextCleaner: React.FC = () => {
  const { success } = useToast();
  const [text, setText] = useState(
    '   Hello   World!  \n\n\n<b>This is HTML</b>\nDuplicate Line\nDuplicate Line\nAnother row with   spaces   '
  );
  const [copied, setCopied] = useState(false);

  const cleanExtraSpaces = () => {
    const cleaned = text
      .split('\n')
      .map((line) => line.replace(/[ \t]+/g, ' ').trim())
      .join('\n');
    setText(cleaned);
    success('Extra spaces removed');
  };

  const removeBlankLines = () => {
    const cleaned = text
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .join('\n');
    setText(cleaned);
    success('Blank lines removed');
  };

  const removeDuplicates = () => {
    const lines = text.split('\n');
    const seen = new Set<string>();
    const unique: string[] = [];
    lines.forEach((l) => {
      if (!seen.has(l)) {
        seen.add(l);
        unique.push(l);
      }
    });
    setText(unique.join('\n'));
    success('Duplicate lines removed');
  };

  const stripHtml = () => {
    const cleaned = text.replace(/<[^>]*>?/gm, '');
    setText(cleaned);
    success('HTML tags stripped');
  };

  const sortLinesAlpha = () => {
    const cleaned = text
      .split('\n')
      .sort((a, b) => a.localeCompare(b))
      .join('\n');
    setText(cleaned);
    success('Lines sorted alphabetically');
  };

  const removeLineBreaks = () => {
    const cleaned = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    setText(cleaned);
    success('Line breaks converted to single line');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    success('Copied cleaned text');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          One-Click Text Cleaners
        </span>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={cleanExtraSpaces}>
            Trim & Remove Extra Spaces
          </Button>
          <Button variant="secondary" size="sm" onClick={removeBlankLines}>
            Remove Blank Lines
          </Button>
          <Button variant="secondary" size="sm" onClick={removeDuplicates}>
            Remove Duplicate Lines
          </Button>
          <Button variant="secondary" size="sm" onClick={stripHtml}>
            Strip HTML Tags
          </Button>
          <Button variant="secondary" size="sm" onClick={sortLinesAlpha}>
            Sort Lines (A-Z)
          </Button>
          <Button variant="secondary" size="sm" onClick={removeLineBreaks}>
            Remove Line Breaks
          </Button>
        </div>
      </div>

      {/* Editor & output */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-400">
            Current Length: {text.length} chars • {text.split('\n').length} lines
          </span>

          <div className="flex items-center gap-2">
            <Button variant="purple" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copied' : 'Copy Text'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setText('')} className="text-xs text-zinc-500 hover:text-rose-400">
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste messy text here..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
        />
      </div>
    </div>
  );
};
