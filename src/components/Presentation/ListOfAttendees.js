import React, { useEffect, useState } from "react";
import axios from "axios";
import SendSmsModal from "../SendSmsModal";
import { toast } from "react-toastify";
import { getAuthHeader } from "../../utils/auth";

const AttendeeList = () => {
  const [presentations, setPresentations] = useState([]);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null);
  const userCampus = localStorage.getItem("userCampus");
  const [checkedAttendees, setCheckedAttendees] = useState({});

  const handleExport = async () => {
    try {
      // Here we make a request to our backend to trigger the CSV export.
      
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/presentations/exportToExcel`, getAuthHeader());
  
      const blob = new Blob([response.data], { type: 'text/csv' });  // Modified MIME type for CSV
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendees_data.csv');  // Modified file extension to .csv
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data: ", error);
      alert("Error exporting data. Please try again.");
    }
};


  const openSmsModal = (phoneNumber) => {
    setSelectedPhoneNumber(phoneNumber);
    setIsSmsModalOpen(true);
  };

  const closeSmsModal = () => {
    setSelectedPhoneNumber(null);
    setIsSmsModalOpen(false);
  };

  const handleCheckboxChange = (e, userId) => {
    const isChecked = e.target.checked;

    // Update local state
    setCheckedAttendees((prevState) => ({
      ...prevState,
      [userId]: isChecked,
    }));

    // Send an update to the backend
    markAttended(userId, isChecked);
  };

  const markAttended = async (userId, isChecked) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/attendedPresentation`,
        { attended: isChecked }
      );
  
      if (response.status !== 200) {
        // Revert checkbox state in case of an error
        setCheckedAttendees((prevState) => ({
          ...prevState,
          [userId]: !isChecked,
        }));
  
        alert("There was an error updating the attendance status.");
      } else {
        // Display a toast when successful
        toast.success("Attendance status updated successfully!");
      }
    } catch (error) {
      console.error("Error marking attendance: ", error);
      alert("Error marking attendance. Please try again.");
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/presentations/allAttendeesInTimeSlots`,getAuthHeader()
        );

        if (mounted) {
          const filteredPresentations = response.data.filter((presentation) => {
            return presentation.timeSlots.some((slot) =>
              slot.attendees.some((attendee) => attendee.campus === userCampus)
            );
          });
          setPresentations(filteredPresentations);

          // Initialize checkedAttendees state
          const initialCheckedAttendees = {};
          filteredPresentations.forEach((presentation) => {
            presentation.timeSlots.forEach((slot) => {
              slot.attendees.forEach((attendee) => {
                initialCheckedAttendees[attendee._id] = attendee.attendedPresentation;

              });
            });
          });
          setCheckedAttendees(initialCheckedAttendees);
        }
      } catch (error) {
        if (mounted) {
          console.error("Error fetching data: ", error);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="attendee-list">
      <button onClick={handleExport}>Export to Excel</button>

      <table>
        <thead>
          <tr>
            <th>Attendee Name</th>
            <th>Phone Number</th>
            <th>Campus</th>
            <th>Presentation Booked</th>
            <th>Booking Time</th>
            <th>Booking Creation Time</th>
            <th>Action</th>
            <th>Attendance</th>
          </tr>
        </thead>

        <tbody>
          {presentations &&
            presentations.map(
              (presentationItem) =>
                presentationItem.timeSlots &&
                presentationItem.timeSlots.map(
                  (slot) =>
                    slot.attendees &&
                    slot.attendees.map((attendee) => (
                      <tr key={attendee._id}>
                        <td>{attendee.name}</td>
                        <td>{attendee.phone}</td>
                        <td>{attendee.campus}</td>
                        <td>{presentationItem.presentationName}</td>
                        <td>
                          {new Date(slot.startTime).toLocaleTimeString()} -{" "}
                          {new Date(slot.endTime).toLocaleTimeString()}
                        </td>

                        <td>{new Date(attendee.bookedAt).toLocaleString()}</td>
                        <td>
                          <button onClick={() => openSmsModal(attendee.phone)}>
                            Send SMS
                          </button>
                        </td>
                        <td>
                         
                          <input
                            type="checkbox"
                            checked={checkedAttendees[attendee._id] || false}
                            onChange={(e) =>
                              handleCheckboxChange(e, attendee._id)
                            }
                          />
                        </td>
                      </tr>
                    ))
                )
            )}
        </tbody>
      </table>
      <SendSmsModal
        isOpen={isSmsModalOpen}
        onRequestClose={closeSmsModal}
        phoneNumbers={[selectedPhoneNumber]}
      />
    </div>
  );
};

export default AttendeeList;