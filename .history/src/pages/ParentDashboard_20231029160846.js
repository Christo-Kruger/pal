import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getUserId,
  getAuthHeader,
  getAuthToken,
  getUserCampus,
} from "../utils/auth";
// import "./ParentDashboard.css";
import { MdError } from "react-icons/md";
import ChildCard from "../components/Parents/ChildCard";
import CircularProgress from "@mui/material/CircularProgress";
import ParentNav from "./ParentNav";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import LoadingScreen from "../components/Structure/LoadingScreen";


function ParentDashboard() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [myPresentations, setMyPresentations] = useState([]);
  const [childData, setChildData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const campus = getUserCampus();
  const [qrCodeData, setQrCodeData] = useState({});

  const fetchBookings = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const response = await axios.get(
      `${backendURL}/api/bookings/parent?userId=${getUserId()}`,
      getAuthHeader()
    );

    if (response.status === 200) {
      setBookings(response.data);
    } else {
      setError("Error fetching bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [bookings.length]);

  const fetchMyPresentations = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const userId = getUserId();
    const token = getAuthToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const [presentationResponse, childrenResponse] = await Promise.all([
      axios.get(`${backendURL}/api/presentations/myBookings`, config),
      axios.get(`${backendURL}/api/users/${userId}/children`, config),
    ]);

    if (
      presentationResponse.status === 200 &&
      childrenResponse.status === 200
    ) {
      const myChildren = childrenResponse.data;
      setChildData(myChildren); // update childData state variable

      const presentationsWithChildName = presentationResponse.data.map(
        (presentation) => {
          const childrenInSameAgeGroup = myChildren.filter(
            (child) => child.ageGroup === presentation.ageGroup
          );
          const childNames = childrenInSameAgeGroup
            .map((child) => child.name)
            .join(", ");
          const childTestGrades = childrenInSameAgeGroup
            .map((child) => child.testGrade)
            .join(", ");
          return {
            ...presentation,
            childName: childNames,
            testGrade: childTestGrades,
            oldSlotId: presentation.timeSlots[0]._id,
          };
        }
      );
      setMyPresentations(presentationsWithChildName);
    } else {
      setError("Error fetching my presentations");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading to true before fetching
      await fetchMyPresentations();
      setIsLoading(false); // Set loading to false after fetching
    };
    fetchData();
  }, []);

  const fetchQRCode = async (userId) => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendURL}/api/users/${userId}/qrCode`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.qrCodeDataURL;
    } catch (error) {
      console.error("Failed fetching QR code:", error);
    }
  };

  useEffect(() => {
    const fetchUserQRCode = async () => {
      const userId = getUserId(); // Assuming the user ID is consistent with the logged-in user
      const qrDataUrl = await fetchQRCode(userId);
      setQrCodeData(qrDataUrl); // We directly set the data URL since only one QR is expected
    };

    fetchUserQRCode();
  }, []);

  return (
    <div className="dashboard-container">
      <ParentNav />
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="textPrimary">Home</Typography>
      </Breadcrumbs>

      {error && (
        <p className="error-message" role="alert">
          <MdError /> {error}
        </p>
      )}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1 className="header"> J LEE 신입생 입학설명회 예약</h1>
        <h4>{campus}캠퍼스</h4>
        <div className="header-text-new">
          <p>
            1. 입학 희망하는 형제,자매가 있으신 경우 "학생추가"를 해주시기
            바랍니다.
          </p>

          <p>2. 설명회 예약이 완료되면 학부모님께 예약확인 문자가 발송됩니다</p>
        </div>
      </div>
      {isLoading ? (
        <<CircularProgress />> // Show CircularProgress when loading
      ) : (
        <ChildCard />
      )}
    </div>
  );
}

export default ParentDashboard;
