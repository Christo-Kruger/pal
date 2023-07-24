import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthHeader, getUserRole } from "../utils/auth";
import CreatePresentationModal from "../components/CreatePresentationModal";
import SendSmsModal from "../components/SendSmsModal";
import "./AdminDashboard.css";
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [filteredCampus, setFilteredCampus] = useState("");
  const [filteredChildName, setFilteredChildName] = useState("");
  const [filteredAttendeeName, setFilteredAttendeeName] = useState("");
  const [filteredAttendeeCampus, setFilteredAttendeeCampus] = useState("");
  const [presentationMode, setPresentationMode] = useState(false);
  const [presentations, setPresentations] = useState([]);
  const [showBookings, setShowBookings] = useState(true);
  const [showPresentationsAttendees, setShowPresentationsAttendees] =
    useState(false);
  const [showPresentations, setShowPresentations] = useState(false);
  const [smsMode, setSmsMode] = useState(false);
  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);

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

  function handleSelectAttendeeeChange(event, item) {
    switch (event.target.value) {
      case "sms":
        if (item?.phone) {
          setSelectedPhoneNumbers((prevPhoneNumber) => [
            ...prevPhoneNumber,
            item.phone,
          ]);
          setSmsMode(true); // Open SMS modal
        }
        break;
      default:
        break;
    }
  }
  
  

  const handleSelectPresentationChange = (event, item) => {
    switch (event.target.value) {
      case "cancel":
        if (window.confirm("Are you sure you want to cancel this record?")) {
          handlePresentationCancel(item._id);
        }
        break;
      default:
        break;
    }
  };


  const fetchBookings = async () => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const userRole = getUserRole();

      if (userRole === "admin") {
        let url = `${backendURL}/api/bookings/admin`;

        if (filteredCampus || filteredChildName) {
          url += "?";

          if (filteredCampus) {
            url += `campus=${filteredCampus}&`;
          }

          if (filteredChildName) {
            url += `childName=${filteredChildName}&`;
          }

          url = url.slice(0, -1);
        }

        const response = await axios.get(url, getAuthHeader());

        if (response.status === 200) {
          setBookings(response.data);
        } else {
          console.log("Error fetching bookings");
        }
      } else {
        console.log("Access denied: User is not an admin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPresentations = async () => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const userRole = getUserRole();

      if (userRole === "admin") {
        let url = `${backendURL}/api/presentations/admin`;

        if (filteredAttendeeName || filteredAttendeeCampus) {
          url += "?";

          if (filteredAttendeeName) {
            url += `name=${filteredAttendeeName}&`;
          }

          if (filteredAttendeeCampus) {
            url += `campus=${filteredAttendeeCampus}&`;
          }

          url = url.slice(0, -1); // remove the last "&"
        }

        const response = await axios.get(url, getAuthHeader());

        if (response.status === 200) {
          setPresentations(response.data);
        } else {
          console.log("Error fetching presentations");
        }
      } else {
        console.log("Access denied: User is not an admin");
      }
    } catch (error) {
      console.error(error);
    }
  };

