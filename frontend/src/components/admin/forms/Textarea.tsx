import { forwardRef } from 'react';
import styles from '../../../styles/components/Textarea.module.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className={styles.wrapper}>
        {label && (
          <label className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`${styles.textarea} ${error ? styles.textareaError : ''} ${className}`}
          {...props}
        />
        {error && <p className={styles.errorText}>{error}</p>}
        {helperText && !error && (
          <p className={styles.helperText}>{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
