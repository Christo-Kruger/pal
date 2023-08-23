import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthHeader, getUserId } from "../utils/auth";
import { toast } from "react-toastify";
import moment from "moment";
import { MdDateRange, MdPlace, MdAccessTime } from "react-icons/md"; // icons for date, place, and time

import "./BookPresentationModal.css";

function BookPresentationModal({
  presentations,
  closeModal,
  onBookingCreated,
}) {
  const [expandedPresentation, setExpandedPresentation] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Add fetch presentations function here to get updates every 5 seconds
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleBooking = async (presentationId, slotId) => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await axios.patch(
        `${backendURL}/api/presentations/${presentationId}/slots/${slotId}/attendees`,
        {},
        getAuthHeader()
      );

      if (response.status === 200) {
        onBookingCreated(response.data);
        closeModal();
        toast.success("Booking was successful!");
      }
    } catch (err) {
      toast.error(err.response.data.message || "You've already booked!");
    }
  };

  const toggleExpandCard = (presentationId) => {
    if (expandedPresentation === presentationId) {
      setExpandedPresentation(null);
    } else {
      setExpandedPresentation(presentationId);
    }
  };

  return (
    <>
      <div className="modal-header">
        <h1>Book Presentation</h1>
        <button className="close-button" onClick={closeModal}>
          &times; {/* This is the "x" symbol */}
        </button>
      </div>
      <div className="presentation-grid">
        {presentations.map((presentation) => (
          <div
            key={presentation._id}
            className={`presentation-card ${
              expandedPresentation === presentation._id ? "expanded" : ""
            }`}
          >
            <h3>{presentation.name}</h3>
            <div className="presentation-meta">
              <span>
                <MdDateRange />{" "}
                {new Date(presentation.date).toLocaleDateString()}
              </span>
              <span>
                <MdPlace /> {presentation.location}
              </span>
            </div>
            <p>
              {expandedPresentation === presentation._id
                ? presentation.description
                : `${presentation.description.substring(0, 100)}...`}
            </p>
            {presentation.description.length > 100 && (
              <button
                className="view-more"
                onClick={() => toggleExpandCard(presentation._id)}
              >
                {expandedPresentation === presentation._id
                  ? "View Less"
                  : "View More"}
              </button>
            )}
            <h4>
              <MdAccessTime /> Time Slots:
            </h4>
            <div className="time-slots">
              {presentation.timeSlots ? (
                presentation.timeSlots.map((slot) => {
                  const userHasBooked = slot.attendees.includes(getUserId());
                  return (
                    <div key={slot._id} className="time-slot">
                      <div className="slot-time">
                        {moment(slot.startTime).format("HH:mm")} -{" "}
                        {moment(slot.endTime).format("HH:mm")}
                      </div>
                      <div className="slot-info">
                        <span>Available: {slot.availableSlots}</span>
                        <button
                          onClick={() =>
                            handleBooking(presentation._id, slot._id)
                          }
                          disabled={
                            slot.attendees.length >= slot.maxAttendees ||
                            userHasBooked
                          }
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No time slots available for this presentation.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default BookPresentationModal;
