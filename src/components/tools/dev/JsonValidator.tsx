import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Wand2, Copy, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';

export const JsonValidator: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [jsonInput, setJsonInput] = useState(`{\n  name: 'ToolBox',\n  tags: ['fast', 'private',],\n}`);
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const validate = () => {
    try {
      JSON.parse(jsonInput);
      setStatus('valid');
      setErrorDetails(null);
      success('JSON is 100% valid!');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';
      setStatus('invalid');
      setErrorDetails(msg);
      toastError('JSON Syntax Error', msg);
    }
  };

  const autoRepair = () => {
    try {
      // Common JSON syntax repairs: single quotes -> double quotes, trailing commas removal, unquoted keys
      let fixed = jsonInput
        .replace(/,\s*([}\]])/g, '$1') // remove trailing commas
        .replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"') // single to double quotes
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":'); // quote unquoted keys

      JSON.parse(fixed); // check validity
      setJsonInput(JSON.stringify(JSON.parse(fixed), null, 2));
      setStatus('valid');
      setErrorDetails(null);
      success('JSON automatically repaired!');
    } catch {
      toastError('Auto-repair failed', 'Please review syntax manually.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <Button variant="purple" size="sm" onClick={validate} className="font-semibold shadow-purple-600/30">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Validate JSON
          </Button>

          <Button variant="secondary" size="sm" onClick={autoRepair}>
            <Wand2 className="w-4 h-4 mr-1" />
            Auto-Repair Common Errors
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(jsonInput);
              success('Copied to clipboard');
            }}
            className="text-xs text-zinc-300"
          >
            <Copy className="w-3.5 h-3.5 mr-1" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setJsonInput('')} className="text-xs text-zinc-500 hover:text-rose-400">
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {status === 'valid' && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Valid JSON Structure. Ready for production and API payloads.</span>
        </div>
      )}

      {status === 'invalid' && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <p className="font-bold">Invalid JSON</p>
            <p className="text-rose-400/80 font-mono mt-0.5">{errorDetails}</p>
          </div>
        </div>
      )}

      <textarea
        rows={14}
        value={jsonInput}
        onChange={(e) => {
          setJsonInput(e.target.value);
          setStatus('idle');
        }}
        placeholder="Paste JSON to validate or repair..."
        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
      />
    </div>
  );
};
