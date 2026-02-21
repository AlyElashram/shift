import { useEffect, useRef } from 'react';
import styles from '../../styles/components/Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

const sizeClassMap = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
} as const;

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className={styles.overlay}
    >
      <div className={`${styles.dialog} ${sizeClassMap[size]}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <svg className={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
  loading?: boolean;
}

const variantClassMap = {
  danger: styles.confirmDanger,
  warning: styles.confirmWarning,
  default: styles.confirmDefault,
} as const;

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={loading}
            className={styles.cancelButton}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`${styles.confirmButton} ${variantClassMap[variant]}`}
          >
            {loading ? (
              <span className={styles.loadingContent}>
                <svg className={styles.spinner} viewBox="0 0 24 24">
                  <circle className={styles.spinnerTrack} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className={styles.spinnerHead} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </>
      }
    >
      <p className={styles.confirmMessage}>{message}</p>
    </Modal>
  );
}
