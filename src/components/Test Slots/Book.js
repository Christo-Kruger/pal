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
      toast.error("예약 전 아동을 ​​선택해주세요.");
      return;
    }
    onBook(timeSlot._id, selectedChildId);
  };

  return (
    <div className="time-slot-card">
      <h5>
        <FaSchool /> {timeSlot.campus + " 캠퍼스"}
      </h5>
      <p>
        <FaClock />날짜: {new Date(timeSlot.date).toLocaleDateString()}
      </p>
      <p>
      시작: {timeSlot.startTime} - End: {timeSlot.endTime}
      </p>
      <button className="book-button" onClick={handleBook}>
      책
      </button>
    </div>
  );
};

const TimeSlotList = ({ onClose }) => {
  const userCampus = localStorage.getItem("userCampus");

  const [timeSlots, setTimeSlots] = useState([]);
  const [isEligibleForBooking, setIsEligibleForBooking] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(userCampus); // Defaults to userCampus

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
      const sortedSlots = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
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

      // Set the first child's ID as the default selected child
      if (response.data.length > 0) {
        setSelectedChildId(response.data[0]._id);
      }
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
      toast.error("지금은 예약할 수 없습니다.");
      return;
    }

    const alreadyBooked = await checkExistingBookingForChild(childId);
    if (alreadyBooked) {
      toast.error("이 아이는 이미 시험 시간을 예약했습니다.");
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

      if (response.data && response.data._id) {
        toast.success("예약이 성공적으로 완료되었습니다! SMS가 전송되었습니다.");
        onClose();
      }
    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.data === "This test slot is fully booked."
      ) {
        toast.error(
          "이 테스트 슬롯은 예약이 꽉 찼습니다. 다른 슬롯을 선택하세요."
        );
      } 
    }
  };
  return (
    <div className="time-slot-list">
      <h1>
      테스트 예약</h1>

      {/* Filter Section */}
      <div className="filters">
        <div className="filter child-selection">
          <label htmlFor="childSelect">어린이:</label>
          <select
            id="childSelect"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            {children.map((child) => (
              <option key={child._id} value={child._id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Time Slot Cards */}
      <div className="slot-cards">
        {timeSlots.length ? (
          timeSlots
            .filter((slot) => slot.campus === selectedCampus)
            .map((slot) => (
              <TimeSlotCard
                key={slot._id}
                timeSlot={slot}
                onBook={handleBookSlot}
                selectedChildId={selectedChildId}
              />
            ))
        ) : (
          <p className="no-slots">
           현재 이용 가능한 시간대가 없습니다. 나중에 다시 확인해 주세요.
          </p>
        )}
      </div>
    </div>
  );
};

export default TimeSlotList;
