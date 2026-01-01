// Firebase Service Functions
// CRUD operations for doctors, patients, and appointments

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Collection references
const COLLECTIONS = {
    DOCTORS: 'doctors',
    PATIENTS: 'patients',
    APPOINTMENTS: 'appointments',
    BLOCKED_SLOTS: 'blockedSlots'
};

// ===================================
// Doctor Services
// ===================================

export const createDoctor = async (doctorData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.DOCTORS), {
            ...doctorData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { id: docRef.id, ...doctorData };
    } catch (error) {
        console.error('Error creating doctor:', error);
        throw error;
    }
};

export const getDoctorById = async (doctorId) => {
    try {
        const docRef = doc(db, COLLECTIONS.DOCTORS, doctorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting doctor:', error);
        throw error;
    }
};

export const getDoctorByEmail = async (email) => {
    try {
        const q = query(
            collection(db, COLLECTIONS.DOCTORS),
            where('email', '==', email)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting doctor by email:', error);
        throw error;
    }
};

export const getAllDoctors = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.DOCTORS));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting all doctors:', error);
        throw error;
    }
};

export const updateDoctor = async (doctorId, data) => {
    try {
        const docRef = doc(db, COLLECTIONS.DOCTORS, doctorId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        return { id: doctorId, ...data };
    } catch (error) {
        console.error('Error updating doctor:', error);
        throw error;
    }
};

// ===================================
// Patient Services
// ===================================

export const createPatient = async (patientData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.PATIENTS), {
            ...patientData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...patientData };
    } catch (error) {
        console.error('Error creating patient:', error);
        throw error;
    }
};

export const getPatientByEmail = async (email) => {
    try {
        const q = query(
            collection(db, COLLECTIONS.PATIENTS),
            where('email', '==', email)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting patient by email:', error);
        throw error;
    }
};

export const getPatientsByDoctor = async (doctorId) => {
    try {
        // Get unique patients from appointments
        const q = query(
            collection(db, COLLECTIONS.APPOINTMENTS),
            where('doctorId', '==', doctorId)
        );
        const querySnapshot = await getDocs(q);

        const patientMap = new Map();
        querySnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (!patientMap.has(data.patientEmail)) {
                patientMap.set(data.patientEmail, {
                    name: data.patientName,
                    email: data.patientEmail,
                    phone: data.patientPhone,
                    appointmentCount: 1
                });
            } else {
                const existing = patientMap.get(data.patientEmail);
                existing.appointmentCount++;
            }
        });

        return Array.from(patientMap.values());
    } catch (error) {
        console.error('Error getting patients by doctor:', error);
        throw error;
    }
};

// ===================================
// Appointment Services
// ===================================

export const createAppointment = async (appointmentData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), {
            ...appointmentData,
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { id: docRef.id, ...appointmentData, status: 'pending' };
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
};

export const getAppointmentById = async (appointmentId) => {
    try {
        const docRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting appointment:', error);
        throw error;
    }
};

export const getAppointmentsByDoctor = async (doctorId, filters = {}) => {
    try {
        let q = query(
            collection(db, COLLECTIONS.APPOINTMENTS),
            where('doctorId', '==', doctorId),
            orderBy('appointmentDate', 'desc')
        );

        const querySnapshot = await getDocs(q);
        let appointments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Apply client-side filters
        if (filters.status) {
            appointments = appointments.filter(apt => apt.status === filters.status);
        }

        if (filters.date) {
            const filterDate = new Date(filters.date).toDateString();
            appointments = appointments.filter(apt => {
                const aptDate = apt.appointmentDate?.toDate?.() || new Date(apt.appointmentDate);
                return aptDate.toDateString() === filterDate;
            });
        }

        return appointments;
    } catch (error) {
        console.error('Error getting appointments by doctor:', error);
        throw error;
    }
};

export const getAppointmentsByDate = async (doctorId, date) => {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const q = query(
            collection(db, COLLECTIONS.APPOINTMENTS),
            where('doctorId', '==', doctorId),
            where('appointmentDate', '>=', Timestamp.fromDate(startOfDay)),
            where('appointmentDate', '<=', Timestamp.fromDate(endOfDay))
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting appointments by date:', error);
        throw error;
    }
};

