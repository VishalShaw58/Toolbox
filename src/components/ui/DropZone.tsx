import React, { useRef, useState } from 'react';
import { UploadCloud, File, ShieldCheck, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  title?: string;
  description?: string;
  formatsDescription?: string;
  className?: string;
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  accept,
  multiple = false,
  maxSizeMB = 50,
  title = 'Drop your files here',
  description = 'or click to browse from your device',
  formatsDescription,
  className,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMsg(null);

    const validFiles: File[] = [];
    const maxBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxBytes) {
        setErrorMsg(`File "${file.name}" exceeds the ${maxSizeMB}MB maximum limit.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(multiple ? validFiles : [validFiles[0]]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'relative group border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 bg-zinc-950/60 backdrop-blur-md',
          isDragOver
            ? 'border-purple-500 bg-purple-950/20 scale-[1.005]'
            : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300',
              isDragOver
                ? 'bg-purple-600/30 text-purple-300 scale-110 shadow-lg shadow-purple-500/20'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-700'
            )}
          >
            <UploadCloud className="w-8 h-8 transition-transform group-hover:-translate-y-0.5" />
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1">{title}</h3>
          <p className="text-xs sm:text-sm text-zinc-400 mb-4">{description}</p>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="pointer-events-none mb-4 group-hover:border-zinc-600"
          >
            <File className="w-3.5 h-3.5 mr-1.5" />
            Select {multiple ? 'Files' : 'File'}
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-zinc-500">
            {formatsDescription && (
              <span className="bg-zinc-900/90 px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-400">
                {formatsDescription}
              </span>
            )}
            <span className="bg-zinc-900/90 px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-400">
              Max {maxSizeMB}MB
            </span>
            <span className="flex items-center gap-1 text-emerald-400/90 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-900/40">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              100% Private (Local Processing)
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl text-rose-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
