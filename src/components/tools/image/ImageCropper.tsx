import React, { useState, useRef, useEffect } from 'react';
import { Download, Crop, Sparkles, RefreshCw, Circle } from 'lucide-react';
import { DropZone } from '../../ui/DropZone';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import confetti from 'canvas-confetti';

export const ImageCropper: React.FC = () => {
  const { success } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null); // null = free
  const [isCircle, setIsCircle] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 80, height: 80 }); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg'>('image/png');

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFile = (files: File[]) => {
    if (files.length === 0) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      setCropBox({ x: 15, y: 15, width: 70, height: 70 });
    };
    reader.readAsDataURL(files[0]);
  };

  const handleDownload = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const canvas = document.createElement('canvas');

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const cropPixelX = (cropBox.x / 100) * naturalW;
    const cropPixelY = (cropBox.y / 100) * naturalH;
    const cropPixelW = (cropBox.width / 100) * naturalW;
    const cropPixelH = (cropBox.height / 100) * naturalH;

    canvas.width = cropPixelW;
    canvas.height = cropPixelH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isCircle) {
      ctx.beginPath();
      ctx.arc(cropPixelW / 2, cropPixelH / 2, Math.min(cropPixelW, cropPixelH) / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    ctx.drawImage(
      img,
      cropPixelX,
      cropPixelY,
      cropPixelW,
      cropPixelH,
      0,
      0,
      cropPixelW,
      cropPixelH
    );

    const ext = exportFormat === 'image/png' ? 'png' : 'jpg';
    const dataUrl = canvas.toDataURL(exportFormat, 0.95);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `cropped-image-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 40, spread: 60 });
    success('Cropped image downloaded!');
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <DropZone
          onFilesSelected={handleFile}
          accept="image/*"
          title="Upload an image to crop"
          description="Square, widescreen, standard, or circular avatar crop"
          formatsDescription="PNG, JPG, WebP"
        />
      ) : (
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1">
                Aspect Ratio:
              </span>
              {[
                { label: 'Freeform', ratio: null, circle: false },
                { label: '1:1 Square', ratio: 1, circle: false },
                { label: '16:9 Widescreen', ratio: 16 / 9, circle: false },
                { label: '4:3 Standard', ratio: 4 / 3, circle: false },
                { label: 'Avatar Circle', ratio: 1, circle: true },
              ].map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => {
                    setAspectRatio(r.ratio);
                    setIsCircle(r.circle);
                    if (r.ratio === 1) {
                      setCropBox({ x: 20, y: 20, width: 60, height: 60 });
                    } else if (r.ratio && r.ratio > 1) {
                      setCropBox({ x: 10, y: 25, width: 80, height: 50 });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    (aspectRatio === r.ratio && isCircle === r.circle)
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                className="bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-zinc-200"
              >
                <option value="image/png">PNG Format</option>
                <option value="image/jpeg">JPG Format</option>
              </select>

              <Button variant="purple" size="sm" onClick={handleDownload} className="font-semibold shadow-purple-600/30">
                <Download className="w-4 h-4 mr-1.5" />
                Download Crop
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageSrc(null)}
                className="text-xs text-zinc-500 hover:text-rose-400"
              >
                New Image
              </Button>
            </div>
          </div>

          {/* Crop Area */}
          <div className="flex items-center justify-center p-8 bg-zinc-950 rounded-2xl border border-zinc-800 min-h-[450px]">
            <div ref={containerRef} className="relative inline-block select-none max-w-full">
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Source to crop"
                className="max-h-[500px] max-w-full object-contain pointer-events-none rounded-lg"
              />

              {/* Crop Box Overlay */}
              <div
                className={`absolute border-2 border-purple-400 shadow-2xl transition-all ${
                  isCircle ? 'rounded-full' : 'rounded-none'
                }`}
                style={{
                  top: `${cropBox.y}%`,
                  left: `${cropBox.x}%`,
                  width: `${cropBox.width}%`,
                  height: `${cropBox.height}%`,
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
                }}
              >
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                  <div className="border-r border-b border-white/50" />
                  <div className="border-r border-b border-white/50" />
                  <div className="border-b border-white/50" />
                  <div className="border-r border-b border-white/50" />
                  <div className="border-r border-b border-white/50" />
                  <div className="border-b border-white/50" />
                  <div className="border-r border-white/50" />
                  <div className="border-r border-white/50" />
                  <div />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Slider fine tune */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-zinc-950/60 rounded-xl border border-zinc-800 text-xs">
            <div>
              <label className="text-zinc-400">Position X: {cropBox.x}%</label>
              <input
                type="range"
                min="0"
                max={100 - cropBox.width}
                value={cropBox.x}
                onChange={(e) => setCropBox({ ...cropBox, x: Number(e.target.value) })}
                className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded"
              />
            </div>
            <div>
              <label className="text-zinc-400">Position Y: {cropBox.y}%</label>
              <input
                type="range"
                min="0"
                max={100 - cropBox.height}
                value={cropBox.y}
                onChange={(e) => setCropBox({ ...cropBox, y: Number(e.target.value) })}
                className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded"
              />
            </div>
            <div>
              <label className="text-zinc-400">Width: {cropBox.width}%</label>
              <input
                type="range"
                min="20"
                max={100 - cropBox.x}
                value={cropBox.width}
                onChange={(e) => {
                  const w = Number(e.target.value);
                  const h = aspectRatio ? w / aspectRatio : cropBox.height;
                  setCropBox({ ...cropBox, width: w, height: Math.min(100 - cropBox.y, h) });
                }}
                className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded"
              />
            </div>
            <div>
              <label className="text-zinc-400">Height: {cropBox.height}%</label>
              <input
                type="range"
                min="20"
                max={100 - cropBox.y}
                value={cropBox.height}
                onChange={(e) => {
                  const h = Number(e.target.value);
                  const w = aspectRatio ? h * aspectRatio : cropBox.width;
                  setCropBox({ ...cropBox, height: h, width: Math.min(100 - cropBox.x, w) });
                }}
                className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
