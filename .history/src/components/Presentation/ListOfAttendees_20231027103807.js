import React, { useEffect, useState } from "react";
import axios from "axios";
import SendSmsModal from "../SendSmsModal";
import { toast } from "react-toastify";
import { getAuthHeader } from "../../utils/auth";
import { ProgressBar } from "react-loader-spinner";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AttendeeList = () => {
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null);
  const [checkedAttendees, setCheckedAttendees] = useState({});
  const userCampus = localStorage.getItem("userCampus");
  const userRole = localStorage.getItem("userRole");
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 100;  // Limit is set to 100 as per your requirement

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    console.log(`Fetching page ${page}...`)
  
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/presentations/allAttendeesInTimeSlots?limit=${limit}&page=${page}`,
          getAuthHeader()
        );
        console.log("Response Data:", response.data); // Debugging line
        
        if (Array.isArray(response.data.data)) {
          if (mounted) {
            const filteredAttendees = response.data.data.filter(
              (attendee) =>
                attendee.campus === userCampus || userRole === "superadmin"
            );
            setAttendees(filteredAttendees);
  
            // Initialize checkedAttendees state
            const initialCheckedAttendees = {};
            filteredAttendees.forEach((attendee) => {
              initialCheckedAttendees[attendee._id] =
                attendee.attendedPresentation;
            });
            setCheckedAttendees(initialCheckedAttendees);
            setIsLoading(false);
          }
        } else {
          console.error("Response data is not an array"); // Debugging line
          setIsLoading(false);  // Set isLoading to false when data is not an array
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
  }, [page, userCampus, userRole ]);

  const filteredRows = attendees
    .filter((attendee) => {
      if (!searchTerm) return true;
      return (
        attendee.phone.includes(searchTerm) ||
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.childName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .map((attendee, index) => ({
      id: index + 1,
      _id: attendee._id,
      name: attendee.name,
      email: attendee.email,
      phone: attendee.phone,
      campus: attendee.campus,
      childName: attendee.childName,
      dateOfBirth: new Date(attendee.dateOfBirth).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      childGender: attendee.childGender,
      previousSchool: attendee.previousSchool,
      childTestGrade: attendee.childTestGrade,
      presentationName: attendee.presentationName,
      startTime: new Date(attendee.startTime).toLocaleTimeString(),
      bookedAt:
        new Date(attendee.bookedAt).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }) +
        " " +
        new Date(attendee.bookedAt).toLocaleTimeString(),
    }));
    
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


  const columns = [
    { field: "id", headerName: "No.", width: 70 },
    { field: "name", headerName: "Parent", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone Number", width: 150 },
    { field: "campus", headerName: "Campus", width: 130 },
    { field: "childName", headerName: "Child Name", width: 150 },
    { field: "dateOfBirth", headerName: "DOB", width: 130 },
    { field: "childGender", headerName: "Gender", width: 120 },
    { field: "previousSchool", headerName: "School", width: 150 },
    { field: "childTestGrade", headerName: "Grade", width: 120 },
    { field: "presentationName", headerName: "Presentation", width: 150 },
    { field: "startTime", headerName: "Booked Time", width: 150 },
    { field: "bookedAt", headerName: "Booking Created", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => openSmsModal(params.row.phone)}
        >
          Send SMS
        </Button>
      ),
    },
    {
      field: "attendance",
      headerName: "Attendance",
      width: 150,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={checkedAttendees[params.row._id] || false}
          onChange={(e) => handleCheckboxChange(e, params.row._id)}
        />
      ),
    },
  ];
  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };
  return (
    <div className="attendee-list" style={{ marginTop: "2rem" }}>
      <button onClick={handleExport}>Export to Excel</button>
      <button onClick={handlePrevious}>Previous</button>
      <button onClick={handleNext}>Next</button>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "20px", width: "300px" }}
        InputProps={{
          style: { padding: "10px" },
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <ProgressBar
            type="ThreeDots"
            color="#00BFFF"
            height={100}
            width={100}
          />
        </div>
      ) : (
        <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10} // Local page size
          paginationMode="server" // Since you handle pagination manually
          page={page - 1} // DataGrid uses zero-based indexing for pages
          onPageChange={(newPage) => setPage(newPage.page + 1)} // Set new page on page change
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
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
