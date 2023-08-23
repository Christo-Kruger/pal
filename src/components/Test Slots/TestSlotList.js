import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateTestSlot from "./UpdateTestSlot"; // Import the UpdateTestSlot component
import "./Timeslot.css";

const TestSlotList = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTestSlot, setSelectedTestSlot] = useState(null); // State variable to keep track of the selected test slot for editing

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/timeSlots/admin`
        );
        setTimeSlots(response.data);
      } catch (error) {
        toast.error("Error fetching test slots.");
      }
    };
    fetchTimeSlots();
  }, []);

  const handleEdit = (testSlot) => {
    setSelectedTestSlot(testSlot);
  };

  const handleUpdateModalClose = () => {
    setSelectedTestSlot(null);
  };

  const handleTestSlotUpdated = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/timeSlots/admin`
      );
      setTimeSlots(response.data);
      toast.success("Test slot list updated!");
    } catch (error) {
      toast.error("Error updating test slot list.");
    }
  };
  

  const handleDelete = async (testSlotId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/timeSlots/${testSlotId}`
      );
      setTimeSlots((prevTimeSlots) =>
        prevTimeSlots.filter((testSlot) => testSlot._id !== testSlotId)
      );
      toast.success("Test slot deleted successfully!");
    } catch (error) {
      toast.error("Error deleting test slot.");
    }
  };

  return (
    <div className="timeslots">
      <h2>Test Slot List</h2>
      <table>
        <thead>
          <tr>
            <th>Campus</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((testSlot) => (
            <tr key={testSlot._id}>
              <td>{testSlot.campus}</td>
              <td>{new Date(testSlot.date).toLocaleDateString()}</td>
              <td>{testSlot.startTime}</td>
              <td>{testSlot.endTime}</td>

              <td>{testSlot.capacity}</td>
              <td>
                <button onClick={() => handleEdit(testSlot)}>Edit</button>
                <button onClick={() => handleDelete(testSlot._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTestSlot && (
  <UpdateTestSlot
    testSlotId={selectedTestSlot._id}
    onClose={handleUpdateModalClose}
    onUpdated={handleTestSlotUpdated}  // Pass the function here
  />
)}

    
    </div>
  );
};

export default TestSlotList;
