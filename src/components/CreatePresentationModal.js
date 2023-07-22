import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthHeader } from "../utils/auth";
import Modal from "react-modal";
import "./CreatePresentationModal.css";


function CreatePresentationModal({ isOpen, onRequestClose, onPresentationCreated,  editingPresentation  }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    console.log("Editing Presentation Data:", editingPresentation);
    if (editingPresentation) {
      setName(editingPresentation.name);
      setDescription(editingPresentation.description);
      setLocation(editingPresentation.location);
      setDate(editingPresentation.date);
      setTime(editingPresentation.time);
    } else {
      setName("");
      setDescription("");
      setLocation("");
      setDate("");
      setTime("");
    }
  }, [editingPresentation]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newPresentation = {
      name,
      description,
      location,
      date,
      time,
      attendees: [], // starts with an empty array
    };

    const backendURL = "http://localhost:9000";
    const response = await axios.post(`${backendURL}/api/presentations`, newPresentation, getAuthHeader());

    if (response.status === 201) { // Status should be 201 for creation
      onPresentationCreated(response.data);
      onRequestClose();
    } else {
      console.log("Error creating presentation");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Create Presentation</h2>
      <form onSubmit={handleSubmit}>
        {/* Additional fields for name and location */}
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
        <button type="submit">Create Presentation</button>
      </form>
    </Modal>
  );
}

export default CreatePresentationModal;
