import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

const UpdateTestSlot = ({ testSlotId: timeSlotid, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    campus: "",
    capacity: "",
  });

  useEffect(() => {
    const fetchTestSlot = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/timeSlots/${timeSlotid}`
        );
        setFormData(response.data);
      } catch (error) {
        alert("Error fetching test slot.");
      }
    };
    fetchTestSlot();
  }, [timeSlotid]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/timeSlots/${timeSlotid}`,
        formData
      );
      onClose(); // Close the modal on successful update
      onUpdated(); // Notify the parent (TestSlotList) that the update was successful
    } catch (error) {
      alert("Error updating test slot.");
    }
  };

  return (
    <div>
      <Modal
        isOpen={true}
        onRequestClose={onClose}
        contentLabel="Update Test Slot"
      >
        <h2>Update Test Slot</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Campus:</label>
            <select
              name="campus"
              value={formData.campus}
              onChange={handleChange}
            >
              <option value="Suji">Suji</option>
              <option value="Dongtan">Dongtan</option>
              <option value="Bundang">Bundang</option>
            </select>
          </div>
          <div>
            <label>Capacity:</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Update Slot</button>
        </form>
      </Modal>
    
    </div>
  );
};

export default UpdateTestSlot;
