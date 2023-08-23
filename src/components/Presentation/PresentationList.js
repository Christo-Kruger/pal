import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthHeader, getUserRole } from "../../utils/auth";
import UpdatePresentationModal from "./UpdatePresentationModal";
import SendSmsModal from "../SendSmsModal"; // Adjust the path if necessary.


const PresentationList = () => {
  const [presentations, setPresentations] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPresentationId, setSelectedPresentationId] = useState(null);
  const [isSmsModalOpen, setSmsModalOpen] = useState(false);
  const [currentPhoneNumbers, setCurrentPhoneNumbers] = useState([]);

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
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/presentations/presentations`,
        {
          headers: getAuthHeader(),
        }
      );
      setPresentations(response.data);
    } catch (error) {
      toast.error("Error fetching presentations.");
    }
  };

  useEffect(() => {
    fetchPresentations();
  }, []);

  const handleDelete = async (presentationId) => {
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

  return (
    <div>
      <h2>Presentation List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Attendees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {presentations.map((presentation) => (
            <React.Fragment key={presentation._id}>
              {presentation.timeSlots &&
                presentation.timeSlots.map((timeSlot) => (
                  <tr key={timeSlot._id}>
                    <td>{presentation.name}</td>
                    <td>{presentation.location}</td>
                    <td>{new Date(presentation.date).toLocaleDateString()}</td>
                    <td>{new Date(timeSlot.startTime).toLocaleTimeString()}</td>
                    <td>{new Date(timeSlot.endTime).toLocaleTimeString()}</td>
                    <td>{calculateAttendeesInfo(timeSlot)}</td>
                    <td>
                      <button onClick={() => handleDelete(presentation._id)}>
                        Delete
                      </button>
                      <button onClick={() => handleEdit(presentation._id)}>
                        Edit
                      </button>
                      <button onClick={() => handleSendSMS(presentation._id)}>
                        Send SMS
                      </button>
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <ToastContainer position="top-center" autoClose={3000} />
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
