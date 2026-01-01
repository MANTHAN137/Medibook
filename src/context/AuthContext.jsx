// Authentication Context
import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth, isConfigured } from '../firebase/config';
import { getDoctorByEmail, createDoctor } from '../firebase/services';
import { Spinner } from '../components/common/Loader';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [doctorData, setDoctorData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isConfigured) {
            console.warn('Firebase is not configured. Running in demo mode.');
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // Fetch doctor data
                try {
                    const doctor = await getDoctorByEmail(firebaseUser.email);
                    setDoctorData(doctor);
                } catch (error) {
                    console.error('Error fetching doctor data:', error);
                }
            } else {
                setUser(null);
                setDoctorData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const doctor = await getDoctorByEmail(email);
            setDoctorData(doctor);
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: getAuthErrorMessage(error.code) };
        }
    };

    const register = async (email, password, doctorInfo) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Create doctor profile in Firestore
            const doctor = await createDoctor({
                ...doctorInfo,
                email,
                uid: result.user.uid
            });

            setDoctorData(doctor);
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: getAuthErrorMessage(error.code) };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setDoctorData(null);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            return { success: false, error: getAuthErrorMessage(error.code) };
        }
    };

    const updateDoctorData = (data) => {
        setDoctorData(prev => ({ ...prev, ...data }));
    };

    const value = {
        user,
        doctorData,
        loading,
        login,
        register,
        logout,
        resetPassword,
        updateDoctorData,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
                    <Spinner size="lg" />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (code) => {
    switch (code) {
        case 'auth/user-not-found':
            return 'No account found with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        default:
            return 'An error occurred. Please try again.';
    }
};

export default AuthContext;