// To cancel Presentation
const handlePresentationCancel = async (id) => {
  try {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const response = await axios.delete(
      `${backendURL}/api/presentations/admin/delete/${id}`,
      getAuthHeader()
    );

    if (response.status === 200) {
      const updatedPresentations = presentations.filter(
        (presentation) => presentation._id !== id
      );
      setPresentations(updatedPresentations);
      toast.success("Presentation successfully cancelled.");
    } else {
      console.log("Error deleting presentation");
      toast.error("Error deleting presentation.");
    }
  } catch (error) {
    console.error(error);
    toast.error("Operation failed.");
  }
};


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
          booking._id === id ? { ...booking, confirmed: true } : booking
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

  const handlePresentationCreated = (newPresentation) => {
    setPresentations((prevPresentations) => [
      ...prevPresentations,
      newPresentation,
    ]);
  };

  useEffect(() => {
    fetchBookings();
    fetchPresentations();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="nav-button-container">
        <button
          className="nav-button"
          onClick={() => setPresentationMode(true)}
        >
          Create a Presentation
        </button>
        <button
          className="nav-button"
          onClick={() => {
            setShowBookings(true);
            setShowPresentationsAttendees(false);
            setShowPresentations(false);
          }}
        >
          Show Test Bookings
        </button>
        <button
          className="nav-button"
          onClick={() => {
            setShowBookings(false);
            setShowPresentationsAttendees(true);
            setShowPresentations(false);
          }}
        >
          Show Presentations Attendees
        </button>
        <button
          className="nav-button"
          onClick={() => {
            setShowBookings(false);
            setShowPresentationsAttendees(false);
            setShowPresentations(true);
          }}
        >
          Manage Presentations
        </button>
      </div>
      <CreatePresentationModal
        isOpen={presentationMode}
        onRequestClose={() => setPresentationMode(false)}
        onPresentationCreated={handlePresentationCreated}
      />
    <SendSmsModal
  isOpen={smsMode}
  onRequestClose={() => setSmsMode(false)}
  phoneNumber={selectedPhoneNumbers.length > 0 ? selectedPhoneNumbers[0] : ""}
  phoneNumbers={[
    ...selectedPhoneNumbers,
    ...selectedAttendees.map((attendee) => attendee.phone),
  ]}
/>


      {showBookings && (
        <div>
          <h2>Booked Tests</h2>
          <div className="filter-container">
            <label className="filter-label">
              Filter by Campus:
              <select
                className="filter-select"
                value={filteredCampus}
                onChange={(e) => setFilteredCampus(e.target.value)}
              >
                <option value="">All</option>
                <option value="Suji">Suji</option>
                <option value="Dongtan">Dongtan</option>
                <option value="Bundang">Bundang</option>
              </select>
            </label>
            <label className="filter-label">
              Filter by Name:
              <input
                className="filter-input"
                type="text"
                value={filteredChildName}
                onChange={(e) => setFilteredChildName(e.target.value)}
              />
            </label>
            <button className="filter-button" onClick={fetchBookings}>
              Apply Filters
            </button>
          </div>
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Child Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Campus</th>
                <th>Date</th>
                <th>Time</th>
                <th>Parent Name</th>
                <th>Parent Number</th>
                <th>Action</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.child.name}</td>
                  <td>{booking.child.age}</td>
                  <td>{booking.child.gender}</td>
                  <td>{booking.campus}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>{booking.time}</td>
                  <td>{booking.parent.name}</td>
                  <td>{booking.parent.phone}</td>
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
                  <td>{booking.confirmed ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPresentationsAttendees && (
        <div>
          <h2>Attendees</h2>
          <div className="nav-button-container">
          </div>
          <div className="filter-container">
            <label className="filter-label">
              Filter by Name:
              <input
                className="filter-input"
                type="text"
                value={filteredAttendeeName}
                onChange={(e) => setFilteredAttendeeName(e.target.value)}
              />
            </label>
            <label className="filter-label">
              Filter by Campus:
              <select
                className="filter-select"
                value={filteredAttendeeCampus}
                onChange={(e) => setFilteredAttendeeCampus(e.target.value)}
              >
                <option value="">All</option>
                <option value="Suji">Suji</option>
                <option value="Dongtan">Dongtan</option>
                <option value="Bundang">Bundang</option>
              </select>
            </label>
            <button className="filter-button" onClick={fetchPresentations}>
              Apply Filters
            </button>
          </div>
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Campus</th>
                <th>Presentation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
  {presentations.map((presentation) =>
    presentation.attendees
      .filter(
        (attendee) =>
          !filteredAttendeeName ||
          attendee.name
            .toLowerCase()
            .includes(filteredAttendeeName.toLowerCase())
      )
      .filter(
        (attendee) =>
          !filteredAttendeeCampus ||
          attendee.campus === filteredAttendeeCampus
      )
      .map((attendee) => (
        <tr key={attendee._id}>
          <td>{attendee.name}</td>
          <td>{attendee?.phone}</td>
          <td>{attendee.campus}</td>
          <td>{presentation.name}</td>
          <td>
            <select
              onChange={(e) => handleSelectAttendeeeChange(e, attendee)}
            >
              <option value="">Select an action</option>
              <option value="sms">Send SMS</option>
            </select>
          </td>
        </tr>
      ))
  )}
</tbody>

          </table>
        </div>
      )}
      {showPresentations && (
        <div>
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {presentations.map((presentation) => (
                <tr key={presentation._id}>
                  <td>{presentation.name}</td>

                  <td>
                    <select
                      onChange={(e) =>
                        handleSelectPresentationChange(e, presentation)
                      }
                    >
                      <option value="">Select an action</option>
                      <option value="cancel">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
