import React from 'react';

const VARIANT_CLASSES = {
  primary: 'bg-orange-600 text-white',
  secondary: 'bg-slate-800 text-white',
  success: 'bg-emerald-600 text-white',
  danger: 'bg-red-600 text-white',
  warning: 'bg-yellow-100 text-yellow-900',
  info: 'bg-sky-100 text-sky-800',
  neutral: 'bg-gray-200 text-gray-900',
};

const Badge = ({
  variant = 'primary',
  pill = true,
  className = '',
  icon,
  children,
  ...props
}) => {
  const shapeClass = pill ? 'rounded-full' : 'rounded-lg';
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;

  return (
    <span
      className={`${shapeClass} ${variantClass} inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold ${className}`.trim()}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
