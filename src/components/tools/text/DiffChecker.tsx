import React, { useState } from 'react';
import { GitCompare, ArrowRightLeft } from 'lucide-react';
import { Button } from '../../ui/Button';

export const DiffChecker: React.FC = () => {
  const [original, setOriginal] = useState('{\n  "name": "ToolBox",\n  "version": "1.0.0",\n  "status": "beta"\n}');
  const [modified, setModified] = useState('{\n  "name": "ToolBox Pro",\n  "version": "2.0.0",\n  "status": "production",\n  "fast": true\n}');

  const origLines = original.split('\n');
  const modLines = modified.split('\n');
  const maxLines = Math.max(origLines.length, modLines.length);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Original Text (Before)
          </label>
          <textarea
            rows={8}
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Modified Text (After)
          </label>
          <textarea
            rows={8}
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Comparison diff view */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Side-by-Side Line Comparison
        </h4>
        <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 font-mono text-xs overflow-x-auto space-y-1">
          {Array.from({ length: maxLines }).map((_, idx) => {
            const o = origLines[idx] ?? '';
            const m = modLines[idx] ?? '';
            const isDiff = o !== m;

            return (
              <div key={idx} className="grid grid-cols-2 gap-4 py-0.5 px-2 rounded">
                <div
                  className={`p-1.5 rounded flex items-start gap-2 ${
                    isDiff && o
                      ? 'bg-rose-950/40 text-rose-300 border border-rose-900/40'
                      : 'text-zinc-400'
                  }`}
                >
                  <span className="text-zinc-600 select-none w-6 text-right shrink-0">{idx + 1}</span>
                  <span className="break-all whitespace-pre-wrap">{o || ' '}</span>
                </div>

                <div
                  className={`p-1.5 rounded flex items-start gap-2 ${
                    isDiff && m
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/40'
                      : 'text-zinc-400'
                  }`}
                >
                  <span className="text-zinc-600 select-none w-6 text-right shrink-0">{idx + 1}</span>
                  <span className="break-all whitespace-pre-wrap">{m || ' '}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
