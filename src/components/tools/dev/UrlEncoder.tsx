import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft, Link2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';

export const UrlEncoder: React.FC = () => {
  const { success } = useToast();
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('https://example.com/search?query=react+tools&filter=free & online');
  const [copied, setCopied] = useState(false);

  let output = '';
  let urlParams: Array<[string, string]> = [];
  let parsedHost = '';
  let parsedPath = '';

  try {
    if (mode === 'encode') {
      output = encodeURIComponent(input);
    } else {
      output = decodeURIComponent(input);
    }

    // Try parsing URL query parameters
    const checkUrl = mode === 'decode' ? output : input;
    if (checkUrl.startsWith('http://') || checkUrl.startsWith('https://')) {
      const urlObj = new URL(checkUrl);
      parsedHost = urlObj.host;
      parsedPath = urlObj.pathname;
      urlParams = Array.from(urlObj.searchParams.entries());
    }
  } catch {
    output = mode === 'decode' ? '[Malformed URI Component]' : output;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mode Buttons */}
      <div className="flex items-center gap-2 p-1 bg-zinc-950 p-2 rounded-2xl border border-zinc-800 w-fit">
        <button
          type="button"
          onClick={() => setMode('encode')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            mode === 'encode' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          URL Encode
        </button>
        <button
          type="button"
          onClick={() => setMode('decode')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            mode === 'decode' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          URL Decode
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            {mode === 'encode' ? 'Decoded / Plain URL' : 'Encoded URL'}
          </label>
          <textarea
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter URL to encode or decode..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
            </label>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs text-purple-400">
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <textarea
            rows={8}
            readOnly
            value={output}
            className="w-full bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 font-mono leading-relaxed select-all"
          />
        </div>
      </div>

      {/* Query Parameters Table */}
      {urlParams.length > 0 && (
        <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Parsed URL Query Parameters
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                  <th className="py-2 px-3">Parameter Key</th>
                  <th className="py-2 px-3">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 font-mono">
                {urlParams.map(([key, val], idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/40">
                    <td className="py-2 px-3 text-purple-300 font-bold">{key}</td>
                    <td className="py-2 px-3 text-zinc-200">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
