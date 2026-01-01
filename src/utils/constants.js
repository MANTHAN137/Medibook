// Utility Constants

// Time slots configuration (30-minute intervals)
export const TIME_SLOTS = [
    '09:00 AM', '09:30 AM',
    '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM',
    '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM'
];

// Morning, Afternoon, Evening groups
export const TIME_SLOT_GROUPS = {
    morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    afternoon: ['12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'],
    evening: ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM']
};

// Medical Specializations
export const SPECIALIZATIONS = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Orthopedic',
    'Neurologist',
    'Gynecologist',
    'ENT Specialist',
    'Ophthalmologist',
    'Psychiatrist',
    'Dentist',
    'Urologist',
    'Gastroenterologist',
    'Pulmonologist',
    'Endocrinologist',
    'Oncologist',
    'Nephrologist',
    'Rheumatologist'
];

// Appointment Status
export const APPOINTMENT_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no-show'
};

// Status Colors
export const STATUS_COLORS = {
    pending: { bg: 'rgba(234, 179, 8, 0.2)', color: '#facc15' },
    confirmed: { bg: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' },
    completed: { bg: 'rgba(0, 119, 182, 0.2)', color: '#7dd3fc' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171' },
    'no-show': { bg: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af' }
};

// Days of the Week
export const DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

// Working Days (default - Monday to Saturday)
export const DEFAULT_WORKING_DAYS = [1, 2, 3, 4, 5, 6];

// Default Working Hours
export const DEFAULT_WORKING_HOURS = {
    start: '09:00 AM',
    end: '06:30 PM',
    lunchStart: '01:00 PM',
    lunchEnd: '02:00 PM'
};

// Consultation Duration Options (in minutes)
export const CONSULTATION_DURATIONS = [15, 20, 30, 45, 60];

// Gender Options
export const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

// Block Reason Presets
export const BLOCK_REASON_PRESETS = [
    'Lunch Break',
    'Personal Work',
    'Meeting',
    'Leave',
    'Emergency',
    'Other'
];
