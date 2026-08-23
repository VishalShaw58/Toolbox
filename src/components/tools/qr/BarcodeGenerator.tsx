import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Download, Copy, Check, Barcode as BarcodeIcon, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import confetti from 'canvas-confetti';

export const BarcodeGenerator: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [format, setFormat] = useState<'CODE128' | 'EAN13' | 'UPC' | 'CODE39' | 'ITF' | 'pharmacode'>('CODE128');
  const [value, setValue] = useState('TOOLBOX-2026');
  const [lineColor, setLineColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [margin, setMargin] = useState(10);
  const [barcodeError, setBarcodeError] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;
    setBarcodeError(null);

    try {
      JsBarcode(svgRef.current, value || '123456', {
        format: format,
        lineColor: lineColor,
        background: bgColor,
        width: width,
        height: height,
        displayValue: displayValue,
        fontSize: fontSize,
        margin: margin,
        valid: (valid) => {
          if (!valid) {
            setBarcodeError(`Invalid content for ${format} format.`);
          }
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid barcode string';
      setBarcodeError(msg);
    }
  }, [format, value, lineColor, bgColor, width, height, displayValue, fontSize, margin]);

  const handleDownloadSvg = () => {
    if (!svgRef.current || barcodeError) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode-${format.toLowerCase()}-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    confetti({ particleCount: 30, spread: 50 });
    success('Barcode SVG downloaded');
  };

  const handleDownloadPng = () => {
    if (!svgRef.current || barcodeError) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(image, 0, 0);
      const png = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = png;
      a.download = `barcode-${format.toLowerCase()}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      confetti({ particleCount: 30, spread: 50 });
      success('Barcode PNG downloaded');
    };
    image.src = blobURL;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Formats & Inputs */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Barcode Standard
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'CODE128', name: 'Code 128 (Alphanumeric)' },
              { id: 'EAN13', name: 'EAN-13 (13 Digits)' },
              { id: 'UPC', name: 'UPC-A (12 Digits)' },
              { id: 'CODE39', name: 'Code 39' },
              { id: 'ITF', name: 'ITF-14' },
              { id: 'pharmacode', name: 'Pharmacode' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFormat(f.id as typeof format);
                  if (f.id === 'EAN13' && value.length !== 12 && value.length !== 13) {
                    setValue('978020137962');
                  } else if (f.id === 'UPC' && value.length !== 11 && value.length !== 12) {
                    setValue('12345678901');
                  }
                }}
                className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition-colors cursor-pointer ${
                  format === f.id
                    ? 'bg-purple-600/20 text-white border-purple-500/50 shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Barcode Data / Value
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 123456789 or PRODUCT-SKU"
              className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-purple-500"
            />
            {barcodeError && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {barcodeError}
              </p>
            )}
          </div>
        </div>

        {/* Customization controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Bar Height ({height}px)</label>
            <input
              type="range"
              min="40"
              max="200"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-purple-500 bg-zinc-800 h-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Bar Width ({width}px)</label>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-purple-500 bg-zinc-800 h-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Line Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 cursor-pointer"
              />
              <input
                type="text"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1 text-xs text-zinc-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1 text-xs text-zinc-200 font-mono"
              />
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center justify-between p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
            <span className="text-xs font-medium text-zinc-300">Display Human-Readable Text Below</span>
            <input
              type="checkbox"
              checked={displayValue}
              onChange={(e) => setDisplayValue(e.target.checked)}
              className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Live Barcode Preview */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-950/80 rounded-2xl border border-zinc-800/90 shadow-inner">
        <div className="text-center mb-4">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Live Barcode Preview
          </span>
        </div>

        <div
          className="p-6 rounded-2xl shadow-2xl flex items-center justify-center overflow-x-auto max-w-full mb-6 border border-zinc-200"
          style={{ backgroundColor: bgColor }}
        >
          <svg ref={svgRef} className="max-w-full" />
        </div>

        <div className="w-full max-w-xs space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="purple"
              size="md"
              disabled={Boolean(barcodeError)}
              onClick={handleDownloadPng}
              className="w-full text-xs font-semibold"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download PNG
            </Button>
            <Button
              variant="secondary"
              size="md"
              disabled={Boolean(barcodeError)}
              onClick={handleDownloadSvg}
              className="w-full text-xs"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download SVG
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
