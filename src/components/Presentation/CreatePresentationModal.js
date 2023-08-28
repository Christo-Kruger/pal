import React, { useState } from 'react';
import axios from 'axios';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import "../../styles/CreatePresentationModal.css"

const CreatePresentationModal = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    timeSlots: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleAddTimeSlot = () => {
    setFormData((prevData) => ({
      ...prevData,
      timeSlots: [...prevData.timeSlots, { startTime: '', endTime: '', maxAttendees: '' }],
    }));
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData((prevData) => {
      const updatedTimeSlots = [...prevData.timeSlots];
      updatedTimeSlots.splice(index, 1);
      return { ...prevData, timeSlots: updatedTimeSlots };
    });
  };

  const handleTimeSlotChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedTimeSlots = [...prevData.timeSlots];
      updatedTimeSlots[index][field] = value;
      return { ...prevData, timeSlots: updatedTimeSlots };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert time strings to full date objects before sending
    const updatedTimeSlots = formData.timeSlots.map(slot => {
        const startTime = new Date(`${formData.date}T${slot.startTime}`);
        const endTime = new Date(`${formData.date}T${slot.endTime}`);
        return {
            ...slot,
            startTime,
            endTime
        };
    });

    const updatedFormData = {
        ...formData,
        timeSlots: updatedTimeSlots
    };

    try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/presentations`, updatedFormData);
        toast.success('Presentation created successfully!');
        onRequestClose();
    } catch (error) {
        toast.error('Error creating presentation.');
    }
};


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create Presentation"
      className="presentation-modal"
      overlayClassName="overlay"
    >
      <div className="modal-header">
        <h2>Create Presentation</h2>
        <button className="close-button" onClick={onRequestClose}>&times;</button>
      </div>
      <div className="scrollable-content">
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
  <label>Description:</label>
  <textarea 
    className="description-box"
    name="description"
    value={formData.description}
    onChange={handleChange}
    required
  />
</div>
        <div className="input-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <label>Time Slots:</label>
        {formData.timeSlots.map((timeSlot, index) => (
          <div key={index} className="timeslot-group">
            <div>
              <label>Start:</label>
              <input
                type="time"
                value={timeSlot.startTime}
                onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                required
              />
            </div>
            <div>
              <label>End:</label>
              <input
                type="time"
                value={timeSlot.endTime}
                onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                required
              />
            </div>
            <div>
              <label>Max Attendees:</label>
              <input
                type="number"
                placeholder="Max Attendees"
                value={timeSlot.maxAttendees}
                onChange={(e) => handleTimeSlotChange(index, 'maxAttendees', e.target.value)}
                required
              />
            </div>
            <button type="button" className="remove-slot-btn" onClick={() => handleRemoveTimeSlot(index)}>X</button>
          </div>
        ))}
       <button type="button" className="add-slot-btn" onClick={handleAddTimeSlot}>Add Time Slot</button>
        
        <button type="submit" className="submit-btn">Create Presentation</button>
      </form>
      </div>
      
    </Modal>
  );
};

export default CreatePresentationModal;
