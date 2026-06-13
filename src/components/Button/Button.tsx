import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', loading = false, disabled, children, className, ...props }, ref) => {
    let classes = `ds-button ${variant} ${size}`;
    if (loading) classes += ' loading';
    if (className) classes += ` ${className}`;

    return (
      <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
        {loading && <span className="spinner" aria-hidden="true" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
