import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft, Upload, Download, FileText } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import { downloadText } from '../../../lib/utils';

export const Base64Tool: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState('ToolBox 2026: Fast, Private, In-Browser');
  const [outputText, setOutputText] = useState('');
  const [isUrlSafe, setIsUrlSafe] = useState(false);
  const [copied, setCopied] = useState(false);

  const processText = (text: string, currentMode: 'encode' | 'decode', urlSafe: boolean) => {
    if (!text) {
      setOutputText('');
      return;
    }
    try {
      if (currentMode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(text)));
        const finalStr = urlSafe ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : encoded;
        setOutputText(finalStr);
      } else {
        let base64 = text;
        if (urlSafe) {
          base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
          while (base64.length % 4) {
            base64 += '=';
          }
        }
        const decoded = decodeURIComponent(escape(atob(base64)));
        setOutputText(decoded);
      }
    } catch {
      setOutputText(currentMode === 'decode' ? '[Error: Invalid Base64 string]' : '');
    }
  };

  React.useEffect(() => {
    processText(inputText, mode, isUrlSafe);
  }, [inputText, mode, isUrlSafe]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setInputText(result);
      success(`Loaded file "${file.name}" as Data URL`);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    success('Copied output to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mode Select */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              mode === 'encode'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            Encode Plaintext → Base64
          </button>

          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              mode === 'decode'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            Decode Base64 → Plaintext
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isUrlSafe}
              onChange={(e) => setIsUrlSafe(e.target.checked)}
              className="w-4 h-4 rounded accent-purple-500"
            />
            <span>URL-Safe (- and _ without padding)</span>
          </label>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-300">
            <Upload className="w-3.5 h-3.5" />
            <span>Load File</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {mode === 'encode' ? 'Plaintext / Raw Input' : 'Base64 Input'}
          </label>
          <textarea
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64 string to decode...'}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Result'}
            </label>
            {outputText && (
              <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs text-purple-400 hover:text-purple-300">
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
          <textarea
            rows={12}
            readOnly
            value={outputText}
            placeholder="Result will appear here..."
            className="w-full bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 font-mono leading-relaxed select-all"
          />
        </div>
      </div>
    </div>
  );
};
