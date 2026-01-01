// Home Page
import { Link } from 'react-router-dom';
import { Calendar, Clock, Shield, Star, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './Home.css';

const Home = () => {
    const features = [
        {
            icon: Calendar,
            title: 'Easy Booking',
            description: 'Book appointments in just a few clicks. See real-time availability and choose your preferred time.'
        },
        {
            icon: Clock,
            title: 'Save Time',
            description: 'No more waiting on calls. Book instantly 24/7 from anywhere, anytime.'
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your health data is encrypted and protected. We prioritize your privacy.'
        }
    ];

    const steps = [
        { number: '01', title: 'Find Your Doctor', description: 'Browse our network of qualified doctors' },
        { number: '02', title: 'Select Date & Time', description: 'Choose a convenient appointment slot' },
        { number: '03', title: 'Confirm Booking', description: 'Fill your details and confirm your visit' }
    ];

    const benefits = [
        'No registration required for patients',
        'Real-time availability updates',
        'Instant confirmation',
        'Free cancellation',
        'Reminder notifications',
        'Mobile-friendly interface'
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content container">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <Star size={14} />
                            <span>Trusted by 10,000+ patients</span>
                        </div>
                        <h1 className="hero-title">
                            Book Doctor Appointments
                            <span className="text-gradient"> Effortlessly</span>
                        </h1>
                        <p className="hero-description">
                            Say goodbye to long waiting times and phone calls.
                            Find the right doctor, check availability, and book your appointment in seconds.
                        </p>
                        <div className="hero-actions">
                            <Link to="/doctors">
                                <Button size="lg" icon={ArrowRight} iconPosition="right">
                                    Find a Doctor
                                </Button>
                            </Link>
                            <Link to="/doctor/login">
                                <Button variant="secondary" size="lg">
                                    Are you a Doctor?
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-card glass-card">
                            <div className="hero-card-header">
                                <div className="hero-avatar">
                                    <span>👨‍⚕️</span>
                                </div>
                                <div>
                                    <h4>Dr. Sharma</h4>
                                    <span>General Physician</span>
                                </div>
                            </div>
                            <div className="hero-card-slots">
                                <div className="slot-chip available">09:00 AM</div>
                                <div className="slot-chip available">10:30 AM</div>
                                <div className="slot-chip booked">02:00 PM</div>
                                <div className="slot-chip available">04:00 PM</div>
                            </div>
                            <div className="hero-card-action">
                                <Button fullWidth size="sm">Book Now</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-bg-gradient"></div>
            </section>

            {/* Features Section */}
            <section className="features container">
                <div className="section-header">
                    <h2 className="section-title">Why Choose MediBook?</h2>
                    <p className="section-subtitle">
                        We make healthcare accessible and convenient for everyone
                    </p>
                </div>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <Card key={index} hover className="feature-card">
                            <div className="feature-icon">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">
                            Book your appointment in three simple steps
                        </p>
                    </div>
                    <div className="steps-grid">
                        {steps.map((step, index) => (
                            <div key={index} className="step-card">
                                <div className="step-number">{step.number}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits container">
                <div className="benefits-content">
                    <div className="benefits-text">
                        <h2 className="section-title">Everything You Need</h2>
                        <p className="section-subtitle">
                            A complete solution for managing your healthcare appointments
                        </p>
                        <ul className="benefits-list">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="benefit-item">
                                    <CheckCircle size={20} className="benefit-icon" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <Link to="/doctors">
                            <Button icon={ArrowRight} iconPosition="right">
                                Get Started Now
                            </Button>
                        </Link>
                    </div>
                    <div className="benefits-visual">
                        <div className="stats-grid">
                            <div className="stat-card glass-card">
                                <div className="stat-value">50+</div>
                                <div className="stat-label">Doctors</div>
                            </div>
                            <div className="stat-card glass-card">
                                <div className="stat-value">10K+</div>
                                <div className="stat-label">Patients</div>
                            </div>
                            <div className="stat-card glass-card">
                                <div className="stat-value">25K+</div>
                                <div className="stat-label">Appointments</div>
                            </div>
                            <div className="stat-card glass-card">
                                <div className="stat-value">4.9</div>
                                <div className="stat-label">Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-content glass-card">
                        <h2 className="cta-title">Ready to Book Your Appointment?</h2>
                        <p className="cta-description">
                            Join thousands of patients who trust MediBook for their healthcare needs
                        </p>
                        <Link to="/doctors">
                            <Button size="lg" icon={ArrowRight} iconPosition="right">
                                Find a Doctor Near You
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <Calendar size={24} />
                                <span>MediBook</span>
                            </div>
                            <p className="footer-tagline">
                                Making healthcare accessible, one appointment at a time.
                            </p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Quick Links</h4>
                                <Link to="/doctors">Find Doctors</Link>
                                <Link to="/about">About Us</Link>
                            </div>
                            <div className="footer-column">
                                <h4>For Doctors</h4>
                                <Link to="/doctor/login">Login</Link>
                                <Link to="/doctor/register">Register</Link>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 MediBook. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
