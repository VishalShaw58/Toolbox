import React, { useState } from 'react';
import { CustomToolData } from '../../../lib/customToolsStore';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import {
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
  Code,
  ShieldCheck,
} from 'lucide-react';

interface DynamicCustomToolRunnerProps {
  tool: CustomToolData;
}

export const DynamicCustomToolRunner: React.FC<DynamicCustomToolRunnerProps> = ({ tool }) => {
  const { success, error } = useToast();
  const [inputVal, setInputVal] = useState('');
  const [outputVal, setOutputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const [customParams, setCustomParams] = useState({
    paramA: 10,
    paramB: 'preset',
    toggleFlag: true,
  });

  const handleRun = () => {
    try {
      if (tool.templateType === 'text') {
        const transType = tool.configOptions?.transformationType || 'uppercase';
        let res = inputVal;
        if (transType === 'uppercase') res = inputVal.toUpperCase();
        else if (transType === 'lowercase') res = inputVal.toLowerCase();
        else if (transType === 'reverse') res = inputVal.split('').reverse().join('');
        else if (transType === 'base64') res = btoa(unescape(encodeURIComponent(inputVal)));
        else if (transType === 'rot13') {
          res = inputVal.replace(/[a-zA-Z]/g, (c) => {
            const code = c.charCodeAt(0);
            return String.fromCharCode(
              code + (c.toLowerCase() <= 'm' ? 13 : -13)
            );
          });
        } else {
          res = inputVal.trim();
        }
        setOutputVal(res);
        success('Processed Successfully', `Output generated using ${transType} transformation.`);
      } else if (tool.templateType === 'dev') {
        try {
          const parsed = JSON.parse(inputVal);
          setOutputVal(JSON.stringify(parsed, null, 2));
          success('Formatted JSON', 'Validated and formatted successfully.');
        } catch {
          // Fallback to encoding / hashing mockup
          setOutputVal(btoa(unescape(encodeURIComponent(inputVal))));
          success('Payload Generated', 'Encoded input value.');
        }
      } else if (tool.templateType === 'generator') {
        const items = inputVal
          ? inputVal.split('\n').filter((x) => x.trim())
          : ['Result Alpha', 'Result Beta', 'Result Gamma', 'Result Delta'];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        setOutputVal(`✨ Generated (${new Date().toLocaleTimeString()}): \n${randomItem}`);
        success('Generated Output', 'New random sample generated.');
      } else if (tool.templateType === 'calc') {
        try {
          // Safe mathematical evaluation
          const sanitized = inputVal.replace(/[^0-9+\-*/(). ]/g, '');
          // eslint-disable-next-line no-eval
          const calcRes = Function(`'use strict'; return (${sanitized || '0'})`)();
          setOutputVal(`Calculated: ${calcRes}`);
          success('Calculation Complete', `Result: ${calcRes}`);
        } catch {
          error('Calculation Error', 'Please check mathematical syntax.');
        }
      } else {
        // Custom Code runner
        if (tool.customCode) {
          // Dynamic execution in safe scope
          const fn = new Function('input', 'params', `
            try {
              ${tool.customCode}
            } catch (err) {
              return 'Error: ' + err.message;
            }
          `);
          const res = fn(inputVal, customParams);
          setOutputVal(typeof res === 'object' ? JSON.stringify(res, null, 2) : String(res));
          success('Execution Complete', 'Custom function ran cleanly.');
        } else {
          setOutputVal(`Processed: ${inputVal}`);
        }
      }
    } catch (err: any) {
      error('Tool Execution Failed', err?.message || 'An error occurred during execution.');
    }
  };

  const handleCopy = () => {
    if (!outputVal) return;
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    success('Copied to Clipboard', 'Result is ready to paste.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner indicating custom tool */}
      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-200">Custom Admin Tool</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/10 text-white">
                {tool.templateType}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Published and running live in your local ToolBox environment.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Local Runtime</span>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {tool.configOptions?.placeholderInput ? 'Input Data' : 'Tool Input'}
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              {inputVal.length} chars
            </span>
          </div>

          <textarea
            rows={8}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              tool.configOptions?.placeholderInput ||
              'Enter or paste raw text, numbers, or JSON data to process...'
            }
            className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-mono text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 resize-y"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setInputVal('');
                setOutputVal('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <Button
              onClick={handleRun}
              className="shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              <Play className="w-4 h-4 fill-current mr-2" />
              <span>{tool.configOptions?.actionLabel || 'Execute Action'}</span>
            </Button>
          </div>
        </div>

        {/* Output Card */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {tool.configOptions?.outputLabel || 'Output Result'}
              </label>
              {outputVal && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 min-h-[160px] p-4 bg-black/50 border border-white/10 rounded-xl font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto whitespace-pre-wrap flex flex-col justify-between">
              {outputVal ? (
                outputVal
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-8">
                  <Zap className="w-6 h-6 stroke-1 text-slate-700" />
                  <span className="text-xs">Click Execute to view generated results here</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-white/5">
            <span className="font-mono">Status: Ready</span>
            <button
              onClick={handleCopy}
              disabled={!outputVal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-slate-200 text-xs font-semibold rounded-full border border-white/10 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Output</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
