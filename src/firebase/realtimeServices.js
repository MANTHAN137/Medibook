// Firebase Realtime Database Services
// Real-time sync for notifications, presence, and live updates

import {
    ref,
    set,
    push,
    get,
    update,
    remove,
    onValue,
    onChildAdded,
    onChildChanged,
    serverTimestamp,
    query as rtQuery,
    orderByChild,
    limitToLast,
    equalTo
} from 'firebase/database';
import { realtimeDb } from './config';

// ===================================
// Notifications
// ===================================

// Create a new notification
export const createNotification = async (userId, notification) => {
    try {
        const notificationsRef = ref(realtimeDb, `notifications/${userId}`);
        const newNotificationRef = push(notificationsRef);
        await set(newNotificationRef, {
            ...notification,
            read: false,
            createdAt: serverTimestamp()
        });
        return { id: newNotificationRef.key, ...notification };
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Listen to notifications in real-time
export const subscribeToNotifications = (userId, callback) => {
    const notificationsRef = ref(realtimeDb, `notifications/${userId}`);
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
        const notifications = [];
        snapshot.forEach((childSnapshot) => {
            notifications.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        // Sort by createdAt descending
        notifications.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        callback(notifications);
    });
    return unsubscribe;
};

// Mark notification as read
export const markNotificationAsRead = async (userId, notificationId) => {
    try {
        const notificationRef = ref(realtimeDb, `notifications/${userId}/${notificationId}`);
        await update(notificationRef, { read: true });
        return { success: true };
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId) => {
    try {
        const notificationsRef = ref(realtimeDb, `notifications/${userId}`);
        const snapshot = await get(notificationsRef);
        const updates = {};
        snapshot.forEach((childSnapshot) => {
            updates[`${childSnapshot.key}/read`] = true;
        });
        await update(notificationsRef, updates);
        return { success: true };
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
};

// Delete a notification
export const deleteNotification = async (userId, notificationId) => {
    try {
        const notificationRef = ref(realtimeDb, `notifications/${userId}/${notificationId}`);
        await remove(notificationRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
};

// ===================================
// Live Appointment Updates
// ===================================

// Subscribe to appointment changes for a doctor
export const subscribeToAppointmentUpdates = (doctorId, callback) => {
    const appointmentsRef = ref(realtimeDb, `liveAppointments/${doctorId}`);
    const unsubscribe = onValue(appointmentsRef, (snapshot) => {
        const appointments = [];
        snapshot.forEach((childSnapshot) => {
            appointments.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        callback(appointments);
    });
    return unsubscribe;
};

// Add a new appointment to realtime (for instant notification)
export const pushLiveAppointment = async (doctorId, appointmentData) => {
    try {
        const appointmentRef = ref(realtimeDb, `liveAppointments/${doctorId}/${appointmentData.id}`);
        await set(appointmentRef, {
            ...appointmentData,
            updatedAt: serverTimestamp()
        });

        // Also create a notification for the doctor
        await createNotification(doctorId, {
            type: 'new_appointment',
            title: 'New Appointment Booked',
            message: `${appointmentData.patientName} booked an appointment for ${appointmentData.timeSlot}`,
            appointmentId: appointmentData.id
        });

        return { success: true };
    } catch (error) {
        console.error('Error pushing live appointment:', error);
        throw error;
    }
};

// Update appointment status in realtime
export const updateLiveAppointmentStatus = async (doctorId, appointmentId, status) => {
    try {
        const appointmentRef = ref(realtimeDb, `liveAppointments/${doctorId}/${appointmentId}`);
        await update(appointmentRef, {
            status,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating live appointment:', error);
        throw error;
    }
};

// ===================================
// User Presence (Online Status)
// ===================================

// Set user as online
export const setUserOnline = async (userId) => {
    try {
        const userStatusRef = ref(realtimeDb, `presence/${userId}`);
        await set(userStatusRef, {
            state: 'online',
            lastSeen: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error setting user online:', error);
        throw error;
    }
};

// Set user as offline
export const setUserOffline = async (userId) => {
    try {
        const userStatusRef = ref(realtimeDb, `presence/${userId}`);
        await set(userStatusRef, {
            state: 'offline',
            lastSeen: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error setting user offline:', error);
        throw error;
    }
};

// Subscribe to user presence
export const subscribeToPresence = (userId, callback) => {
    const presenceRef = ref(realtimeDb, `presence/${userId}`);
    const unsubscribe = onValue(presenceRef, (snapshot) => {
        callback(snapshot.val());
    });
    return unsubscribe;
};

// ===================================
// Live Chat (Patient-Doctor Messaging)
// ===================================

// Send a message
export const sendMessage = async (conversationId, message) => {
    try {
        const messagesRef = ref(realtimeDb, `chats/${conversationId}/messages`);
        const newMessageRef = push(messagesRef);
        await set(newMessageRef, {
            ...message,
            timestamp: serverTimestamp()
        });

        // Update conversation metadata
        const conversationRef = ref(realtimeDb, `chats/${conversationId}/metadata`);
        await update(conversationRef, {
            lastMessage: message.text,
            lastMessageTime: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { id: newMessageRef.key, ...message };
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Subscribe to messages
export const subscribeToMessages = (conversationId, callback) => {
    const messagesRef = ref(realtimeDb, `chats/${conversationId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
        const messages = [];
        snapshot.forEach((childSnapshot) => {
            messages.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        callback(messages);
    });
    return unsubscribe;
};

// Listen for new messages only
export const listenForNewMessages = (conversationId, callback) => {
    const messagesRef = ref(realtimeDb, `chats/${conversationId}/messages`);
    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
        callback({
            id: snapshot.key,
            ...snapshot.val()
        });
    });
    return unsubscribe;
};

// ===================================
// Real-time Stats
// ===================================

// Subscribe to live stats for doctor dashboard
export const subscribeToLiveStats = (doctorId, callback) => {
    const statsRef = ref(realtimeDb, `stats/${doctorId}`);
    const unsubscribe = onValue(statsRef, (snapshot) => {
        callback(snapshot.val() || {
            todayAppointments: 0,
            pendingCount: 0,
            completedToday: 0
        });
    });
    return unsubscribe;
};

// Update live stats
export const updateLiveStats = async (doctorId, stats) => {
    try {
        const statsRef = ref(realtimeDb, `stats/${doctorId}`);
        await update(statsRef, {
            ...stats,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating live stats:', error);
        throw error;
    }
};
