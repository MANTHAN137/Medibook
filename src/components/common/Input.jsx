// Input Component
import { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
    label,
    type = 'text',
    error,
    icon: Icon,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`input-group ${className}`}>
            {label && (
                <label className="input-label">{label}</label>
            )}
            <div className="input-wrapper">
                {Icon && <Icon className="input-icon" size={18} />}
                <input
                    ref={ref}
                    type={type}
                    className={`input ${Icon ? 'input-with-icon' : ''} ${error ? 'input-error' : ''}`}
                    {...props}
                />
            </div>
            {error && (
                <span className="input-error-text">{error}</span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

// Textarea Component
export const Textarea = forwardRef(({
    label,
    error,
    className = '',
    rows = 4,
    ...props
}, ref) => {
    return (
        <div className={`input-group ${className}`}>
            {label && (
                <label className="input-label">{label}</label>
            )}
            <textarea
                ref={ref}
                rows={rows}
                className={`input textarea ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && (
                <span className="input-error-text">{error}</span>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

// Select Component
export const Select = forwardRef(({
    label,
    options = [],
    error,
    placeholder,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`input-group ${className}`}>
            {label && (
                <label className="input-label">{label}</label>
            )}
            <select
                ref={ref}
                className={`input select ${error ? 'input-error' : ''}`}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>{placeholder}</option>
                )}
                {options.map((option) => (
                    <option
                        key={option.value || option}
                        value={option.value || option}
                    >
                        {option.label || option}
                    </option>
                ))}
            </select>
            {error && (
                <span className="input-error-text">{error}</span>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Input;
