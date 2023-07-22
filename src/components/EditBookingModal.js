import React, { useState } from 'react';
import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

function EditBookingModal({ closeModal, booking, onBookingUpdated }) {
  const [childName, setChildName] = useState(booking.child.name);
  const [previousSchool, setPreviousSchool] = useState(booking.child.previousSchool);
  const [age, setAge] = useState(booking.child.age);
  const [campus, setCampus] = useState(booking.campus);
  const [date, setDate] = useState(booking.date);
  const [time, setTime] = useState(booking.time);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedBookingData = {
      child: {
        name: childName,
        previousSchool,
        age,
      },
      campus,
      date,
      time,
    };

    try {
      const backendURL = 'http://localhost:9000';
      const response = await axios.patch(
        `${backendURL}/api/bookings/${booking._id}`,
        updatedBookingData,
        getAuthHeader()
      );

      if (response.status === 200) {
        alert('Booking updated successfully');
        onBookingUpdated(); // Fetch updated bookings
        closeModal(); // Close the modal
      } else {
        alert('Failed to update booking');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update booking');
    }
  };

  return (
    <div>
      <h2>Edit Booking</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Child's Name:
          <input type="text" value={childName} onChange={(e) => setChildName(e.target.value)} required />
        </label>
        <label>
          Previous School:
          <input type="text" value={previousSchool} onChange={(e) => setPreviousSchool(e.target.value)} required />
        </label>
        <label>
          Test Type:
          <select value={age} onChange={(e) => setAge(e.target.value)} required>
            <option value="">--Please choose an option--</option>
            <option value="5 Year Old">5 Year Old</option>
            <option value="6 Year Old">6 Year Old</option>
            <option value="7 Year Old">7 Year Old</option>
            <option value="1st Grade">1st Grade</option>
            <option value="2nd Grade">2nd Grade</option>
            <option value="3rd Grade">3rd Grade</option>
            <option value="4th Grade">4th Grade</option>
            <option value="5th Grade">5th Grade</option>
            <option value="6th Grade">6th Grade</option>
            <option value="7th Grade">7th Grade</option>
            <option value="8th Grade">8th Grade</option>
          </select>
        </label>
        <label>
          Campus:
          <select value={campus} onChange={(e) => setCampus(e.target.value)} required>
            <option value="">--Please choose an option--</option>
            <option value="Suji">Suji</option>
            <option value="Dongtan">Dongtan</option>
            <option value="Bundang">Bundang</option>
          </select>
        </label>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>
          Time:
          <select value={time} onChange={(e) => setTime(e.target.value)} required>
            <option value="">--Please choose an option--</option>
            <option value="14:30">14:30</option>
            <option value="15:30">15:30</option>
            <option value="16:30">16:30</option>
            <option value="17:30">17:30</option>
            <option value="18:30">18:30</option>
            <option value="19:30">19:30</option>
            <option value="20:30">20:30</option>
            <option value="21:30">21:30</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default EditBookingModal;
