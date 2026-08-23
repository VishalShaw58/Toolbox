import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, ArrowUp, ArrowDown, Trash2, FileText, Sparkles, Layers } from 'lucide-react';
import { DropZone } from '../../ui/DropZone';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import { formatBytes, downloadBlob } from '../../../lib/utils';
import confetti from 'canvas-confetti';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

export const PdfMerger: React.FC = () => {
  const { success, error } = useToast();
  const [items, setItems] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const handleFiles = async (files: File[]) => {
    const newItems: PdfFileItem[] = [];

    for (const file of files) {
      const id = Math.random().toString(36).substring(2, 9);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();

        newItems.push({
          id,
          file,
          name: file.name,
          size: file.size,
          pageCount,
        });
      } catch (err) {
        console.error(err);
        newItems.push({
          id,
          file,
          name: file.name,
          size: file.size,
          pageCount: 1,
        });
      }
    }

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

  const handleMerge = async () => {
    if (items.length < 2) {
      error('Please upload at least 2 PDF files to merge.');
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of items) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, `merged-document-${Date.now()}.pdf`);

      confetti({ particleCount: 50, spread: 70 });
      success('PDFs merged successfully!', 'Your unified PDF has been downloaded.');
    } catch (err) {
      console.error(err);
      error('Failed to merge PDFs', 'Please ensure none of the files are password-protected.');
    } finally {
      setIsMerging(false);
    }
  };

  const totalPages = items.reduce((acc, i) => acc + i.pageCount, 0);

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <DropZone
          onFilesSelected={handleFiles}
          accept="application/pdf"
          multiple={true}
          maxSizeMB={50}
          title="Drop multiple PDF files to combine"
          description="Drag and drop 2 or more PDF documents to merge into a single file"
          formatsDescription="PDF Documents"
        />
      ) : (
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                {items.length} Files Selected ({totalPages} Total Pages)
              </h3>
              <p className="text-xs text-zinc-400">
                Use arrows to adjust document merge sequence
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'application/pdf';
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files) handleFiles(Array.from(files));
                  };
                  input.click();
                }}
              >
                Add More PDFs
              </Button>

              <Button
                variant="purple"
                size="sm"
                loading={isMerging}
                onClick={handleMerge}
                className="font-semibold shadow-purple-600/30"
              >
                <Layers className="w-4 h-4 mr-1.5" />
                Merge & Download PDF
              </Button>
            </div>
          </div>

          {/* List of PDFs */}
          <div className="space-y-2.5">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/90 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-red-950/50 border border-red-800/60 flex items-center justify-center text-rose-400 font-mono text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate max-w-sm sm:max-w-md">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • {formatBytes(item.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveUp(idx)}
                    className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-900 rounded-lg transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={idx === items.length - 1}
                    onClick={() => moveDown(idx)}
                    className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-900 rounded-lg transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 rounded-lg transition-colors"
                    title="Remove"
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
