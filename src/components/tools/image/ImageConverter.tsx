import React, { useState } from 'react';
import { Download, RefreshCw, Layers, ArrowRight } from 'lucide-react';
import { DropZone } from '../../ui/DropZone';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import confetti from 'canvas-confetti';
import { formatBytes } from '../../../lib/utils';

interface ImageConverterProps {
  forcedFormat?: 'png' | 'jpeg' | 'webp';
  toolTitle?: string;
}

export const ImageConverter: React.FC<ImageConverterProps> = ({
  forcedFormat,
}) => {
  const { success } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp' | 'bmp'>(forcedFormat || 'png');
  const [quality, setQuality] = useState(90);
  const [bgFill, setBgFill] = useState('#ffffff');
  const [convertedUrls, setConvertedUrls] = useState<Array<{ name: string; url: string; size: number }>>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleFiles = (selected: File[]) => {
    setFiles(selected);
    setConvertedUrls([]);
  };

  const convertAll = async () => {
    if (files.length === 0) return;
    setIsConverting(true);

    const results: Array<{ name: string; url: string; size: number }> = [];

    for (const file of files) {
      const mime = targetFormat === 'jpeg' ? 'image/jpeg' : targetFormat === 'webp' ? 'image/webp' : 'image/png';
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

      const url = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              if (targetFormat === 'jpeg') {
                ctx.fillStyle = bgFill;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
              }
              ctx.drawImage(img, 0, 0);
              canvas.toBlob(
                (blob) => {
                  let blobUrl = '';
                  if (blob) {
                    blobUrl = URL.createObjectURL(blob);
                    results.push({
                      name: `${baseName}.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`,
                      url: blobUrl,
                      size: blob.size,
                    });
                  }
                  resolve(blobUrl);
                },
                mime,
                quality / 100
              );
            }
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }

    setConvertedUrls(results);
    setIsConverting(false);
    confetti({ particleCount: 40, spread: 60 });
    success('Conversion complete', `Successfully converted ${results.length} files.`);
  };

  const downloadOne = (item: { name: string; url: string }) => {
    const a = document.createElement('a');
    a.href = item.url;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    convertedUrls.forEach((it, idx) => {
      setTimeout(() => downloadOne(it), idx * 200);
    });
    success('Downloading all converted images');
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone
          onFilesSelected={handleFiles}
          accept="image/*"
          multiple={true}
          title="Drop images to convert format"
          description="Batch convert JPG, PNG, WebP, BMP, GIF, SVG into any format"
          formatsDescription="Universal Image Converter"
        />
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Convert To</label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value as typeof targetFormat)}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-xs text-zinc-200 font-medium"
                >
                  <option value="png">PNG (Lossless & Alpha)</option>
                  <option value="jpeg">JPG / JPEG (Standard)</option>
                  <option value="webp">WebP (Next-Gen Web)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1.5">
                  <span>Quality: {quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-zinc-800 h-2 rounded-lg"
                />
              </div>

              {targetFormat === 'jpeg' && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Background Fill Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgFill}
                      onChange={(e) => setBgFill(e.target.value)}
                      className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bgFill}
                      onChange={(e) => setBgFill(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-zinc-200 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-850 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="purple"
                  size="sm"
                  loading={isConverting}
                  onClick={convertAll}
                  className="font-semibold shadow-purple-600/30"
                >
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  Convert {files.length} {files.length === 1 ? 'Image' : 'Images'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setFiles([])}>
                  Select Different Files
                </Button>
              </div>

              {convertedUrls.length > 0 && (
                <Button variant="primary" size="sm" onClick={downloadAll}>
                  <Download className="w-4 h-4 mr-1.5" />
                  Download All ({convertedUrls.length})
                </Button>
              )}
            </div>
          </div>

          {/* Files / Results preview */}
          <div className="space-y-3">
            {convertedUrls.length > 0
              ? convertedUrls.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-zinc-900 border border-zinc-800"
                      />
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">{item.name}</p>
                        <p className="text-xs text-emerald-400 font-medium">{formatBytes(item.size)}</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => downloadOne(item)}>
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Download
                    </Button>
                  </div>
                ))
              : files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300"
                  >
                    <span className="truncate max-w-sm">{file.name}</span>
                    <span className="text-zinc-500">{formatBytes(file.size)}</span>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};
