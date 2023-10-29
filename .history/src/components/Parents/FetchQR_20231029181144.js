// import React, { useEffect, useState } from "react";

// const FetchQR = ({ bookingId }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const backendURL = process.env.REACT_APP_BACKEND_URL; // Moved outside the function

//   const fetchQRCode = async (bookingId) => {
//     try {
//       const response = await fetch(
//         `${backendURL}/api/bookings/qr/${bookingId}`
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed fetching QR code:", error);
//       setError(error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQRCode(bookingId);
//   }, [bookingId]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error loading QR Code: {error.message}</p>;
//   }

//   return (
//     <img
//       src={`${backendURL}/api/bookings/qr/${bookingId}`}
//       alt="QR Code"
//       onError={() => setError(new Error("Failed to load image"))}
//     />
//   );
// };

// export default FetchQR;
