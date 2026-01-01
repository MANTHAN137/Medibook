// Doctor Registration Page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Building, Stethoscope, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SPECIALIZATIONS, DEFAULT_WORKING_DAYS } from '../../utils/constants';
import Input, { Select, Textarea } from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';
import './DoctorAuth.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Account
        email: '',
        password: '',
        confirmPassword: '',
        // Profile
        name: '',
        phone: '',
        specialization: '',
        experience: '',
        // Clinic
        clinicName: '',
        clinicAddress: '',
        consultationDuration: '30',
        about: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.specialization) newErrors.specialization = 'Specialization is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const doctorInfo = {
            name: formData.name,
            phone: formData.phone,
            specialization: formData.specialization,
            experience: formData.experience,
            clinicName: formData.clinicName,
            clinicAddress: formData.clinicAddress,
            consultationDuration: parseInt(formData.consultationDuration),
            about: formData.about,
            workingDays: DEFAULT_WORKING_DAYS
        };

        const result = await register(formData.email, formData.password, doctorInfo);

        if (result.success) {
            toast.success('Account created successfully!');
            navigate('/doctor/dashboard');
        } else {
            toast.error(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container auth-container-wide">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <div className="logo-icon">
                            <Calendar size={24} />
                        </div>
                        <span className="logo-text">MediBook</span>
                    </Link>
                    <h1 className="auth-title">Doctor Registration</h1>
                    <p className="auth-subtitle">
                        Create your account to start managing appointments
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="register-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <span>Account</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <span>Profile</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <span>Clinic</span>
                    </div>
                </div>

                <Card className="auth-card">
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Account Info */}
                        {step === 1 && (
                            <div className="form-fields animate-fadeIn">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="doctor@clinic.com"
                                    icon={Mail}
                                    error={errors.email}
                                />

                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    icon={Lock}
                                    error={errors.password}
                                />

                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    icon={Lock}
                                    error={errors.confirmPassword}
                                />
                            </div>
                        )}

                        {/* Step 2: Profile Info */}
                        {step === 2 && (
                            <div className="form-fields animate-fadeIn">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Dr. John Smith"
                                    icon={User}
                                    error={errors.name}
                                />

                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    icon={Phone}
                                    error={errors.phone}
                                />

                                <Select
                                    label="Specialization"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    placeholder="Select your specialization"
                                    options={SPECIALIZATIONS}
                                    error={errors.specialization}
                                />

                                <Input
                                    label="Years of Experience"
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="e.g., 10 years"
                                />
                            </div>
                        )}

                        {/* Step 3: Clinic Info */}
                        {step === 3 && (
                            <div className="form-fields animate-fadeIn">
                                <Input
                                    label="Clinic/Hospital Name"
                                    type="text"
                                    name="clinicName"
                                    value={formData.clinicName}
                                    onChange={handleChange}
                                    placeholder="City Health Clinic"
                                    icon={Building}
                                />

                                <Input
                                    label="Clinic Address"
                                    type="text"
                                    name="clinicAddress"
                                    value={formData.clinicAddress}
                                    onChange={handleChange}
                                    placeholder="123 Medical Street, City"
                                />

                                <Select
                                    label="Consultation Duration (minutes)"
                                    name="consultationDuration"
                                    value={formData.consultationDuration}
                                    onChange={handleChange}
                                    options={[
                                        { value: '15', label: '15 minutes' },
                                        { value: '20', label: '20 minutes' },
                                        { value: '30', label: '30 minutes' },
                                        { value: '45', label: '45 minutes' },
                                        { value: '60', label: '60 minutes' }
                                    ]}
                                />

                                <Textarea
                                    label="About You"
                                    name="about"
                                    value={formData.about}
                                    onChange={handleChange}
                                    placeholder="Write a brief description about yourself and your practice..."
                                    rows={4}
                                />
                            </div>
                        )}

                        <div className="form-actions form-actions-row">
                            {step > 1 && (
                                <Button type="button" variant="ghost" onClick={handleBack}>
                                    Back
                                </Button>
                            )}

                            {step < 3 ? (
                                <Button type="button" onClick={handleNext}>
                                    Continue
                                </Button>
                            ) : (
                                <Button type="submit" loading={loading}>
                                    Create Account
                                </Button>
                            )}
                        </div>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/doctor/login">Sign in</Link>
                        </p>
                    </div>
                </Card>

                <div className="auth-back">
                    <Link to="/">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
