// Reusable Button Component
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    type = 'button',
    onClick,
    className = '',
    ...props
}) => {
    const classNames = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full',
        loading && 'btn-loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classNames}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <span className="btn-spinner" />
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon className="btn-icon" size={18} />}
                    {children && <span className="btn-text">{children}</span>}
                    {Icon && iconPosition === 'right' && <Icon className="btn-icon" size={18} />}
                </>
            )}
        </button>
    );
};

export default Button;
