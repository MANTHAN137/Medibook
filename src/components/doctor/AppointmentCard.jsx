// Appointment Card Component
import { Phone, Mail, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { formatTimeSlot, parseTimestamp, formatDate } from '../../utils/dateUtils';
import { STATUS_COLORS } from '../../utils/constants';
import Card from '../common/Card';
import Button from '../common/Button';
import './AppointmentCard.css';

const AppointmentCard = ({
    appointment,
    onComplete,
    onCancel,
    showDate = false
}) => {
    const {
        patientName,
        patientPhone,
        patientEmail,
        timeSlot,
        appointmentDate,
        status,
        reason
    } = appointment;

    const statusColor = STATUS_COLORS[status] || STATUS_COLORS.pending;
    const initials = patientName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'P';
    const date = parseTimestamp(appointmentDate);

    return (
        <Card className="appointment-card">
            <div className="appointment-header">
                <div className="patient-avatar">
                    {initials}
                </div>
                <div className="patient-info">
                    <h4 className="patient-name">{patientName}</h4>
                    <div className="appointment-time">
                        <Clock size={14} />
                        <span>{timeSlot}</span>
                        {showDate && date && (
                            <span className="appointment-date">• {formatDate(date, 'MMM dd')}</span>
                        )}
                    </div>
                </div>
                <span
                    className="status-badge"
                    style={{
                        background: statusColor.bg,
                        color: statusColor.color
                    }}
                >
                    {status}
                </span>
            </div>

            <div className="appointment-body">
                {reason && (
                    <p className="appointment-reason">{reason}</p>
                )}

                <div className="patient-contacts">
                    {patientPhone && (
                        <a href={`tel:${patientPhone}`} className="contact-item">
                            <Phone size={14} />
                            <span>{patientPhone}</span>
                        </a>
                    )}
                    {patientEmail && (
                        <a href={`mailto:${patientEmail}`} className="contact-item">
                            <Mail size={14} />
                            <span>{patientEmail}</span>
                        </a>
                    )}
                </div>
            </div>

            {status === 'pending' && (
                <div className="appointment-actions">
                    <Button
                        size="sm"
                        variant="success"
                        icon={CheckCircle}
                        onClick={onComplete}
                    >
                        Complete
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        icon={XCircle}
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default AppointmentCard;
