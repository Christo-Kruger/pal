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
  getUserId,
  getUserRole,
  getAttendedPresentation,
} from "../../utils/auth";
import "react-toastify/dist/ReactToastify.css";
import MyTestBooking from "../Parents/MyTestBooking";


const ChangeTest = ({ onClose, childData, bookingId }) => {
  const userCampus = localStorage.getItem("userCampus");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEligibleForBooking, setIsEligibleForBooking] = useState(false);
  const [childHasBooking, setChildHasBooking] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [groupIsEligible, setGroupIsEligible] = useState(true);
  const child = childData


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
    if (selectedSlot) {
      updateBooking(selectedSlot.testSlotId, selectedSlot._id);
    }
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
  
  const updateBooking = async (testSlotId, timeSlotId) => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const user = getUserId();

  
      const response = await axios.patch(
        `${backendURL}/api/bookings/${bookingId}`,
        {
          testSlotId,
          timeSlotId,
          user,
        },
        {
  
        }
      );
      toast.success('Booking updated successfully.');
      onClose();  // Close the modal or navigate to another page
    } catch (error) {
      console.error('Error updating booking:', error.response?.data || error);
      toast.error('Error updating booking.');
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
        <p>아동 이름: {child.name}</p>
        <p>아동 학년: {child.testGrade}</p>
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
  
export default ChangeTest;
