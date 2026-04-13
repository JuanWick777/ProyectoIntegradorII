import React from 'react';

const VARIANT_CLASSES = {
  primary: 'ui-btn--primary text-white shadow-lg',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-base',
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
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-60 disabled:pointer-events-none';
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : 'false'}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
};

export default Button;
