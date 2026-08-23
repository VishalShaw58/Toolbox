import React, { useState } from 'react';
import {
  Download,
  Trash2,
  Minimize2,
  FileImage,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { DropZone } from '../../ui/DropZone';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { formatBytes, downloadBlob } from '../../../lib/utils';
import { useToast } from '../../../hooks/useToast';
import confetti from 'canvas-confetti';

interface CompressedImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalDataUrl: string;
  compressedBlob: Blob | null;
  compressedSize: number;
  compressedDataUrl: string | null;
  savingsPercent: number;
  status: 'idle' | 'compressing' | 'done' | 'error';
}

export const ImageCompressor: React.FC = () => {
  const { success, error } = useToast();
  const [items, setItems] = useState<CompressedImageItem[]>([]);
  const [quality, setQuality] = useState(75);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [maxDimension, setMaxDimension] = useState<number>(0); // 0 = no resize
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  const compressSingleImage = async (
    item: CompressedImageItem,
    qualityPercent: number,
    format: string,
    maxDim: number
  ): Promise<CompressedImageItem> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (maxDim > 0 && (width > maxDim || height > maxDim)) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ ...item, status: 'error' });
          return;
        }

        // For JPEG, fill transparent background with white
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        const q = qualityPercent / 100;
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ ...item, status: 'error' });
              return;
            }
            const compressedUrl = URL.createObjectURL(blob);
            const savings = Math.max(
              0,
              Math.round(((item.originalSize - blob.size) / item.originalSize) * 100)
            );

            resolve({
              ...item,
              compressedBlob: blob,
              compressedSize: blob.size,
              compressedDataUrl: compressedUrl,
              savingsPercent: savings,
              status: 'done',
            });
          },
          format,
          q
        );
      };
      img.onerror = () => {
        resolve({ ...item, status: 'error' });
      };
      img.src = item.originalDataUrl;
    });
  };

  const handleFilesSelected = (files: File[]) => {
    const newItems: CompressedImageItem[] = files.map((file) => {
      const id = Math.random().toString(36).substring(2, 9);
      const url = URL.createObjectURL(file);
      return {
        id,
        file,
        name: file.name,
        originalSize: file.size,
        originalDataUrl: url,
        compressedBlob: null,
        compressedSize: 0,
        compressedDataUrl: null,
        savingsPercent: 0,
        status: 'idle',
      };
    });

    setItems((prev) => [...prev, ...newItems]);
  };

  const processAll = async () => {
    if (items.length === 0) return;
    setIsProcessingAll(true);

    const updated: CompressedImageItem[] = [];
    for (const it of items) {
      const res = await compressSingleImage(it, quality, targetFormat, maxDimension);
      updated.push(res);
    }
    setItems(updated);
    setIsProcessingAll(false);
    confetti({ particleCount: 50, spread: 70 });
    success('Compression complete', `Optimized ${updated.length} images.`);
  };

  const handleDownloadItem = (item: CompressedImageItem) => {
    if (!item.compressedBlob) return;
    const ext = targetFormat === 'image/jpeg' ? 'jpg' : targetFormat === 'image/webp' ? 'webp' : 'png';
    const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    downloadBlob(item.compressedBlob, `${baseName}-compressed.${ext}`);
  };

  const handleDownloadAll = () => {
    const readyItems = items.filter((i) => i.status === 'done' && i.compressedBlob);
    if (readyItems.length === 0) return;

    readyItems.forEach((item, index) => {
      setTimeout(() => {
        handleDownloadItem(item);
      }, index * 200);
    });
    success('Downloading all files');
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  // Calculations for bulk summary
  const totalOriginal = items.reduce((acc, i) => acc + i.originalSize, 0);
  const totalCompressed = items.reduce(
    (acc, i) => acc + (i.compressedSize > 0 ? i.compressedSize : i.originalSize),
    0
  );
  const totalSavedPercent =
    totalOriginal > 0 ? Math.max(0, Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)) : 0;

  return (
    <div className="space-y-8">
      {items.length === 0 ? (
        <DropZone
          onFilesSelected={handleFilesSelected}
          accept="image/jpeg,image/png,image/webp"
          multiple={true}
          maxSizeMB={35}
          title="Drop multiple images to compress"
          description="Supports JPG, PNG, and WebP — processed 100% locally in your browser"
          formatsDescription="JPG, PNG, WebP"
        />
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quality Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-zinc-300">
                  <span>Compression Quality: {quality}%</span>
                  <span className="text-purple-400">
                    {quality > 85 ? 'High Quality' : quality > 60 ? 'Balanced' : 'Max Compression'}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  step="5"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-zinc-800 h-2 rounded-lg"
                />
              </div>

              {/* Output Format */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-300">Output Format</label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value as typeof targetFormat)}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                >
                  <option value="image/jpeg">JPG / JPEG (Best for photos)</option>
                  <option value="image/webp">WebP (Next-Gen high compression)</option>
                  <option value="image/png">PNG (Lossless / transparent)</option>
                </select>
              </div>

              {/* Max Width Resize Option */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-300">Max Dimension</label>
                <select
                  value={maxDimension}
                  onChange={(e) => setMaxDimension(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                >
                  <option value={0}>Original Dimensions (No scale)</option>
                  <option value={1920}>Max 1920px (Full HD)</option>
                  <option value={1280}>Max 1280px (Web standard)</option>
                  <option value={800}>Max 800px (Thumbnail/Blog)</option>
                </select>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-zinc-850 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="purple"
                  size="sm"
                  loading={isProcessingAll}
                  onClick={processAll}
                  className="font-semibold shadow-purple-600/30"
                >
                  <Minimize2 className="w-4 h-4 mr-1.5" />
                  Compress All Images
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = true;
                    input.accept = 'image/jpeg,image/png,image/webp';
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) handleFilesSelected(Array.from(files));
                    };
                    input.click();
                  }}
                >
                  Add More Images
                </Button>
              </div>

              <div className="flex items-center gap-3">
                {items.some((i) => i.status === 'done') && (
                  <Button variant="primary" size="sm" onClick={handleDownloadAll}>
                    <Download className="w-4 h-4 mr-1.5" />
                    Download All
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-zinc-500 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Savings Stats Banner */}
          {items.some((i) => i.status === 'done') && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-cyan-950/30 border border-purple-800/40 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Total Saved: {formatBytes(totalOriginal - totalCompressed)} ({totalSavedPercent}%)
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Original: {formatBytes(totalOriginal)} → Compressed: {formatBytes(totalCompressed)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Image Items List */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700/80 gap-4 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.compressedDataUrl || item.originalDataUrl}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-200 truncate max-w-xs sm:max-w-sm">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                      <span>{formatBytes(item.originalSize)}</span>
                      {item.status === 'done' && (
                        <>
                          <ArrowRight className="w-3 h-3 text-zinc-600" />
                          <span className="font-semibold text-emerald-400">
                            {formatBytes(item.compressedSize)}
                          </span>
                          <span className="text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.2 rounded font-mono">
                            -{item.savingsPercent}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {item.status === 'done' && (
                    <Button variant="secondary" size="sm" onClick={() => handleDownloadItem(item)}>
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Download
                    </Button>
                  )}
                  {item.status === 'idle' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const updated = await compressSingleImage(item, quality, targetFormat, maxDimension);
                        setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));
                      }}
                    >
                      Compress
                    </Button>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
