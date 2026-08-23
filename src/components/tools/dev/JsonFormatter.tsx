import React, { useState } from 'react';
import { Copy, Check, Trash2, Download, AlertCircle, Sparkles, Minimize2, FileCode } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import { downloadText } from '../../../lib/utils';

export const JsonFormatter: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [input, setInput] = useState(`{
  "product": "ToolBox",
  "version": 1.0,
  "privacy": {
    "clientOnly": true,
    "zeroLogs": true
  },
  "tools": ["QR", "PDF", "Images", "Developer", "Utilities"]
}`);
  const [indentSize, setIndentSize] = useState<2 | 4 | 'tab'>(2);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (spaces: 2 | 4 | 'tab' = indentSize) => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, spaces === 'tab' ? '\t' : spaces);
      setInput(formatted);
      setErrorMsg(null);
      success('JSON Formatted successfully');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON format';
      setErrorMsg(msg);
      toastError('JSON Syntax Error', msg);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setErrorMsg(null);
      success('JSON Minified');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON format';
      setErrorMsg(msg);
      toastError('JSON Syntax Error', msg);
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setErrorMsg(null);
      success('Valid JSON! No syntax errors detected.');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON syntax';
      setErrorMsg(msg);
      toastError('Validation Failed', msg);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    success('JSON copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadText(input, `data-${Date.now()}.json`, 'application/json');
    success('Downloaded .json file');
  };

  return (
    <div className="space-y-6">
      {/* Top Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="purple"
            size="sm"
            onClick={() => formatJson(indentSize)}
            className="font-semibold shadow-purple-600/30"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Format (Beautify)
          </Button>

          <Button variant="secondary" size="sm" onClick={minifyJson}>
            <Minimize2 className="w-4 h-4 mr-1" />
            Minify (1-Line)
          </Button>

          <Button variant="outline" size="sm" onClick={validateJson}>
            <Check className="w-4 h-4 mr-1" />
            Validate
          </Button>

          <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-xl border border-zinc-800 text-xs text-zinc-400">
            <span className="text-zinc-500 font-semibold mr-1">Indent:</span>
            {[2, 4, 'tab'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setIndentSize(s as typeof indentSize);
                  formatJson(s as typeof indentSize);
                }}
                className={`px-2 py-0.5 rounded-md font-mono ${
                  indentSize === s ? 'bg-zinc-800 text-white font-bold' : 'hover:text-zinc-200'
                }`}
              >
                {s === 'tab' ? 'Tab' : `${s}sp`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <Download className="w-3.5 h-3.5 mr-1" />
            Download .json
          </Button>

          <Button variant="ghost" size="sm" onClick={handleCopy} className="text-zinc-300 hover:text-white">
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button variant="ghost" size="sm" onClick={() => setInput('')} className="text-xs text-zinc-500 hover:text-rose-400">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-300 text-xs font-mono">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <p className="font-bold">Syntax Error in JSON</p>
            <p className="text-rose-300/80 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Editor text area */}
      <textarea
        rows={16}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          if (errorMsg) setErrorMsg(null);
        }}
        placeholder="Paste JSON object or array here..."
        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono leading-relaxed selection:bg-purple-600/40"
      />
    </div>
  );
};
