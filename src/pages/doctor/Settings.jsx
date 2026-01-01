// Doctor Settings Page
import { useState } from 'react';
import { User, Building, Clock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateDoctor } from '../../firebase/services';
import { SPECIALIZATIONS, CONSULTATION_DURATIONS, DAYS_OF_WEEK } from '../../utils/constants';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import Card from '../../components/common/Card';
import Input, { Select, Textarea } from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
    const { doctorData, updateDoctorData } = useAuth();
    const isDemo = !doctorData?.id || doctorData.id === 'demo';

    const [formData, setFormData] = useState({
        name: doctorData?.name || 'Demo Doctor',
        phone: doctorData?.phone || '+91 98765 43210',
        specialization: doctorData?.specialization || 'General Physician',
        experience: doctorData?.experience || '10 years',
        clinicName: doctorData?.clinicName || 'Demo Clinic',
        clinicAddress: doctorData?.clinicAddress || 'Mumbai, India',
        consultationDuration: doctorData?.consultationDuration?.toString() || '30',
        about: doctorData?.about || 'Experienced doctor dedicated to patient care.',
        workingDays: doctorData?.workingDays || [1, 2, 3, 4, 5, 6]
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleWorkingDayToggle = (dayIndex) => {
        setFormData(prev => ({
            ...prev,
            workingDays: prev.workingDays.includes(dayIndex)
                ? prev.workingDays.filter(d => d !== dayIndex)
                : [...prev.workingDays, dayIndex].sort()
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isDemo) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                toast.success('Demo: Settings saved successfully!');
            } else {
                await updateDoctor(doctorData.id, {
                    ...formData,
                    consultationDuration: parseInt(formData.consultationDuration)
                });
                updateDoctorData(formData);
                toast.success('Settings saved successfully!');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DoctorLayout>
            <div className="settings-page">
                <div className="page-header">
                    <h1>Settings</h1>
                    <p>Manage your profile and clinic information</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Profile Section */}
                    <Card className="settings-section">
                        <div className="section-header">
                            <User size={20} />
                            <h3>Profile Information</h3>
                        </div>

                        <div className="form-grid">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Dr. John Smith"
                            />

                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                            />

                            <Select
                                label="Specialization"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                options={SPECIALIZATIONS}
                            />

                            <Input
                                label="Experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="10 years"
                            />
                        </div>

                        <div className="form-full">
                            <Textarea
                                label="About"
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                placeholder="Write about yourself and your practice..."
                                rows={4}
                            />
                        </div>
                    </Card>

                    {/* Clinic Section */}
                    <Card className="settings-section">
                        <div className="section-header">
                            <Building size={20} />
                            <h3>Clinic Information</h3>
                        </div>

                        <div className="form-grid">
                            <Input
                                label="Clinic/Hospital Name"
                                name="clinicName"
                                value={formData.clinicName}
                                onChange={handleChange}
                                placeholder="City Health Clinic"
                            />

                            <Input
                                label="Clinic Address"
                                name="clinicAddress"
                                value={formData.clinicAddress}
                                onChange={handleChange}
                                placeholder="123 Medical Street, City"
                            />
                        </div>
                    </Card>

                    {/* Schedule Section */}
                    <Card className="settings-section">
                        <div className="section-header">
                            <Clock size={20} />
                            <h3>Schedule Settings</h3>
                        </div>

                        <div className="form-grid">
                            <Select
                                label="Consultation Duration"
                                name="consultationDuration"
                                value={formData.consultationDuration}
                                onChange={handleChange}
                                options={CONSULTATION_DURATIONS.map(d => ({
                                    value: d.toString(),
                                    label: `${d} minutes`
                                }))}
                            />
                        </div>

                        <div className="working-days">
                            <label className="form-label">Working Days</label>
                            <div className="days-grid">
                                {DAYS_OF_WEEK.map((day, index) => (
                                    <label
                                        key={day}
                                        className={`day-checkbox ${formData.workingDays.includes(index) ? 'active' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.workingDays.includes(index)}
                                            onChange={() => handleWorkingDayToggle(index)}
                                        />
                                        <span>{day.slice(0, 3)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Save Button */}
                    <div className="settings-actions">
                        <Button type="submit" icon={Save} loading={loading}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </DoctorLayout>
    );
};

export default Settings;
