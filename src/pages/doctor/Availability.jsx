// Availability Management Page
import { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { blockSlot, unblockSlot, getAllBlockedSlots } from '../../firebase/services';
import { TIME_SLOTS, BLOCK_REASON_PRESETS } from '../../utils/constants';
import { formatDate, parseTimestamp } from '../../utils/dateUtils';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import CalendarPicker from '../../components/booking/CalendarPicker';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal, { ModalFooter } from '../../components/common/Modal';
import { Select } from '../../components/common/Input';
import toast from 'react-hot-toast';
import './Availability.css';

const Availability = () => {
    const { doctorData } = useAuth();
    const doctorId = doctorData?.id || 'demo';

    const [selectedDate, setSelectedDate] = useState(null);
    const [blockedSlots, setBlockedSlots] = useState([]);
    const [allBlockedSlots, setAllBlockedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [blockReason, setBlockReason] = useState('');

    // Demo blocked slots
    const demoBlockedSlots = [
        { id: 'bs1', date: new Date(), timeSlot: '01:00 PM', reason: 'Lunch Break' },
        { id: 'bs2', date: new Date(), timeSlot: '01:30 PM', reason: 'Lunch Break' },
    ];

    useEffect(() => {
        if (doctorId !== 'demo') {
            fetchAllBlockedSlots();
        } else {
            setAllBlockedSlots(demoBlockedSlots);
        }
    }, [doctorId]);

    useEffect(() => {
        if (selectedDate) {
            filterBlockedSlotsForDate();
        }
    }, [selectedDate, allBlockedSlots]);

    const fetchAllBlockedSlots = async () => {
        try {
            const slots = await getAllBlockedSlots(doctorId);
            setAllBlockedSlots(slots);
        } catch (error) {
            console.error('Error fetching blocked slots:', error);
        }
    };

    const filterBlockedSlotsForDate = () => {
        const dateStr = selectedDate.toDateString();
        const filtered = allBlockedSlots.filter(slot => {
            const slotDate = parseTimestamp(slot.date);
            return slotDate?.toDateString() === dateStr;
        });
        setBlockedSlots(filtered);
    };

    const handleSlotToggle = (slot) => {
        setSelectedSlots(prev =>
            prev.includes(slot)
                ? prev.filter(s => s !== slot)
                : [...prev, slot]
        );
    };

    const handleBlockSlots = async () => {
        if (selectedSlots.length === 0) {
            toast.error('Please select at least one time slot');
            return;
        }

        setLoading(true);

        try {
            if (doctorId === 'demo') {
                // Demo mode
                const newBlocked = selectedSlots.map((slot, index) => ({
                    id: `demo-${Date.now()}-${index}`,
                    date: selectedDate,
                    timeSlot: slot,
                    reason: blockReason
                }));
                setAllBlockedSlots(prev => [...prev, ...newBlocked]);
                toast.success(`Blocked ${selectedSlots.length} slot(s)`);
            } else {
                // Real mode
                for (const slot of selectedSlots) {
                    await blockSlot(doctorId, selectedDate, slot, blockReason);
                }
                await fetchAllBlockedSlots();
                toast.success(`Blocked ${selectedSlots.length} slot(s)`);
            }

            setShowBlockModal(false);
            setSelectedSlots([]);
            setBlockReason('');
        } catch (error) {
            console.error('Error blocking slots:', error);
            toast.error('Failed to block slots');
        } finally {
            setLoading(false);
        }
    };

    const handleUnblockSlot = async (slotId) => {
        try {
            if (doctorId === 'demo') {
                setAllBlockedSlots(prev => prev.filter(s => s.id !== slotId));
                toast.success('Slot unblocked');
            } else {
                await unblockSlot(slotId);
                await fetchAllBlockedSlots();
                toast.success('Slot unblocked');
            }
        } catch (error) {
            console.error('Error unblocking slot:', error);
            toast.error('Failed to unblock slot');
        }
    };

    const getSlotStatus = (slot) => {
        return blockedSlots.some(bs => bs.timeSlot === slot) ? 'blocked' : 'available';
    };

    return (
        <DoctorLayout>
            <div className="availability-page">
                <div className="page-header">
                    <h1>Manage Availability</h1>
                    <p>Block or unblock time slots for appointments</p>
                </div>

                <div className="availability-layout">
                    {/* Calendar Section */}
                    <Card className="calendar-section">
                        <h3>Select Date</h3>
                        <CalendarPicker
                            selectedDate={selectedDate}
                            onSelectDate={setSelectedDate}
                        />
                    </Card>

                    {/* Slots Section */}
                    <Card className="slots-section">
                        {selectedDate ? (
                            <>
                                <div className="slots-header">
                                    <div>
                                        <h3>Time Slots</h3>
                                        <p>{formatDate(selectedDate, 'EEEE, MMMM dd, yyyy')}</p>
                                    </div>
                                    <Button
                                        icon={Plus}
                                        onClick={() => setShowBlockModal(true)}
                                    >
                                        Block Slots
                                    </Button>
                                </div>

                                <div className="slots-grid">
                                    {TIME_SLOTS.map(slot => {
                                        const status = getSlotStatus(slot);
                                        const blockedInfo = blockedSlots.find(bs => bs.timeSlot === slot);

                                        return (
                                            <div
                                                key={slot}
                                                className={`slot-item ${status}`}
                                            >
                                                <div className="slot-time">
                                                    <Clock size={14} />
                                                    <span>{slot}</span>
                                                </div>
                                                {status === 'blocked' && (
                                                    <>
                                                        {blockedInfo?.reason && (
                                                            <span className="slot-reason">{blockedInfo.reason}</span>
                                                        )}
                                                        <button
                                                            className="slot-unblock"
                                                            onClick={() => handleUnblockSlot(blockedInfo.id)}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="slots-legend">
                                    <div className="legend-item">
                                        <span className="legend-dot available"></span>
                                        <span>Available</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot blocked"></span>
                                        <span>Blocked</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="select-date-prompt">
                                <Calendar size={48} />
                                <h3>Select a Date</h3>
                                <p>Choose a date from the calendar to view and manage time slots</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* All Blocked Slots */}
                <Card className="all-blocked-section">
                    <h3>Upcoming Blocked Slots</h3>
                    {allBlockedSlots.length > 0 ? (
                        <div className="blocked-list">
                            {allBlockedSlots
                                .filter(slot => {
                                    const slotDate = parseTimestamp(slot.date);
                                    return slotDate >= new Date();
                                })
                                .slice(0, 10)
                                .map(slot => {
                                    const slotDate = parseTimestamp(slot.date);
                                    return (
                                        <div key={slot.id} className="blocked-item">
                                            <div className="blocked-info">
                                                <span className="blocked-date">{formatDate(slotDate, 'MMM dd')}</span>
                                                <span className="blocked-time">{slot.timeSlot}</span>
                                                {slot.reason && <span className="blocked-reason">{slot.reason}</span>}
                                            </div>
                                            <button
                                                className="blocked-remove"
                                                onClick={() => handleUnblockSlot(slot.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        <p className="no-blocked">No upcoming blocked slots</p>
                    )}
                </Card>
            </div>

            {/* Block Slots Modal */}
            <Modal
                isOpen={showBlockModal}
                onClose={() => {
                    setShowBlockModal(false);
                    setSelectedSlots([]);
                    setBlockReason('');
                }}
                title="Block Time Slots"
                size="md"
            >
                <div className="block-modal-content">
                    <p className="block-date">
                        Date: <strong>{selectedDate && formatDate(selectedDate, 'EEEE, MMMM dd, yyyy')}</strong>
                    </p>

                    <div className="block-reason-select">
                        <Select
                            label="Reason (Optional)"
                            value={blockReason}
                            onChange={(e) => setBlockReason(e.target.value)}
                            placeholder="Select a reason"
                            options={BLOCK_REASON_PRESETS}
                        />
                    </div>

                    <div className="block-slots-grid">
                        <label className="block-slots-label">Select Slots to Block</label>
                        <div className="slots-checkbox-grid">
                            {TIME_SLOTS.filter(slot => getSlotStatus(slot) !== 'blocked').map(slot => (
                                <label key={slot} className="slot-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedSlots.includes(slot)}
                                        onChange={() => handleSlotToggle(slot)}
                                    />
                                    <span>{slot}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {selectedSlots.length > 0 && (
                        <p className="selected-count">
                            {selectedSlots.length} slot{selectedSlots.length !== 1 ? 's' : ''} selected
                        </p>
                    )}
                </div>

                <ModalFooter>
                    <Button variant="ghost" onClick={() => setShowBlockModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleBlockSlots}
                        loading={loading}
                        disabled={selectedSlots.length === 0}
                    >
                        Block Selected
                    </Button>
                </ModalFooter>
            </Modal>
        </DoctorLayout>
    );
};

export default Availability;
