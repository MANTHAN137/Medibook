// Custom hook for appointments management
import { useState, useCallback } from 'react';
import {
    getAppointmentsByDoctor,
    getAppointmentsByDate,
    updateAppointmentStatus,
    cancelAppointment,
    completeAppointment,
    getDoctorStats
} from '../firebase/services';

export const useAppointments = (doctorId) => {
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAppointments = useCallback(async (filters = {}) => {
        if (!doctorId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getAppointmentsByDoctor(doctorId, filters);
            setAppointments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [doctorId]);

    const fetchAppointmentsByDate = useCallback(async (date) => {
        if (!doctorId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getAppointmentsByDate(doctorId, date);
            setAppointments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [doctorId]);

    const fetchStats = useCallback(async () => {
        if (!doctorId) return;

        try {
            const data = await getDoctorStats(doctorId);
            setStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    }, [doctorId]);

    const updateStatus = useCallback(async (appointmentId, status, notes = '') => {
        try {
            await updateAppointmentStatus(appointmentId, status, notes);
            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === appointmentId ? { ...apt, status, notes } : apt
                )
            );
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }, []);

    const cancel = useCallback(async (appointmentId, reason = '') => {
        try {
            await cancelAppointment(appointmentId, reason);
            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === appointmentId ? { ...apt, status: 'cancelled', notes: reason } : apt
                )
            );
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }, []);

    const complete = useCallback(async (appointmentId, notes = '') => {
        try {
            await completeAppointment(appointmentId, notes);
            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === appointmentId ? { ...apt, status: 'completed', notes } : apt
                )
            );
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }, []);

    return {
        appointments,
        stats,
        loading,
        error,
        fetchAppointments,
        fetchAppointmentsByDate,
        fetchStats,
        updateStatus,
        cancel,
        complete
    };
};

export default useAppointments;
