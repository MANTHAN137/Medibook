// Doctor Dashboard Page
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar, Clock, Users, CheckCircle, XCircle,
    TrendingUp, ChevronRight, Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../hooks/useAppointments';
import { formatDate, formatDateRelative, getGreeting, parseTimestamp } from '../../utils/dateUtils';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import AppointmentCard from '../../components/doctor/AppointmentCard';
import StatsCard from '../../components/doctor/StatsCard';
import { SkeletonCard } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
    const { doctorData } = useAuth();
    const doctorId = doctorData?.id || 'demo';
    const {
        appointments,
        stats,
        loading,
        fetchAppointments,
        fetchStats,
        complete,
        cancel
    } = useAppointments(doctorId);

    const [todayAppointments, setTodayAppointments] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    // Demo data
    const demoStats = {
        total: 156,
        pending: 8,
        completed: 142,
        cancelled: 6,
        today: 5,
        thisWeek: 23
    };

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
            patientEmail: 'priya@email.com',
            timeSlot: '10:30 AM',
            appointmentDate: new Date(),
            status: 'pending',
            reason: 'Fever and cold symptoms'
        },
        {
            id: 'apt3',
            patientName: 'Amit Kumar',
            patientPhone: '+91 98765 43212',
            timeSlot: '11:30 AM',
            appointmentDate: new Date(),
            status: 'pending',
            reason: 'Follow-up visit'
        },
        {
            id: 'apt4',
            patientName: 'Sneha Reddy',
            patientPhone: '+91 98765 43213',
            timeSlot: '02:30 PM',
            appointmentDate: new Date(),
            status: 'pending'
        },
        {
            id: 'apt5',
            patientName: 'Vikram Singh',
            patientPhone: '+91 98765 43214',
            timeSlot: '04:00 PM',
            appointmentDate: new Date(),
            status: 'pending'
        }
    ];

    useEffect(() => {
        if (doctorId !== 'demo') {
            fetchAppointments();
            fetchStats();
        } else {
            setTodayAppointments(demoAppointments);
        }
    }, [doctorId]);

    useEffect(() => {
        if (appointments.length > 0) {
            const today = new Date().toDateString();
            const todayApts = appointments.filter(apt => {
                const aptDate = parseTimestamp(apt.appointmentDate);
                return aptDate?.toDateString() === today && apt.status === 'pending';
            });
            setTodayAppointments(todayApts);

            const upcoming = appointments.filter(apt => {
                const aptDate = parseTimestamp(apt.appointmentDate);
                return aptDate > new Date() && apt.status === 'pending';
            }).slice(0, 5);
            setUpcomingAppointments(upcoming);
        }
    }, [appointments]);

    const handleComplete = async (id) => {
        if (doctorId === 'demo') {
            setTodayAppointments(prev => prev.filter(apt => apt.id !== id));
            toast.success('Appointment marked as completed');
            return;
        }
        const result = await complete(id);
        if (result.success) {
            toast.success('Appointment marked as completed');
            fetchAppointments();
            fetchStats();
        }
    };

    const handleCancel = async (id) => {
        if (doctorId === 'demo') {
            setTodayAppointments(prev => prev.filter(apt => apt.id !== id));
            toast.success('Appointment cancelled');
            return;
        }
        const result = await cancel(id);
        if (result.success) {
            toast.success('Appointment cancelled');
            fetchAppointments();
            fetchStats();
        }
    };

    const displayStats = stats || demoStats;
    const displayTodayAppointments = todayAppointments.length > 0 ? todayAppointments : demoAppointments;

    return (
        <DoctorLayout>
            <div className="dashboard">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-greeting">
                            {getGreeting()}, {doctorData?.name?.split(' ')[0] || 'Doctor'}! 👋
                        </h1>
                        <p className="dashboard-date">{formatDate(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
                    </div>
                    <div className="dashboard-actions">
                        <Button variant="secondary" icon={Bell}>
                            Notifications
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <StatsCard
                        title="Today's Appointments"
                        value={displayStats.today}
                        icon={Calendar}
                        color="primary"
                    />
                    <StatsCard
                        title="Pending"
                        value={displayStats.pending}
                        icon={Clock}
                        color="warning"
                    />
                    <StatsCard
                        title="Completed"
                        value={displayStats.completed}
                        icon={CheckCircle}
                        color="success"
                    />
                    <StatsCard
                        title="This Week"
                        value={displayStats.thisWeek}
                        icon={TrendingUp}
                        color="accent"
                    />
                </div>

                {/* Today's Appointments */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Today's Appointments</h2>
                        <Link to="/doctor/appointments">
                            <Button variant="ghost" size="sm" icon={ChevronRight} iconPosition="right">
                                View All
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="appointments-grid">
                            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                        </div>
                    ) : displayTodayAppointments.length > 0 ? (
                        <div className="appointments-grid">
                            {displayTodayAppointments.map(appointment => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    onComplete={() => handleComplete(appointment.id)}
                                    onCancel={() => handleCancel(appointment.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="empty-state">
                            <div className="empty-icon">📅</div>
                            <h3>No Appointments Today</h3>
                            <p>You have no scheduled appointments for today.</p>
                        </Card>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions">
                        <Link to="/doctor/availability">
                            <Card hover className="quick-action-card">
                                <div className="quick-action-icon">
                                    <Clock size={24} />
                                </div>
                                <div className="quick-action-content">
                                    <h4>Manage Availability</h4>
                                    <p>Block or unblock time slots</p>
                                </div>
                                <ChevronRight size={20} />
                            </Card>
                        </Link>
                        <Link to="/doctor/patients">
                            <Card hover className="quick-action-card">
                                <div className="quick-action-icon">
                                    <Users size={24} />
                                </div>
                                <div className="quick-action-content">
                                    <h4>Patient Records</h4>
                                    <p>View patient history</p>
                                </div>
                                <ChevronRight size={20} />
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default Dashboard;
