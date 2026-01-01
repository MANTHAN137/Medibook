// Doctor List Page
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Star, Filter } from 'lucide-react';
import { getAllDoctors } from '../firebase/services';
import { SPECIALIZATIONS } from '../utils/constants';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loader, { SkeletonCard } from '../components/common/Loader';
import './DoctorList.css';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        filterDoctors();
    }, [doctors, searchTerm, selectedSpecialization]);

    const fetchDoctors = async () => {
        try {
            const data = await getAllDoctors();
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterDoctors = () => {
        let filtered = [...doctors];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (doc) =>
                    doc.name?.toLowerCase().includes(term) ||
                    doc.specialization?.toLowerCase().includes(term) ||
                    doc.clinicName?.toLowerCase().includes(term)
            );
        }

        if (selectedSpecialization) {
            filtered = filtered.filter(
                (doc) => doc.specialization === selectedSpecialization
            );
        }

        setFilteredDoctors(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedSpecialization('');
    };

    // Demo doctors for when Firebase is not configured
    const demoDoctors = [
        {
            id: 'demo1',
            name: 'Dr. Rajesh Kumar',
            specialization: 'General Physician',
            clinicName: 'City Health Clinic',
            clinicAddress: 'MG Road, Mumbai',
            consultationDuration: 30,
            rating: 4.8
        },
        {
            id: 'demo2',
            name: 'Dr. Priya Sharma',
            specialization: 'Dermatologist',
            clinicName: 'Skin Care Center',
            clinicAddress: 'Koramangala, Bangalore',
            consultationDuration: 30,
            rating: 4.9
        },
        {
            id: 'demo3',
            name: 'Dr. Amit Patel',
            specialization: 'Cardiologist',
            clinicName: 'Heart Care Hospital',
            clinicAddress: 'Andheri West, Mumbai',
            consultationDuration: 45,
            rating: 4.7
        },
        {
            id: 'demo4',
            name: 'Dr. Sneha Reddy',
            specialization: 'Pediatrician',
            clinicName: 'Kids First Clinic',
            clinicAddress: 'Jubilee Hills, Hyderabad',
            consultationDuration: 30,
            rating: 4.9
        },
        {
            id: 'demo5',
            name: 'Dr. Vikram Singh',
            specialization: 'Orthopedic',
            clinicName: 'Bone & Joint Center',
            clinicAddress: 'Sector 18, Noida',
            consultationDuration: 30,
            rating: 4.6
        },
        {
            id: 'demo6',
            name: 'Dr. Anjali Gupta',
            specialization: 'Gynecologist',
            clinicName: 'Women Health Clinic',
            clinicAddress: 'Connaught Place, Delhi',
            consultationDuration: 30,
            rating: 4.8
        }
    ];

    const displayDoctors = doctors.length > 0 ? filteredDoctors : demoDoctors;

    return (
        <div className="doctor-list-page">
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <h1 className="page-title">Find Your Doctor</h1>
                    <p className="page-subtitle">
                        Browse our network of experienced doctors and book your appointment
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="search-section">
                    <div className="search-bar">
                        <Input
                            type="text"
                            placeholder="Search by name, specialization, or clinic..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={Search}
                        />
                        <Button
                            variant="secondary"
                            icon={Filter}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Filters
                        </Button>
                    </div>

                    {showFilters && (
                        <div className="filters-panel glass-card">
                            <div className="filter-group">
                                <label className="filter-label">Specialization</label>
                                <select
                                    className="form-input"
                                    value={selectedSpecialization}
                                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                                >
                                    <option value="">All Specializations</option>
                                    {SPECIALIZATIONS.map((spec) => (
                                        <option key={spec} value={spec}>
                                            {spec}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {(searchTerm || selectedSpecialization) && (
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="results-info">
                    <p>
                        Showing <strong>{displayDoctors.length}</strong> doctor
                        {displayDoctors.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Doctor Grid */}
                {loading ? (
                    <div className="doctors-grid">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : displayDoctors.length > 0 ? (
                    <div className="doctors-grid">
                        {displayDoctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h3>No doctors found</h3>
                        <p>Try adjusting your search or filters</p>
                        <Button variant="secondary" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Doctor Card Component
const DoctorCard = ({ doctor }) => {
    const initials = doctor.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2);

    return (
        <Card hover className="doctor-card">
            <Link to={`/doctor/${doctor.id}`} className="doctor-card-link">
                <div className="doctor-card-header">
                    <div className="doctor-avatar">
                        <span>{initials}</span>
                    </div>
                    <div className="doctor-info">
                        <h3 className="doctor-name">{doctor.name}</h3>
                        <p className="doctor-specialization">{doctor.specialization}</p>
                    </div>
                </div>

                <div className="doctor-card-body">
                    <div className="doctor-detail">
                        <MapPin size={16} />
                        <span>{doctor.clinicAddress || 'Location not specified'}</span>
                    </div>
                    <div className="doctor-detail">
                        <Clock size={16} />
                        <span>{doctor.consultationDuration || 30} min consultation</span>
                    </div>
                </div>

                <div className="doctor-card-footer">
                    {doctor.rating && (
                        <div className="doctor-rating">
                            <Star size={16} fill="var(--warning-400)" />
                            <span>{doctor.rating}</span>
                        </div>
                    )}
                    <Button size="sm">Book Appointment</Button>
                </div>
            </Link>
        </Card>
    );
};

export default DoctorList;
