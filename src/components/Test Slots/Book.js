import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getAuthHeader,
  getUserRole,
  getAttendedPresentation,
} from "../../utils/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/BookSlots.css";
import { FaClock, FaSchool } from "react-icons/fa";

const TimeSlotCard = ({ timeSlot, onBook, selectedChildId }) => {
  const handleBook = () => {
    if (!selectedChildId) {
      toast.error("Please select a child before booking.");
      return;
    }
    onBook(timeSlot._id, selectedChildId);
  };

  return (
    <div className="time-slot-card">
      <h5><FaSchool /> {timeSlot.campus + " Campus"}</h5>
      <p><FaClock /> Date: {new Date(timeSlot.date).toLocaleDateString()}</p>
      <p>Start: {timeSlot.startTime} - End: {timeSlot.endTime}</p>
      <button className="book-button" onClick={handleBook}>Book</button>
    </div>
  );
};

const TimeSlotList = ({ onClose }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [isEligibleForBooking, setIsEligibleForBooking] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(""); // To filter by campus

  useEffect(() => {
    fetchTimeSlots();
    fetchChildren();
    determineUserEligibility();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${backendURL}/api/timeSlots`);
      
      // Sort by date
      const sortedSlots = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setTimeSlots(sortedSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const fetchChildren = async () => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const headersObj = getAuthHeader();
      const response = await axios.get(`${backendURL}/api/child`, headersObj);
      console.log(response.data);
      setChildren(response.data);
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const determineUserEligibility = () => {
    const userRole = getUserRole();
    const attendedPresentation = getAttendedPresentation();

    if (userRole === "parent" && attendedPresentation === true) {
      setIsEligibleForBooking(true);
    } else {
      setIsEligibleForBooking(false);
    }
  };

  const checkExistingBookingForChild = async (childId) => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const headersObj = getAuthHeader();
      const response = await axios.get(
        `${backendURL}/api/bookings/child/${childId}`,
        headersObj
      );
      if (response.data && response.data.length) {
        return true; // Booking exists
      }
      return false; // No booking exists
    } catch (error) {
      console.error("Error checking for child's bookings:", error);
      return false;
    }
  };

  const handleBookSlot = async (slotId, childId) => {
    if (!isEligibleForBooking) {
      toast.error("You are not eligible for booking at this time.");
      return;
    }

    

    const alreadyBooked = await checkExistingBookingForChild(childId);
    if (alreadyBooked) {
      toast.error("This child is already booked for a test slot.");
      return;
    }

    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const headersObj = getAuthHeader();

      if (!headersObj || !headersObj.headers) {
        console.error("No token in local storage");
        return;
      }

      const response = await axios.post(
        `${backendURL}/api/bookings`,
        { testSlotId: slotId, childId: childId },
        headersObj
      );

      if (response.status === 201) {
        toast.success("Booking successfully made! SMS sent."); // Updated message
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error(error);
      toast.error("There was an error making your booking. Please try again.");
    }
  };

  return (
    <div className="time-slot-list">
      <h1>Booking Time Slots</h1>

      {/* Filter Section */}
      <div className="filters">
        <div className="filter child-selection">
          <label htmlFor="childSelect">Child:</label>
          <select
            id="childSelect"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            <option value="">Select...</option>
            {children.map((child) => (
              <option key={child._id} value={child._id}>{child.name}</option>
            ))}
          </select>
        </div>

        <div className="filter campus-selection">
          <label htmlFor="campusSelect">Campus:</label>
          <select
            id="campusSelect"
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
          >
            <option value="">All</option>
            {["Bundang", "Dongtan", "Suji"].map((campus) => (
              <option key={campus} value={campus}>{campus}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Time Slot Cards */}
      <div className="slot-cards">
        {timeSlots.length ? (
          timeSlots
            .filter(slot => !selectedCampus || slot.campus === selectedCampus)
            .map((slot) => (
              <TimeSlotCard key={slot._id} timeSlot={slot} onBook={handleBookSlot} selectedChildId={selectedChildId} />
            ))
        ) : (
          <p className="no-slots">No available time slots at the moment. Please check back later.</p>
        )}
      </div>
    </div>
  );
};


export default TimeSlotList;
