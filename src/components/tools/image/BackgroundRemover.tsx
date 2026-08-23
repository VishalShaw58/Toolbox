import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, Pipette, RefreshCw, Layers } from 'lucide-react';
import { DropZone } from '../../ui/DropZone';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import confetti from 'canvas-confetti';

export const BackgroundRemover: React.FC = () => {
  const { success } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [targetColor, setTargetColor] = useState<{ r: number; g: number; b: number }>({ r: 255, g: 255, b: 255 });
  const [tolerance, setTolerance] = useState(35);
  const [feather, setFeather] = useState(15);
  const [isEyedropperActive, setIsEyedropperActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (files: File[]) => {
    if (files.length === 0) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.onload = () => {
        originalImgRef.current = img;
        // Sample top-left corner as default background color
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.naturalWidth;
        tempCanvas.height = img.naturalHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0);
          const pixel = tempCtx.getImageData(5, 5, 1, 1).data;
          setTargetColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(files[0]);
  };

  const processRemoval = () => {
    if (!canvasRef.current || !originalImgRef.current) return;
    const canvas = canvasRef.current;
    const img = originalImgRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const { r: tr, g: tg, b: tb } = targetColor;
    const tolSq = tolerance * tolerance * 3;
    const featherRange = feather * feather * 3;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const distSq = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;

      if (distSq < tolSq) {
        data[i + 3] = 0; // Fully transparent
      } else if (distSq < tolSq + featherRange && featherRange > 0) {
        const factor = (distSq - tolSq) / featherRange;
        data[i + 3] = Math.round(data[i + 3] * factor);
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };

  useEffect(() => {
    if (imageSrc && originalImgRef.current) {
      processRemoval();
    }
  }, [targetColor, tolerance, feather, imageSrc]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !originalImgRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = originalImgRef.current.naturalWidth / rect.width;
    const scaleY = originalImgRef.current.naturalHeight / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    // Read original pixel color
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = originalImgRef.current.naturalWidth;
    tempCanvas.height = originalImgRef.current.naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(originalImgRef.current, 0, 0);
      const pixel = tempCtx.getImageData(x, y, 1, 1).data;
      setTargetColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
      success('Background color sampled from click!');
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `transparent-cutout-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 40, spread: 60 });
    success('Transparent PNG downloaded!');
  };

  const rgbHex = `#${((1 << 24) + (targetColor.r << 16) + (targetColor.g << 8) + targetColor.b).toString(16).slice(1)}`;

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <DropZone
          onFilesSelected={handleFile}
          accept="image/*"
          title="Upload image to remove background"
          description="Click any background color or chroma-key to isolate your subject and export transparent PNG"
          formatsDescription="PNG, JPG, WebP"
        />
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Target Background Color (or click canvas)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={rgbHex}
                    onChange={(e) => {
                      const hex = e.target.value;
                      const r = parseInt(hex.slice(1, 3), 16);
                      const g = parseInt(hex.slice(3, 5), 16);
                      const b = parseInt(hex.slice(5, 7), 16);
                      setTargetColor({ r, g, b });
                    }}
                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-zinc-300 bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800 uppercase flex-1">
                    {rgbHex}
                  </span>
                </div>
              </div>

              {/* Tolerance */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1.5">
                  <span>Color Tolerance</span>
                  <span className="text-purple-400 font-mono">{tolerance}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-zinc-800 h-2 rounded-lg"
                />
              </div>

              {/* Feather Edge */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1.5">
                  <span>Edge Smoothness / Feather</span>
                  <span className="text-purple-400 font-mono">{feather}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={feather}
                  onChange={(e) => setFeather(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-zinc-800 h-2 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-850 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Pipette className="w-3.5 h-3.5 text-purple-400" />
                Tip: Click anywhere on the image below to sample background color
              </span>

              <div className="flex items-center gap-3">
                <Button variant="purple" size="sm" onClick={handleDownload} className="font-semibold shadow-purple-600/30">
                  <Download className="w-4 h-4 mr-1.5" />
                  Download Transparent PNG
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setImageSrc(null)} className="text-xs text-zinc-500 hover:text-white">
                  New Image
                </Button>
              </div>
            </div>
          </div>

          {/* Checkerboard Preview Canvas */}
          <div className="flex items-center justify-center p-8 bg-zinc-950 rounded-2xl border border-zinc-800 min-h-[450px]">
            <div
              className="p-2 rounded-xl border border-zinc-700/50 shadow-2xl max-w-full"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #18181b 25%, transparent 25%), linear-gradient(-45deg, #18181b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #18181b 75%), linear-gradient(-45deg, transparent 75%, #18181b 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                backgroundColor: '#09090b',
              }}
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="max-h-[500px] max-w-full object-contain cursor-crosshair rounded-lg"
                title="Click anywhere to sample color"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
