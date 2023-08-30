import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthHeader, getUserId } from "../utils/auth";
import { toast } from "react-toastify";
import moment from "moment";
import { MdDateRange, MdPlace, MdAccessTime } from "react-icons/md"; // icons for date, place, and time


import "./BookPresentationModal.css";

function BookPresentationModal({
  presentations,
  closeModal,
  childData,
  onBookingCreated,
}) {
  const [expandedPresentation, setExpandedPresentation] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Add fetch presentations function here to get updates every 5 seconds
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleBooking = async (presentationId, slotId, presentationName, startTime) => {
    const presentation = presentations.find(p => p._id === presentationId);
    const child = childData.find(child => child.ageGroup === presentation.ageGroup);
    if (!child) {
      toast.error("이 연령대에는 자녀가 없습니다.");
      return;
    }

    const presentationInfo = `
    프레젠테이션: ${presentationName}
    시작 시간: ${startTime}
    어린이: ${child.name}
  
시험 등급: ${child.testGrade}
`;

const confirmation = window.confirm(`다음 프레젠테이션을 예약하시겠습니까?\n\n${presentationInfo}`);


    if (!confirmation) return;

    const backendURL = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await axios.patch(
        `${backendURL}/api/presentations/${presentationId}/slots/${slotId}/attendees`,
        {},
        getAuthHeader()
      );

      if (response.status === 200) {
        onBookingCreated(response.data);
        
        closeModal();
        toast.success("예약 성공했어요!");
        
      }
    } catch (err) {
      toast.error(err.response.data.message || 
        "이미 예약하셨네요!");
    }

  };

  const toggleExpandCard = (presentationId) => {
    if (expandedPresentation === presentationId) {
      setExpandedPresentation(null);
    } else {
      setExpandedPresentation(presentationId);
    }
  };

  return (
    <>
      <div className="modal-header">
        <h1>설명회 예약</h1>
        <button className="close-button" onClick={closeModal}>
          &times; {/* This is the "x" symbol */}
        </button>
      </div>
      <div className="presentation-grid">
        {presentations.map((presentation) => (
          <div
            key={presentation._id}
            className={`presentation-card ${
              expandedPresentation === presentation._id ? "expanded" : ""
            }`}
          >
            <h3>{presentation.name}</h3>
            <div className="presentation-meta">
              <span>
                <MdDateRange />{" "}
                <h5>{new Date(presentation.date).toLocaleDateString()}</h5>
              </span>
              <span>
                <MdPlace /> <h5>{presentation.location}</h5>
              </span>
            </div>
            <p>
              {expandedPresentation === presentation._id
                ? presentation.description
                : `${presentation.description.substring(0, 100)}...`}
            </p>
            {presentation.description.length > 100 && (
              <button
                className="view-more"
                onClick={() => toggleExpandCard(presentation._id)}
              >
                {expandedPresentation === presentation._id
                  ? 
                  "간단히 보기"
                  : "더보기"}
              </button>
            )}
            <h4>
              <MdAccessTime /> 시간대:
            </h4>
            <div className="time-slots">
              {presentation.timeSlots ? (
                presentation.timeSlots.map((slot) => {
                  const userHasBooked = slot.attendees.includes(getUserId());
                  return (
                    <div key={slot._id} className="time-slot">
                      <div className="slot-time">
                        {moment(slot.startTime).format("HH:mm")}
                      </div>
                      <div className="slot-info">
                        <button
                          onClick={() =>
                            handleBooking(presentation._id, slot._id, presentation.name, moment(slot.startTime).format("HH:mm"))
                          
                          }
                          disabled={
                            slot.attendees.length >= slot.maxAttendees ||
                            userHasBooked
                          }
                        >
                          도서 슬롯
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>이 프리젠테이션에 사용할 수 있는 시간이 없습니다.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default BookPresentationModal;
