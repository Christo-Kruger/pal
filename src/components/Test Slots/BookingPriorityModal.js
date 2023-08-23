import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../../styles/BookingPriorityModal.css';  // Let's assume you have this CSS file for styling

const BookingPriorityModal = ({ isOpen, onRequestClose }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");  // State for feedback message

  const handleSubmit = async () => {
    try {
        const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(`${backendURL}/api/bookingPriority`, { 
        priorityStart: startTime,
        priorityEnd: endTime
      });
  
      if (response.data) {
        setMessage('Booking priority times set successfully!'); // Show feedback inline
        setTimeout(onRequestClose, 2000); // Close the modal after 2 seconds
      }
    } catch (error) {
      setMessage('Failed to set booking priority times. Please try again.'); // Show error inline
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Booking Priority Modal"
      className="priority-modal"
      overlayClassName="overlay"
    >
      <div className="modal-header">
        <h2>Set Booking Priority Times</h2>
        <button className="close-button" onClick={onRequestClose}>&times;</button>
      </div>

      <div className="modal-body">
        <label>
          Start Time:
          <input 
            type="datetime-local" 
            value={startTime} 
            onChange={e => setStartTime(e.target.value)} 
          />
        </label>
        <label>
          End Time:
          <input 
            type="datetime-local" 
            value={endTime} 
            onChange={e => setEndTime(e.target.value)} 
          />
        </label>
      </div>

      {message && <div className="modal-message">{message}</div>}

      <div className="modal-footer">
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </Modal>
  );
}

export default BookingPriorityModal;
