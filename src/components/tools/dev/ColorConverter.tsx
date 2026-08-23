import React, { useState } from 'react';
import { Copy, Check, Pipette, Sparkles, Sliders } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';

export const ColorConverter: React.FC = () => {
  const { success } = useToast();
  const [hex, setHex] = useState('#8B5CF6'); // Purple 500
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Convert Hex to RGB
  const hexToRgb = (h: string) => {
    let clean = h.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgb = hexToRgb(hex);

  // RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number) => {
    const c = 1 - r / 255;
    const m = 1 - g / 255;
    const y = 1 - b / 255;
    const k = Math.min(c, m, y);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    return {
      c: Math.round(((c - k) / (1 - k)) * 100),
      m: Math.round(((m - k) / (1 - k)) * 100),
      y: Math.round(((y - k) / (1 - k)) * 100),
      k: Math.round(k * 100),
    };
  };

  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  // WCAG Relative Luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  const contrastWithWhite = (1 + 0.05) / (luminance + 0.05);
  const contrastWithBlack = (luminance + 0.05) / (0 + 0.05);

  const formats = [
    { key: 'hex', name: 'HEX', value: hex.toUpperCase() },
    { key: 'rgb', name: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { key: 'rgba', name: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
    { key: 'hsl', name: 'HSL', value: `hsl(${hsl.h}deg, ${hsl.s}%, ${hsl.l}%)` },
    { key: 'cmyk', name: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
    { key: 'css-var', name: 'CSS Variable', value: `--color-primary: ${hex};` },
  ];

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    success('Copied color code');
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Color Visual Picker & Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
          <div
            className="w-full h-40 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-center transition-colors"
            style={{ backgroundColor: hex }}
          >
            <span
              className="px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow"
              style={{
                backgroundColor: luminance > 0.4 ? '#09090b' : '#ffffff',
                color: luminance > 0.4 ? '#ffffff' : '#09090b',
              }}
            >
              {hex.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-12 h-10 rounded-xl bg-zinc-900 border border-zinc-700 cursor-pointer"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-purple-500 uppercase"
            />
          </div>

          {/* WCAG Contrast check */}
          <div className="w-full p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1.5 text-xs">
            <p className="font-semibold text-zinc-400">WCAG Contrast Ratios:</p>
            <div className="flex justify-between text-zinc-300">
              <span>Against White Text:</span>
              <span className={`font-mono font-bold ${contrastWithWhite >= 4.5 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {contrastWithWhite.toFixed(2)}:1 {contrastWithWhite >= 4.5 ? '(Pass AA)' : '(Fail)'}
              </span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Against Black Text:</span>
              <span className={`font-mono font-bold ${contrastWithBlack >= 4.5 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {contrastWithBlack.toFixed(2)}:1 {contrastWithBlack >= 4.5 ? '(Pass AA)' : '(Fail)'}
              </span>
            </div>
          </div>
        </div>

        {/* Color Formats List */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Color Standard Formats (Click to copy)
          </h3>

          <div className="space-y-2.5">
            {formats.map((f) => (
              <div
                key={f.key}
                onClick={() => handleCopy(f.value, f.key)}
                className="flex items-center justify-between p-3.5 bg-zinc-950 border border-zinc-800 hover:border-purple-500/50 rounded-xl cursor-pointer group transition-all"
              >
                <div>
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase">{f.name}</p>
                  <p className="text-sm font-mono text-zinc-200 group-hover:text-purple-300 font-bold mt-0.5">
                    {f.value}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-zinc-300">
                  {copiedKey === f.key ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
