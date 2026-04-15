import React from 'react';

const FormInput = ({
  id,
  label,
  type = 'text',
  as = 'input',
  value,
  onChange,
  placeholder,
  options = [],
  children,
  helperText,
  error,
  required = false,
  rows = 3,
  className = '',
  wrapperClassName = '',
  ...props
}) => {
  const baseClass = as === 'select' ? 'form-select' : 'form-control';
  const errorClass = error ? 'is-invalid' : '';
  const inputClass = className || `${baseClass} ${errorClass}`.trim();

  return (
    <div className={`mb-3 ${wrapperClassName}`.trim()}>
      {label && (
        <label htmlFor={id} className="form-label fw-semibold small">
          {label}{required ? <span className="text-danger ms-1">*</span> : ''}
        </label>
      )}

      {as === 'textarea' ? (
        <textarea
          id={id}
          className={`${baseClass} ${errorClass} ${className}`.trim()}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      ) : as === 'select' ? (
        <select
          id={id}
          className={`${baseClass} ${errorClass} ${className}`.trim()}
          value={value}
          onChange={onChange}
          {...props}
        >
          {options.length > 0
            ? options.map((option) => (
                <option key={option.value ?? option.id ?? option} value={option.value ?? option.id ?? option}>
                  {option.label ?? option.nombre ?? option}
                </option>
              ))
            : children}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          className={inputClass}
          {...(type !== 'file' ? { value } : {})}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      )}

      {helperText && !error && <div className="form-text text-muted">{helperText}</div>}
      {error && (
        <div className="invalid-feedback d-flex align-items-center gap-1 mt-1">
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  );
};

export default FormInput;
