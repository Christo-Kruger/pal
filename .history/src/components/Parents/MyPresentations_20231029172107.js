import React, { useState } from "react";
import ChangeTimeSlotModal from "../Presentation/ChangeTimeSlotModal";

const MyPresentations = ({
  myPresentations,
  handleCancelPresentation,
  setActiveModal,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const handleTimeSlotChange = (presentationId) => {
    const presentation = myPresentations.find((p) => p._id === presentationId);
    setEditingBooking(presentation);
    setModalVisible(true);
  };

  return (
    <div className="my-presentations">
      {myPresentations.map((presentation) => (
        <div
          key={presentation._id}
          className="presentation-card"
          style={{ backgroundColor: "#e0f7fa", border: "2px " }}
        >
          <h3>{presentation.name}</h3>
          <h4>
            날짜:{" "}
            {new Date(presentation.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }) +
              " " +
              new Date(presentation.timeSlots[0].startTime).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
          </h4>
          <p>장소 : {presentation.location}</p>
          <p>학생명: {presentation.childName}</p>
          <p>2024년 학년: {presentation.testGrade}</p>
          <div className="booking-actions" style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="button-bookings"
              onClick={() => handleTimeSlotChange(presentation._id)}
              style={{ width: "170px" }}
            >
              예약시간변경
            </button>
            <button
              className="button-bookings"
              onClick={() => handleCancelPresentation(presentation._id)}
              style={{ width: "170px" }}
            >
              취소
            </button>
          </div>
          <div
            style={{
              margin: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {/* {presentation.myQrCode && (
              <img
                src={`data:image/png;base64,${presentation.myQrCode}`}
                alt="User QR Code"
              />
            )} */}
          </div>
        </div>
      ))}
      {isModalVisible && (
        <ChangeTimeSlotModal
          editingBooking={editingBooking}
          presentationId={editingBooking?._id}
          oldSlotId={editingBooking?.oldSlotId}
          onTimeSlotChanged={() => {
            setModalVisible(false);
          }}
          closeModal={() => {
            setModalVisible(false);
            setEditingBooking(null);
          }}
        />
      )}
    </div>
  );
  
};

export default MyPresentations;
