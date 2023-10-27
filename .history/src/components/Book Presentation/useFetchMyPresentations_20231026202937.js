import { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserId, getAuthToken } from '../utils/auth';

export const useFetchMyPresentations = () => {
  const [myPresentations, setMyPresentations] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyPresentations = async () => {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const userId = getUserId();
      const token = getAuthToken();

      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const response = await axios.get(`${backendURL}/api/presentations/myBookings`, config);
        
        if (response.status === 200) {
          setMyPresentations(response.data);
        } else {
          setError("Error fetching my presentations");
        }
      } catch (err) {
        setError(err);
      }
    };

    fetchMyPresentations();
  }, []);

  return { myPresentations, error };
};
