import React from 'react';
import './FormField.css';

export const FormField = ({
  label,
  id,
  name,
  error,
  hint,
  required = false,
  prefix,
  suffix,
  children,
  className = '',
}) => {
  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id || name} className="form-label">
          {label}
          {required && <span className="required-mark" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {prefix && <span className="input-prefix">{prefix}</span>}
        {children}
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  );
};

export default FormField;
