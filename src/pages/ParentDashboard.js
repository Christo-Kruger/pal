import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import BookingForm from "../components/BookingForm";
import BookPresentationModal from "../components/BookPresentationModal";
import EditBookingModal from "../components/EditBookingModal"; // Import the new EditBookingModal
import axios from "axios";
import { getUserId, getAuthHeader } from "../utils/auth";
import "./ParentDashboard.css";
import { Trash2, Edit } from "react-feather";



function ParentDashboard() {
  const [bookingModal, setBookingModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingPresentation, setBookingPresentation] = useState(false);
  const [presentations, setPresentations] = useState([]);

  const fetchBookings = async () => {
    try {
      const backendURL = "http://localhost:9000";
      const response = await axios.get(
        `${backendURL}/api/bookings?userId=${getUserId()}`,
        getAuthHeader()
      );

      if (response.status === 200) {
        setBookings(response.data);
      } else {
        console.log("Error fetching bookings");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [bookingModal, bookingPresentation]); // re-fetch bookings whenever bookingMode changes

  useEffect(() => {
    // Fetch presentations
    const fetchPresentations = async () => {
      const backendURL = "http://localhost:9000";
      const response = await axios.get(
        `${backendURL}/api/presentations`,
        getAuthHeader()
      );

      if (response.status === 200) {
        setPresentations(response.data);
      } else {
        console.log("Error fetching presentations");
      }
    };

    fetchPresentations();
  }, []);

  const closeModal = () => {
    setBookingModal(false);
    setBookingPresentation(false);
    setEditingBooking(null); // Reset the editingBooking state when the modal is closed
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        // Make a request to delete the booking with the given id
        const backendURL = "http://localhost:9000";
        const response = await axios.delete(
          `${backendURL}/api/bookings/${id}`,
          getAuthHeader()
        );

        if (response.status === 200) {
          // If the delete request is successful, update the bookings state by removing the deleted booking
          setBookings((prevBookings) =>
            prevBookings.filter((booking) => booking._id !== id)
          );
        } else {
          console.log("Error deleting booking");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (booking) => {
    // Set the booking to be edited
    setEditingBooking(booking);
    // Open the modal
    setBookingModal(true);
  };

  // Check if there are no bookings
  const isEmptyState = bookings.length === 0;

  return (
    <div className="dashboard-container">
      <h1 className="header-text">What would you like to do?</h1>
      <div className="button-container">
        <button className="button" onClick={() => setBookingModal(true)}>
          Book a Test
        </button>
        <button className="button" onClick={() => !bookingPresentation && setBookingPresentation(true)}>
  Book Presentation
</button>
      </div>
      {isEmptyState ? (
        <p className="no-booking">
          No bookings found. Book a test or presentation now!
        </p>
      ) : (
        <div className="card-container">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <h3>{booking.child.name}</h3>
              <p>Previous School: {booking.child.previousSchool}</p>
              <p>Age: {booking.child.age}</p>
              <p>Campus: {booking.campus}</p>
              <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
              <p>Time: {booking.time}</p>
              <div className="booking-actions">
                <div
                  className="booking-action-icon"
                  onClick={() => handleDelete(booking._id)}
                >
                  <Trash2 size={24} color="black" />
                </div>
                <div
                  className="booking-action-icon"
                  onClick={() => handleEdit(booking)}
                >
                  <Edit size={24} color="black" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div id="bookTestModal">
      <Modal
        isOpen={bookingModal}
        onRequestClose={closeModal}
        contentLabel="Booking Form"
      >
        {editingBooking ? (
          <EditBookingModal
            closeModal={closeModal}
            booking={editingBooking}
            onBookingUpdated={fetchBookings}
          />
        ) : (
          <BookingForm closeModal={closeModal} />
        )}
      </Modal>

      <Modal
        isOpen={bookingPresentation}
        onRequestClose={closeModal}
        contentLabel="Book Presentation Form"
      >
        <BookPresentationModal
          presentations={presentations}
          closeModal={closeModal}
          onBookingCreated={fetchBookings}
        />
      </Modal>
    </div>
    </div>
  );
}
export default ParentDashboard;