export const updateAppointmentStatus = async (appointmentId, status, notes = '') => {
    try {
        const docRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
        await updateDoc(docRef, {
            status,
            notes,
            updatedAt: serverTimestamp()
        });
        return { id: appointmentId, status };
    } catch (error) {
        console.error('Error updating appointment status:', error);
        throw error;
    }
};

export const cancelAppointment = async (appointmentId, reason = '') => {
    return updateAppointmentStatus(appointmentId, 'cancelled', reason);
};

export const completeAppointment = async (appointmentId, notes = '') => {
    return updateAppointmentStatus(appointmentId, 'completed', notes);
};

// ===================================
// Blocked Slots Services
// ===================================

export const blockSlot = async (doctorId, date, timeSlot, reason = '') => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.BLOCKED_SLOTS), {
            doctorId,
            date: Timestamp.fromDate(new Date(date)),
            timeSlot,
            reason,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, doctorId, date, timeSlot, reason };
    } catch (error) {
        console.error('Error blocking slot:', error);
        throw error;
    }
};

export const unblockSlot = async (slotId) => {
    try {
        await deleteDoc(doc(db, COLLECTIONS.BLOCKED_SLOTS, slotId));
        return { success: true };
    } catch (error) {
        console.error('Error unblocking slot:', error);
        throw error;
    }
};

export const getBlockedSlots = async (doctorId, date) => {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const q = query(
            collection(db, COLLECTIONS.BLOCKED_SLOTS),
            where('doctorId', '==', doctorId),
            where('date', '>=', Timestamp.fromDate(startOfDay)),
            where('date', '<=', Timestamp.fromDate(endOfDay))
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting blocked slots:', error);
        throw error;
    }
};

export const getAllBlockedSlots = async (doctorId) => {
    try {
        const q = query(
            collection(db, COLLECTIONS.BLOCKED_SLOTS),
            where('doctorId', '==', doctorId),
            orderBy('date', 'asc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting all blocked slots:', error);
        throw error;
    }
};

// ===================================
// Availability Check
// ===================================

export const getAvailableSlots = async (doctorId, date, allSlots) => {
    try {
        // Get booked appointments for the date
        const appointments = await getAppointmentsByDate(doctorId, date);
        const bookedSlots = appointments
            .filter(apt => apt.status !== 'cancelled')
            .map(apt => apt.timeSlot);

        // Get blocked slots for the date
        const blockedSlots = await getBlockedSlots(doctorId, date);
        const blockedTimeSlots = blockedSlots.map(slot => slot.timeSlot);

        // Filter available slots
        const unavailableSlots = new Set([...bookedSlots, ...blockedTimeSlots]);
        return allSlots.filter(slot => !unavailableSlots.has(slot));
    } catch (error) {
        console.error('Error getting available slots:', error);
        throw error;
    }
};

// ===================================
// Statistics
// ===================================

export const getDoctorStats = async (doctorId) => {
    try {
        const appointments = await getAppointmentsByDoctor(doctorId);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = {
            total: appointments.length,
            pending: 0,
            completed: 0,
            cancelled: 0,
            today: 0,
            thisWeek: 0
        };

        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        appointments.forEach(apt => {
            // Count by status
            if (apt.status === 'pending') stats.pending++;
            else if (apt.status === 'completed') stats.completed++;
            else if (apt.status === 'cancelled') stats.cancelled++;

            // Count today's appointments
            const aptDate = apt.appointmentDate?.toDate?.() || new Date(apt.appointmentDate);
            if (aptDate.toDateString() === today.toDateString()) {
                stats.today++;
            }

            // Count this week's appointments
            if (aptDate >= weekStart && aptDate <= today) {
                stats.thisWeek++;
            }
        });

        return stats;
    } catch (error) {
        console.error('Error getting doctor stats:', error);
        throw error;
    }
};
