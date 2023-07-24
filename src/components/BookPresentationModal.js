import React, { useState } from "react";
import axios from "axios";
import {
  getAuthHeader,
  getUserId,
  getUserName,
  getUserPhone,
  getUserCampus,
} from "../utils/auth";
import { toast } from "react-toastify"; // Import Toastify

import "./BookPresentationModal.css";

function BookPresentationModal({
  presentations,
  closeModal,
  onBookingCreated,
}) {
  const [expandedCards, setExpandedCards] = useState([]);

  const handleBooking = async (presentationId) => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;

    // Define the attendee object based on the current user's details
    const attendee = {
      _id: getUserId(),
      name: getUserName(),
      phone: getUserPhone(),
      campus: getUserCampus(),
    };

    try {
      const response = await axios.patch(
        `${backendURL}/api/presentations/${presentationId}/attendees`,
        { attendee }, // Pass the attendee object in the request body
        getAuthHeader()
      );

      if (response.status === 200) {
        onBookingCreated(response.data);
        closeModal();
        toast.success("Booking was successful!"); // Display the success toast
      }
    } catch (err) {
      // Handle error from the server
      if (err.response.data.message === "User has already booked this presentation") {
        toast.warn("You have already booked a slot for this presentation."); // Warning toast
      } else {
        console.log("Error booking presentation:", err.response.data.message);
        toast.error("Error booking presentation"); // Error toast
      }
    }
  };


  const toggleExpandCard = (presentationId) => {
    setExpandedCards((prevExpandedCards) => {
      if (prevExpandedCards.includes(presentationId)) {
        return prevExpandedCards.filter((id) => id !== presentationId);
      } else {
        return [...prevExpandedCards, presentationId];
      }
    });
  };

  return (
    <>
      <div className="modal-header">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        <h2>Book Presentation</h2>
      </div>
      <div className="presentation-grid">
        {presentations.map((presentation) => (
          <div
            key={presentation._id}
            className={`presentation-card ${
              expandedCards.includes(presentation._id) ? "expanded" : ""
            }`}
          >
            <h3>{presentation.name}</h3>
            <p>
              {expandedCards.includes(presentation._id)
                ? presentation.description
                : presentation.description.substring(0, 100) + "..."}
            </p>
            {presentation.description.length > 100 && (
              <span
                className="view-more"
                onClick={() => toggleExpandCard(presentation._id)}
              >
                {expandedCards.includes(presentation._id)
                  ? "View Less"
                  : "View More"}
              </span>
            )}
            <p>{presentation.location}</p>
            <p>Booked Slots: {presentation.attendees.length}</p>

            <p>Available Slots: {presentation.availableSlots}</p>
            <button
              onClick={() => handleBooking(presentation._id)}
              disabled={
                presentation.attendees.length === presentation.maxAttendees
              }
            >
              Book Presentation
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default BookPresentationModal;
