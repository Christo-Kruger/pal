import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  IconButton,
  ListItemText,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CreatePresentationModal from "../components/Presentation/CreatePresentationModal";
import UpdatePresentationModal from "../components/Presentation/UpdatePresentationModal";
import PresentationList from "../components/Presentation/PresentationList";
import TestCreateModal from "../components/Test Slots/CreateTestSlot";
import TestUpdateModal from "../components/Test Slots/UpdateTestSlot";
import TestList from "../components/Test Slots/TestSlotList";
import BookingList from "../components/Test Slots/BookingList";
import AttendeeList from "../components/Presentation/ListOfAttendees";
import AddAdmin from "../components/AddAdmin";
import EditAdmins from "../components/EditAdmin"; // You'll need to import this component
import Settings from "../components/Admin/Settings/Settings";
import BookingCalendar from "../components/Test Slots/BookingCalendar";
import ParentList from "../components/ParentList";
import QRScannerModal from "../components/Admin/QRScannerModal";
import CreateGroup from "../components/Admin/Group Creatation/CreateGroup";
import Groups from "../components/Admin/Group Creatation/Groups";
import ParentChildList from "../components/Admin/Group Creatation/ParentChildList";

import "../styles/Admin.css";

const Admin = () => {
  const [selectedPresentationId, setSelectedPresentationId] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
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
  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleShowCreateGroup = () => {
    setActiveComponentAndHideCalendar("createGroup");
  };

  const handleShowGroups = () => {
    setActiveComponentAndHideCalendar("viewGroups");
  }

  const handleShowParentChild = () =>{
    setActiveComponentAndHideCalendar("parentChildList");
  }

  const handleSettings = () => {
    setActiveComponentAndHideCalendar("settings");
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
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleOpenQRScanner}>
            Open QR Scanner
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <List>
          {/* Calendar Operations */}
          <ListItem
            button
            onClick={() => {
              toggleCalendarVisibility();
              handleDrawerToggle();
            }}
          >
            <ListItemText
              primary={showCalendar ? "Hide Calendar" : "Show Calendar"}
            />
          </ListItem>

          {/* Test Operations */}
          <ListItem
            button
            onClick={() => {
              handleCreateTestOpen();
              handleDrawerToggle();
            }}
          >
            <ListItemText primary="Create Test" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              handleShowTestList();
              handleDrawerToggle();
            }}
          >
            <ListItemText primary="Tests" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              handleShowBookingList();
              handleDrawerToggle();
            }}
          >
            <ListItemText primary="Test Takers" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              handleSettings();
              handleDrawerToggle();
            }}
          >
            <ListItemText primary="Settings" />
          </ListItem>

          {/* Presentation Operations */}
          <ListItem
            button
            onClick={() => {
              handleCreatePresentationOpen();
              handleDrawerToggle();
            }}
          >
            <ListItemText primary="Create Presentation" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              handleShowPresentationList();
              handleDrawerToggle();
            }}
          >
            <ListItemText primary="Presentations" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              handleShowAttendeeList();
              handleDrawerToggle();
            }}
          >
            <ListItemText primary="Attendees" />
          </ListItem>

          {/* Miscellaneous */}
          <ListItem
            button
            onClick={() => {
              handleShowParentList();
              handleDrawerToggle();
            }}
          >
            <ListItemText primary="Parents" />
          </ListItem>

          {/* Admin Operations */}
          {userRole === "superadmin" && (
            <>
              <ListItem
                button
                onClick={() => {
                  handleShowAddAdmin();
                  handleDrawerToggle();
                }}
              >
                <ListItemText primary="Add Admin" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  handleShowEditAdmins();
                  handleDrawerToggle();
                }}
              >
                <ListItemText primary="View/Edit Admins" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  handleShowCreateGroup();
                  handleDrawerToggle();
                }}
              >
                <ListItemText primary="Create Groups" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  handleShowGroups();
                  handleDrawerToggle();
                }}
              >
                <ListItemText primary="View Groups" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  handleShowParentChild();
                  handleDrawerToggle();
                }}
              >
                <ListItemText primary="View Parent Child" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      {showCalendar && <BookingCalendar />}

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
      {activeComponent === "createGroup" && <CreateGroup />}
      {activeComponent === "viewGroups" && <Groups />}
      {activeComponent === "parentChildList" && <ParentChildList />}
      {activeComponent === "settings" && <Settings />}


      <QRScannerModal
        isOpen={activeComponent === "QRScanner"}
        onRequestClose={handleCloseQRScanner}
      />
    </div>
  );
};

export default Admin;
