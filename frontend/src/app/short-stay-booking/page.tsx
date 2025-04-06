'use client';
import React, { useState } from 'react';

const PRICE_PER_HOUR = 7500;
const SLOT_DURATION_HOURS = 2;
const START_HOUR = 9;
const END_HOUR = 17;

const generateStartTimes = (): string[] => {
  const times: string[] = [];
  for (let hour = START_HOUR; hour + SLOT_DURATION_HOURS <= END_HOUR; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    times.push(time);
  }
  return times;
};

const addHoursToTime = (time: string, hoursToAdd: number): string => {
  const [hourStr, minuteStr] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hourStr));
  date.setMinutes(parseInt(minuteStr));
  date.setHours(date.getHours() + hoursToAdd);
  return date.toTimeString().slice(0, 5); // Format: HH:MM
};

const AppointmentBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');

  const startTimes = generateStartTimes();
  const selectedEndTime = selectedStartTime ? addHoursToTime(selectedStartTime, SLOT_DURATION_HOURS) : '';

  const handleCheckout = () => {
    alert(`Booking confirmed!\n\nDate: ${selectedDate}\nTime: ${selectedStartTime} - ${selectedEndTime}\nPrice: $${PRICE_PER_HOUR * SLOT_DURATION_HOURS}`);
  };

  return (
    <div className="our_room">
      <div className="container">
      <div className="hotel-card">
      <h2 className="pageTitle mb-3">Book Short Stay</h2>
        <div className="hotel-card-body">
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Select a date:</label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedStartTime('');
              }}
            />
          </div>

          {selectedDate && (
            <div className="mb-3">
              <label htmlFor="startTime" className="form-label">Choose start time:</label>
              <select
                id="startTime"
                className="form-select"
                value={selectedStartTime}
                onChange={(e) => setSelectedStartTime(e.target.value)}
              >
                <option value="">-- Select start time --</option>
                {startTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {selectedStartTime && (
            <div className="border-top pt-3">
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Time:</strong> {selectedStartTime} - {selectedEndTime}</p>
              <p><strong>Duration:</strong> {SLOT_DURATION_HOURS} hours</p>
              <p><strong>Total Price:</strong> ₦{PRICE_PER_HOUR * SLOT_DURATION_HOURS}</p>
              <button className="book-btn mt-4" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          )}
      </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
