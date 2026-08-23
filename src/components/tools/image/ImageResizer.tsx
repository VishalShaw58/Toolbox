import React, { useState, useEffect } from 'react';
import { Download, Lock, Unlock, Sparkles, RefreshCw } from 'lucide-react';
import { DropZone } from '../../ui/DropZone';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import confetti from 'canvas-confetti';

export const ImageResizer: React.FC = () => {
  const { success } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [percentage, setPercentage] = useState(100);
  const [mode, setMode] = useState<'pixels' | 'percent'>('pixels');

  const handleFile = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setFileName(file.name.substring(0, file.name.lastIndexOf('.')) || file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.onload = () => {
        setOrigWidth(img.naturalWidth);
        setOrigHeight(img.naturalHeight);
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setPercentage(100);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockRatio && origWidth > 0) {
      const newH = Math.round((val * origHeight) / origWidth);
      setHeight(newH);
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockRatio && origHeight > 0) {
      const newW = Math.round((val * origWidth) / origHeight);
      setWidth(newW);
    }
  };

  const handlePercentageChange = (pct: number) => {
    setPercentage(pct);
    if (origWidth > 0 && origHeight > 0) {
      setWidth(Math.round((origWidth * pct) / 100));
      setHeight(Math.round((origHeight * pct) / 100));
    }
  };

  const setPreset = (presetW: number, presetH: number) => {
    setWidth(presetW);
    setHeight(presetH);
    setLockRatio(false);
  };

  const handleDownload = () => {
    if (!imageSrc || width <= 0 || height <= 0) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, width, height);

      const ext = format === 'image/png' ? 'png' : format === 'image/jpeg' ? 'jpg' : 'webp';
      const dataUrl = canvas.toDataURL(format, 0.95);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${fileName}-${width}x${height}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      confetti({ particleCount: 30, spread: 50 });
      success('Resized image downloaded!');
    };
    img.src = imageSrc;
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <DropZone
          onFilesSelected={handleFile}
          accept="image/*"
          title="Upload image to resize"
          description="Scale by pixels, percentages or social media presets with aspect ratio lock"
          formatsDescription="PNG, JPG, WebP"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-300">
                Original: {origWidth} × {origHeight} px
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageSrc(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Change Image
              </Button>
            </div>

            {/* Resize Mode Tabs */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('pixels')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  mode === 'pixels'
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                By Exact Pixels
              </button>
              <button
                type="button"
                onClick={() => setMode('percent')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  mode === 'percent'
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                By Percentage Scale
              </button>
            </div>

            {mode === 'pixels' ? (
              <div className="space-y-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                <div className="grid grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Width (px)</label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-sm text-zinc-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Height (px)</label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-sm text-zinc-100 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setLockRatio(!lockRatio)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      lockRatio
                        ? 'bg-purple-950/60 text-purple-300 border-purple-800'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{lockRatio ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                <div className="flex justify-between text-xs font-semibold text-zinc-300">
                  <span>Scale Factor</span>
                  <span className="text-purple-400 font-mono">{percentage}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={percentage}
                  onChange={(e) => handlePercentageChange(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-zinc-800 h-2 rounded-lg"
                />
                <div className="flex justify-between text-xs text-zinc-400 pt-1">
                  <span>Result: {width} × {height} px</span>
                </div>
              </div>
            )}

            {/* Presets */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Standard Social Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Instagram Square', w: 1080, h: 1080 },
                  { name: 'Instagram Story / Reel', w: 1080, h: 1920 },
                  { name: 'Twitter / X Header', w: 1500, h: 500 },
                  { name: 'Full HD (1080p)', w: 1920, h: 1080 },
                  { name: 'YouTube Thumbnail', w: 1280, h: 720 },
                  { name: 'Avatar / Profile', w: 500, h: 500 },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setPreset(preset.w, preset.h)}
                    className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left hover:bg-zinc-850 transition-colors text-xs"
                  >
                    <p className="font-semibold text-zinc-200">{preset.name}</p>
                    <p className="text-[11px] text-zinc-500 font-mono">{preset.w} × {preset.h}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Output format & Download */}
            <div className="space-y-3 pt-3 border-t border-zinc-850">
              <div className="flex items-center gap-3">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as typeof format)}
                  className="bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-xs text-zinc-200 flex-1"
                >
                  <option value="image/png">PNG Format</option>
                  <option value="image/jpeg">JPG Format</option>
                  <option value="image/webp">WebP Format</option>
                </select>

                <Button variant="purple" size="md" onClick={handleDownload} className="font-semibold shadow-purple-600/30">
                  <Download className="w-4 h-4 mr-1.5" />
                  Download Resized
                </Button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Target Output Preview
            </span>
            <div className="p-2 border border-zinc-800 rounded-xl bg-zinc-900/40 flex items-center justify-center max-w-full max-h-[450px]">
              <img
                src={imageSrc}
                alt="Resize preview"
                className="max-h-[400px] max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="mt-3 text-xs text-zinc-400 font-mono">
              Dimension: {width} × {height} px
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
