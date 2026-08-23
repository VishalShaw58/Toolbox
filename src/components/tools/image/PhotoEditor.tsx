import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Undo,
  Redo,
  RotateCcw,
  Download,
  Sliders,
  Crop,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { DropZone } from '../../ui/DropZone';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import confetti from 'canvas-confetti';

interface FilterState {
  brightness: number; // 0 to 200 (100 normal)
  contrast: number; // 0 to 200 (100 normal)
  saturate: number; // 0 to 200 (100 normal)
  blur: number; // 0 to 20 (0 normal)
  grayscale: number; // 0 to 100 (0 normal)
  sepia: number; // 0 to 100 (0 normal)
  invert: number; // 0 to 100 (0 normal)
  hueRotate: number; // 0 to 360 (0 normal)
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  hueRotate: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
};

export const PhotoEditor: React.FC = () => {
  const { success, error } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [history, setHistory] = useState<FilterState[]>([DEFAULT_FILTERS]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  const applyFiltersToState = (newFilters: FilterState) => {
    setFilters(newFilters);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newFilters);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleFilterChange = (key: keyof FilterState, val: number | boolean) => {
    const updated = { ...filters, [key]: val };
    setFilters(updated);
  };

  // Commit history on mouse up for sliders
  const handleSliderCommit = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(filters);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setFilters(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setFilters(history[historyIndex + 1]);
    }
  };

  const handleReset = () => {
    applyFiltersToState(DEFAULT_FILTERS);
    success('Filters reset to default');
  };

  const renderCanvas = () => {
    if (!canvasRef.current || !originalImageRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = originalImageRef.current;
    const isRotated = filters.rotation === 90 || filters.rotation === 270;
    const width = isRotated ? img.naturalHeight : img.naturalWidth;
    const height = isRotated ? img.naturalWidth : img.naturalHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Move to center for rotation / flip
    ctx.translate(width / 2, height / 2);
    ctx.rotate((filters.rotation * Math.PI) / 180);
    ctx.scale(filters.flipH ? -1 : 1, filters.flipV ? -1 : 1);

    // Apply CSS filters
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) invert(${filters.invert}%) hue-rotate(${filters.hueRotate}deg)`;

    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();
  };

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        originalImageRef.current = img;
        renderCanvas();
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  useEffect(() => {
    renderCanvas();
  }, [filters]);

  const handleFile = (files: File[]) => {
    if (files.length === 0) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      setFilters(DEFAULT_FILTERS);
      setHistory([DEFAULT_FILTERS]);
      setHistoryIndex(0);
    };
    reader.readAsDataURL(files[0]);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const ext = exportFormat === 'image/png' ? 'png' : exportFormat === 'image/jpeg' ? 'jpg' : 'webp';
    const dataUrl = canvasRef.current.toDataURL(exportFormat, 0.92);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `edited-photo-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 40, spread: 60 });
    success('Edited image downloaded!');
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <DropZone
          onFilesSelected={handleFile}
          accept="image/*"
          title="Upload a photo to edit"
          description="Adjust brightness, contrast, orientation, color balance, and export in high quality"
          formatsDescription="PNG, JPG, WebP"
        />
      ) : (
        <div className="space-y-6">
          {/* Top toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={historyIndex === 0}
                onClick={handleUndo}
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4 mr-1" />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={historyIndex >= history.length - 1}
                onClick={handleRedo}
                title="Redo"
              >
                <Redo className="w-4 h-4 mr-1" />
                Redo
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-zinc-400 hover:text-white">
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                className="bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-zinc-200"
              >
                <option value="image/png">PNG (Lossless)</option>
                <option value="image/jpeg">JPG (Standard)</option>
                <option value="image/webp">WebP (Optimized)</option>
              </select>

              <Button variant="purple" size="sm" onClick={handleDownload} className="font-semibold shadow-purple-600/30">
                <Download className="w-4 h-4 mr-1.5" />
                Download Photo
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageSrc(null)}
                className="text-xs text-zinc-500 hover:text-rose-400"
              >
                New Photo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Center Canvas Viewport */}
            <div className="lg:col-span-8 flex items-center justify-center p-6 bg-zinc-950/90 rounded-2xl border border-zinc-800 min-h-[450px] overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[600px] object-contain rounded-xl shadow-2xl transition-all"
              />
            </div>

            {/* Right Controls Panel */}
            <div className="lg:col-span-4 space-y-6 p-5 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 overflow-y-auto max-h-[600px]">
              {/* Orientation & Flip */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                  Transform
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const nextRot = (filters.rotation + 90) % 360;
                      applyFiltersToState({ ...filters, rotation: nextRot });
                    }}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs flex flex-col items-center gap-1.5"
                  >
                    <RotateCw className="w-4 h-4 text-purple-400" />
                    <span>Rotate 90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyFiltersToState({ ...filters, flipH: !filters.flipH })}
                    className={`p-2.5 rounded-xl border text-xs flex flex-col items-center gap-1.5 transition-colors ${
                      filters.flipH
                        ? 'bg-purple-950/50 border-purple-800 text-purple-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                    }`}
                  >
                    <FlipHorizontal className="w-4 h-4" />
                    <span>Flip H</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyFiltersToState({ ...filters, flipV: !filters.flipV })}
                    className={`p-2.5 rounded-xl border text-xs flex flex-col items-center gap-1.5 transition-colors ${
                      filters.flipV
                        ? 'bg-purple-950/50 border-purple-800 text-purple-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                    }`}
                  >
                    <FlipVertical className="w-4 h-4" />
                    <span>Flip V</span>
                  </button>
                </div>
              </div>

              {/* Adjustments */}
              <div className="space-y-4 pt-2 border-t border-zinc-850">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Adjustments
                </h4>

                {/* Brightness */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Brightness</span>
                    <span className="font-mono text-zinc-500">{filters.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.brightness}
                    onChange={(e) => handleFilterChange('brightness', Number(e.target.value))}
                    onMouseUp={handleSliderCommit}
                    onTouchEnd={handleSliderCommit}
                    className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Contrast</span>
                    <span className="font-mono text-zinc-500">{filters.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.contrast}
                    onChange={(e) => handleFilterChange('contrast', Number(e.target.value))}
                    onMouseUp={handleSliderCommit}
                    onTouchEnd={handleSliderCommit}
                    className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Saturation</span>
                    <span className="font-mono text-zinc-500">{filters.saturate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.saturate}
                    onChange={(e) => handleFilterChange('saturate', Number(e.target.value))}
                    onMouseUp={handleSliderCommit}
                    onTouchEnd={handleSliderCommit}
                    className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg"
                  />
                </div>

                {/* Blur */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Blur</span>
                    <span className="font-mono text-zinc-500">{filters.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={filters.blur}
                    onChange={(e) => handleFilterChange('blur', Number(e.target.value))}
                    onMouseUp={handleSliderCommit}
                    onTouchEnd={handleSliderCommit}
                    className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg"
                  />
                </div>

                {/* Grayscale */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Grayscale / Black & White</span>
                    <span className="font-mono text-zinc-500">{filters.grayscale}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.grayscale}
                    onChange={(e) => handleFilterChange('grayscale', Number(e.target.value))}
                    onMouseUp={handleSliderCommit}
                    onTouchEnd={handleSliderCommit}
                    className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg"
                  />
                </div>

                {/* Sepia */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Sepia Vintage</span>
                    <span className="font-mono text-zinc-500">{filters.sepia}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.sepia}
                    onChange={(e) => handleFilterChange('sepia', Number(e.target.value))}
                    onMouseUp={handleSliderCommit}
                    onTouchEnd={handleSliderCommit}
                    className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg"
                  />
                </div>

                {/* Invert */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Invert Colors</span>
                    <span className="font-mono text-zinc-500">{filters.invert}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.invert}
                    onChange={(e) => handleFilterChange('invert', Number(e.target.value))}
                    onMouseUp={handleSliderCommit}
                    onTouchEnd={handleSliderCommit}
                    className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg"
                  />
                </div>

                {/* Hue Rotate */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Hue Tint Shift</span>
                    <span className="font-mono text-zinc-500">{filters.hueRotate}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={filters.hueRotate}
                    onChange={(e) => handleFilterChange('hueRotate', Number(e.target.value))}
                    onMouseUp={handleSliderCommit}
                    onTouchEnd={handleSliderCommit}
                    className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
