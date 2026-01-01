// Patient Records Page
import { useState, useEffect } from 'react';
import { Search, User, Phone, Mail, Calendar, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPatientsByDoctor, getAppointmentsByDoctor } from '../../firebase/services';
import { formatDate, parseTimestamp } from '../../utils/dateUtils';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { SkeletonCard } from '../../components/common/Loader';
import './Patients.css';

const Patients = () => {
    const { doctorData } = useAuth();
    const doctorId = doctorData?.id || 'demo';

    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]);

    // Demo patients
    const demoPatients = [
        { name: 'Rahul Sharma', email: 'rahul@email.com', phone: '+91 98765 43210', appointmentCount: 5 },
        { name: 'Priya Patel', email: 'priya@email.com', phone: '+91 98765 43211', appointmentCount: 3 },
        { name: 'Amit Kumar', email: 'amit@email.com', phone: '+91 98765 43212', appointmentCount: 8 },
        { name: 'Sneha Reddy', email: 'sneha@email.com', phone: '+91 98765 43213', appointmentCount: 2 },
        { name: 'Vikram Singh', email: 'vikram@email.com', phone: '+91 98765 43214', appointmentCount: 4 },
        { name: 'Anjali Gupta', email: 'anjali@email.com', phone: '+91 98765 43215', appointmentCount: 6 },
    ];

    const demoHistory = [
        { id: 1, date: new Date(2024, 0, 15), timeSlot: '10:00 AM', status: 'completed', reason: 'Regular checkup' },
        { id: 2, date: new Date(2024, 1, 20), timeSlot: '11:30 AM', status: 'completed', reason: 'Follow-up' },
        { id: 3, date: new Date(2024, 2, 10), timeSlot: '09:30 AM', status: 'completed', reason: 'Fever treatment' },
    ];

    useEffect(() => {
        fetchPatients();
    }, [doctorId]);

    useEffect(() => {
        filterPatients();
    }, [patients, searchTerm]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            if (doctorId === 'demo') {
                setPatients(demoPatients);
            } else {
                const data = await getPatientsByDoctor(doctorId);
                setPatients(data);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            setPatients(demoPatients);
        } finally {
            setLoading(false);
        }
    };

    const filterPatients = () => {
        if (!searchTerm) {
            setFilteredPatients(patients);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = patients.filter(patient =>
            patient.name?.toLowerCase().includes(term) ||
            patient.email?.toLowerCase().includes(term) ||
            patient.phone?.includes(term)
        );
        setFilteredPatients(filtered);
    };

    const handlePatientClick = async (patient) => {
        setSelectedPatient(patient);

        if (doctorId === 'demo') {
            setPatientHistory(demoHistory);
        } else {
            try {
                const appointments = await getAppointmentsByDoctor(doctorId);
                const history = appointments.filter(apt => apt.patientEmail === patient.email);
                setPatientHistory(history);
            } catch (error) {
                console.error('Error fetching patient history:', error);
                setPatientHistory([]);
            }
        }
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'P';
    };

    return (
        <DoctorLayout>
            <div className="patients-page">
                <div className="page-header">
                    <h1>Patient Records</h1>
                    <p>View all patients who have visited your clinic</p>
                </div>

                {/* Search */}
                <Card className="search-card">
                    <Input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={Search}
                    />
                </Card>

                {/* Results */}
                <div className="results-info">
                    <strong>{filteredPatients.length}</strong> patient{filteredPatients.length !== 1 ? 's' : ''} found
                </div>

                {/* Patients Grid */}
                {loading ? (
                    <div className="patients-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : filteredPatients.length > 0 ? (
                    <div className="patients-grid">
                        {filteredPatients.map((patient, index) => (
                            <Card
                                key={index}
                                hover
                                className="patient-card"
                                onClick={() => handlePatientClick(patient)}
                            >
                                <div className="patient-avatar">
                                    {getInitials(patient.name)}
                                </div>
                                <div className="patient-info">
                                    <h4 className="patient-name">{patient.name}</h4>
                                    <div className="patient-contacts">
                                        {patient.phone && (
                                            <span className="contact">
                                                <Phone size={14} />
                                                {patient.phone}
                                            </span>
                                        )}
                                        {patient.email && (
                                            <span className="contact">
                                                <Mail size={14} />
                                                {patient.email}
                                            </span>
                                        )}
                                    </div>
                                    <div className="patient-visits">
                                        <Calendar size={14} />
                                        {patient.appointmentCount} visit{patient.appointmentCount !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                <ChevronRight size={20} className="patient-arrow" />
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="empty-state">
                        <div className="empty-icon">👥</div>
                        <h3>No Patients Found</h3>
                        <p>
                            {searchTerm
                                ? 'Try adjusting your search term'
                                : 'Patients will appear here after they book appointments'}
                        </p>
                    </Card>
                )}
            </div>

            {/* Patient History Modal */}
            <Modal
                isOpen={!!selectedPatient}
                onClose={() => {
                    setSelectedPatient(null);
                    setPatientHistory([]);
                }}
                title="Patient Details"
                size="md"
            >
                {selectedPatient && (
                    <div className="patient-modal-content">
                        <div className="patient-modal-header">
                            <div className="patient-avatar large">
                                {getInitials(selectedPatient.name)}
                            </div>
                            <div>
                                <h3>{selectedPatient.name}</h3>
                                <div className="patient-modal-contacts">
                                    {selectedPatient.phone && (
                                        <a href={`tel:${selectedPatient.phone}`}>
                                            <Phone size={14} />
                                            {selectedPatient.phone}
                                        </a>
                                    )}
                                    {selectedPatient.email && (
                                        <a href={`mailto:${selectedPatient.email}`}>
                                            <Mail size={14} />
                                            {selectedPatient.email}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="patient-history">
                            <h4>Visit History</h4>
                            {patientHistory.length > 0 ? (
                                <div className="history-list">
                                    {patientHistory.map((visit, index) => {
                                        const date = parseTimestamp(visit.date) || visit.date;
                                        return (
                                            <div key={index} className="history-item">
                                                <div className="history-date">
                                                    <span className="date">{formatDate(date, 'MMM dd, yyyy')}</span>
                                                    <span className="time">{visit.timeSlot}</span>
                                                </div>
                                                <span className={`history-status ${visit.status}`}>
                                                    {visit.status}
                                                </span>
                                                {visit.reason && (
                                                    <p className="history-reason">{visit.reason}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="no-history">No visit history available</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </DoctorLayout>
    );
};

export default Patients;
