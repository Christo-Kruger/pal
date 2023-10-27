// React and Hooks
import React, { useState, useEffect } from "react";

import {
  CalendarToday as CalendarIcon,
  Assignment as TestsIcon,
  Slideshow as PresentationIcon,
  Person as ParentsIcon,
  Settings as SuperAdminIcon,
  Group as GroupsIcon,
} from "@material-ui/icons";
import QrCodeIcon from "@mui/icons-material/QrCode";
// Material-UI Components
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  IconButton,
  ListItemText,
  Collapse,
  ListItemIcon,
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MenuIcon from "@material-ui/icons/Menu";

// Presentation Components
import CreatePresentationModal from "../components/Presentation/CreatePresentationModal";
import UpdatePresentationModal from "../components/Presentation/UpdatePresentationModal";
import PresentationList from "../components/Presentation/PresentationList";
import AttendeeList from "../components/Presentation/ListOfAttendees";

// Test Components
import TestCreateModal from "../components/Test Slots/CreateTestSlot";
import TestUpdateModal from "../components/Test Slots/UpdateTestSlot";
import TestList from "../components/Test Slots/TestSlotList";
import BookingList from "../components/Test Slots/BookingList";
import BookingCalendar from "../components/Test Slots/BookingCalendar";

// Admin Components
import AddAdmin from "../components/AddAdmin";
import EditAdmins from "../components/EditAdmin";
import Settings from "../components/Admin/Settings/Settings";
import CanBook from "../components/Admin/Settings/CanBook";
import QRScannerModal from "../components/Admin/QRScannerModal";
import CreateGroup from "../components/Admin/Group Creatation/CreateGroup";
import Groups from "../components/Admin/Group Creatation/Groups";
import ParentChildList from "../components/Admin/Group Creatation/ParentChildList";
import ParentList from "../components/ParentList"; // Included
import GroupMembers from "../components/Admin/Group Creatation/GroupMembers"

// Structure Components
import LogoutButton from "../components/Structure/LogoutButton";
import Logo from "../components/Structure/Logo";

// Styles
import "../styles/Admin.css";
import { makeStyles } from '@material-ui/core/styles';

// Define styles
const drawerWidth = 240;
const miniDrawerWidth = 60;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  miniDrawer: {
    width: miniDrawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  miniDrawerPaper: {
    width: miniDrawerWidth,
  },
}));

