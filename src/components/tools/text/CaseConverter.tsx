import React, { useState } from 'react';
import { Copy, Check, Trash2, ArrowRightLeft } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';

export const CaseConverter: React.FC = () => {
  const { success } = useToast();
  const [input, setInput] = useState<string>('ToolBox: all in one productivity and developer toolkit.');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Conversion helpers
  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/\b\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
      .replace(/\s+/g, '')
      .replace(/[^\w]/g, '');
  };

  const toPascalCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/[^\w]/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_');
  };

  const toKebabCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
  };

  const toConstantCase = (str: string) => {
    return str
      .trim()
      .toUpperCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_');
  };

  const toAlternatingCase = (str: string) => {
    return str
      .split('')
      .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
      .join('');
  };

  const cases = [
    { key: 'upper', name: 'UPPERCASE', transform: (s: string) => s.toUpperCase() },
    { key: 'lower', name: 'lowercase', transform: (s: string) => s.toLowerCase() },
    { key: 'title', name: 'Title Case', transform: toTitleCase },
    { key: 'sentence', name: 'Sentence case', transform: toSentenceCase },
    { key: 'camel', name: 'camelCase', transform: toCamelCase },
    { key: 'pascal', name: 'PascalCase', transform: toPascalCase },
    { key: 'snake', name: 'snake_case', transform: toSnakeCase },
    { key: 'kebab', name: 'kebab-case', transform: toKebabCase },
    { key: 'constant', name: 'CONSTANT_CASE', transform: toConstantCase },
    { key: 'alternating', name: 'aLtErNaTiNg cAsE', transform: toAlternatingCase },
  ];

  const handleCopy = (textToCopy: string, key: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedKey(key);
    success('Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Original Text
          </label>
          <Button variant="ghost" size="sm" onClick={() => setInput('')} className="text-xs text-zinc-500 hover:text-rose-400">
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste your text to convert casing..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-sans"
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Converted Formats (Click to copy)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cases.map((c) => {
            const transformed = input ? c.transform(input) : '';
            const isCopied = copiedKey === c.key;

            return (
              <div
                key={c.key}
                onClick={() => handleCopy(transformed, c.key)}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-purple-500/50 hover:bg-zinc-900/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-400 tracking-wide">
                    {c.name}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-500 group-hover:text-zinc-300">
                    {isCopied ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Copy
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs font-mono text-zinc-200 line-clamp-2 break-all bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-850">
                  {transformed || <span className="text-zinc-600 italic">Enter text above...</span>}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
