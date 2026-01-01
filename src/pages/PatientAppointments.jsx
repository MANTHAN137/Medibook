// Patient Appointments Page - View, Cancel, Update appointments
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, XCircle, Edit, Search } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { getAppointmentsByPatient, updateAppointment, cancelAppointment as cancelAppointmentService } from '../firebase/services';
import { formatDate, parseTimestamp } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import './PatientAppointments.css';

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [editReason, setEditReason] = useState('');

    // Demo appointments for testing
    const demoAppointments = [
        {
            id: 'patient-apt-1',
            doctorName: 'Dr. Rajesh Kumar',
            doctorSpecialization: 'General Physician',
            clinicName: 'City Health Clinic',
            clinicAddress: 'MG Road, Mumbai',
            timeSlot: '10:30 AM',
            appointmentDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
            status: 'pending',
            reason: 'Regular checkup',
            patientName: 'Guest Patient',
            patientPhone: '+91 98765 43210',
            patientEmail: 'guest@example.com'
        },
        {
            id: 'patient-apt-2',
            doctorName: 'Dr. Priya Sharma',
            doctorSpecialization: 'Dermatologist',
            clinicName: 'Skin Care Center',
            clinicAddress: 'Koramangala, Bangalore',
            timeSlot: '02:00 PM',
            appointmentDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
            status: 'pending',
            reason: 'Skin allergy consultation',
            patientName: 'Guest Patient',
            patientPhone: '+91 98765 43210',
            patientEmail: 'guest@example.com'
        },
        {
            id: 'patient-apt-3',
            doctorName: 'Dr. Amit Patel',
            doctorSpecialization: 'Cardiologist',
            clinicName: 'Heart Care Hospital',
            clinicAddress: 'Andheri West, Mumbai',
            timeSlot: '11:00 AM',
            appointmentDate: new Date(Date.now() - 86400000 * 7), // 7 days ago
            status: 'completed',
            reason: 'Heart checkup',
            patientName: 'Guest Patient',
            patientPhone: '+91 98765 43210',
            patientEmail: 'guest@example.com'
        }
    ];

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            // In real app, this would use actual patient ID from auth
            // For now, we'll use demo data
            setAppointments(demoAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setAppointments(demoAppointments);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (appointment) => {
        setSelectedAppointment(appointment);
        setCancelReason('');
        setShowCancelModal(true);
    };

    const handleEditClick = (appointment) => {
        setSelectedAppointment(appointment);
        setEditReason(appointment.reason || '');
        setShowEditModal(true);
    };

    const confirmCancel = async () => {
        if (!selectedAppointment) return;

        try {
            // For demo, update local state
            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === selectedAppointment.id
                        ? { ...apt, status: 'cancelled', cancelReason }
                        : apt
                )
            );
            toast.success('Appointment cancelled successfully');
            setShowCancelModal(false);
            setSelectedAppointment(null);
        } catch (error) {
            toast.error('Failed to cancel appointment');
        }
    };

    const confirmEdit = async () => {
        if (!selectedAppointment) return;

        try {
            // For demo, update local state
            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === selectedAppointment.id
                        ? { ...apt, reason: editReason }
                        : apt
                )
            );
            toast.success('Appointment updated successfully');
            setShowEditModal(false);
            setSelectedAppointment(null);
        } catch (error) {
            toast.error('Failed to update appointment');
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            apt.doctorName?.toLowerCase().includes(query) ||
            apt.doctorSpecialization?.toLowerCase().includes(query) ||
            apt.clinicName?.toLowerCase().includes(query)
        );
    });

    const upcomingAppointments = filteredAppointments.filter(apt =>
        apt.status === 'pending' && parseTimestamp(apt.appointmentDate) >= new Date()
    );

    const pastAppointments = filteredAppointments.filter(apt =>
        apt.status !== 'pending' || parseTimestamp(apt.appointmentDate) < new Date()
    );

    const getStatusBadge = (status) => {
        const statusStyles = {
            pending: { bg: 'rgba(234, 179, 8, 0.2)', color: '#facc15' },
            completed: { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' },
            cancelled: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }
        };
        const style = statusStyles[status] || statusStyles.pending;
        return (
            <span className="status-badge" style={{ background: style.bg, color: style.color }}>
                {status}
            </span>
        );
    };

    return (
        <>
            <Navbar />
            <div className="patient-appointments-page">
                <div className="container">
                    <div className="page-header">
                        <h1>My Appointments</h1>
                        <p>View and manage your upcoming and past appointments</p>
                    </div>

                    <div className="search-section">
                        <Input
                            type="text"
                            placeholder="Search by doctor name, specialization, or clinic..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={Search}
                        />
                    </div>

                    {/* Upcoming Appointments */}
                    <section className="appointments-section">
                        <h2>Upcoming Appointments ({upcomingAppointments.length})</h2>
                        {upcomingAppointments.length > 0 ? (
                            <div className="appointments-grid">
                                {upcomingAppointments.map(apt => (
                                    <Card key={apt.id} className="appointment-card">
                                        <div className="appointment-header">
                                            <div className="doctor-info">
                                                <div className="doctor-avatar">
                                                    {apt.doctorName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <h3>{apt.doctorName}</h3>
                                                    <span className="specialization">{apt.doctorSpecialization}</span>
                                                </div>
                                            </div>
                                            {getStatusBadge(apt.status)}
                                        </div>

                                        <div className="appointment-details">
                                            <div className="detail-row">
                                                <Calendar size={16} />
                                                <span>{formatDate(parseTimestamp(apt.appointmentDate), 'EEEE, MMMM dd, yyyy')}</span>
                                            </div>
                                            <div className="detail-row">
                                                <Clock size={16} />
                                                <span>{apt.timeSlot}</span>
                                            </div>
                                            <div className="detail-row">
                                                <User size={16} />
                                                <span>{apt.clinicName} - {apt.clinicAddress}</span>
                                            </div>
                                            {apt.reason && (
                                                <div className="reason-text">
                                                    <strong>Reason:</strong> {apt.reason}
                                                </div>
                                            )}
                                        </div>

                                        <div className="appointment-actions">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                icon={Edit}
                                                onClick={() => handleEditClick(apt)}
                                            >
                                                Update
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                icon={XCircle}
                                                onClick={() => handleCancelClick(apt)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="empty-state">
                                <div className="empty-icon">📅</div>
                                <h3>No Upcoming Appointments</h3>
                                <p>You don't have any scheduled appointments</p>
                                <Link to="/doctors">
                                    <Button>Find a Doctor</Button>
                                </Link>
                            </Card>
                        )}
                    </section>

                    {/* Past Appointments */}
                    <section className="appointments-section">
                        <h2>Past Appointments ({pastAppointments.length})</h2>
                        {pastAppointments.length > 0 ? (
                            <div className="appointments-grid">
                                {pastAppointments.map(apt => (
                                    <Card key={apt.id} className="appointment-card past">
                                        <div className="appointment-header">
                                            <div className="doctor-info">
                                                <div className="doctor-avatar">
                                                    {apt.doctorName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <h3>{apt.doctorName}</h3>
                                                    <span className="specialization">{apt.doctorSpecialization}</span>
                                                </div>
                                            </div>
                                            {getStatusBadge(apt.status)}
                                        </div>

                                        <div className="appointment-details">
                                            <div className="detail-row">
                                                <Calendar size={16} />
                                                <span>{formatDate(parseTimestamp(apt.appointmentDate), 'MMMM dd, yyyy')}</span>
                                            </div>
                                            <div className="detail-row">
                                                <Clock size={16} />
                                                <span>{apt.timeSlot}</span>
                                            </div>
                                        </div>

                                        {apt.status === 'completed' && (
                                            <div className="appointment-actions">
                                                <Link to={`/doctor/${apt.doctorId || 'demo1'}`}>
                                                    <Button size="sm" variant="secondary">
                                                        Book Again
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="empty-state">
                                <p>No past appointments</p>
                            </Card>
                        )}
                    </section>
                </div>

                {/* Cancel Modal */}
                <Modal
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    title="Cancel Appointment"
                >
                    <div className="cancel-modal-content">
                        <p>Are you sure you want to cancel your appointment with <strong>{selectedAppointment?.doctorName}</strong>?</p>
                        <Input
                            label="Reason for cancellation (optional)"
                            type="text"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="e.g., Schedule conflict"
                        />
                        <div className="modal-actions">
                            <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
                                Keep Appointment
                            </Button>
                            <Button variant="danger" onClick={confirmCancel}>
                                Confirm Cancellation
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    title="Update Appointment"
                >
                    <div className="edit-modal-content">
                        <p>Update the reason for your appointment with <strong>{selectedAppointment?.doctorName}</strong></p>
                        <Input
                            label="Reason for visit"
                            type="text"
                            value={editReason}
                            onChange={(e) => setEditReason(e.target.value)}
                            placeholder="e.g., Regular checkup"
                        />
                        <div className="modal-actions">
                            <Button variant="ghost" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button onClick={confirmEdit}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default PatientAppointments;
