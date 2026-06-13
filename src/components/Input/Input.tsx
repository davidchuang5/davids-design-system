import React from 'react';
import './Input.css';

export type InputVariant = 'default' | 'error' | 'success';
export type InputSize = 'small' | 'medium' | 'large';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', size = 'medium', label, hint, id, className, ...props }, ref) => {
    let inputClasses = `ds-input ${size}`;
    if (variant !== 'default') inputClasses += ` ${variant}`;
    if (className) inputClasses += ` ${className}`;

    let hintClasses = 'ds-input-hint';
    if (variant !== 'default') hintClasses += ` ${variant}`;

    return (
      <div className="ds-input-wrapper">
        {label && <label className="ds-input-label" htmlFor={id}>{label}</label>}
        <input ref={ref} id={id} className={inputClasses} {...props} />
        {hint && <span className={hintClasses}>{hint}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
