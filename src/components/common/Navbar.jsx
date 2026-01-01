// Navbar Component
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, User, LogIn } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/doctors', label: 'Find Doctors' },
        { path: '/about', label: 'About' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <Calendar size={24} />
                    </div>
                    <span className="logo-text">MediBook</span>
                </Link>

                <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
                    <ul className="navbar-links">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar-actions">
                        <Link
                            to="/doctor/login"
                            className="navbar-btn navbar-btn-ghost"
                            onClick={() => setIsOpen(false)}
                        >
                            <LogIn size={18} />
                            <span>Doctor Login</span>
                        </Link>
                    </div>
                </div>

                <button
                    className="navbar-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
