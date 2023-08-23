import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SimpleModal from './BookingDetailModal';


const localizer = momentLocalizer(moment);
const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}/api/bookings`;
const calendarStyle = { height: 500 };

const formatBookingToEvent = (booking) => {
  console.log("Booking's child:", booking.child);
  if (!booking.testSlot) {
    return null; // Return early if there's no testSlot
  }

  const startDate = new Date(booking.testSlot.date);
  const endDate = new Date(booking.testSlot.date);

  const [startHour, startMinute] = booking.testSlot.startTime.split(":");
  const [endHour, endMinute] = booking.testSlot.endTime.split(":");

  startDate.setHours(parseInt(startHour), parseInt(startMinute));
  endDate.setHours(parseInt(endHour), parseInt(endMinute));

  return {
    title: booking?.child ? booking?.child?.name : "No Name",
    start: startDate,
    end: endDate,
    resource: booking,
    desc: booking.child
      ? `Additional info: ${booking?.child?.gender || "No Gender"} ${
          booking?.child?.testGrade || "No TestGrade"
        }`
      : "No Child Data",
  };
};


const BookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(BACKEND_URL);
        console.log("Fetched Bookings:", response.data);
        const formattedBookings = response.data.map(formatBookingToEvent);
        setBookings(formattedBookings);
      } catch (error) {
        console.error(
          "Error fetching bookings:",
          error.response?.data || error.message
        );
        toast.error("Failed to fetch bookings.");
      }
    };
    fetchBookings();
  }, []);

  const handleEventClick = (event) => {
setSelectedBooking(event.resource);
console.log('Current selectedBooking after click:', selectedBooking);

    setModalIsOpen(true);
   };

  const closeModal = () => {
    setSelectedBooking(null);
    setModalIsOpen(false);
  };

  return (
    <div style={calendarStyle}>
      <Calendar
        localizer={localizer}
        events={bookings}
        startAccessor="start"
        endAccessor="end"
        style={calendarStyle}
        onSelectEvent={handleEventClick}
      />
      <SimpleModal
    isOpen={modalIsOpen}
    booking={selectedBooking}
    onClose={closeModal}
/>
    
    </div>
    
  );
};

export default BookingCalendar;
