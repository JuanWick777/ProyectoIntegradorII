import React from 'react';

const LoadingSpinner = ({
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'primary', // bootstrap text color
  className = '',
  style,
  label,
  center = false,
  role = 'status',
}) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  const spinner = (
    <span
      className={`spinner-border ${sizeClass} text-${variant} ${className}`.trim()}
      style={style}
      role={role}
      aria-label={label || 'Cargando'}
    />
  );

  if (!center) return spinner;

  return (
    <div className="text-center py-5">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;

