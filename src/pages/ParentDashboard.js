import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { MdFileDownload } from "react-icons/md";
import Book from "../components/Test Slots/Book";
import BookPresentationModal from "../components/BookPresentationModal";
import EditBookingModal from "../components/EditBookingModal";
import axios from "axios";
import { getUserId, getAuthHeader, getAuthToken } from "../utils/auth";
import "./ParentDashboard.css";
import ChangeTimeSlotModal from "../components/ChangeTimeSlotModal";

import { MdError } from "react-icons/md";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function ParentDashboard() {
  const [activeModal, setActiveModal] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [presentations, setPresentations] = useState([]);
  const [error, setError] = useState(null);
  const [myPresentations, setMyPresentations] = useState([]);
  const [childData, setChildData] = useState([]);

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
    fetchMyPresentations();
  }, [myPresentations.length]);

  useEffect(() => {
    const fetchPresentations = async () => {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.get(
        `${backendURL}/api/presentations`,
        getAuthHeader()
      );

      if (response.status === 200) {
        setPresentations(response.data);
      } else {
        setError("Error fetching presentations");
      }
    };

    fetchPresentations();
  }, []);

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 예약을 삭제하시겠습니까?")) {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.delete(
        `${backendURL}/api/bookings/${id}`,
        getAuthHeader()
      );

      if (response.status === 200) {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== id)
        );
        toast.success("예약이 성공적으로 삭제되었습니다.");
      } else {
        toast.error("예약을 삭제하는 중에 오류가 발생했습니다.");
      }
    }
  };

  const handleTimeSlotChange = (presentationId) => {
    const presentation = myPresentations.find((p) => p._id === presentationId);
    setEditingBooking(presentation);
    setActiveModal("changeTimeSlot");
  };

  const isEmptyState = bookings.length === 0;

  const downloadQRCode = async () => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const userId = getUserId();
      const response = await fetch(`${backendURL}/api/users/${userId}/qrcode`);
      const qrCodePDFBlob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(qrCodePDFBlob);
      link.download = "qrcode.pdf"; // Change the file name to .pdf
      link.click();

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading QR code PDF:", error);
      toast.error("QR 코드 PDF를 다운로드하는 중에 오류가 발생했습니다.");
    }
  };

  const fetchUpdatedPresentations = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const response = await axios.get(
      `${backendURL}/api/presentations`,
      getAuthHeader()
    );

    if (response.status === 200) {
      setPresentations(response.data);
    } else {
      setError("Error fetching updated presentations");
    }
  };

  return (
    <div className="dashboard-container">
      {error && (
        <p className="error-message" role="alert">
          <MdError /> {error}
        </p>
      )}

      <h1 className="header"> J LEE 신입생 입학설명회 예약</h1>
      <div className="header-text">
  
      <ol>
        <li>
          형제, 있으실 경우 "학생추가"를 해주시기 바랍니다.
        </li>
        <li>
          설명회 예약이 완료되면 학부모님께 예약확인 문자가 발송됩니다.
        </li>
      </ol>
  
  </div>
      <div className="button-containerPD">
        {/* <button
          className="button"
          onClick={() => setActiveModal("booking")}
          aria-label="Book a Test"
        >
          시험 예약
        </button> */}
        <button
          className="button"
          onClick={() => setActiveModal("presentation")}
          aria-label="Book Presentation"
        >
          신입생 설명회 예약
        </button>

        <Link to="/add-child">
          <button className="button" aria-label="Add Child">
            학생 추가
          </button>
        </Link>
      </div>

      {isEmptyState && myPresentations.length === 0 ? (
        <p className="no-booking">
          예약내역이 없습니다. [신입생 설명회 예약]를 클릭하여 예약을
          진행해주세요.
        </p>
      ) : (
        <div className="card-container">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="booking-card"
              style={{ backgroundColor: "#f0f0f0", border: "2px solid #ccc" }}
            >
              <h3>{booking.child.name}</h3>
              <p>이전 학교: {booking.child.previousSchool}</p>
              <p>시험등급: {booking.child.testGrade}</p>
              <p>교정: {booking?.testSlot?.campus}</p>
              <p>
                날짜: {new Date(booking?.testSlot?.date).toLocaleDateString()}
              </p>
              <p>시간: {booking?.testSlot?.startTime}</p>
              <div className="booking-actions">
                <button
                  className="button"
                  onClick={() => handleDelete(booking._id)}
                >
                  취소
                </button>
              </div>
            </div>
          ))}

          {myPresentations.map((presentation) => (
            <div
              key={presentation._id}
              className="presentation-card"
              style={{ backgroundColor: "#e0f7fa", border: "2px " }}
            >
              <h3>{presentation.name}</h3>
              <h4>날짜: {new Date(presentation.date).toLocaleDateString() + ' ' + new Date(presentation.timeSlots[0].startTime).toLocaleTimeString()}</h4>

              <p>장소 : {presentation.location}</p>
              <p>
                학생(유아)명:
                {presentation.childName}
              </p>
              <p>2024년 예비 학년(연령): {presentation.testGrade}</p>
             
              <div className="booking-actions">
                <button
                  className="button-bookings"
                  onClick={() => handleTimeSlotChange(presentation._id)}
                >
                  예약시간변경
                </button>

                {new Date(presentation.date) - new Date() <=
                  2 * 24 * 60 * 60 * 1000 && (
                  <button
                    className="button-bookings"
                    onClick={() => downloadQRCode()}
                    aria-label="Download QR Code"
                  >
                    <MdFileDownload /> QR 다운로드
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={activeModal !== null}
        onRequestClose={closeModal}
        contentLabel="Dynamic Modal"
      >
        {activeModal === "booking" && <Book closeModal={closeModal} />}
        {activeModal === "presentation" && (
          <BookPresentationModal
            presentations={presentations}
            closeModal={closeModal}
            childData={childData}
            onBookingCreated={fetchUpdatedPresentations}
          />
        )}
        {activeModal === "editBooking" && (
          <EditBookingModal
            closeModal={closeModal}
            booking={editingBooking}
            onBookingUpdated={fetchBookings}
          />
        )}

        {activeModal === "changeTimeSlot" && (
          <ChangeTimeSlotModal
            closeModal={closeModal}
            presentationId={editingBooking._id}
            oldSlotId={editingBooking.oldSlotId}
            onTimeSlotChanged={fetchMyPresentations}
          />
        )}
      </Modal>
    </div>
  );
}

export default ParentDashboard;
