// Time Slot Picker Component
import { TIME_SLOT_GROUPS } from '../../utils/constants';
import { isSlotPast } from '../../utils/dateUtils';
import './TimeSlotPicker.css';

const TimeSlotPicker = ({
    selectedDate,
    selectedSlot,
    onSelectSlot,
    availableSlots = [],
    bookedSlots = [],
    blockedSlots = []
}) => {
    const getSlotStatus = (slot) => {
        if (blockedSlots.includes(slot)) return 'blocked';
        if (bookedSlots.includes(slot)) return 'booked';
        if (selectedDate && isSlotPast(selectedDate, slot)) return 'past';
        if (availableSlots.length > 0 && !availableSlots.includes(slot)) return 'unavailable';
        return 'available';
    };

    const handleSlotClick = (slot) => {
        const status = getSlotStatus(slot);
        if (status === 'available') {
            onSelectSlot(slot);
        }
    };

    const renderSlotGroup = (title, slots) => (
        <div className="slot-group">
            <h4 className="slot-group-title">{title}</h4>
            <div className="slot-grid">
                {slots.map((slot) => {
                    const status = getSlotStatus(slot);
                    const isSelected = selectedSlot === slot;

                    return (
                        <button
                            key={slot}
                            className={`slot-btn ${status} ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSlotClick(slot)}
                            disabled={status !== 'available'}
                        >
                            {slot}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="time-slot-picker">
            {renderSlotGroup('Morning', TIME_SLOT_GROUPS.morning)}
            {renderSlotGroup('Afternoon', TIME_SLOT_GROUPS.afternoon)}
            {renderSlotGroup('Evening', TIME_SLOT_GROUPS.evening)}

            <div className="slot-legend">
                <div className="legend-item">
                    <span className="legend-dot available"></span>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot booked"></span>
                    <span>Booked</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot blocked"></span>
                    <span>Blocked</span>
                </div>
            </div>
        </div>
    );
};

export default TimeSlotPicker;
