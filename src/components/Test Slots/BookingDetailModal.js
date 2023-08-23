import React from "react";
import '../../styles/BookingDetailModal.css';


const BookingDetailModal = ({ isOpen, booking, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Booking Details</h2>
        {booking && (
          <div>
            <p>
              <strong>Child:</strong>{" "}
              {booking.child ? booking.child.name : "No Name"}
            </p>
            <p>
         
            <strong>Test:</strong> {booking.child ? booking.child.testGrade : "No Name"}
            </p>
            <p>
              <strong>Date:</strong> {new Date (booking.testSlot.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Start Time:</strong> {booking.testSlot.startTime}
            </p>
            <p>
              <strong>End Time:</strong> {booking.testSlot.endTime}
            </p>
            <p>
            <strong>Fee:</strong> {booking.price ? `₩${new Intl.NumberFormat('ko-KR').format(booking.price)}` : "N/A"}


            </p>
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BookingDetailModal;
