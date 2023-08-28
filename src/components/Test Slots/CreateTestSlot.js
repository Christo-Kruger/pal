import React, { useState } from 'react';
import axios from 'axios';
import "../../styles/CreateTestSlot.css"
import Modal from 'react-modal';

const CreateTestSlot = ({ isOpen, onRequestClose }) => {
  // Fetching the userCampus and userRole from localStorage
  const userCampus = localStorage.getItem('userCampus') || '';
  const userRole = localStorage.getItem('userRole') || ''; // Assuming you store user role in localStorage

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    testGrade: '',
    campus: userCampus, // Setting the initial value of campus based on user's campus
    capacity: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/timeSlots`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Test slot created successfully!');
      // Clear form fields after successful creation
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        testGrade: '',
        campus: userCampus,
        capacity: '',
      });
    } catch (error) {
      alert('Error creating test slot.');
    }
  };
  
  
  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Create Test Slot"
    className="testslot-modal"
    overlayClassName="overlay"
  >
    <div className="form-container">
      <h2>Create Test Slot</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="label-input-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="label-input-group">
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="label-input-group">
          <label htmlFor="endTime">End Time:</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="label-input-group">
          <label htmlFor="testGrade">Age Group:</label>
          <select 
            id="testGrade"
            name="testGrade" 
            value={formData.testGrade} 
            onChange={handleChange}>
                <option value="">Select Grade</option>
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
        </div>
        <div className="label-input-group">
            <label htmlFor="campus">Campus:</label>
            {userRole !== 'superadmin' ? (
              <input 
                type="text"
                id="campus"
                name="campus"
                value={formData.campus}
                readOnly
              />
            ) : (
              <select 
                id="campus"
                name="campus" 
                value={formData.campus} 
                onChange={handleChange}
              >
                <option value="">Select Campus</option>
                <option value="Bundang">Bundang</option>
                <option value="Dongtan">Dongtan</option>
                <option value="Suji">Suji</option>
              </select>
            )}
          </div>
        
        <div className="label-input-group">
          <label htmlFor="capacity">Capacity:</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit">Create Slot</button>
      </form>
    </div>
  </Modal>
  );
};

export default CreateTestSlot;
