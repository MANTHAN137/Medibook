// Doctor Login Page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';
import './DoctorAuth.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        // Demo login check
        if (formData.email === 'demo@doctor.com' && formData.password === 'demo123') {
            toast.success('Welcome to the demo dashboard!');
            navigate('/doctor/dashboard');
            setLoading(false);
            return;
        }

        const result = await login(formData.email, formData.password);

        if (result.success) {
            toast.success('Welcome back!');
            navigate('/doctor/dashboard');
        } else {
            toast.error(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <div className="logo-icon">
                            <Calendar size={24} />
                        </div>
                        <span className="logo-text">MediBook</span>
                    </Link>
                    <h1 className="auth-title">Doctor Login</h1>
                    <p className="auth-subtitle">
                        Sign in to manage your appointments
                    </p>
                </div>

                <Card className="auth-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-fields">
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
                                placeholder="Enter your password"
                                icon={Lock}
                                error={errors.password}
                            />
                        </div>

                        <div className="form-actions">
                            <Button type="submit" fullWidth loading={loading}>
                                Sign In
                            </Button>
                        </div>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/doctor/register">Register here</Link>
                        </p>
                    </div>

                    <div className="demo-credentials">
                        <p><strong>Demo Credentials:</strong></p>
                        <p>Email: demo@doctor.com</p>
                        <p>Password: demo123</p>
                    </div>
                </Card>

                <div className="auth-back">
                    <Link to="/">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
