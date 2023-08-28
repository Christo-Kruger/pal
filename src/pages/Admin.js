import React, { useState, useEffect } from "react";
import CreatePresentationModal from "../components/Presentation/CreatePresentationModal";
import UpdatePresentationModal from "../components/Presentation/UpdatePresentationModal";
import PresentationList from "../components/Presentation/PresentationList";
import TestCreateModal from "../components/Test Slots/CreateTestSlot";
import TestUpdateModal from "../components/Test Slots/UpdateTestSlot";
import TestList from "../components/Test Slots/TestSlotList";
import BookingList from "../components/Test Slots/BookingList";
import AttendeeList from "../components/Presentation/ListOfAttendees";
import AddAdmin from "../components/AddAdmin";
import EditAdmins from "../components/EditAdmin";  // You'll need to import this component
import BookingPriorityModal from "../components/Test Slots/BookingPriorityModal";
import BookingCalendar from "../components/Test Slots/BookingCalendar";
import ParentList from "../components/ParentList";
import QRScannerModal from "../components/Admin/QRScannerModal";
import "../styles/Admin.css";


const Admin = () => {
  const [selectedPresentationId, setSelectedPresentationId] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [userRole, setUserRole] = useState("");

  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
 

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
  }, []);

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
  const handleOpenQRScanner = () => {
    setActiveComponentAndHideCalendar("QRScanner");
  };

  
  const handleShowPresentationList = () => {
    setActiveComponentAndHideCalendar("presentationList");
  };
  
  const handleShowTestList = () => {
    setActiveComponentAndHideCalendar("testList");
  };
  
  const handleShowBookingList = () => {
    setActiveComponentAndHideCalendar("bookingList");
  };
  
  const handleShowAttendeeList = () => {
    setActiveComponentAndHideCalendar("attendeeList");
  };
  
  const handleShowParentList = () => {
    setActiveComponentAndHideCalendar("viewParents");
  };
  
  const handleShowAddAdmin = () => {
    setActiveComponentAndHideCalendar("addAdmin");
  };
  
  const handleShowEditAdmins = () => {
    setActiveComponentAndHideCalendar("editAdmins");
  };

  const handleCloseQRScanner = () => {
    setIsQRScannerOpen(false);
    setActiveComponent(null);
  };
  

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <button className="nav-button" onClick={handleOpenQRScanner}>
  Open QR Scanner
</button>
      
      <div className="filter-container">
      <button className="nav-button" onClick={toggleCalendarVisibility}>
          {showCalendar ? "Hide Calendar" : "Show Calendar"}
        </button>
  
        <button className="nav-button" onClick={handleCreateTestOpen}>
          Create Test
        </button>
        <button className="nav-button" onClick={handleShowPresentationList}>
  Presentations
</button>
<button className="nav-button" onClick={handleShowTestList}>
  Tests
</button>
<button className="nav-button" onClick={handleShowBookingList}>
  Test Takers
</button>

<button className="nav-button" onClick={handleShowAttendeeList}>
  Attendees
</button>
<button className="nav-button" onClick={handleShowParentList}>
  Parents
</button>
        <button className="nav-button" onClick={handleCreateBookingPriorityOpen}>
        Set Booking Priority Times
      </button>
      {userRole === "superadmin" && (
          <>
            <button className="nav-button" onClick={handleCreatePresentationOpen}>
              Create Presentation
            </button>
            <button className="nav-button" onClick={handleShowAddAdmin}>
  Add Admin
</button>
<button className="nav-button" onClick={handleShowEditAdmins}>
  View/Edit Admins
</button>

          </>
        )}
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
      {activeComponent === "editAdmins" && <EditAdmins />}
      {activeComponent === "viewParents" && <ParentList />}
      <QRScannerModal isOpen={activeComponent === "QRScanner"} onRequestClose={handleCloseQRScanner} />
    </div>
  );
};

export default Admin;
