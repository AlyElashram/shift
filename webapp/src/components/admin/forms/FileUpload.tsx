"use client";

import { useState, useRef } from "react";

interface FileUploadProps {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  value?: string[];
  onChange?: (urls: string[]) => void;
  onUpload?: (files: File[]) => Promise<string[]>;
  maxFiles?: number;
  disabled?: boolean;
}

export function FileUpload({
  label,
  error,
  helperText,
  accept = "image/*",
  multiple = true,
  value = [],
  onChange,
  onUpload,
  maxFiles = 10,
  disabled = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !onUpload) return;

    const fileArray = Array.from(files).slice(0, maxFiles - value.length);
    if (fileArray.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = await onUpload(fileArray);
      onChange?.([...value, ...uploadedUrls]);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange?.(newValue);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-[var(--shift-gray-light)]">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors
          ${dragOver
            ? "border-[var(--shift-yellow)] bg-[var(--shift-yellow)]/5"
            : "border-[var(--shift-gray)]/50 hover:border-[var(--shift-gray)]"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${error ? "border-red-500" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled || uploading}
        />

        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-[var(--shift-gray-light)]">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="text-[var(--shift-gray)]">
            <svg className="mx-auto h-10 w-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">
              <span className="text-[var(--shift-yellow)]">Click to upload</span>
              {" "}or drag and drop
            </p>
            <p className="text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-[var(--shift-gray)]/30"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-[var(--shift-gray)]">{helperText}</p>
      )}
    </div>
  );
}
