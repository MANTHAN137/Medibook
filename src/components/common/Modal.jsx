// Modal Component
import { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showClose = true
}) => {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal modal-${size}`}
                onClick={(e) => e.stopPropagation()}
            >
                {(title || showClose) && (
                    <div className="modal-header">
                        {title && <h2 className="modal-title">{title}</h2>}
                        {showClose && (
                            <button className="modal-close" onClick={onClose}>
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Modal Footer for action buttons
export const ModalFooter = ({ children }) => (
    <div className="modal-footer">
        {children}
    </div>
);

export default Modal;
