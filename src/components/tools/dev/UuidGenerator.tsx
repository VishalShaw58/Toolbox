import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Check, Sparkles, Download } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import { downloadText } from '../../../lib/utils';

export const UuidGenerator: React.FC = () => {
  const { success } = useToast();
  const [quantity, setQuantity] = useState<number>(5);
  const [isUppercase, setIsUppercase] = useState(false);
  const [includeHyphens, setIncludeHyphens] = useState(true);
  const [wrapBraces, setWrapBraces] = useState(false);
  const [wrapQuotes, setWrapQuotes] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateUuidV4 = (): string => {
    // RFC 4122 v4 compliant using crypto.randomUUID or fallback
    let uuid = '';
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      uuid = crypto.randomUUID();
    } else {
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    if (!includeHyphens) {
      uuid = uuid.replace(/-/g, '');
    }
    if (isUppercase) {
      uuid = uuid.toUpperCase();
    }
    if (wrapBraces) {
      uuid = `{${uuid}}`;
    }
    if (wrapQuotes) {
      uuid = `"${uuid}"`;
    }

    return uuid;
  };

  const regenerate = () => {
    const list: string[] = [];
    for (let i = 0; i < quantity; i++) {
      list.push(generateUuidV4());
    }
    setUuids(list);
  };

  useEffect(() => {
    regenerate();
  }, [quantity, isUppercase, includeHyphens, wrapBraces, wrapQuotes]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    success(`Copied ${uuids.length} UUIDs to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOne = (val: string) => {
    navigator.clipboard.writeText(val);
    success('UUID copied');
  };

  const handleDownload = () => {
    downloadText(uuids.join('\n'), `uuids-${Date.now()}.txt`);
    success('Downloaded UUID text file');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Quantity ({quantity})
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number(e.target.value))))}
              className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-zinc-100 font-mono"
            />
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isUppercase}
                onChange={(e) => setIsUppercase(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-500"
              />
              <span>Uppercase (A-F)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHyphens}
                onChange={(e) => setIncludeHyphens(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-500"
              />
              <span>Include Hyphens (-)</span>
            </label>
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={wrapBraces}
                onChange={(e) => setWrapBraces(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-500"
              />
              <span>Wrap in Braces {}</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={wrapQuotes}
                onChange={(e) => setWrapQuotes(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-500"
              />
              <span>Wrap in Quotes ""</span>
            </label>
          </div>

          <div className="flex items-end gap-2">
            <Button variant="purple" size="sm" onClick={regenerate} className="w-full justify-center">
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Generate
            </Button>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-850 flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <Download className="w-3.5 h-3.5 mr-1" />
            Download TXT
          </Button>

          <Button variant="primary" size="sm" onClick={handleCopyAll}>
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied All' : `Copy All (${uuids.length})`}
          </Button>
        </div>
      </div>

      {/* Generated list */}
      <div className="space-y-2">
        {uuids.map((id, idx) => (
          <div
            key={idx}
            onClick={() => handleCopyOne(id)}
            className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-900/60 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-600 font-mono w-6 text-right select-none">{idx + 1}</span>
              <span className="font-mono text-sm text-zinc-200 group-hover:text-purple-300 transition-colors select-all">
                {id}
              </span>
            </div>
            <Copy className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300" />
          </div>
        ))}
      </div>
    </div>
  );
};
