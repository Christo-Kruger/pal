import React, { useState } from "react";
import CreatePresentationModal from "../components/Presentation/CreatePresentationModal";
import UpdatePresentationModal from "../components/Presentation/UpdatePresentationModal";
import PresentationList from "../components/Presentation/PresentationList";
import TestCreateModal from "../components/Test Slots/CreateTestSlot";
import TestUpdateModal from "../components/Test Slots/UpdateTestSlot";
import TestList from "../components/Test Slots/TestSlotList";
import BookingList from "../components/Test Slots/BookingList";
import AttendeeList from "../components/Presentation/ListOfAttendees"; // Import your Attendee List component here
import AddAdmin from "../components/AddAdmin";
import BookingPriorityModal from "../components/Test Slots/BookingPriorityModal";
import BookingCalendar from "../components/Test Slots/BookingCalendar";

import "../styles/Admin.css";
const Admin = () => {
  const [selectedPresentationId, setSelectedPresentationId] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const toggleCalendarVisibility = () => {
    if (showCalendar) {
      setActiveComponent(null);
    }
    setShowCalendar(!showCalendar);
  };
  const setActiveComponentAndHideCalendar = (component) => {
    setShowCalendar(false);
    setActiveComponent(component);
};

const handleCreatePresentationOpen = () => {
    setActiveComponentAndHideCalendar("createPresentation");
};

const handleCreateBookingPriorityOpen = () => {
    setActiveComponentAndHideCalendar("createBookingPriority");
};

const handleBookingListOpen = () => {
    setActiveComponentAndHideCalendar("bookingList");
};

const handleCreateTestOpen = () => {
    setActiveComponentAndHideCalendar("createTest");
};

const handleEditPresentation = (presentationId) => {
    setSelectedPresentationId(presentationId);
    setActiveComponentAndHideCalendar("updatePresentation");
};

const handleEditTest = (testId) => {
    setSelectedTestId(testId);
    setActiveComponentAndHideCalendar("updateTest");
};

  const handleModalClose = () => {
    setActiveComponent(null);
    setSelectedTestId(null);
    setSelectedPresentationId(null);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="filter-container">
      <button className="nav-button" onClick={toggleCalendarVisibility}>
          {showCalendar ? "Hide Calendar" : "Show Calendar"}
        </button>
        <button className="nav-button" onClick={handleCreatePresentationOpen}>
          Create Presentation
        </button>
        <button className="nav-button" onClick={handleCreateTestOpen}>
          Create Test
        </button>
        <button
          className="nav-button"
          onClick={() => setActiveComponent("presentationList")}
        >
          Presentations
        </button>
        <button
          className="nav-button"
          onClick={() => setActiveComponent("testList")}
        >
          Tests
        </button>
        <button className="nav-button" onClick={handleBookingListOpen}>
          Test Takers
        </button>

        <button
          className="nav-button"
          onClick={() => setActiveComponent("attendeeList")}
        >
          Attendees
        </button>
        <button
          className="nav-button"
          onClick={() => setActiveComponent("addAdmin")}
        >
          Add Admin
        </button>
        <button className="nav-button" onClick={handleCreateBookingPriorityOpen}>
        Set Booking Priority Times
      </button>
      </div>

        {showCalendar && <BookingCalendar />}

      
      {activeComponent === "createBookingPriority" && (
        <BookingPriorityModal isOpen={true} onRequestClose={handleModalClose} />
      )}

      {activeComponent === "createPresentation" && (
        <CreatePresentationModal
          isOpen={true}
          onRequestClose={handleModalClose}
        />
      )}
      {activeComponent === "updatePresentation" && selectedPresentationId && (
        <UpdatePresentationModal
          presentationId={selectedPresentationId}
          isOpen={true}
          onRequestClose={handleModalClose}
        />
      )}
      {activeComponent === "createTest" && (
        <TestCreateModal isOpen={true} onRequestClose={handleModalClose} />
      )}
      {activeComponent === "updateTest" && selectedTestId && (
        <TestUpdateModal
          testId={selectedTestId}
          isOpen={true}
          onRequestClose={handleModalClose}
        />
      )}
      {activeComponent === "presentationList" && (
        <PresentationList onEdit={handleEditPresentation} />
      )}
      {activeComponent === "testList" && <TestList onEdit={handleEditTest} />}
      {activeComponent === "bookingList" && <BookingList />}
      {activeComponent === "attendeeList" && <AttendeeList />}
      {activeComponent === "addAdmin" && <AddAdmin />}
    </div>
  );
};

export default Admin;
