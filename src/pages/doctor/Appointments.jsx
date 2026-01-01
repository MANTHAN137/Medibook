// Appointments List Page
import { useState, useEffect } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../hooks/useAppointments';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { parseTimestamp, formatDate } from '../../utils/dateUtils';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import AppointmentCard from '../../components/doctor/AppointmentCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { SkeletonCard } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import './Appointments.css';

const Appointments = () => {
    const { doctorData } = useAuth();
    const doctorId = doctorData?.id || 'demo';
    const {
        appointments,
        loading,
        fetchAppointments,
        complete,
        cancel
    } = useAppointments(doctorId);

    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');

    // Demo appointments
    const demoAppointments = [
        {
            id: 'apt1',
            patientName: 'Rahul Sharma',
            patientPhone: '+91 98765 43210',
            patientEmail: 'rahul@email.com',
            timeSlot: '09:30 AM',
            appointmentDate: new Date(),
            status: 'pending',
            reason: 'Regular checkup'
        },
        {
            id: 'apt2',
            patientName: 'Priya Patel',
            patientPhone: '+91 98765 43211',
            timeSlot: '10:30 AM',
            appointmentDate: new Date(),
            status: 'pending',
            reason: 'Fever and cold'
        },
        {
            id: 'apt3',
            patientName: 'Amit Kumar',
            patientPhone: '+91 98765 43212',
            timeSlot: '02:30 PM',
            appointmentDate: new Date(Date.now() - 86400000),
            status: 'completed',
            reason: 'Follow-up'
        },
        {
            id: 'apt4',
            patientName: 'Sneha Reddy',
            patientPhone: '+91 98765 43213',
            timeSlot: '11:00 AM',
            appointmentDate: new Date(Date.now() - 86400000 * 2),
            status: 'completed'
        },
        {
            id: 'apt5',
            patientName: 'Vikram Singh',
            patientPhone: '+91 98765 43214',
            timeSlot: '03:30 PM',
            appointmentDate: new Date(Date.now() - 86400000 * 3),
            status: 'cancelled'
        }
    ];

    const displayAppointments = appointments.length > 0 ? appointments : demoAppointments;

    useEffect(() => {
        if (doctorId !== 'demo') {
            fetchAppointments();
        }
    }, [doctorId]);

    useEffect(() => {
        filterAppointments();
    }, [displayAppointments, searchTerm, statusFilter, dateFilter]);

    const filterAppointments = () => {
        let filtered = [...displayAppointments];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(apt =>
                apt.patientName?.toLowerCase().includes(term) ||
                apt.patientPhone?.includes(term)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(apt => apt.status === statusFilter);
        }

        // Date filter
        if (dateFilter) {
            const filterDate = new Date(dateFilter).toDateString();
            filtered = filtered.filter(apt => {
                const aptDate = parseTimestamp(apt.appointmentDate);
                return aptDate?.toDateString() === filterDate;
            });
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => {
            const dateA = parseTimestamp(a.appointmentDate);
            const dateB = parseTimestamp(b.appointmentDate);
            return dateB - dateA;
        });

        setFilteredAppointments(filtered);
    };

    const handleComplete = async (id) => {
        if (doctorId === 'demo') {
            toast.success('Demo: Appointment marked as completed');
            return;
        }
        const result = await complete(id);
        if (result.success) {
            toast.success('Appointment marked as completed');
            fetchAppointments();
        }
    };

    const handleCancel = async (id) => {
        if (doctorId === 'demo') {
            toast.success('Demo: Appointment cancelled');
            return;
        }
        const result = await cancel(id);
        if (result.success) {
            toast.success('Appointment cancelled');
            fetchAppointments();
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setDateFilter('');
    };

    return (
        <DoctorLayout>
            <div className="appointments-page">
                <div className="page-header">
                    <h1>Appointments</h1>
                    <p>Manage all your patient appointments</p>
                </div>

                {/* Filters */}
                <Card className="filters-card">
                    <div className="filters-row">
                        <div className="filter-search">
                            <Input
                                type="text"
                                placeholder="Search by patient name or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={Search}
                            />
                        </div>

                        <div className="filter-group">
                            <select
                                className="form-input"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <Input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                icon={Calendar}
                            />
                        </div>

                        {(searchTerm || statusFilter !== 'all' || dateFilter) && (
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                Clear
                            </Button>
                        )}
                    </div>
                </Card>

                {/* Results */}
                <div className="results-info">
                    Showing <strong>{filteredAppointments.length}</strong> appointment{filteredAppointments.length !== 1 ? 's' : ''}
                </div>

                {/* Appointments List */}
                {loading ? (
                    <div className="appointments-grid">
                        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : filteredAppointments.length > 0 ? (
                    <div className="appointments-grid">
                        {filteredAppointments.map(appointment => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                showDate={true}
                                onComplete={() => handleComplete(appointment.id)}
                                onCancel={() => handleCancel(appointment.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>No Appointments Found</h3>
                        <p>Try adjusting your search or filters</p>
                        <Button variant="secondary" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </Card>
                )}
            </div>
        </DoctorLayout>
    );
};

export default Appointments;
