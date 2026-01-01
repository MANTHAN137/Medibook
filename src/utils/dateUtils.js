// Date Utility Functions

import { format, isToday, isTomorrow, isPast, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

/**
 * Format date to display string
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
    if (!date) return '';
    const d = date instanceof Date ? date : date.toDate?.() || new Date(date);
    return format(d, formatStr);
};

/**
 * Format date with relative label (Today, Tomorrow, or date)
 */
export const formatDateRelative = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : date.toDate?.() || new Date(date);

    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'EEE, MMM dd');
};

/**
 * Format time slot for display
 */
export const formatTimeSlot = (slot) => {
    return slot; // Already formatted as "HH:MM AM/PM"
};

/**
 * Check if a date is in the past
 */
export const isDatePast = (date) => {
    if (!date) return false;
    const d = date instanceof Date ? date : date.toDate?.() || new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
};

/**
 * Check if a time slot is in the past for today
 */
export const isSlotPast = (date, timeSlot) => {
    const d = date instanceof Date ? date : new Date(date);
    if (!isToday(d)) return isPast(d);

    // Parse time slot
    const [time, period] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;

    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;

    const slotDate = new Date(d);
    slotDate.setHours(hour24, minutes, 0, 0);

    return isPast(slotDate);
};

/**
 * Get the next N days from today
 */
export const getNextDays = (count = 14) => {
    const days = [];
    for (let i = 0; i < count; i++) {
        days.push(addDays(new Date(), i));
    }
    return days;
};

/**
 * Get days of current week
 */
export const getCurrentWeekDays = () => {
    const today = new Date();
    const start = startOfWeek(today);
    const end = endOfWeek(today);
    return eachDayOfInterval({ start, end });
};

/**
 * Get day of week index (0 = Sunday, 6 = Saturday)
 */
export const getDayOfWeek = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.getDay();
};

/**
 * Check if a day is a working day
 */
export const isWorkingDay = (date, workingDays = [1, 2, 3, 4, 5, 6]) => {
    return workingDays.includes(getDayOfWeek(date));
};

/**
 * Format duration for display
 */
export const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

/**
 * Parse Firebase Timestamp to Date
 */
export const parseTimestamp = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp instanceof Date) return timestamp;
    if (timestamp.toDate) return timestamp.toDate();
    return new Date(timestamp);
};
