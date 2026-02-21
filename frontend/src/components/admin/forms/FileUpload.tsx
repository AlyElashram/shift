import { useState, useRef } from 'react';
import styles from '../../../styles/components/FileUpload.module.css';

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
  accept = 'image/*',
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
      console.error('Upload failed:', err);
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

  const dropzoneClasses = [
    styles.dropzone,
    dragOver ? styles.dropzoneDragOver : '',
    disabled ? styles.dropzoneDisabled : '',
    error ? styles.dropzoneError : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={dropzoneClasses}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className={styles.hiddenInput}
          disabled={disabled || uploading}
        />

        {uploading ? (
          <div className={styles.uploadingState}>
            <svg className={styles.spinner} viewBox="0 0 24 24">
              <circle className={styles.spinnerTrack} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className={styles.spinnerHead} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Uploading...</span>
          </div>
        ) : (
          <div className={styles.idleState}>
            <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className={styles.uploadText}>
              <span className={styles.uploadHighlight}>Click to upload</span>{' '}
              or drag and drop
            </p>
            <p className={styles.uploadHint}>PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className={styles.previewGrid}>
          {value.map((url, index) => (
            <div key={index} className={styles.previewItem}>
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className={styles.previewImage}
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className={styles.removeButton}
              >
                <svg className={styles.removeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className={styles.errorText}>{error}</p>}
      {helperText && !error && (
        <p className={styles.helperText}>{helperText}</p>
      )}
    </div>
  );
}
