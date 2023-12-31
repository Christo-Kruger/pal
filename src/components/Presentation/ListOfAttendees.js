import React, { useEffect, useState } from "react";
import axios from "axios";
import SendSmsModal from "../SendSmsModal";
import { toast } from "react-toastify";
import { getAuthHeader } from "../../utils/auth";
import {  ProgressBar } from "react-loader-spinner"; // Import the spinner

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AttendeeList = () => {
  const [presentations, setPresentations] = useState([]);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null);
  const [checkedAttendees, setCheckedAttendees] = useState({});
  const userCampus = localStorage.getItem("userCampus");
  const userRole = localStorage.getItem("userRole");
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState({ criteria: 'date', order: 'desc' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/presentations/allAttendeesInTimeSlots`,
          getAuthHeader()
        );

        if (mounted) {
          const filteredAttendees = response.data.filter(
            (attendee) =>
              attendee.campus === userCampus || userRole === "superadmin"
          );

          setAttendees(filteredAttendees);
          console.log("Filtered Attendees:", filteredAttendees);

          // Initialize checkedAttendees state
          const initialCheckedAttendees = {};
          filteredAttendees.forEach((attendee) => {
            initialCheckedAttendees[attendee._id] =
              attendee.attendedPresentation;
          });
          setCheckedAttendees(initialCheckedAttendees);
          setIsLoading(false);
        }
      } catch (error) {
        if (mounted) {
          console.error("Error fetching data: ", error);
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const initializeCheckedAttendees = (filteredPresentations) => {
    const initialCheckedAttendees = {};
    filteredPresentations.forEach((presentation) => {
      presentation.timeSlots.forEach((slot) => {
        slot.attendees.forEach((attendee) => {
          initialCheckedAttendees[attendee._id] = attendee.attendedPresentation;
        });
      });
    });
    setCheckedAttendees(initialCheckedAttendees);
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/presentations/exportToExcel`,
        {
          ...getAuthHeader(),
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendees_data.xlsx");
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
    setCheckedAttendees((prevState) => ({
      ...prevState,
      [userId]: isChecked,
    }));
    markAttended(userId, isChecked);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    const [criteria, order] = event.target.value.split("-");
    setSortBy({ criteria, order });
  };

  const markAttended = async (userId, isChecked) => {
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/api/users/${userId}/attendedPresentation`,
        { attended: isChecked }
      );

      if (response.status !== 200) {
        revertCheckboxState(userId, isChecked);
        alert("There was an error updating the attendance status.");
      } else {
        toast.success("Attendance status updated successfully!");
      }
    } catch (error) {
      revertCheckboxState(userId, isChecked);
      console.error("Error marking attendance: ", error);
      alert("Error marking attendance. Please try again.");
    }
  };

  const revertCheckboxState = (userId, isChecked) => {
    setCheckedAttendees((prevState) => ({
      ...prevState,
      [userId]: !isChecked,
    }));
  };
  return (
    <div className="attendee-list">
      <button onClick={handleExport}>Export to Excel</button>
  
      <input
        type="text"
        placeholder="Search by Phone, Name or Child Name"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <select
        value={`${sortBy.criteria}-${sortBy.order}`}
        onChange={handleSortChange}
      >
        <option value="">Sort by</option>
        <option value="date-asc">Date Ascending</option>
        <option value="date-desc">Date Descending</option>
      </select>
  
      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <ProgressBar
            type="ThreeDots"
            color="#00BFFF"
            height={100}
            width={100}
          />
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Parent</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Campus</th>
              <th>Child Name</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>School</th>
              <th>Grade</th>
              <th>Presentation</th>
              <th>Booked Time</th>
              <th>Booking Created</th>
              <th>Action</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {attendees &&
              attendees
                .filter((attendee) => {
                  if (!searchTerm) return true;
                  return (
                    attendee.phone.includes(searchTerm) ||
                    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    attendee.childName.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                })
                .sort((a, b) => {
                  if (sortBy.criteria === "date") {
                    return sortBy.order === "asc"
                      ? new Date(a.bookedAt) - new Date(b.bookedAt)
                      : new Date(b.bookedAt) - new Date(a.bookedAt);
                  }
                  // Additional sorting criteria can be added here
                  return 0;
                })
                .map((attendee, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{attendee.name}</td>
                    <td>{attendee.email}</td>
                    <td>{attendee.phone}</td>
                    <td>{attendee.campus}</td>
                    <td>{attendee.childName}</td>
                    <td>{new Date(attendee.dateOfBirth).toLocaleDateString()}</td>
                    <td>{attendee.childGender}</td>
                    <td>{attendee.previousSchool}</td>
                    <td>{attendee.childTestGrade}</td>
                    <td>{attendee.presentationName}</td>
                    <td>{new Date(attendee.startTime).toLocaleTimeString()}</td>
                    <td>{new Date(attendee.bookedAt).toLocaleString()}</td>
                    <td>
                      <button onClick={() => openSmsModal(attendee.phone)}>Send SMS</button>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedAttendees[attendee._id] || false}
                        onChange={(e) => handleCheckboxChange(e, attendee._id)}
                      />
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      )}
  
      <SendSmsModal
        isOpen={isSmsModalOpen}
        onRequestClose={closeSmsModal}
        phoneNumbers={[selectedPhoneNumber]}
      />
    </div>
  );
  
};

export default AttendeeList;
