import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { MdFileDownload } from "react-icons/md";
import Book from "../components/Test Slots/Book";
import BookPresentationModal from "../components/BookPresentationModal";
import EditBookingModal from "../components/EditBookingModal";
import axios from "axios";
import { getUserId, getAuthHeader } from "../utils/auth";
import "./ParentDashboard.css";
import { Trash2, Edit } from "react-feather";
import { MdError } from "react-icons/md";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

function ParentDashboard() {
  const [activeModal, setActiveModal] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [presentations, setPresentations] = useState([]);
  const [error, setError] = useState(null);
  const [myPresentations, setMyPresentations] = useState([]);

  const fetchBookings = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const response = await axios.get(
      `${backendURL}/api/bookings/parent?userId=${getUserId()}`,
      getAuthHeader()
    );

    if (response.status === 200) {
      setBookings(response.data);
    } else {
      setError("Error fetching bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [bookings.length]);
  

  const fetchMyPresentations = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const response = await axios.get(
      `${backendURL}/api/presentations/myBookings`,
      getAuthHeader()
    );

    if (response.status === 200) {
      setMyPresentations(response.data);
    } else {
      setError("Error fetching my presentations");
    }
  };


  useEffect(() => {
    fetchMyPresentations();
  }, [myPresentations.length]);
 
  useEffect(() => {
    const fetchPresentations = async () => {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.get(
        `${backendURL}/api/presentations`,
        getAuthHeader()
      );

      if (response.status === 200) {
        setPresentations(response.data);
      } else {
        setError("Error fetching presentations");
      }
    };

    fetchPresentations();
  }, []);

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.delete(
        `${backendURL}/api/bookings/${id}`,
        getAuthHeader()
      );

      if (response.status === 200) {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== id)
        );
        toast.success("Booking successfully deleted.");
      } else {
        toast.error("Error deleting booking.");
      }
    }
  };



  const isEmptyState = bookings.length === 0;

  const downloadQRCode = async () => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const userId = getUserId();
      const response = await fetch(`${backendURL}/api/users/${userId}/qrcode`);
      const qrCodePDFBlob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(qrCodePDFBlob);
      link.download = "qrcode.pdf"; // Change the file name to .pdf
      link.click();

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading QR code PDF:", error);
      toast.error("Error downloading QR code PDF.");
    }
  };

  return (
    <div className="dashboard-container">
      {error && (
        <p className="error-message" role="alert">
          <MdError /> {error}
        </p>
      )}
  
      <h1 className="header"> Welcome to J Lee Parent Booking Portal</h1>
      <h4 className="header-text">What would you like to do?</h4>
  
      <div className="button-containerPD">
        <button
          className="button"
          onClick={() => setActiveModal("booking")}
          aria-label="Book a Test"
        >
          Book a Test
        </button>
        <button
          className="button"
          onClick={() => setActiveModal("presentation")}
          aria-label="Book Presentation"
        >
          Book Presentation
        </button>

        <Link to="/add-child">
    <button className="button" aria-label="Add Child">
      Add Child
    </button>
  </Link>
      </div>
  
      {isEmptyState && myPresentations.length === 0 ? (
        <p className="no-booking">
          No bookings found. Book a test or presentation now!
        </p>
      ) : (
        <div className="card-container">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card" style={{backgroundColor: '#f0f0f0', border: '2px solid #ccc'}}>
              <h3>{booking.child.name}</h3>
              <p>Previous School: {booking.child.previousSchool}</p>
              <p>Test Grade: {booking.child.testGrade}</p>
              <p>Campus: {booking?.testSlot?.campus}</p>
              <p>
                Date: {new Date(booking?.testSlot?.date).toLocaleDateString()}
              </p>
              <p>Time: {booking?.testSlot?.startTime}</p>
              <div className="booking-actions">
                <button
                  className="button"
                  onClick={() => handleDelete(booking._id)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
  
          {myPresentations.map((presentation) => (
             <div key={presentation._id} className="presentation-card" style={{backgroundColor: '#e0f7fa', border: '2px '}}>
              <h3>{presentation.name}</h3>
              <p>Location: {presentation.location}</p>
              <p>
                Date: {new Date(presentation.date).toLocaleDateString()}
              </p>
              {presentation.timeSlots.map((timeSlot, index) => (
                <div key={index}>
                  <p>
                    Start Time:{" "}
                    {new Date(timeSlot.startTime).toLocaleTimeString()}
                  </p>
                  <p>
                    End Time: {new Date(timeSlot.endTime).toLocaleTimeString()}
                  </p>
                </div>
              ))}
        {new Date(presentation.date) - new Date() <= 2 * 24 * 60 * 60 * 1000 && (
          <button
            className="button"
            onClick={() => downloadQRCode()}
            aria-label="Download QR Code"
          >
            <MdFileDownload /> Download QR
          </button>
        )}
      </div>
          ))}
        </div>
      )}
  
      <Modal
        isOpen={activeModal !== null}
        onRequestClose={closeModal}
        contentLabel="Dynamic Modal"
      >
        {activeModal === "booking" && <Book closeModal={closeModal} />}
        {activeModal === "presentation" && (
          <BookPresentationModal
            presentations={presentations}
            closeModal={closeModal}
            onBookingCreated={fetchBookings}
          />
        )}
        {activeModal === "editBooking" && (
          <EditBookingModal
            closeModal={closeModal}
            booking={editingBooking}
            onBookingUpdated={fetchBookings}
          />
        )}
      </Modal>
    </div>
  );  
}

export default ParentDashboard;
