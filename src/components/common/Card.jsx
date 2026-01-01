// Glass Card Component
import './Card.css';

const Card = ({
    children,
    className = '',
    hover = false,
    padding = 'lg',
    onClick,
    ...props
}) => {
    const classNames = [
        'card',
        `card-padding-${padding}`,
        hover && 'card-hover',
        onClick && 'card-clickable',
        className
    ].filter(Boolean).join(' ');

    return (
        <div
            className={classNames}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

// Card Header Component
export const CardHeader = ({ children, className = '' }) => (
    <div className={`card-header ${className}`}>
        {children}
    </div>
);

// Card Title Component
export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`card-title ${className}`}>
        {children}
    </h3>
);

// Card Content Component
export const CardContent = ({ children, className = '' }) => (
    <div className={`card-content ${className}`}>
        {children}
    </div>
);

// Card Footer Component
export const CardFooter = ({ children, className = '' }) => (
    <div className={`card-footer ${className}`}>
        {children}
    </div>
);

export default Card;
