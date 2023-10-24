import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserId, getAuthHeader } from "../../utils/auth";
import TimeSlotList from "../Test Slots/TimeSlotList";
import MyTestBooking from "./MyTestBooking";

const useFetchBookings = (childData, setNewBooking) => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!childData) {
      setError("Child data is null");
      return;
    }

    const fetchData = async () => {
      try {
        const backendURL = process.env.REACT_APP_BACKEND_URL;
        const response = await axios.get(
          `${backendURL}/api/bookings/parent?userId=${getUserId()}`,
          getAuthHeader()
        );
        
        if (response.status === 200) {
          const filteredBookings = response.data.filter(
            (booking) => booking.child && booking.child._id === childData._id
          );
  
          setBookings(filteredBookings);
          if (filteredBookings.length > 0) {
            setNewBooking(true);
          }
        } else {
          setError("Error fetching bookings");
        }
      } catch (e) {
        setError(`Error fetching bookings: ${e.message}`);
      }
    };
  
    fetchData();
  }, [childData, setNewBooking]);

  return { bookings, error };
};

const TestBooking = ({ childData }) => {
  const [newBooking, setNewBooking] = useState(false);
  const { bookings, error } = useFetchBookings(childData, setNewBooking);
  const [myBookings, setBookings] = useState(bookings);

  if (!childData) {
    return <div>Please contact JLee for help.</div>;
  }

  return (
    <div>
      <div>
      <h1 style={{ flex: "1",display: "flex", justifyContent:"center",alignItems:"center", borderBottom:"1px solid lightgray",}}>Entrance Tests</h1>
      </div>
      {error && <div>Error: {error}</div>}
      {newBooking ? (
        <MyTestBooking bookings={bookings}
        childData={childData} />
      ) : (
        <TimeSlotList childData={childData} />
      )}
    </div>
  );
};

export default TestBooking;
