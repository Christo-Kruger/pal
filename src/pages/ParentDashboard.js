import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { MdFileDownload } from "react-icons/md";
import Book from "../components/Test Slots/Book";
import BookPresentationModal from "../components/BookPresentationModal";
import EditBookingModal from "../components/EditBookingModal";
import axios from "axios";
import { getUserId, getAuthHeader, getAuthToken } from "../utils/auth";
import "./ParentDashboard.css";
import ChangeTimeSlotModal from "../components/ChangeTimeSlotModal";

import { MdError } from "react-icons/md";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function ParentDashboard() {
  const [activeModal, setActiveModal] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [presentations, setPresentations] = useState([]);
  const [error, setError] = useState(null);
  const [myPresentations, setMyPresentations] = useState([]);
  const [childData, setChildData] = useState([]);


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

  const handleCancelPresentation = async (presentationId) => {
    const userId = getUserId();
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.delete(
        `${backendURL}/api/presentations/parent/${presentationId}/attendees/${userId}`,
        getAuthHeader()
      );

      if (response.status === 200) {
        // update the myPresentations state
        setMyPresentations((prevPresentations) =>
          prevPresentations.filter(
            (presentation) => presentation._id !== presentationId
          )
        );
        toast.success("Booking successfully cancelled.");
      } else {
        toast.error("Error cancelling booking.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Error cancelling booking.");
    }
  };

  const fetchMyPresentations = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const userId = getUserId();
    const token = getAuthToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
  
    const [presentationResponse, childrenResponse] = await Promise.all([
      axios.get(`${backendURL}/api/presentations/myBookings`, config),
      axios.get(`${backendURL}/api/users/${userId}/children`, config),
    ]);
  
    if (
      presentationResponse.status === 200 &&
      childrenResponse.status === 200
    ) {
      const myChildren = childrenResponse.data;
      setChildData(myChildren); // update childData state variable
  
      const presentationsWithChildName = presentationResponse.data.map(
        (presentation) => {
          const childrenInSameAgeGroup = myChildren.filter(
            (child) => child.ageGroup === presentation.ageGroup
          );
          const childNames = childrenInSameAgeGroup
            .map((child) => child.name)
            .join(", ");
          const childTestGrades = childrenInSameAgeGroup
            .map((child) => child.testGrade)
            .join(", ");
          return { ...presentation, childName: childNames, testGrade: childTestGrades, oldSlotId: presentation.timeSlots[0]._id, };
        }
      );
      setMyPresentations(presentationsWithChildName);
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

  const handleTimeSlotChange = (presentationId) => {
    const presentation = myPresentations.find((p) => p._id === presentationId);
    setEditingBooking(presentation);
    setActiveModal("changeTimeSlot");
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
            <div
              key={booking._id}
              className="booking-card"
              style={{ backgroundColor: "#f0f0f0", border: "2px solid #ccc" }}
            >
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
            <div
              key={presentation._id}
              className="presentation-card"
              style={{ backgroundColor: "#e0f7fa", border: "2px " }}
            >
              <h3>{presentation.name}</h3>
              <p>Location: {presentation.location}</p>
              <p>Child: {presentation.childName}</p>
              <p>Test Grade: {presentation.testGrade}</p>
              <p>Date: {new Date(presentation.date).toLocaleDateString()}</p>
              <p>
                Start Time:{" "}
                {new Date(
                  presentation.timeSlots[0].startTime
                ).toLocaleTimeString()}
              </p>
              <div className="booking-actions">
              <button
    className="button-bookings"
    onClick={() => handleTimeSlotChange(presentation._id)}
  >
    Change Time Slot
  </button>
                <button
                  className="button-bookings"
                  onClick={() =>
                    handleCancelPresentation(presentation._id /* attendeeId */)
                  }
                >
                  Cancel
                </button>
                {new Date(presentation.date) - new Date() <=
                  2 * 24 * 60 * 60 * 1000 && (
                  <button
                    className="button-bookings"
                    onClick={() => downloadQRCode()}
                    aria-label="Download QR Code"
                  >
                    <MdFileDownload /> Download QR
                  </button>
                )}
              </div>
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
            childData={childData}
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

{activeModal === "changeTimeSlot" && (
   <ChangeTimeSlotModal
   closeModal={closeModal}
   presentationId={editingBooking._id}
   oldSlotId={editingBooking.oldSlotId}
   onTimeSlotChanged={fetchMyPresentations}
/>
  
    )}
      </Modal>
    </div>
  );
}

export default ParentDashboard;
