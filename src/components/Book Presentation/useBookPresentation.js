import { useState, useEffect } from "react";
import axios from "axios";
import {
  getUserId,
  getAuthHeader,
  getAuthToken,
  getUserCampus,
} from "../../utils/auth";

const useBookPresentation = (initialPresentations, childData) => {
  const [presentations, setPresentations] = useState(
    initialPresentations || []
  );
  const [expandedPresentation, setExpandedPresentation] = useState(null);
  const [myPresentations, setMyPresentations] = useState(null);
  const [error, setError] = useState(null);
  const [localChildData, setLocalChildData] = useState(childData);
  const campus = getUserCampus();
  const [canBook, setCanBook] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingFetches, setPendingFetches] = useState(3);

  const fetchMyPresentations = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const userId = getUserId();
    const token = getAuthToken();

    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const [presentationResponse, childrenResponse] = await Promise.all([
        axios.get(`${backendURL}/api/presentations/myBookings`, config),
        axios.get(`${backendURL}/api/users/${userId}/children`, config),
      ]);

      if (
        presentationResponse.status === 200 &&
        childrenResponse.status === 200
      ) {
        const myChildren = childrenResponse.data;
        setLocalChildData(myChildren); // update localChildData state variable

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

              myAttendance: presentation.myAttendance,
            };
          }
        );
        setMyPresentations(presentationsWithChildName);
      } else {
        setError("Error fetching my presentations");
      }
    } catch (error) {
      setError("Error fetching my presentations");
    } finally {
      setPendingFetches((prev) => prev - 1);
    }
  };

  useEffect(() => {
    fetchMyPresentations();
  }, []);

  return {
    presentations,
    expandedPresentation,
    setExpandedPresentation,
    myPresentations,
    setMyPresentations,
    error,
    localChildData,
    setLocalChildData,
    canBook,
    isLoading,
    pendingFetches,
    setPendingFetches,
  };
};

export default useBookPresentation;
