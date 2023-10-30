import React, { useState, useEffect, useMemo, useCallback } from "react";  // Added useMemo and useCallback
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import {
  getUserId,
  getAuthHeader,
  getAuthToken,
  getUserCampus,
} from "../utils/auth";
import BookPresentations from "../components/Parents/BookPresentations";
import MyPresentations from "../components/Parents/MyPresentations";
import CannotBookCard from "./Presentation/CannotBookCard";
import FindingBookingsLoadingScreen from "./Structure/FindingBookingsLoadingScreen";
import "./BookPresentationModal.css"
import { useFetch } from "./Structure/useFetch";

function BookPresentationModal({
  presentations: initialPresentations,
  closeModal,
  childData,
  triggerRefresh,
}) {
  const [presentations, setPresentations] = useState(
    initialPresentations || []
  );
  const [expandedPresentation, setExpandedPresentation] = useState(null);
  const [myPresentations, setMyPresentations] = useState(null);
  const [error, setError] = useState(null);
  const [localChildData, setLocalChildData] = useState(childData);
  const campus = getUserCampus();
  const [canBook, setCanBook] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Initialize to true to indicate loading
  const [pendingFetches, setPendingFetches] = useState(3);
  const [updatedPresentations, setUpdatedPresentations] = useState([]);

  

  useEffect(() => {
    console.log("useEffect is running");
    const intervalId = setInterval(() => {
      // Add fetch presentations function here to get updates every 5 seconds
    }, 59000);

    return () => clearInterval(intervalId);
  }, []);

  const handleBooking = useCallback(async (
    presentationId,
    slotId,
    presentationName,
    startTime
  ) => {
    const presentation = presentations.find((p) => p._id === presentationId);

    const child = childData;

    if (!child || child.ageGroup !== presentation.ageGroup) {
      toast.error("이 연령대에는 자녀가 없습니다.");
      return;
    }
    const presentationInfo = `
    설명회: ${presentationName}
    날짜: ${new Date(presentation.date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
    시간:  ${startTime}
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
        console.log("Presentations:", presentations);
        console.log("Looking for presentationId:", presentationId);
        const presentationIndex = presentations.findIndex(
          (p) => p._id === presentationId
        );
        console.log("Found presentationIndex:", presentationIndex);

        if (presentationIndex === -1) {
          // Handle presentation not found
          toast.error("Presentation not found");
          return;
        }

        const slotIndex = presentations[presentationIndex].timeSlots.findIndex(
          (slot) => slot.slotId === slotId // use 'slotId' instead of 'id'
        );

        console.log("Found slotIndex:", slotIndex);

        if (slotIndex === -1) {
          // Handle slot not found
          toast.error("Slot not found");
          return;
        }

        const updatedPresentations = [...presentations];

        // Check if presentationIndex is valid
        if (!updatedPresentations[presentationIndex]) {
          console.log("Presentation not found in updated array");
          toast.error("Presentation not found");
          return;
        }

        // Check if slotIndex is valid
        if (!updatedPresentations[presentationIndex].timeSlots[slotIndex]) {
          console.log("Slot not found in updated array");
          toast.error("Slot not found");
          return;
        }

        // Check if attendees array exists, if not, create it.
        if (
          !Array.isArray(
            updatedPresentations[presentationIndex].timeSlots[slotIndex]
              .attendees
          )
        ) {
          console.log(
            "Attendees not found in updated array. Creating an empty array."
          );
          updatedPresentations[presentationIndex].timeSlots[
            slotIndex
          ].attendees = [];
        }

        updatedPresentations[presentationIndex].timeSlots[
          slotIndex
        ].attendees.push(getUserId());

        setPresentations(updatedPresentations);

        triggerRefresh();
        closeModal();
        toast.success("예약 성공했어요!");
      }
    } catch (err) {
      console.log("Error:", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data.message || "이미 예약하셨네요!");
      } else {
        // This means the request didn't even reach the server.
        toast.error("An unknown error occurred.");
      }
    }
  }, [presentations, childData]); 

  const toggleExpandCard = useCallback((presentationId) => {
    if (expandedPresentation === presentationId) {
      setExpandedPresentation(null);
    } else {
      setExpandedPresentation(presentationId);
    }
  }, [expandedPresentation]);  // <-- Dependencies

  useEffect(() => {
    console.log("useEffect is running");
    if (initialPresentations) {
      setPresentations(initialPresentations);
    } else {
    }
  }, [initialPresentations]);

  const { data: myBookings, error: bookingError, isLoading: bookingLoading } = useFetch(`${process.env.REACT_APP_BACKEND_URL}/api/presentations/myBookings`, [], getAuthToken());
  const userId = getUserId();
  const { data: myChildren, error: childrenError, isLoading: childrenLoading } = useFetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/children`, [], getAuthToken());
  
  useEffect(() => {
    if (!bookingLoading && !childrenLoading && !bookingError && !childrenError) {
      const presentationsWithChildName = myBookings.map((presentation) => {
        const childrenInSameAgeGroup = myChildren.filter(
          (child) => child.ageGroup === presentation.ageGroup
        );
        const childNames = childrenInSameAgeGroup.map((child) => child.name).join(", ");
        const childTestGrades = childrenInSameAgeGroup.map((child) => child.testGrade).join(", ");
        return {
          ...presentation,
          childName: childNames,
          testGrade: childTestGrades,
          oldSlotId: presentation.timeSlots[0]._id,
          myQrCode: presentation.myQrCode,
          myAttendance: presentation.myAttendance,
        };
      });
      setMyPresentations(presentationsWithChildName);
    }
    if (bookingError || childrenError) {
      setError("Error fetching my presentations");
    }
  }, [myBookings, myChildren, bookingLoading, childrenLoading, bookingError, childrenError]);

  const handleCancelPresentation = useCallback(async  (presentationId, timeSlotIndex) => {
    if (
      window.confirm(
        `설명회 예약 취소 시 최초 예약 기록은 삭제됩니다. 정말 예약 취소하시겠습니까?  
      ★  최초 예약 기록은 테스트 후 등록 순번에 영향이 있을 수 있습니다.`
      )
    ) {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.delete(
        `${backendURL}/api/presentations/${presentationId}/attendees/${getUserId()}`,
        getAuthHeader()
      );
  
      if (response.status === 200) {
        const newPresentations = updatedPresentations.filter(
          (presentation) => presentation._id !== presentationId
        );
        setUpdatedPresentations(newPresentations);
        toast.success("설명회 예약 취소가 완료되었습니다.");
      } else {
        toast.error(
          "설명회 예약 취소가 정상적으로 완료되지 않았습니다. 다시 시도해주세요."
        );
      }
    }
  }, [updatedPresentations]);
  
  //Fetch can book age groups to see if the user's child's age group can book

  useEffect(() => {
    const fetchCanBookStatus = async () => {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      try {
        const response = await axios.get(
          `${backendURL}/api/canBook/${campus}/${childData.testGrade}`
        ); // Replace with your actual API endpoint

        if (response.data && response.data.canBook === true) {
          setCanBook(true);
        } else {
          setCanBook(false);
        }
      } catch (err) {
        // Handle your errors here
        setCanBook(false);
      } finally {
        // Decrement pending fetches or perform other final actions
        setPendingFetches((prev) => prev - 1);
      }
    };

    fetchCanBookStatus();
  }, [campus, childData.testGrade]); // Depend on both campus and childData.testGrade

  const filteredMyPresentations = useMemo(() => {
    return myPresentations ? myPresentations.filter((p) => p.ageGroup === childData.ageGroup) : [];
  }, [myPresentations, childData.ageGroup]); // <-- Dependencies

  return (
    <div className="book-presentation-modal-new">
      <div className="modal-header-new">
        <h1 style={{ flex: 1, textAlign: "center" }}>J LEE 설명회 예약</h1>
      </div>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FindingBookingsLoadingScreen />
        </div>
      ) : (
        <>
          {filteredMyPresentations.length > 0 ? (
            <MyPresentations
              myPresentations={filteredMyPresentations}
              handleCancelPresentation={handleCancelPresentation}
            />
          ) : (
            <>
              {canBook ? ( // Check both campus and child age group eligibility
                <BookPresentations
                  presentations={presentations}
                  toggleExpandCard={toggleExpandCard}
                  expandedPresentation={expandedPresentation}
                  handleBooking={handleBooking}
                  getUserId={getUserId}
                  toast={toast}
                  moment={moment}
                  //trigger refesh
                  triggerRefresh={triggerRefresh}
                />
              ) : (
                <CannotBookCard />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default BookPresentationModal;