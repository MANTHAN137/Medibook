// Booking Success Page
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './BookingSuccess.css';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { doctor, date, slot, patient } = location.state || {};

    if (!doctor || !date || !slot) {
        return (
            <div className="booking-success-page">
                <div className="container">
                    <div className="no-booking">
                        <h2>No booking information found</h2>
                        <p>Please book an appointment first.</p>
                        <Link to="/doctors">
                            <Button>Find a Doctor</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-success-page">
            <div className="container">
                <div className="success-content">
                    <div className="success-icon">
                        <CheckCircle size={64} />
                    </div>

                    <h1 className="success-title">Appointment Booked!</h1>
                    <p className="success-subtitle">
                        Your appointment has been successfully scheduled.
                        We've sent a confirmation to your phone/email.
                    </p>

                    <Card className="booking-details-card">
                        <h3>Appointment Details</h3>

                        <div className="detail-row">
                            <div className="detail-icon">
                                <User size={20} />
                            </div>
                            <div className="detail-content">
                                <span className="detail-label">Doctor</span>
                                <span className="detail-value">{doctor.name}</span>
                                <span className="detail-sub">{doctor.specialization}</span>
                            </div>
                        </div>

                        <div className="detail-row">
                            <div className="detail-icon">
                                <Calendar size={20} />
                            </div>
                            <div className="detail-content">
                                <span className="detail-label">Date</span>
                                <span className="detail-value">{formatDate(date, 'EEEE, MMMM dd, yyyy')}</span>
                            </div>
                        </div>

                        <div className="detail-row">
                            <div className="detail-icon">
                                <Clock size={20} />
                            </div>
                            <div className="detail-content">
                                <span className="detail-label">Time</span>
                                <span className="detail-value">{slot}</span>
                            </div>
                        </div>

                        {patient && (
                            <div className="patient-details">
                                <h4>Patient Information</h4>
                                <p><strong>Name:</strong> {patient.name}</p>
                                <p><strong>Phone:</strong> {patient.phone}</p>
                                {patient.email && <p><strong>Email:</strong> {patient.email}</p>}
                            </div>
                        )}
                    </Card>

                    <div className="success-actions">
                        <Link to="/doctors">
                            <Button variant="secondary">
                                Book Another Appointment
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button icon={ArrowRight} iconPosition="right">
                                Go to Home
                            </Button>
                        </Link>
                    </div>

                    <div className="success-note">
                        <p>
                            <strong>Note:</strong> Please arrive 10 minutes before your scheduled appointment time.
                            If you need to reschedule or cancel, please contact the clinic directly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
