// Main Application Entry Point
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import Navbar from './components/common/Navbar';

// Patient Pages
import Home from './pages/Home';
import DoctorList from './pages/DoctorList';
import DoctorProfile from './pages/DoctorProfile';
import BookingSuccess from './pages/BookingSuccess';
import PatientAppointments from './pages/PatientAppointments';

// Doctor Pages
import Login from './pages/doctor/Login';
import Register from './pages/doctor/Register';
import Dashboard from './pages/doctor/Dashboard';
import Appointments from './pages/doctor/Appointments';
import Availability from './pages/doctor/Availability';
import Patients from './pages/doctor/Patients';
import Settings from './pages/doctor/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Allow demo access
    const isDemo = window.location.pathname.includes('/doctor/') &&
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register');

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="spinner spinner-lg" />
            </div>
        );
    }

    // For demo purposes, allow access to doctor dashboard
    if (!isAuthenticated && !isDemo) {
        // Check if coming from demo login
        const demoAccess = sessionStorage.getItem('demoAccess');
        if (!demoAccess) {
            return <Navigate to="/doctor/login" replace />;
        }
    }

    return children;
};

// Patient Layout (with Navbar)
const PatientLayout = ({ children }) => (
    <>
        <Navbar />
        {children}
    </>
);

function AppRoutes() {
    return (
        <Routes>
            {/* Patient Routes */}
            <Route path="/" element={<PatientLayout><Home /></PatientLayout>} />
            <Route path="/doctors" element={<PatientLayout><DoctorList /></PatientLayout>} />
            <Route path="/doctor/:id" element={<PatientLayout><DoctorProfile /></PatientLayout>} />
            <Route path="/booking-success" element={<PatientLayout><BookingSuccess /></PatientLayout>} />
            <Route path="/my-appointments" element={<PatientAppointments />} />

            {/* Doctor Auth Routes */}
            <Route path="/doctor/login" element={<Login />} />
            <Route path="/doctor/register" element={<Register />} />

            {/* Doctor Protected Routes */}
            <Route
                path="/doctor/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/doctor/appointments"
                element={
                    <ProtectedRoute>
                        <Appointments />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/doctor/availability"
                element={
                    <ProtectedRoute>
                        <Availability />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/doctor/patients"
                element={
                    <ProtectedRoute>
                        <Patients />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/doctor/settings"
                element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#1f2937',
                            color: '#f9fafb',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#f9fafb',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#f9fafb',
                            },
                        },
                    }}
                />
            </AuthProvider>
        </Router>
    );
}

export default App;
