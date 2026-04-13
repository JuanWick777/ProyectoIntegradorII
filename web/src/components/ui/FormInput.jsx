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
  const inputClass = className || (as === 'select' ? 'form-select' : 'form-control');

  return (
    <div className={`mb-3 ${wrapperClassName}`.trim()}>
      {label && (
        <label htmlFor={id} className="form-label fw-semibold small">
          {label}{required ? ' *' : ''}
        </label>
      )}

      {as === 'textarea' ? (
        <textarea
          id={id}
          className={inputClass}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      ) : as === 'select' ? (
        <select
          id={id}
          className={inputClass}
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

      {helperText && <div className="form-text">{helperText}</div>}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default FormInput;
