import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import "react-toastify/dist/ReactToastify.css";
import { getAuthHeader, getUserRole } from "../../utils/auth";
import UpdatePresentationModal from "./UpdatePresentationModal";
import SendSmsModal from "../SendSmsModal"; 
import { ProgressBar } from "react-loader-spinner";


const PresentationList = () => {
  const [presentations, setPresentations] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPresentationId, setSelectedPresentationId] = useState(null);
  const [isSmsModalOpen, setSmsModalOpen] = useState(false);
  const [currentPhoneNumbers, setCurrentPhoneNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleEdit = (presentationId) => {
    setSelectedPresentationId(presentationId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPresentationId(null);
    setModalOpen(false);
  };
  const handleSendSMS = (presentationId) => {
    const presentation = presentations.find(p => p._id === presentationId);
    const phoneNumbers = presentation.timeSlots.flatMap(timeSlot => 
        timeSlot.attendees.map(attendee => attendee._id?.phone)  // Note the change here.
    );
    setCurrentPhoneNumbers(phoneNumbers);
    setSmsModalOpen(true);
};


const fetchPresentations = async () => {
  try {
    setIsLoading(true); // Begin loading
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/presentations/presentations`,
      {
        headers: getAuthHeader(),
      }
    );
    setPresentations(response.data);
    setIsLoading(false); // End loading
  } catch (error) {
    toast.error("Error fetching presentations.");
    setIsLoading(false); // End loading on error as well
  }
};

  useEffect(() => {
    fetchPresentations();
  }, []);

  const handleDelete = async (presentationId) => {
    if (!window.confirm("Are you sure you want to delete this presentation?")) {
      return; // if the user presses Cancel, do not continue with the deletion
    }
  
    try {
      const authHeaders = getAuthHeader();
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/presentations/${presentationId}`,
        authHeaders
      );
  
      setPresentations((prevPresentations) =>
        prevPresentations.filter(
          (presentation) => presentation._id !== presentationId
        )
      );
      toast.success("Presentation deleted successfully!");
    } catch (error) {
      toast.error(
        `Error deleting presentation: ${error.response.data.message}`
      );
    }
  };

  const calculateAttendeesInfo = (timeSlot) => {
    const totalAttendees = timeSlot.attendees ? timeSlot.attendees.length : 0;
    const maxCapacity = timeSlot.maxAttendees || 0;
    return `${totalAttendees}/${maxCapacity}`;
  };

  
  const rows = presentations.flatMap(presentation =>
    presentation.timeSlots.map((timeSlot) => ({
      id: timeSlot._id,
      name: presentation.name,
      location: presentation.location,
      campus: presentation.campus,
      date: new Date(presentation.date).toLocaleDateString(),
      startTime: new Date(timeSlot.startTime).toLocaleTimeString(),
      endTime: new Date(timeSlot.endTime).toLocaleTimeString(),
      attendees: calculateAttendeesInfo(timeSlot),
      presentationId: presentation._id
    }))
  );

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "location", headerName: "Location", width: 150 },
    { field: "campus", headerName: "Campus", width: 150 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "startTime", headerName: "Start Time", width: 150 },
    { field: "endTime", headerName: "End Time", width: 150 },
    { field: "attendees", headerName: "Attendees", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 350,
      renderCell: (params) => (
        <>
          <button onClick={() => handleDelete(params.row.presentationId)}>
            Delete
          </button>
          <button onClick={() => handleEdit(params.row.presentationId)}>
            Edit
          </button>
          <button onClick={() => handleSendSMS(params.row.presentationId)}>
            Send SMS
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Presentation List</h2>
      {isLoading ? (
        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          <ProgressBar color="#00BFFF" height={100} width={100} />
        </div>
      ) : (
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
      )}
      <UpdatePresentationModal
        presentationId={selectedPresentationId}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onUpdated={fetchPresentations}
      />
      <SendSmsModal
        isOpen={isSmsModalOpen}
        onRequestClose={() => setSmsModalOpen(false)}
        phoneNumbers={currentPhoneNumbers}
      />
    </div>
  );
};

export default PresentationList;