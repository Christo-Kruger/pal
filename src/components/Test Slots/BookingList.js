import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthHeader} from "../../utils/auth";
import SendSmsModal from "../../components/SendSmsModal";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState([]);
  const [smsMode, setSmsMode] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState([]);

  const [userCampus, setUserCampus] = useState('');
  const [userRole, setUserRole] = useState('');

  function handleSelectBookingChange(event, item) {
    switch (event.target.value) {
      case "cancel":
        if (window.confirm("Are you sure you want to cancel this record?")) {
          handleBookingCancel(item._id);
        }
        break;
      case "paid":
        if (window.confirm("Are you sure you want to mark this as paid?")) {
          handleBookingPayment(item._id);
        }
        break;
      case "sms":
        setSelectedPhoneNumbers((prevPhoneNumber) => [
          ...prevPhoneNumber,
          item.parent.phone,
        ]);
        setSmsMode(true); // Open SMS modal
        break;
      default:
        break;
    }
  }

    //To cancel Booking
    const handleBookingCancel = async (id) => {
        try {
          const backendURL = process.env.REACT_APP_BACKEND_URL;
          const response = await axios.delete(
            `${backendURL}/api/bookings/admin/delete/${id}`,
            getAuthHeader()
          );
    
          if (response.status === 200) {
            const updatedBookings = bookings.filter(
              (booking) => booking._id !== id
            );
            setBookings(updatedBookings);
            toast.success("Booking successfully cancelled.");
          } else {
            console.log("Error deleting booking");
            toast.error("Error deleting booking.");
          }
        } catch (error) {
          console.error(error);
          toast.error("Operation failed.");
        }
      };
//Update Payment
      const handleBookingPayment = async (id) => {
        try {
          const backendURL = process.env.REACT_APP_BACKEND_URL;
          const response = await axios.patch(
            `${backendURL}/api/bookings/payment/${id}`,
            {},
            getAuthHeader()
          );
    
          if (response.status === 200) {
            const updatedBookings = bookings.map((booking) =>
              booking._id === id ? { ...booking, paid: true } : booking
            );
            setBookings(updatedBookings);
            toast.success("Booking marked as paid.");
          } else {
            console.log("Error updating booking");
            toast.error("Error updating booking.");
          }
        } catch (error) {
          console.log("Error updating booking:", error);
          toast.error(`Error updating the booking. ${error.message}`);
        }
      };
    

      useEffect(() => {
        // Step 2: Populate states from localStorage
        setUserCampus(localStorage.getItem("userCampus"));
        setUserRole(localStorage.getItem("userRole")); // Assuming you store userRole in localStorage. If not, this will need to be fetched or set up another way.
    
        const fetchBookings = async () => {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/bookings`
            );
    
            // Step 3: Filter bookings based on the user's role and campus
            if (userRole === "superadmin") {
              setBookings(response.data); // Show all bookings if superadmin
            } else {
              const filteredBookings = response.data.filter((booking) =>
                booking.testSlot && booking.testSlot.campus === userCampus
              );
              setBookings(filteredBookings); // Show only bookings of the user's campus if not superadmin
    
            }
          } catch (error) {
            console.log("Error fetching bookings:", error);
          }
        };
    
        fetchBookings();
      }, [userCampus, userRole]);

  return (
    <div>
              <SendSmsModal
        key={smsMode}
        isOpen={smsMode}
        onRequestClose={() => {
          setSmsMode(false);
          setSelectedPhoneNumbers([]);  // Add these two lines
          setSelectedAttendees([]);  // to clear the selected phone numbers and attendees
        }}
        phoneNumber={
          selectedPhoneNumbers.length > 0 ? selectedPhoneNumbers[0] : ""
        }
        phoneNumbers={[
          ...selectedPhoneNumbers,
          ...selectedAttendees.map((attendee) => attendee.phone),
        ]}
      />
      <h2>Booking List</h2>
      <table>
        <thead>
          <tr>
            <th>Child</th>
            <th>Test Grade</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Campus</th>
            <th>Test Slot</th>
            <th>Date</th>
            <th>Parent Number</th>
            <th>Actions</th>
            <th>Paid</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.child && booking.child.name}</td>
              <td>{booking.child && booking.child.testGrade}</td>
              <td>{booking.child && new Date(booking.child.dateOfBirth).toLocaleDateString()}</td>
              <td>{booking.child && booking.child.gender}</td>
              <td>{booking.testSlot && booking.testSlot.campus}</td>
              <td>
                {booking.testSlot &&
                  `${booking.testSlot.startTime} - ${booking.testSlot.endTime}`}
              </td>

              <td>{booking.testSlot && new Date(booking.testSlot.date).toLocaleDateString()}</td>

              <td>{booking.parent && booking.parent.phone}</td>
              <td>
              <select
                      onChange={(e) => handleSelectBookingChange(e, booking)}
                    >
                      <option value="">Select an action</option>
                      <option value="cancel">Cancel</option>
                      <option value="paid">Paid</option>
                      <option value="sms">Send SMS</option>
                    </select>
              </td>
              <td>{booking && booking.paid ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;
