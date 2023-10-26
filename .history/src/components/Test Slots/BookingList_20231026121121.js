import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { getAuthHeader } from "../../utils/auth";
import SendSmsModal from "../../components/SendSmsModal";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState([]);
  const [smsMode, setSmsMode] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState([]);

  const [userCampus, setUserCampus] = useState('');
  const [userRole, setUserRole] = useState('');

  function handleSelectBookingChange(event, item) {
    switch (event.target.value) {
      case "cancel":
        if (window.confirm("Are you sure you want to cancel this record?")) {
          handleBookingCancel(item._id);
        }
        break;
      case "paid":
        if (window.confirm("Are you sure you want to mark this as paid?")) {
          handleBookingPayment(item._id);
        }
        break;
      case "sms":
        setSelectedPhoneNumbers((prevPhoneNumber) => [
          ...prevPhoneNumber,
          item.parent.phone,
        ]);
        setSmsMode(true); // Open SMS modal
        break;
      default:
        break;
    }
  }

    //To cancel Booking
    const handleBookingCancel = async (id) => {
        try {
          const backendURL = process.env.REACT_APP_BACKEND_URL;
          const response = await axios.delete(
            `${backendURL}/api/bookings/admin/delete/${id}`,
            getAuthHeader()
          );
    
          if (response.status === 200) {
            const updatedBookings = bookings.filter(
              (booking) => booking._id !== id
            );
            setBookings(updatedBookings);
            toast.success("Booking successfully cancelled.");
          } else {
            console.log("Error deleting booking");
            toast.error("Error deleting booking.");
          }
        } catch (error) {
          console.error(error);
          toast.error("Operation failed.");
        }
      };
//Update Payment
      const handleBookingPayment = async (id) => {
        try {
          const backendURL = process.env.REACT_APP_BACKEND_URL;
          const response = await axios.patch(
            `${backendURL}/api/bookings/payment/${id}`,
            {},
            getAuthHeader()
          );
    
          if (response.status === 200) {
            const updatedBookings = bookings.map((booking) =>
              booking._id === id ? { ...booking, paid: true } : booking
            );
            setBookings(updatedBookings);
            toast.success("Booking marked as paid.");
          } else {
            console.log("Error updating booking");
            toast.error("Error updating booking.");
          }
        } catch (error) {
          console.log("Error updating booking:", error);
          toast.error(`Error updating the booking. ${error.message}`);
        }
      };
    

      useEffect(() => {
        // Step 2: Populate states from localStorage
        setUserCampus(localStorage.getItem("userCampus"));
        setUserRole(localStorage.getItem("userRole")); // Assuming you store userRole in localStorage. If not, this will need to be fetched or set up another way.
    
        const fetchBookings = async () => {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/bookings`
            );
    
            // Step 3: Filter bookings based on the user's role and campus
            if (userRole === "superadmin") {
              setBookings(response.data); // Show all bookings if superadmin
            } else {
              const filteredBookings = response.data.filter((booking) =>
                booking.testSlot && booking.testSlot.campus === userCampus
              );
              setBookings(filteredBookings); // Show only bookings of the user's campus if not superadmin
    
            }
          } catch (error) {
            console.log("Error fetching bookings:", error);
          }
        };
    
        fetchBookings();
      }, [userCampus, userRole]);

      const columns = [
        {
          field: 'childName',
          headerName: 'Child',
          width: 150,
          valueGetter: (params) => params.row.child?.name
        },
        {
          field: 'group',
          headerName: 'Group',
          width: 120,
          valueGetter: (params) => params.row.child?.group?.name || "N/A"
        },
        {
          field: 'testGrade',
          headerName: 'Test Grade',
          width: 120,
          valueGetter: (params) => params.row.child?.testGrade
        },
        {
          field: 'dob',
          headerName: 'DOB',
          width: 120,
          valueGetter: (params) => params.row.child ? new Date(params.row.child.dateOfBirth).toLocaleDateString() : ""
        },
        {
          field: 'gender',
          headerName: 'Gender',
          width: 100,
          valueGetter: (params) => params.row.child?.gender
        },
        {
          field: 'campus',
          headerName: 'Campus',
          width: 130,
          valueGetter: (params) => params.row.testSlot?.campus
        },
        {
          field: 'testSlot',
          headerName: 'Test Slot',
          width: 100,
          valueGetter: (params) => params.row.testSlot && params.row.testSlot.timeSlots && params.row.testSlot.timeSlots.length > 0 ? params.row.testSlot.timeSlots[0].startTime : "N/A"
        },
        {
          field: 'date',
          headerName: 'Date',
          width: 120,
          valueGetter: (params) => params.row.testSlot ? new Date(params.row.testSlot.date).toLocaleDateString() : ""
        },
        {
          field: 'parentPhone',
          headerName: 'Parent Number',
          width: 150,
          valueGetter: (params) => params.row.parent?.phone
        },
        {
          field: 'actions',
          headerName: 'Actions',
          width: 200,
          renderCell: (params) => (
            <select
              onChange={(e) => handleSelectBookingChange(e, params.row)}
            >
              <option value="">Select an action</option>
              <option value="cancel">Cancel</option>
              <option value="paid">Paid</option>
              <option value="sms">Send SMS</option>
            </select>
          )
        },
        {
          field: 'paid',
          headerName: 'Paid',
          width: 90,
          valueGetter: (params) => params.row.paid ? "Yes" : "No"
        }
      ];
      
      const NoRowsOverlay = () => {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>No data</div>;
      };
      
      
    
      return (
        <div>
          <SendSmsModal
            key={smsMode}
            isOpen={smsMode}
            onRequestClose={() => {
              setSmsMode(false);
              setSelectedPhoneNumbers([]);
              setSelectedAttendees([]);
            }}
            phoneNumber={
              selectedPhoneNumbers.length > 0 ? selectedPhoneNumbers[0] : ""
            }
            phoneNumbers={[
              ...selectedPhoneNumbers,
              ...selectedAttendees.map((attendee) => attendee.phone),
            ]}
          />
          <h2>Test Takers</h2>
          <div style={{ height: 600, width: '100%' }}>
            <DataGrid 
              rows={bookings} 
              columns={columns} 
              pageSize={10} 
              rowsPerPageOptions={[10]}
              noRowsOverlay={<NoRowsOverlay />}
              getRowId={(row) => row._id}

            />
          </div>
        </div>
      );
    };
    
    export default BookingList;