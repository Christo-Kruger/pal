import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserId, getUserName, getAuthHeader } from "../utils/auth";
import { toast } from "react-toastify"; // Import toastify

function BookingForm({ closeModal }) {
  const [childName, setChildName] = useState("");
  const [previousSchool, setPreviousSchool] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [campus, setCampus] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookingCount, setBookingCount] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState("");

  const fetchBookingCount = async () => {
    if (campus && date && time) {
      try {
        const backendURL = process.env.REACT_APP_BACKEND_URL;
        const response = await axios.get(
          `${backendURL}/api/bookings/count?date=${date}T${time}&campus=${campus}`,
          getAuthHeader()
        );
        setBookingCount(response.data.count);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch booking count"); // Error toast
      }
    } else {
      setBookingCount(null);
    }
  };

  useEffect(() => {
    fetchBookingCount();
  }, [campus, date, time]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parentId = getUserId();
    const parentName = getUserName();

    if (!parentId || !parentName) {
      toast.error("Error getting user information"); // Error toast
      return;
    }

    const bookingData = {
      child: {
        name: childName,
        previousSchool,
        age,
        gender,
        dateOfBirth,
      },
      parent: {
        _id: parentId,
        name: parentName,
      },
      campus,
      date,
      time,
    };

    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(
        `${backendURL}/api/bookings`,
        bookingData,
        getAuthHeader()
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Booking successful"); // Success toast
        closeModal(); // close the modal
      } else {
        toast.error("Booking failed"); // Error toast
      }
    } catch (error) {
      console.error(error);
      toast.error("Booking failed"); // Error toast
    }
  };

  return (
    <div>
      <h2>Booking Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Child's Name:
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            required
          />
        </label>
        <label>
          Child's Gender:
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">--Please choose an option--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label>
          Child's Date of Birth:
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </label>
        <label>
          Previous School: <p>If no previous school write N/A</p>
          <input
            type="text"
            value={previousSchool}
            onChange={(e) => setPreviousSchool(e.target.value)}
            required
          />
        </label>
        <label>
          Test Type:
          <select value={age} onChange={(e) => setAge(e.target.value)} required>
            <option value="">--Please choose an option--</option>
            <option value="5 Year Old">5 Year Old</option>
            <option value="6 Year Old">6 Year Old</option>
            <option value="7 Year Old">7 Year Old</option>
            <option value="1st Grade">1st Grade</option>
            <option value="2nd Grade">2nd Grade</option>
            <option value="3rd Grade">3rd Grade</option>
            <option value="4th Grade">4th Grade</option>
            <option value="5th Grade">5th Grade</option>
            <option value="6th Grade">6th Grade</option>
            <option value="7th Grade">7th Grade</option>
            <option value="8th Grade">8th Grade</option>
          </select>
        </label>
        <label>
          Campus:
          <select
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            required
          >
            <option value="">--Please choose an option--</option>
            <option value="Suji">Suji</option>
            <option value="Dongtan">Dongtan</option>
            <option value="Bundang">Bundang</option>
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          Time:
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          >
            <option value="">--Please choose an option--</option>
            <option value="14:30">14:30</option>
            <option value="15:30">15:30</option>
            <option value="16:30">16:30</option>
            <option value="17:30">17:30</option>
            <option value="18:30">18:30</option>
            <option value="19:30">19:30</option>
            <option value="20:30">20:30</option>
            <option value="21:30">21:30</option>
          </select>
        </label>
        {bookingCount !== null && (
          <p className="count">Current bookings: {bookingCount}/10</p>
        )}
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default BookingForm;
