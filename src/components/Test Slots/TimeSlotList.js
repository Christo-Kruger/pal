import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {
  getAuthHeader,
  getUserRole,
  getAttendedPresentation,
} from "../../utils/auth";
import "react-toastify/dist/ReactToastify.css";
import MyTestBooking from "../Parents/MyTestBooking";


const TimeSlotList = ({ onClose, childData }) => {
  const userCampus = localStorage.getItem("userCampus");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEligibleForBooking, setIsEligibleForBooking] = useState(false);
  const [childHasBooking, setChildHasBooking] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [groupIsEligible, setGroupIsEligible] = useState(true);

  useEffect(() => {
    if (bookings.length > 0) {
      setChildHasBooking(true);
    } else {
      setChildHasBooking(false);
    }
  }, [bookings]);

  useEffect(() => {
    determineUserEligibility();
    if (childData) fetchTimeSlots(childData);
  }, [childData]);

  const handleBook = async (timeSlot) => {
    handleBookSlot(timeSlot.testSlotId, timeSlot._id, childData._id);
  };

  const determineUserEligibility = () => {
    const userRole = getUserRole();
    const attendedPresentation = getAttendedPresentation();
    if (userRole === "parent" && attendedPresentation === true ) {
      setIsEligibleForBooking(true);
    } else {
      setIsEligibleForBooking(false);
    }
  };

  const handleOpenDialog = (slot) => {
    setSelectedSlot(slot);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSlot(null);
  };

  const handleConfirmBook = () => {
    handleBook(selectedSlot);
    handleCloseDialog();
  };

  const fetchTimeSlots = async (childData) => {
    // Log
    console.log("Fetching time slots with parameters:", {
      group: childData.group, // Check if this value is what you expect
    });
  
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${backendURL}/api/timeSlots`, {
        params: {
          group: childData.group,
        },
      });

      // Check for group eligibility here
      if (response.data.length === 0) {
        setGroupIsEligible(false);  // Set group as not eligible
      } else {
        setGroupIsEligible(true);  // Set group as eligible
      }
    
      const sortedSlots = [];
      response.data.forEach((testSlot) => {
        testSlot.timeSlots.forEach((timeSlot) => {
          timeSlot.testSlotId = testSlot._id;
          timeSlot.date = testSlot.date;
          timeSlot.campus = testSlot.campus;
          timeSlot.title = testSlot.title;
          timeSlot.testGrade = testSlot.testGrade;
          sortedSlots.push(timeSlot);
        });
      });
    
      setTimeSlots(sortedSlots);
      // Log
      console.log("Time Slots:", sortedSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };
  
  
  const handleBookSlot = async (testSlotId, timeSlotId, childId) => {
    if (!isEligibleForBooking) {
      toast.error("지금은 예약할 수 없습니다.");
      return;
    }
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const headersObj = getAuthHeader();
      const response = await axios.post(
        `${backendURL}/api/bookings`,
        { testSlotId, timeSlotId, childId },
        headersObj
      );
      if (response.data && response.data.booking) {
        if (response.data.smsSent) {
          toast.success("예약이 성공적으로 완료되었습니다! SMS가 전송되었습니다.");
        } else {
          toast.warn("예약이 성공적으로 완료되었습니다! However, SMS sending failed.");
        }
        onClose();
      } else {
        toast.error("예약에 실패했습니다. 나중에 다시 시도하세요.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uniqueDates = [
    ...new Set(
      timeSlots.map((slot) => new Date(slot.date).toLocaleDateString())
    ),
  ];
  const filteredTimeSlots = timeSlots.filter(
    (slot) => new Date(slot.date).toLocaleDateString() === selectedDate
  );

  return (
    <div className="time-slot-list">
      {childHasBooking ? <MyTestBooking /> : null}
      <div className="child-data" style={{ background: "#eeeeee", display: "flex", justifyContent: "space-between" }}>
        <p>아동 이름: {childData.name}</p>
        <p>아동 학년: {childData.testGrade}</p>
      </div>
      <div className="date-selector">
        <select
          onChange={(e) => setSelectedDate(e.target.value)}
          value={selectedDate}
        >
          <option value="">
            Select a date
          </option>
          {uniqueDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"Confirm Booking"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to book this time slot?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmBook} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <div className="slot-cards">
        {groupIsEligible ? (
          filteredTimeSlots.length ? (
            filteredTimeSlots.map((slot) => (
              <button
                key={slot._id}
                className="book-button"
                onClick={() => handleOpenDialog(slot)}
                disabled={!isEligibleForBooking || slot.status === 'Fully Booked'}
              >
                {slot.status === 'Fully Booked' ? 'Fully Booked' : slot.startTime}
              </button>
            ))
          ) : (
            <p className="no-slots">No available time slots for this date.</p>
          )
        ) : (
          <p className="no-slots">No bookings available yet.</p>
        )}
      </div>
    </div>
  );
}
  
export default TimeSlotList;
