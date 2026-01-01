// Loader Component
import './Loader.css';

// Spinner Loader
export const Spinner = ({ size = 'md', className = '' }) => (
    <div className={`spinner spinner-${size} ${className}`} />
);

// Full Page Loader
const Loader = ({ text = 'Loading...' }) => (
    <div className="loader-container">
        <div className="loader-content">
            <Spinner size="lg" />
            <p className="loader-text">{text}</p>
        </div>
    </div>
);

// Skeleton Loader
export const Skeleton = ({
    width = '100%',
    height = '20px',
    variant = 'text',
    className = ''
}) => (
    <div
        className={`skeleton skeleton-${variant} ${className}`}
        style={{ width, height }}
    />
);

// Skeleton Card
export const SkeletonCard = () => (
    <div className="skeleton-card">
        <div className="skeleton-card-header">
            <Skeleton variant="circle" width="48px" height="48px" />
            <div className="skeleton-card-info">
                <Skeleton width="60%" height="16px" />
                <Skeleton width="40%" height="14px" />
            </div>
        </div>
        <div className="skeleton-card-body">
            <Skeleton width="100%" height="12px" />
            <Skeleton width="80%" height="12px" />
            <Skeleton width="60%" height="12px" />
        </div>
    </div>
);

export default Loader;
