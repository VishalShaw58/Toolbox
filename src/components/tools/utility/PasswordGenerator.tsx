import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Check, ShieldCheck, Lock, Sparkles, KeyRound } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import confetti from 'canvas-confetti';

export const PasswordGenerator: React.FC = () => {
  const { success } = useToast();
  const [length, setLength] = useState(18);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = '';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (useUpper) chars += upper;
    if (useLower) chars += lower;
    if (useNumbers) chars += nums;
    if (useSymbols) chars += syms;

    if (excludeSimilar) {
      chars = chars.replace(/[il1Lo0O]/g, '');
    }

    if (!chars) chars = lower;

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let res = '';
    for (let i = 0; i < length; i++) {
      res += chars[array[i] % chars.length];
    }
    setPassword(res);
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar]);

  // Calculate password strength & entropy
  let poolSize = 0;
  if (useUpper) poolSize += 26;
  if (useLower) poolSize += 26;
  if (useNumbers) poolSize += 10;
  if (useSymbols) poolSize += 30;
  const entropy = Math.round(length * Math.log2(Math.max(1, poolSize)));

  let strengthLabel = 'Weak';
  let strengthColor = 'bg-rose-500 text-rose-300';
  let strengthPercent = 25;

  if (entropy > 85) {
    strengthLabel = 'Very Strong';
    strengthColor = 'bg-emerald-500 text-emerald-300';
    strengthPercent = 100;
  } else if (entropy > 60) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-teal-500 text-teal-300';
    strengthPercent = 75;
  } else if (entropy > 40) {
    strengthLabel = 'Moderate';
    strengthColor = 'bg-amber-500 text-amber-300';
    strengthPercent = 50;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    success('Secure password copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Password Display Box */}
      <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between gap-3 p-4 bg-zinc-900/90 rounded-xl border border-zinc-750">
          <span className="font-mono text-xl sm:text-2xl font-bold text-zinc-100 tracking-wider break-all select-all">
            {password}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={generatePassword}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <Button variant="purple" size="sm" onClick={handleCopy} className="shadow-purple-600/30">
              {copied ? <Check className="w-4 h-4 mr-1 text-emerald-300" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-zinc-400">
              Security Strength: <span className="font-bold text-white">{strengthLabel}</span>
            </span>
            <span className="text-zinc-500 font-mono">~{entropy} bits entropy</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                strengthPercent === 100
                  ? 'bg-emerald-500'
                  : strengthPercent === 75
                  ? 'bg-teal-500'
                  : strengthPercent === 50
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${strengthPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Configuration Sliders & Checkboxes */}
      <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-5">
        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-zinc-200">
            <span>Password Length</span>
            <span className="font-mono text-purple-400 text-sm font-bold">{length} characters</span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-purple-500 bg-zinc-800 h-2 rounded-lg"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-850">
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer hover:border-zinc-700">
            <input
              type="checkbox"
              checked={useUpper}
              onChange={(e) => setUseUpper(e.target.checked)}
              className="w-4 h-4 rounded accent-purple-500"
            />
            <div>
              <p className="text-xs font-semibold text-zinc-200">Uppercase Letters</p>
              <p className="text-[11px] text-zinc-500 font-mono">A, B, C...</p>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer hover:border-zinc-700">
            <input
              type="checkbox"
              checked={useLower}
              onChange={(e) => setUseLower(e.target.checked)}
              className="w-4 h-4 rounded accent-purple-500"
            />
            <div>
              <p className="text-xs font-semibold text-zinc-200">Lowercase Letters</p>
              <p className="text-[11px] text-zinc-500 font-mono">a, b, c...</p>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer hover:border-zinc-700">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="w-4 h-4 rounded accent-purple-500"
            />
            <div>
              <p className="text-xs font-semibold text-zinc-200">Numbers</p>
              <p className="text-[11px] text-zinc-500 font-mono">0, 1, 2, 3...</p>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer hover:border-zinc-700">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="w-4 h-4 rounded accent-purple-500"
            />
            <div>
              <p className="text-xs font-semibold text-zinc-200">Special Symbols</p>
              <p className="text-[11px] text-zinc-500 font-mono">! @ # $ % & *</p>
            </div>
          </label>
        </div>

        <div className="pt-2 border-t border-zinc-850">
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeSimilar}
              onChange={(e) => setExcludeSimilar(e.target.checked)}
              className="w-4 h-4 rounded accent-purple-500"
            />
            <span>Exclude ambiguous characters (like 0, O, 1, l, I)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
