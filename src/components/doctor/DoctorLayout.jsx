// Doctor Dashboard Layout
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Calendar, Clock, Users, Settings,
    LogOut, Menu, X, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './DoctorLayout.css';

const DoctorLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { doctorData, logout } = useAuth();

    const navItems = [
        { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/doctor/appointments', label: 'Appointments', icon: Calendar },
        { path: '/doctor/availability', label: 'Availability', icon: Clock },
        { path: '/doctor/patients', label: 'Patients', icon: Users },
        { path: '/doctor/settings', label: 'Settings', icon: Settings },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out successfully');
        navigate('/doctor/login');
    };

    const doctorName = doctorData?.name || 'Demo Doctor';
    const doctorInitials = doctorName.split(' ').map(n => n[0]).join('').slice(0, 2);

    return (
        <div className="doctor-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-logo">
                        <div className="logo-icon">
                            <Calendar size={20} />
                        </div>
                        <span className="logo-text">MediBook</span>
                    </Link>
                    <button
                        className="sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="main-wrapper">
                {/* Top Bar */}
                <header className="topbar">
                    <button
                        className="menu-toggle"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="topbar-right">
                        <div className="profile-dropdown">
                            <button
                                className="profile-trigger"
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                <div className="profile-avatar">
                                    {doctorInitials}
                                </div>
                                <div className="profile-info">
                                    <span className="profile-name">{doctorName}</span>
                                    <span className="profile-role">{doctorData?.specialization || 'Doctor'}</span>
                                </div>
                                <ChevronDown size={16} className={profileOpen ? 'rotate' : ''} />
                            </button>

                            {profileOpen && (
                                <div className="dropdown-menu">
                                    <Link
                                        to="/doctor/settings"
                                        className="dropdown-item"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        <Settings size={16} />
                                        <span>Settings</span>
                                    </Link>
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;
