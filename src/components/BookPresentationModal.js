import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthHeader, getUserId } from "../utils/auth";
import { toast } from "react-toastify";
import moment from "moment";
import { MdDateRange, MdPlace, MdAccessTime } from "react-icons/md";

import "./BookPresentationModal.css";

function BookPresentationModal({
  presentations: initialPresentations,
  closeModal,
  childData,
  onBookingCreated,
}) {
  const [presentations, setPresentations] = useState(initialPresentations);
  const [expandedPresentation, setExpandedPresentation] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Add fetch presentations function here to get updates every 5 seconds
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleBooking = async (
    presentationId,
    slotId,
    presentationName,
    startTime
  ) => {
    const presentation = presentations.find((p) => p._id === presentationId);
    const child = childData.find(
      (child) => child.ageGroup === presentation.ageGroup
    );
    if (!child) {
      toast.error("이 연령대에는 자녀가 없습니다.");
      return;
    }

    const presentationInfo = `
    설명회: ${presentationName}
    날짜: ${new Date(presentation.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
    시간:  ${(startTime)}
    학생명: ${child.name}
    2024년 학년: ${child.testGrade}
    `;
    const confirmation = window.confirm(
      `아래의 입학설명회 예약정보를 확인해주시기 바랍니다.\n
       ★ 예약 변경 시 원하는 시간 예약이 어려울 수 있습니다.
      \n${presentationInfo}`
    );

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

        const presentationIndex = presentations.findIndex(
          (p) => p._id === presentationId
        );
        const slotIndex = presentations[presentationIndex].timeSlots.findIndex(
          (s) => s._id === slotId
        );

        const updatedPresentations = [...presentations];

        updatedPresentations[presentationIndex].timeSlots[slotIndex].attendees.push(getUserId());
        setPresentations(updatedPresentations);

        closeModal();
        toast.success("예약 성공했어요!");
      }
    } catch (err) {
      toast.error(err.response.data.message || "이미 예약하셨네요!");
    }
  };

  const toggleExpandCard = (presentationId) => {
    if (expandedPresentation === presentationId) {
      setExpandedPresentation(null);
    } else {
      setExpandedPresentation(presentationId);
    }
  };

  useEffect(() => {
    setPresentations(initialPresentations);
 }, [initialPresentations]);
 

  return (
    <div className="book-presentation-modal-new">
      <div className="modal-header-new">
        <h1 style={{ flex: 1, textAlign: "center" }}>J LEE 설명회 예약</h1>
        <button className="close-button" onClick={closeModal}>
          &times;
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
            <h3><strong>{presentation.name}</strong></h3>
            <div className="presentation-meta">
              <h5><MdDateRange /> 일시: {new Date(presentation.date).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</h5>
              <h5><MdPlace /> 장소: {presentation.location}</h5>
            </div>
            <p>{expandedPresentation === presentation._id ? presentation.description : `${presentation.description.substring(0, 100)}...`}</p>
            {presentation.description.length > 100 && (
              <button className="view-more" onClick={() => toggleExpandCard(presentation._id)}>
                {expandedPresentation === presentation._id ? "간단히 보기" : "더보기"}
              </button>
            )}
            <h4><MdAccessTime /> 시간</h4>
            <div className="time-slots">
              {presentation.timeSlots ? (
                presentation.timeSlots.map((slot) => {
                  const userHasBooked = slot.attendees.includes(getUserId());
                  return (
                    <div className="time-slot" onClick={() => {
                      if (slot.attendees.length >= slot.maxAttendees) {
                          toast.error("이미 완전히 예약되었습니다.");
                      }
                  }}>
                      <div className="slot-time">{moment(slot.startTime).format("HH:mm")}</div>
                      <div className="slot-info">
                          <button
    className={`slotButton${slot.attendees.length >= slot.maxAttendees || userHasBooked ? ' disabled-slot' : ''}`}
    onClick={(e) => {
        e.stopPropagation();
        if (!(slot.attendees.length >= slot.maxAttendees || userHasBooked)) {
            handleBooking(
                presentation._id,
                slot._id,
                presentation.name,
                moment(slot.startTime).format("HH:mm")
            );
        }
    }}
    disabled={slot.attendees.length >= slot.maxAttendees || userHasBooked}
>
    {slot.attendees.length >= slot.maxAttendees ? '예약마감' : '예약'}
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
    </div>
  );
}

export default BookPresentationModal;
