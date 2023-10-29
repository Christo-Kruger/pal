import React from 'react';
import axios from "axios";
import { useState, useEffect } from "react";
import {
  getUserId,
  getAuthToken,
} from "../../utils/auth";

function BasicPres({ childData }) {
  const [myPresentations, setMyPresentations] = useState([]);
  const [localChildData, setLocalChildData] = useState(childData);
  const [error, setError] = useState(null);

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

      if (presentationResponse.status === 200 && childrenResponse.status === 200) {
        const myChildren = childrenResponse.data;
        setLocalChildData(myChildren);

        const presentationsWithChildName = presentationResponse.data.map((presentation) => {
          const childrenInSameAgeGroup = myChildren.filter((child) => child.ageGroup === presentation.ageGroup);
          const childNames = childrenInSameAgeGroup.map((child) => child.name).join(", ");
          const childTestGrades = childrenInSameAgeGroup.map((child) => child.testGrade).join(", ");
          return {
            ...presentation,
            childName: childNames,
            testGrade: childTestGrades,
            oldSlotId: presentation.timeSlots[0]._id,
          
          };
        });
        setMyPresentations(presentationsWithChildName);
      } else {
        setError("Error fetching my presentations");
      }
    } catch (err) {
      setError("Error fetching my presentations");
    }
  };

  useEffect(() => {
    fetchMyPresentations();
  }, []);

  const filteredMyPresentations = myPresentations
    ? myPresentations.filter((p) => p.ageGroup === childData.ageGroup)
    : [];

    return (
      <div >
        {filteredMyPresentations.map((presentation, index) => (
          <div key={index}>
                   <h4 style={{textAlign:"center"}}>
          날짜:{" "}
          {new Date(presentation.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }) +
            " " +
            new Date(presentation.timeSlots[0].startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }) +
            " (" +
            new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
              new Date(presentation.date)
            ) +
            ")"}
        </h4>
            {/* {presentation.myQrCode && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={`data:image/png;base64,${presentation.myQrCode}`}
                  alt="User QR Code"
                />
              </div> */}
            )}
          </div>
        ))}
        {error && <div>{error}</div>}
      </div>
    );
  }
  
  export default BasicPres;
