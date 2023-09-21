import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

const UpdatePresentationModal = ({
  presentationId,
  isOpen,
  onRequestClose,
  onUpdated,
}) => {
  const [presentation, setPresentation] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    const fetchPresentation = async () => {
      if (!presentationId) {
        console.error("Invalid presentationId:", presentationId);
        return; // Exit early
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/presentations/${presentationId}`
        );
        const fetchedPresentation = response.data;
        setPresentation(fetchedPresentation);
        setTimeSlots(fetchedPresentation.timeSlots);
      } catch (error) {
        toast.error("Error fetching presentation.");
      }
    };

    fetchPresentation();
  }, [presentationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPresentation((prevPresentation) => ({
      ...prevPresentation,
      [name]: value,
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...timeSlots];
    if (field === "startTime" || field === "endTime") {
      const [hours, minutes] = value.split(":");
      const newDate = new Date(newTimeSlots[index][field]);
      newDate.setUTCHours(parseInt(hours) - 9, parseInt(minutes)); // Convert input (KST) back to UTC
      newTimeSlots[index][field] = newDate.toISOString();
    } else {
      newTimeSlots[index][field] = value;
    }
    setTimeSlots(newTimeSlots);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedPresentation = { ...presentation, timeSlots };
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/presentations/${presentationId}`,
        updatedPresentation
      );
      toast.success("Presentation updated successfully!");
      onRequestClose();

      // Call onUpdated prop after updating the presentation
      if (typeof onUpdated === "function") {
        onUpdated();
      }
    } catch (error) {
      toast.error("Error updating presentation.");
    }
  };

  if (!presentation) {
    return null;
  }

  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    date.setHours(date.getUTCHours() + 9); // Convert to KST
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Update Presentation"
    >
      <h2>Update Presentation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={presentation.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={presentation.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={presentation.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={presentation.date.slice(0, 10)} // assuming date is a string in YYYY-MM-DDTHH:mm:ss.sssZ format
            onChange={handleChange}
            required
          />
        </div>

        {timeSlots.map((slot, index) => {
          const formattedStartTime = formatTime(slot.startTime);
          const formattedEndTime = formatTime(slot.endTime);

          return (
            <div key={index}>
              <label>Time Slot {index + 1}</label>
              <div>
                <label>Start Time:</label>
                <input
                  type="time"
                  value={formattedStartTime}
                  onChange={(e) =>
                    handleTimeSlotChange(index, "startTime", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label>End Time:</label>
                <input
                  type="time"
                  value={formattedEndTime}
                  onChange={(e) =>
                    handleTimeSlotChange(index, "endTime", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label>Max Attendees:</label>
                <input
                  type="number"
                  value={slot.maxAttendees}
                  onChange={(e) =>
                    handleTimeSlotChange(index, "maxAttendees", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          );
        })}

        <button type="submit">Update Presentation</button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </Modal>
  );
};

export default UpdatePresentationModal;
