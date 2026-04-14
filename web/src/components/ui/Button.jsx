import React from 'react';

const VARIANT_STYLES = {
  primary: {
    backgroundColor: '#FF7A00',
    color: '#FFFFFF',
    borderColor: '#FF7A00',
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    color: '#FF7A00',
    borderColor: '#FF7A00',
  },
  outline: {
    backgroundColor: '#FFFFFF',
    color: '#FF7A00',
    borderColor: '#FF7A00',
  },
  danger: {
    backgroundColor: '#FF7A00',
    color: '#FFFFFF',
    borderColor: '#FF7A00',
  },
  success: {
    backgroundColor: '#16A34A',
    color: '#FFFFFF',
    borderColor: '#16A34A',
  },
};

const SIZE_STYLES = {
  sm: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
  },
  md: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
  },
  lg: {
    padding: '0.875rem 1.25rem',
    fontSize: '1.125rem',
  },
};

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  type = 'button',
  className = '',
  disabled = false,
  children,
  style = {},
  ...props
}) => {
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    borderRadius: '0.75rem',
    border: '2px solid',
    transition: 'all 0.2s ease-in-out',
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    ...sizeStyle,
    ...variantStyle,
    ...style,
  };

  return (
    <button
      type={type}
      style={baseStyle}
      className={className}
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : 'false'}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
};

export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;

export default Button;
