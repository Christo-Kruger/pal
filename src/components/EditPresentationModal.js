import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthHeader } from "../utils/auth";
import Modal from "react-modal";
import "./CreatePresentationModal.css";
import { toast } from 'react-toastify'; // Import toastify

function EditPresentationModal({ isOpen, onRequestClose, onPresentationUpdated, presentationToEdit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (presentationToEdit) {
      setName(presentationToEdit.name);
      setDescription(presentationToEdit.description);
      setLocation(presentationToEdit.location);
      
      // Format date and time for input fields
      const presentationDate = new Date(presentationToEdit.date);
      setDate(presentationDate.toISOString().split('T')[0]);
      setTime(presentationDate.toTimeString().split(' ')[0].slice(0, 5));
    }
  }, [presentationToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedPresentation = {
      name,
      description,
      location,
      date,
      time,
    };

    const backendURL = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await axios.put(`${backendURL}/api/presentations/${presentationToEdit._id}`, updatedPresentation, getAuthHeader());

      if (response.status === 200) {
        toast.success('Presentation updated successfully'); // Success toast
        onPresentationUpdated(response.data);
        onRequestClose();
      } else {
        toast.error('Failed to update presentation'); // Error toast
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update presentation'); // Error toast
    }
  };

    return (

  <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
    <h2>Edit Presentation</h2>
    <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>
          Time:
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </label>
        <button type="submit">Update Presentation</button>
    </form>
</Modal>

    );
}
export default EditPresentationModal;