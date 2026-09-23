import React, { useState, useRef } from 'react';
import { Upload, X, Link as LinkIcon, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface ImageUploadInputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  helpText?: string;
  previewHeight?: string;
}

/**
 * Resizes and compresses an image data URL via HTML5 Canvas
 * to avoid exceeding browser localStorage quotas.
 */
const compressImage = (file: File, maxDimension = 1280, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image into memory'));
      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw and compress
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  id,
  label,
  value,
  onChange,
  required = false,
  helpText,
  previewHeight = 'h-40',
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP, etc.).');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch {
      setError('Could not process this image. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === 'upload'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload from PC
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === 'url'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Path / URL
          </button>
        </div>
      </div>

      {helpText && <p className="text-[11px] text-slate-500">{helpText}</p>}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
        id={id ? `${id}-file-input` : undefined}
      />

      {/* Upload Box or URL Input */}
      {mode === 'upload' ? (
        <div className="space-y-2">
          {value ? (
            /* Image Preview Card */
            <div className="relative rounded-2xl border-2 border-slate-200 bg-slate-50 overflow-hidden p-2 group">
              <div className={`w-full ${previewHeight} rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center relative`}>
                <img
                  src={value}
                  alt={label}
                  className="w-full h-full object-contain"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-white text-xs gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Compressing image...</span>
                  </div>
                )}
              </div>

              {/* Action Toolbar on Image Preview */}
              <div className="mt-2 flex items-center justify-between px-1">
                <span className="text-[11px] font-medium text-slate-500 truncate max-w-[200px] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {value.startsWith('data:') ? 'Local Image Loaded' : value}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Change Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChange('')}
                    aria-label="Remove image"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Drag and Drop / Click to Upload Area */
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-emerald-600 hover:bg-emerald-50/20 bg-slate-50/60'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-800">
                    Click to browse from your computer
                  </p>
                  <p className="text-xs text-slate-500">
                    or drag & drop your image here (JPG, PNG, WebP)
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mt-1">
                  Auto-optimized for instant loading
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Path / URL Mode */
        <div className="space-y-2">
          <div className="relative">
            <input
              id={id}
              type="text"
              required={required}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. /assets/my_photo.jpg or https://..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {value && (
            <div className="p-2 border border-slate-200 rounded-xl bg-slate-50 flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/logo_emblem.jpg';
                  }}
                />
              </div>
              <div className="text-left overflow-hidden">
                <span className="text-xs font-semibold text-slate-700 block truncate">
                  Preview loaded
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {value}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
