import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, Plus, ArrowUp, ArrowDown, Trash2, FileSpreadsheet, Sparkles } from 'lucide-react';
import { DropZone } from '../../ui/DropZone';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import { downloadBlob } from '../../../lib/utils';
import confetti from 'canvas-confetti';

interface ImagePdfItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
}

export const JpgToPdf: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<ImagePdfItem[]>([]);
  const [pageSize, setPageSize] = useState<'fit' | 'a4' | 'letter'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFiles = (files: File[]) => {
    const newItems: ImagePdfItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleGeneratePdf = async () => {
    if (items.length === 0) return;
    setIsGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of items) {
        const arrayBuffer = await item.file.arrayBuffer();
        let pdfImage;
        if (item.file.type.includes('png')) {
          pdfImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // Default to JPG embedding
          pdfImage = await pdfDoc.embedJpg(arrayBuffer);
        }

        const imgWidth = pdfImage.width;
        const imgHeight = pdfImage.height;

        let pageWidth = pageSize === 'letter' ? 612 : 595.28; // A4 standard pt
        let pageHeight = pageSize === 'letter' ? 792 : 841.89; // A4 standard pt

        if (pageSize === 'fit') {
          pageWidth = imgWidth + margin * 2;
          pageHeight = imgHeight + margin * 2;
        } else if (orientation === 'landscape') {
          const temp = pageWidth;
          pageWidth = pageHeight;
          pageHeight = temp;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Scale image to fit within margins
        const maxDrawWidth = pageWidth - margin * 2;
        const maxDrawHeight = pageHeight - margin * 2;
        const scale = Math.min(maxDrawWidth / imgWidth, maxDrawHeight / imgHeight);

        const drawWidth = imgWidth * scale;
        const drawHeight = imgHeight * scale;
        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;

        page.drawImage(pdfImage, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, `images-album-${Date.now()}.pdf`);

      confetti({ particleCount: 50, spread: 70 });
      success('PDF Document generated!', `Compiled ${items.length} images into a PDF.`);
    } catch (err) {
      console.error(err);
      toastError('Failed to convert images to PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <DropZone
          onFilesSelected={handleFiles}
          accept="image/jpeg,image/png"
          multiple={true}
          title="Drop images to create PDF document"
          description="Upload photos, screenshots or diagrams to compile into a multi-page PDF booklet"
          formatsDescription="JPG, PNG"
        />
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as typeof pageSize)}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-xs text-zinc-200"
                >
                  <option value="a4">A4 Standard Document</option>
                  <option value="letter">US Letter</option>
                  <option value="fit">Fit to Image Size</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Orientation</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as typeof orientation)}
                  disabled={pageSize === 'fit'}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-xs text-zinc-200 disabled:opacity-50"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Margin ({margin}pt)</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-zinc-800 h-2 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-850 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'image/jpeg,image/png';
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files) handleFiles(Array.from(files));
                  };
                  input.click();
                }}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add More Images
              </Button>

              <Button
                variant="purple"
                size="sm"
                loading={isGenerating}
                onClick={handleGeneratePdf}
                className="font-semibold shadow-purple-600/30"
              >
                <Download className="w-4 h-4 mr-1.5" />
                Generate & Download PDF ({items.length} Pages)
              </Button>
            </div>
          </div>

          {/* List of images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-zinc-500 font-mono w-4">{idx + 1}</span>
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                  />
                  <p className="text-xs font-medium text-zinc-200 truncate">{item.name}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveUp(idx)}
                    className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 rounded hover:bg-zinc-900"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === items.length - 1}
                    onClick={() => moveDown(idx)}
                    className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 rounded hover:bg-zinc-900"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-zinc-900"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
