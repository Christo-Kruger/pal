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
        setPresentation(response.data);
      } catch (error) {
        toast.error("Error fetching presentation.");
      }
    };

    fetchPresentation();
  }, [presentationId]);

  const handleChange = (e) => {
    setPresentation({ ...presentation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/presentations/${presentationId}`,
        presentation
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
            value={presentation.date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Presentation</button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </Modal>
  );
};

export default UpdatePresentationModal;
