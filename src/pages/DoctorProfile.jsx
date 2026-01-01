// Doctor Profile & Booking Page
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Phone, Mail, Calendar } from 'lucide-react';
import { getDoctorById, getAvailableSlots, createAppointment } from '../firebase/services';
import { TIME_SLOTS } from '../utils/constants';
import { formatDate, formatDateRelative } from '../utils/dateUtils';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input, { Textarea, Select } from '../components/common/Input';
import Modal, { ModalFooter } from '../components/common/Modal';
import CalendarPicker from '../components/booking/CalendarPicker';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';
import './DoctorProfile.css';

const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [patientForm, setPatientForm] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        reason: ''
    });

    // Demo doctor data
    const demoDoctors = {
        demo1: {
            id: 'demo1',
            name: 'Dr. Rajesh Kumar',
            specialization: 'General Physician',
            clinicName: 'City Health Clinic',
            clinicAddress: 'MG Road, Mumbai',
            phone: '+91 98765 43210',
            email: 'dr.rajesh@clinic.com',
            consultationDuration: 30,
            rating: 4.8,
            experience: '15 years',
            about: 'Dr. Rajesh Kumar is a highly experienced General Physician with over 15 years of practice. He specializes in preventive healthcare, chronic disease management, and general wellness consultations.',
            workingDays: [1, 2, 3, 4, 5, 6]
        },
        demo2: {
            id: 'demo2',
            name: 'Dr. Priya Sharma',
            specialization: 'Dermatologist',
            clinicName: 'Skin Care Center',
            clinicAddress: 'Koramangala, Bangalore',
            phone: '+91 98765 43211',
            email: 'dr.priya@skin.com',
            consultationDuration: 30,
            rating: 4.9,
            experience: '12 years',
            about: 'Dr. Priya Sharma is a renowned Dermatologist specializing in skin care, acne treatment, and cosmetic dermatology. She has helped thousands of patients achieve healthy, glowing skin.',
            workingDays: [1, 2, 3, 4, 5]
        },
        demo3: {
            id: 'demo3',
            name: 'Dr. Amit Patel',
            specialization: 'Cardiologist',
            clinicName: 'Heart Care Hospital',
            clinicAddress: 'Andheri West, Mumbai',
            phone: '+91 98765 43212',
            email: 'dr.amit@heart.com',
            consultationDuration: 45,
            rating: 4.7,
            experience: '20 years',
            about: 'Dr. Amit Patel is an expert Cardiologist with two decades of experience in treating heart conditions. He is known for his patient-centric approach and expertise in preventive cardiology.',
            workingDays: [1, 2, 3, 4, 5, 6]
        },
        demo4: {
            id: 'demo4',
            name: 'Dr. Sneha Reddy',
            specialization: 'Pediatrician',
            clinicName: 'Kids First Clinic',
            clinicAddress: 'Jubilee Hills, Hyderabad',
            phone: '+91 98765 43213',
            email: 'dr.sneha@kids.com',
            consultationDuration: 30,
            rating: 4.9,
            experience: '10 years',
            about: 'Dr. Sneha Reddy is a caring Pediatrician who loves working with children. She specializes in child development, vaccinations, and common childhood illnesses.',
            workingDays: [1, 2, 3, 4, 5, 6]
        },
        demo5: {
            id: 'demo5',
            name: 'Dr. Vikram Singh',
            specialization: 'Orthopedic',
            clinicName: 'Bone & Joint Center',
            clinicAddress: 'Sector 18, Noida',
            phone: '+91 98765 43214',
            email: 'dr.vikram@ortho.com',
            consultationDuration: 30,
            rating: 4.6,
            experience: '18 years',
            about: 'Dr. Vikram Singh is an experienced Orthopedic surgeon specializing in joint replacements, sports injuries, and spine conditions.',
            workingDays: [1, 2, 3, 4, 5]
        },
        demo6: {
            id: 'demo6',
            name: 'Dr. Anjali Gupta',
            specialization: 'Gynecologist',
            clinicName: 'Women Health Clinic',
            clinicAddress: 'Connaught Place, Delhi',
            phone: '+91 98765 43215',
            email: 'dr.anjali@women.com',
            consultationDuration: 30,
            rating: 4.8,
            experience: '14 years',
            about: 'Dr. Anjali Gupta is a compassionate Gynecologist with expertise in womens health, pregnancy care, and reproductive medicine.',
            workingDays: [1, 2, 3, 4, 5, 6]
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, [id]);

    useEffect(() => {
        if (selectedDate && doctor) {
            fetchAvailableSlots();
        }
    }, [selectedDate, doctor]);

    const fetchDoctor = async () => {
        try {
            // Check if it's a demo doctor
            if (id.startsWith('demo')) {
                setDoctor(demoDoctors[id]);
            } else {
                const data = await getDoctorById(id);
                setDoctor(data);
            }
        } catch (error) {
            console.error('Error fetching doctor:', error);
            toast.error('Failed to load doctor profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        setLoadingSlots(true);
        try {
            if (id.startsWith('demo')) {
                // For demo, show all slots as available
                setAvailableSlots(TIME_SLOTS);
            } else {
                const slots = await getAvailableSlots(doctor.id, selectedDate, TIME_SLOTS);
                setAvailableSlots(slots);
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedSlot('');
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientForm(prev => ({ ...prev, [name]: value }));
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!patientForm.name || !patientForm.phone) {
            toast.error('Please fill in required fields');
            return;
        }

        setBookingLoading(true);

        try {
            if (id.startsWith('demo')) {
                // Demo booking - just show success
                await new Promise(resolve => setTimeout(resolve, 1500));
                toast.success('Demo booking successful!');
                setShowBookingModal(false);
                navigate('/booking-success', {
                    state: {
                        doctor,
                        date: selectedDate,
                        slot: selectedSlot,
                        patient: patientForm
                    }
                });
            } else {
                // Real booking
                await createAppointment({
                    doctorId: doctor.id,
                    doctorName: doctor.name,
                    appointmentDate: Timestamp.fromDate(selectedDate),
                    timeSlot: selectedSlot,
                    patientName: patientForm.name,
                    patientEmail: patientForm.email,
                    patientPhone: patientForm.phone,
                    patientAge: patientForm.age,
                    patientGender: patientForm.gender,
                    reason: patientForm.reason
                });

                toast.success('Appointment booked successfully!');
                setShowBookingModal(false);
                navigate('/booking-success', {
                    state: {
                        doctor,
                        date: selectedDate,
                        slot: selectedSlot,
                        patient: patientForm
                    }
                });
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            toast.error('Failed to book appointment. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="doctor-profile-page">
                <div className="container">
                    <Loader text="Loading doctor profile..." />
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="doctor-profile-page">
                <div className="container">
                    <div className="not-found">
                        <h2>Doctor not found</h2>
                        <p>The doctor profile you're looking for doesn't exist.</p>
                        <Button onClick={() => navigate('/doctors')}>
                            Back to Doctor List
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const initials = doctor.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2);

    return (
        <div className="doctor-profile-page">
            <div className="container">
                {/* Back Button */}
                <button className="back-button" onClick={() => navigate('/doctors')}>
                    <ArrowLeft size={20} />
                    <span>Back to Doctors</span>
                </button>

                <div className="profile-layout">
                    {/* Doctor Info */}
                    <div className="profile-main">
                        <Card className="doctor-info-card">
                            <div className="doctor-header">
                                <div className="doctor-avatar-large">
                                    <span>{initials}</span>
                                </div>
                                <div className="doctor-details">
                                    <h1 className="doctor-name">{doctor.name}</h1>
                                    <p className="doctor-specialization">{doctor.specialization}</p>
                                    {doctor.rating && (
                                        <div className="doctor-rating">
                                            <Star size={18} fill="var(--warning-400)" />
                                            <span>{doctor.rating}</span>
                                            <span className="rating-label">Rating</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="doctor-meta">
                                <div className="meta-item">
                                    <MapPin size={18} />
                                    <div>
                                        <strong>{doctor.clinicName}</strong>
                                        <span>{doctor.clinicAddress}</span>
                                    </div>
                                </div>
                                <div className="meta-item">
                                    <Clock size={18} />
                                    <div>
                                        <strong>{doctor.consultationDuration || 30} min</strong>
                                        <span>Consultation Duration</span>
                                    </div>
                                </div>
                                {doctor.experience && (
                                    <div className="meta-item">
                                        <Calendar size={18} />
                                        <div>
                                            <strong>{doctor.experience}</strong>
                                            <span>Experience</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {doctor.about && (
                                <div className="doctor-about">
                                    <h3>About</h3>
                                    <p>{doctor.about}</p>
                                </div>
                            )}

                            <div className="doctor-contact">
                                <h3>Contact Information</h3>
                                <div className="contact-items">
                                    {doctor.phone && (
                                        <div className="contact-item">
                                            <Phone size={16} />
                                            <span>{doctor.phone}</span>
                                        </div>
                                    )}
                                    {doctor.email && (
                                        <div className="contact-item">
                                            <Mail size={16} />
                                            <span>{doctor.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Booking Section */}
                    <div className="profile-sidebar">
                        <Card className="booking-card">
                            <h2 className="booking-title">Book Appointment</h2>

                            <div className="booking-step">
                                <h4>1. Select Date</h4>
                                <CalendarPicker
                                    selectedDate={selectedDate}
                                    onSelectDate={handleDateSelect}
                                    workingDays={doctor.workingDays || [1, 2, 3, 4, 5, 6]}
                                />
                            </div>

                            {selectedDate && (
                                <div className="booking-step animate-fadeIn">
                                    <h4>2. Select Time Slot</h4>
                                    <p className="selected-date">
                                        {formatDateRelative(selectedDate)} - {formatDate(selectedDate)}
                                    </p>
                                    {loadingSlots ? (
                                        <div className="slots-loading">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <TimeSlotPicker
                                            selectedDate={selectedDate}
                                            selectedSlot={selectedSlot}
                                            onSelectSlot={handleSlotSelect}
                                            availableSlots={availableSlots}
                                        />
                                    )}
                                </div>
                            )}

                            {selectedSlot && (
                                <div className="booking-action animate-fadeIn">
                                    <div className="booking-summary">
                                        <p><strong>Date:</strong> {formatDate(selectedDate, 'EEEE, MMMM dd, yyyy')}</p>
                                        <p><strong>Time:</strong> {selectedSlot}</p>
                                    </div>
                                    <Button
                                        fullWidth
                                        size="lg"
                                        onClick={() => setShowBookingModal(true)}
                                    >
                                        Continue to Book
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <Modal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                title="Complete Your Booking"
                size="md"
            >
                <form onSubmit={handleBookingSubmit}>
                    <div className="booking-form">
                        <div className="form-row">
                            <Input
                                label="Full Name *"
                                name="name"
                                value={patientForm.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="form-row form-row-2">
                            <Input
                                label="Phone Number *"
                                name="phone"
                                type="tel"
                                value={patientForm.phone}
                                onChange={handleInputChange}
                                placeholder="+91 98765 43210"
                                required
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={patientForm.email}
                                onChange={handleInputChange}
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="form-row form-row-2">
                            <Input
                                label="Age"
                                name="age"
                                type="number"
                                value={patientForm.age}
                                onChange={handleInputChange}
                                placeholder="25"
                            />
                            <Select
                                label="Gender"
                                name="gender"
                                value={patientForm.gender}
                                onChange={handleInputChange}
                                placeholder="Select gender"
                                options={['Male', 'Female', 'Other', 'Prefer not to say']}
                            />
                        </div>

                        <div className="form-row">
                            <Textarea
                                label="Reason for Visit"
                                name="reason"
                                value={patientForm.reason}
                                onChange={handleInputChange}
                                placeholder="Briefly describe your symptoms or reason for consultation..."
                                rows={3}
                            />
                        </div>

                        <div className="modal-booking-summary">
                            <h4>Appointment Details</h4>
                            <p><strong>Doctor:</strong> {doctor.name}</p>
                            <p><strong>Date:</strong> {formatDate(selectedDate, 'EEEE, MMMM dd, yyyy')}</p>
                            <p><strong>Time:</strong> {selectedSlot}</p>
                        </div>
                    </div>

                    <ModalFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowBookingModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={bookingLoading}
                        >
                            Confirm Booking
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
};

export default DoctorProfile;
