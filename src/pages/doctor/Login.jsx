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
    const { login, loginWithGoogle } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
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

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);

        const result = await loginWithGoogle();

        if (result.success) {
            if (result.isNewUser) {
                toast.success('Account created! Please update your profile.');
                navigate('/doctor/settings');
            } else {
                toast.success('Welcome back!');
                navigate('/doctor/dashboard');
            }
        } else {
            toast.error(result.error);
        }

        setGoogleLoading(false);
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

                    <div className="social-divider">
                        <span>or continue with</span>
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        fullWidth
                        onClick={handleGoogleSignIn}
                        loading={googleLoading}
                        className="google-btn"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332A8.997 8.997 0 0 0 9.003 18z" fill="#34A853" />
                            <path d="M3.964 10.712A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.33z" fill="#FBBC05" />
                            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.039-3.71z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </Button>

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