const Admin = () => {
  const [selectedPresentationId, setSelectedPresentationId] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [openTests, setOpenTests] = useState(false);
  const [openPresentations, setOpenPresentations] = useState(false);
  const [openParents, setOpenParents] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openGroups, setOpenGroups] = useState(false);
  const classes = useStyles();

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
    setDrawerOpen(!drawerOpen);
  };
  const handleShowCreateGroup = () => {
    setActiveComponentAndHideCalendar("createGroup");
  };

  const handleShowGroups = () => {
    setActiveComponentAndHideCalendar("viewGroups");
  };

  const handleShowGroupMembers = () => {
    setActiveComponentAndHideCalendar("viewGroupMembers");

  }

  const handleShowParentChild = () => {
    setActiveComponentAndHideCalendar("parentChildList");
  };

  const handleSettings = () => {
    setActiveComponentAndHideCalendar("settings");
  };

  //handleCanBook
  const handleCanBook = () => {
    setActiveComponentAndHideCalendar("canBook");
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
  }





  const handleCloseQRScanner = () => {
    setIsQRScannerOpen(false);
    setActiveComponent(null);
  };



  return (
    <div className="admin-dashboard">
      <AppBar
        position="fixed"
        style={{
          backgroundColor: userRole === "superadmin" ? "#2b3643" : "#3f50b5",
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {userRole === "superadmin"
              ? "Super Admin Dashboard"
              : "Admin Dashboard"}
          </Typography>
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Logo />
          </div>
          <LogoutButton />
        </Toolbar>
      </AppBar>
      <Drawer
        className={drawerOpen ? classes.drawer : classes.miniDrawer}
        classes={{
          paper: drawerOpen ? classes.drawerPaper : classes.miniDrawerPaper,
        }}
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <List>
            <div>
              {/* QR Scanner */}
              <ListItem
                button
                onClick={() => {
                  handleOpenQRScanner();
                  handleDrawerToggle();
                }}
              >
                <ListItemIcon>
                  <QrCodeIcon />
                </ListItemIcon>
                <ListItemText primary="Open QR Scanner" />
              </ListItem>

              {/* Calendar */}
              <ListItem
                button
                onClick={() => {
                  toggleCalendarVisibility();
                  handleDrawerToggle();
                }}
              >
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText
                  primary={showCalendar ? "Hide Calendar" : "Show Calendar"}
                />
              </ListItem>

              {/* Tests */}
              <ListItem button onClick={() => setOpenTests(!openTests)}>
                <ListItemIcon>
                  <TestsIcon />
                </ListItemIcon>
                <ListItemText primary="Tests" />

                {openTests ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openTests} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
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
                    <ListItemText primary="View Tests" />
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
                </List>
              </Collapse>

              <ListItem
                button
                onClick={() => setOpenPresentations(!openPresentations)}
              >
                <ListItemIcon>
                  <PresentationIcon />
                </ListItemIcon>
                <ListItemText primary="Presentation" />

                {openPresentations ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openPresentations} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
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
                    <ListItemText primary="View Presentations" />
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => {
                      handleShowAttendeeList();
                      handleDrawerToggle();
                    }}
                  >
                    <ListItemText primary="View Attendees" />
                  </ListItem>
                </List>
              </Collapse>

              {/* Parents */}
              <ListItem button onClick={() => setOpenParents(!openParents)}>
                <ListItemIcon>
                  <ParentsIcon />
                </ListItemIcon>
                <ListItemText primary="Parents" />
                {openParents ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openParents} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    onClick={() => {
                      handleShowParentList();
                      handleDrawerToggle();
                    }}
                  >
                    <ListItemText primary="View Parents" />
                  </ListItem>
                </List>
              </Collapse>

              {/* Groups */}
              <ListItem button onClick={() => setOpenGroups(!openGroups)}>
                <ListItemIcon>
                  <GroupsIcon />
                </ListItemIcon>
                <ListItemText primary="Groups" />
                {openGroups ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openGroups} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
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
                    <ListItemText primary="Add To Group" />
                    </ListItem>
                    <ListItem
                    button
                    onClick={() => {
                      handleShowGroupMembers();
                      handleDrawerToggle();
                    }}
                  >
                    <ListItemText primary="View Group Members" />
                  </ListItem>
                </List>
              </Collapse>
              {/* Super Admin */}
              <div style={{ marginTop: "auto" }}>
                {userRole === "superadmin" && (
                  <>
                    <ListItem button onClick={() => setOpenAdmin(!openAdmin)}>
                      <ListItemIcon>
                        <SuperAdminIcon />
                      </ListItemIcon>
                      <ListItemText primary="Super Admin" />
                      {openAdmin ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openAdmin} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem
                          button
                          onClick={() => {
                            handleSettings();
                            handleDrawerToggle();
                          }}
                        >

                          <ListItemText primary="Manage Campuses" />
                        </ListItem>

<ListItem
                          button
                          onClick={() => {
                            handleCanBook();
                            handleDrawerToggle();
                          }}
                        >
                          <ListItemText primary="Manage Can Book" />
                          

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
                      </List>
                    </Collapse>
                  </>
                )}
              </div>
            </div>
          </List>
        </div>
      </Drawer>

      <div style={{ marginTop: "64px" }}>
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
        {activeComponent === "viewGroupMembers" && <GroupMembers />}
        <QRScannerModal
          isOpen={activeComponent === "QRScanner"}
          onRequestClose={handleCloseQRScanner}
        />
      </div>
    </div>
  );
};

export default Admin;
