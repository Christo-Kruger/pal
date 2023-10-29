import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import axios from "axios";
import TestBooking from "./TestBooking";
import { getAuthHeader, getUserCampus, getUserId } from "../../utils/auth";
import BookPresentationModal from "../BookPresentationModal";
import BasicPres from "./BasicPres";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';

function ChildCard() {
  const { token } = useAuth();
  const [children, setChildren] = useState([]);
  const [editedChildren, setEditedChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedChild, setSelectedChild] = useState(null);
  const [presentations, setPresentations] = useState([]);
  const [error, setError] = useState(null);
  const campus = getUserCampus();
  const [childAgeGroup, setChildAgeGroup] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  
  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const backendURL = process.env.REACT_APP_BACKEND_URL;
        const userId = getUserId()
        
        // Add userId, campus, and childAgeGroup to the query parameters
        const response = await axios.get(
          `${backendURL}/api/presentations?campus=${campus}&ageGroup=${childAgeGroup}&userId=${userId}`,
          getAuthHeader()
        );
        console.log("Response", response);
  
        if (response.status === 200) {
          setPresentations(response.data);
        } else {
          setError("Error fetching presentations");
        }
      } catch (error) {
        setError("Error fetching presentations");
      }
    };
  
    // Execute fetchPresentations only if childAgeGroup is available

    const triggerRefresh = () => {
      setRefreshTrigger(!refreshTrigger);
    };

  useEffect(() => {
    const fetchChildren = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/child`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched child data???:", data);
          setChildren(data);
          setEditedChildren(
            data.map((child) => ({
              ...child,
              dateOfBirth: child.dateOfBirth
                ? new Date(child.dateOfBirth).toISOString().split("T")[0]
                : "",
            }))
          );

          // Set the ageGroup of the first child, or however you want to select the child
          if (data.length > 0) {
            setChildAgeGroup(data[0].ageGroup);
          }
        } else {
          console.error("Failed to fetch children");
        }
      } catch (error) {
        console.error("Error fetching children:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, [token]);

  useEffect(() => {
    console.log("Updated selectedChild:", selectedChild);
  }, [selectedChild]);

  const handleClickOpen = (type, childData = null) => {
    setModalType(type);
    setSelectedChild(childData);
    if (childData) {
      setChildAgeGroup(childData.ageGroup);
    }
    setOpen(true);
    console.log("Selected Child in handleClickOpen:", childData);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateDimensions = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    if (childAgeGroup) {
      fetchPresentations();
    }
  }, [childAgeGroup, refreshTrigger]);
  const cardStyle = {
    minWidth: windowWidth <= 768 ? "auto" : 400,
    maxWidth: windowWidth <= 768 ? "100%" : 500,
    margin: "16px",
    backgroundColor: "lightblue",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  return (
    <div
      className="container"
      style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth:"10px" }}
    >
      <div className="edit-child-box">
        {editedChildren.map((child, index) => (
          <Card key={child.id || index} sx={cardStyle}>
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "32px",
              }}
            >
              <Typography variant="h5" component="div">
                {child.name}
              </Typography>{" "}
              <Typography variant="h6">{child.testGrade}</Typography>
              <BasicPres childData={child}
          
              />
              <Button
                variant="contained"
                style={{ marginTop: "16px", width: "270px" }}
                onClick={() => handleClickOpen("Briefing", child)}
              >
                Manage Presentation
              </Button>
              {/* <Button
                variant="contained"
                style={{ marginTop: "16px", width: "270px" }}
                onClick={() => handleClickOpen("Entrance", child)}
              >
                Entrance Test Reservation
              </Button> */}
            </CardContent>
          </Card>
        ))}

     
<Dialog open={open} onClose={handleClose}>
  
    <IconButton
      edge="end"
      color="inherit"
      onClick={handleClose}
      aria-label="close"
      style={{ position: 'absolute', right: 7, top: 2 }}
    >
      <CloseIcon />
    </IconButton>

    <DialogContent style={{ minWidth: '350px' }}>
    {modalType === "Briefing" ? (
      <BookPresentationModal
        closeModal={handleClose}
        childData={selectedChild}
        presentations={presentations}
        triggerRefresh={triggerRefresh}
      />
    ) : (
      <DialogContentText
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <TestBooking
          closeModal={handleClose}
          childData={selectedChild}
        />
      </DialogContentText>
    )}
  </DialogContent>
</Dialog>
      </div>
    </div>
  );
}

export default ChildCard;
