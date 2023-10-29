// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import SendSmsModal from "../components/SendSmsModal";
// import { getAuthHeader, getUserRole } from "../utils/auth";
// import "./AdminDashboard.css";

// function ViewBookedTest() {
//   const [bookings, setBookings] = useState([]);
//   const [filteredCampus, setFilteredCampus] = useState("");
//   const [filteredChildName, setFilteredChildName] = useState("");
//   const [smsMode, setSmsMode] = useState(false);
//   const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState([]);

//   const handleSelectBookingChange = (event, item) => {
//     switch (event.target.value) {
//       case "cancel":
//         if (window.confirm("Are you sure you want to cancel this record?")) {
//           handleBookingCancel(item._id);
//         }
//         break;
//       case "paid":
//         if (window.confirm("Are you sure you want to mark this as paid?")) {
//           handleBookingPayment(item._id);
//         }
//         break;
//       case "sms":
//         setSelectedPhoneNumbers((prevPhoneNumbers) => [
//           ...prevPhoneNumbers,
//           item.parent.phone,
//         ]);
//         setSmsMode(true); // Open SMS modal
//         break;
//       default:
//         break;
//     }
//   };

//   const fetchBookings = async () => {
//     try {
//       const backendURL = process.env.REACT_APP_BACKEND_URL;
//       const userRole = getUserRole();

//       if (userRole === "admin") {
//         let url = `${backendURL}/api/bookings/admin`;

//         if (filteredCampus || filteredChildName) {
//           url += "?";

//           if (filteredCampus) {
//             url += `campus=${filteredCampus}&`;
//           }

//           if (filteredChildName) {
//             url += `childName=${filteredChildName}&`;
//           }

//           url = url.slice(0, -1);
//         }

//         const response = await axios.get(url, getAuthHeader());

//         if (response.status === 200) {
//           setBookings(response.data);
//         } else {
//           console.log("Error fetching bookings");
//         }
//       } else {
//         console.log("Access denied: User is not an admin");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };


//   //To cancel Booking
//   const handleBookingCancel = async (id) => {
//     try {
//       const backendURL = process.env.REACT_APP_BACKEND_URL;
//       const response = await axios.delete(
//         `${backendURL}/api/bookings/admin/delete/${id}`,
//         getAuthHeader()
//       );

//       if (response.status === 200) {
//         const updatedBookings = bookings.filter(
//           (booking) => booking._id !== id
//         );
//         setBookings(updatedBookings);
//       } else {
//         console.log("Error deleting booking");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleBookingPayment = async (id) => {
//     try {
//       const backendURL = process.env.REACT_APP_BACKEND_URL;
//       const response = await axios.patch(
//         `${backendURL}/api/bookings/payment/${id}`,
//         {},
//         getAuthHeader()
//       );

//       if (response.status === 200) {
//         const updatedBookings = bookings.map((booking) =>
//           booking._id === id ? { ...booking, confirmed: true } : booking
//         );
//         setBookings(updatedBookings);
//       } else {
//         console.log("Error updating booking");
//       }
//     } catch (error) {
//       console.log("Error updating booking:", error);
//       alert(`Error updating the booking. ${error.message}`);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, [filteredCampus, filteredChildName]);
  
//   return (
//     <div>
//       <SendSmsModal
//         isOpen={smsMode}
//         onRequestClose={() => setSmsMode(false)}
//         phoneNumbers={selectedPhoneNumbers}
//       />
//       <h2>Booked Tests</h2>
//       <div className="filter-container">
//         <label className="filter-label">
//           Filter by Campus:
//           <select
//             className="filter-select"
//             value={filteredCampus}
//             onChange={(e) => setFilteredCampus(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="Suji">Suji</option>
//             <option value="Dongtan">Dongtan</option>
//             <option value="Bundang">Bundang</option>
//           </select>
//         </label>
//         <label className="filter-label">
//           Filter by Name:
//           <input
//             className="filter-input"
//             type="text"
//             value={filteredChildName}
//             onChange={(e) => setFilteredChildName(e.target.value)}
//           />
//         </label>
//         <button className="filter-button" onClick={fetchBookings}>
//           Apply Filters
//         </button>
//       </div>
//       <table className="bookings-table">
//         <thead>
//           <tr>
//             <th>Child Name</th>
//             <th>Age</th>
//             <th>Gender</th>
//             <th>Campus</th>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Parent Name</th>
//             <th>Parent Number</th>
//             <th>Action</th>
//             <th>Paid</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((booking) => (
//             <tr key={booking._id}>
//               <td>{booking.child.name}</td>
//               <td>{booking.child.age}</td>
//               <td>{booking.child.gender}</td>
//               <td>{booking.campus}</td>
//               <td>{new Date(booking.date).toLocaleDateString()}</td>
//               <td>{booking.time}</td>
//               <td>{booking.parent.name}</td>
//               <td>{booking.parent.phone}</td>
//               <td>
//                 <select onChange={(e) => handleSelectBookingChange(e, booking)}>
//                   <option value="">Select an action</option>
//                   <option value="cancel">Cancel</option>
//                   <option value="paid">Paid</option>
//                   <option value="sms">Send SMS</option>
//                 </select>
//               </td>
//               <td>{booking.confirmed ? "Yes" : "No"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default ViewBookedTest;
