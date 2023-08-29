import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthHeader, getUserId } from "../utils/auth";
import { toast } from "react-toastify";


function ChangeTimeSlotModal({ closeModal, presentationId, oldSlotId, onTimeSlotChanged }) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const fetchTimeSlots = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const response = await axios.get(
      `${backendURL}/api/presentations/${presentationId}/timeSlots`,
      getAuthHeader()
    );

    if (response.status === 200) {
      setTimeSlots(response.data);
    } else {
      console.error("Error fetching time slots");
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, [presentationId]);

  const handleChangeTimeSlot = async () => {
    if (!selectedTimeSlot) {
      console.error("No time slot selected");
      return;
    }
  
    const oldTime = timeSlots.find(slot => slot._id === oldSlotId)?.startTime;
    const newTime = timeSlots.find(slot => slot._id === selectedTimeSlot)?.startTime;
  
    const confirmChange = window.confirm(`Are you sure you want to change the timeslot from ${new Date(oldTime).toLocaleTimeString()} to ${new Date(newTime).toLocaleTimeString()}?`);
  
    if (!confirmChange) {
      return;
    }
  
    const backendURL = process.env.REACT_APP_BACKEND_URL;
  
    // Get the userId from the auth.js
    const userId = getUserId();
  
    const response = await axios.patch(
      `${backendURL}/api/presentations/${presentationId}/changeSlot`,
      { userId, oldSlotId, newSlotId: selectedTimeSlot },
      getAuthHeader()
    );
  
    if (response.status === 200) {
      toast.success("Timeslot successfully changed.");
      closeModal();
      onTimeSlotChanged();
    } else {
      console.error("Error changing time slot");
      toast.error("Error changing timeslot.");
    }
  };
  
  

  return (
    <div className="change-time-slot-modal">
      <h2>Change Time Slot</h2>
      <select
        value={selectedTimeSlot}
        onChange={(e) => setSelectedTimeSlot(e.target.value)}
      >
        <option value="">Select a new time slot</option>
        {timeSlots.map((timeSlot) => (
          <option key={timeSlot._id} value={timeSlot._id}>
            {new Date(timeSlot.startTime).toLocaleTimeString()}
          </option>
        ))}
      </select>
      <button onClick={handleChangeTimeSlot}>Change Time Slot</button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  );
}

export default ChangeTimeSlotModal;
