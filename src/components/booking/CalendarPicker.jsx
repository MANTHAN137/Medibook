// Calendar Date Picker Component
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, startOfWeek, endOfWeek } from 'date-fns';
import './CalendarPicker.css';

const CalendarPicker = ({
    selectedDate,
    onSelectDate,
    minDate = new Date(),
    maxDate,
    disabledDates = [],
    workingDays = [1, 2, 3, 4, 5, 6] // Monday to Saturday by default
}) => {
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const isDateDisabled = (date) => {
        // Check if before min date
        if (minDate && isBefore(date, new Date(minDate.setHours(0, 0, 0, 0)))) return true;

        // Check if after max date
        if (maxDate && isAfter(date, maxDate)) return true;

        // Check if not a working day
        if (!workingDays.includes(date.getDay())) return true;

        // Check if in disabled dates list
        if (disabledDates.some(d => isSameDay(d, date))) return true;

        return false;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleDateClick = (date) => {
        if (!isDateDisabled(date)) {
            onSelectDate(date);
        }
    };

    return (
        <div className="calendar-picker">
            <div className="calendar-header">
                <button className="calendar-nav" onClick={handlePrevMonth}>
                    <ChevronLeft size={20} />
                </button>
                <h3 className="calendar-month">{format(currentMonth, 'MMMM yyyy')}</h3>
                <button className="calendar-nav" onClick={handleNextMonth}>
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="calendar-weekdays">
                {weekDays.map((day) => (
                    <div key={day} className="calendar-weekday">{day}</div>
                ))}
            </div>

            <div className="calendar-days">
                {days.map((day, index) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isDisabled = isDateDisabled(day);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <button
                            key={index}
                            className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''} ${isToday ? 'today' : ''}`}
                            onClick={() => handleDateClick(day)}
                            disabled={isDisabled || !isCurrentMonth}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarPicker;
