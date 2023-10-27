import { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserCampus } from '../utils/auth';

export const useFetchCampuses = () => {
  const [canBookCampus, setCanBookCampus] = useState(false);
  const campus = getUserCampus();

  useEffect(() => {
    const fetchCampuses = async () => {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      try {
        const response = await axios.get(`${backendURL}/api/campus`);
        const campuses = response.data;
        const userCampus = campuses.find((c) => c.name === campus);

        if (userCampus && userCampus.canBook) {
          setCanBookCampus(true);
        }
      } catch (err) {
        console.error("Error fetching campuses:", err);
      }
    };

    fetchCampuses();
  }, [campus]);

  return { canBookCampus };
};
