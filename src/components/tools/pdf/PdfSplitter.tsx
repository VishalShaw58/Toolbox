import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Scissors, Download, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { DropZone } from '../../ui/DropZone';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import { formatBytes, downloadBlob } from '../../../lib/utils';
import confetti from 'canvas-confetti';

export const PdfSplitter: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageRanges, setPageRanges] = useState<string>('1');
  const [splitMode, setSplitMode] = useState<'range' | 'all'>('range');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const total = doc.getPageCount();
      setFile(selected);
      setPageCount(total);
      setPageRanges(total > 1 ? `1-${Math.min(total, 2)}` : '1');
    } catch (e) {
      toastError('Could not load PDF', 'Please make sure the file is a valid PDF document.');
    }
  };

  const parseRanges = (input: string, maxPages: number): number[] => {
    const pagesToExtract = new Set<number>();
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.max(1, start); p <= Math.min(maxPages, end); p++) {
            pagesToExtract.add(p - 1); // 0-indexed for pdf-lib
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          pagesToExtract.add(p - 1);
        }
      }
    }

    return Array.from(pagesToExtract).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(arrayBuffer);
      const baseName = file.name.replace(/\.[^/.]+$/, '');

      if (splitMode === 'range') {
        const pageIndices = parseRanges(pageRanges, pageCount);
        if (pageIndices.length === 0) {
          toastError('Invalid page range', `Please specify valid page numbers between 1 and ${pageCount}`);
          setIsProcessing(false);
          return;
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
        copiedPages.forEach((p) => newPdf.addPage(p));

        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        downloadBlob(blob, `${baseName}-extracted-pages.pdf`);
        confetti({ particleCount: 40, spread: 60 });
        success('Pages extracted successfully!');
      } else {
        // Extract all pages as separate files
        for (let i = 0; i < pageCount; i++) {
          const singlePagePdf = await PDFDocument.create();
          const [copiedPage] = await singlePagePdf.copyPages(srcPdf, [i]);
          singlePagePdf.addPage(copiedPage);

          const bytes = await singlePagePdf.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          setTimeout(() => {
            downloadBlob(blob, `${baseName}-page-${i + 1}.pdf`);
          }, i * 300);
        }
        confetti({ particleCount: 50, spread: 70 });
        success(`Downloaded ${pageCount} individual PDF pages!`);
      }
    } catch (err) {
      console.error(err);
      toastError('Failed to split PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <DropZone
          onFilesSelected={handleFile}
          accept="application/pdf"
          title="Upload a PDF to split"
          description="Extract specific page ranges or split each page into a separate document"
          formatsDescription="PDF Document"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-rose-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-100">{file.name}</h4>
                  <p className="text-xs text-zinc-400">
                    {pageCount} total pages • {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Change PDF
              </Button>
            </div>

            {/* Split Mode Selector */}
            <div className="pt-2 border-t border-zinc-850">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSplitMode('range')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                    splitMode === 'range'
                      ? 'bg-purple-600/20 text-white border-purple-500/50'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  Custom Page Ranges
                </button>
                <button
                  type="button"
                  onClick={() => setSplitMode('all')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                    splitMode === 'all'
                      ? 'bg-purple-600/20 text-white border-purple-500/50'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  Split into Separate Files
                </button>
              </div>

              {splitMode === 'range' && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-zinc-300">
                    Specify Pages to Extract (e.g. "1-3, 5, 8-10")
                  </label>
                  <input
                    type="text"
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    placeholder={`1-${pageCount}`}
                    className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Separate individual pages with commas or ranges with hyphens. Available pages: 1 to {pageCount}.
                  </p>
                </div>
              )}

              {splitMode === 'all' && (
                <p className="text-xs text-zinc-400 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                  Every page (1 through {pageCount}) will be extracted and downloaded as its own single-page PDF document.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-850 flex justify-end">
              <Button
                variant="purple"
                size="md"
                loading={isProcessing}
                onClick={handleSplit}
                className="font-semibold shadow-purple-600/30"
              >
                <Scissors className="w-4 h-4 mr-1.5" />
                {splitMode === 'range' ? 'Extract & Download PDF' : `Extract All ${pageCount} Pages`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
