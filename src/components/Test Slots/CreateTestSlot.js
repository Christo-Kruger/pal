import React, { useState } from 'react';
import axios from 'axios';
import "../../styles/CreateTestSlot.css"

const CreateTestSlot = () => {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    campus: '',
    capacity: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Received token:', token); // Add this line
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
        campus: '',
        capacity: '',
      });
    } catch (error) {
      alert('Error creating test slot.');
    }
  };
  
  return (
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
          <label htmlFor="campus">Campus:</label>
          <select 
            id="campus"
            name="campus" 
            value={formData.campus} 
            onChange={handleChange}>
            <option value="">Select Campus</option>
            <option value="Bundang">Bundang</option>
            <option value="Dongtan">Dongtan</option>
            <option value="Suji">Suji</option>
          </select>
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
  );
};

export default CreateTestSlot;
