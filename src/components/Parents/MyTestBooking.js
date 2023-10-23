import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import axios from "axios";
import { getAuthHeader } from "../../utils/auth";
import FetchQR from './FetchQR';
import ChangeTest from './ChangeTest';

const MyTestBooking = ({ bookings, setBookings, childData }) => {
  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 예약을 삭제하시겠습니까?")) {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.delete(
        `${backendURL}/api/bookings/${id}`,
        getAuthHeader()
      );

      if (response.status === 200) {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== id)
        );
        toast.success("예약이 성공적으로 삭제되었습니다.");
      } else {
        toast.error("예약을 삭제하는 중에 오류가 발생했습니다.");
      }
    }
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const handleTimeSlotChange = (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId);
    setEditingBooking(booking);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  return (
    <div className="my-bookings">
      {bookings.map((booking) => (
        <Card
          key={booking._id}
          sx={{
            backgroundColor: "#e0f7fa",
            marginBottom: "1rem",
          }}
        >
          <CardContent>
            <Typography variant="h5">{booking.child.name}</Typography>
            <Typography variant="h6">{booking.testSlot.title}</Typography>
            <Typography variant="body1">시험등급: {booking.child.testGrade}</Typography>
            <Typography variant="body1">교정: {booking?.testSlot?.campus}</Typography>
            <Typography variant="body1">
              날짜: {new Date(booking?.testSlot?.date).toLocaleDateString("ko-KR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
            {booking?.testSlot?.timeSlots.map((timeSlot, index) => (
              <Typography key={index} variant="body1">
                시간: {timeSlot.startTime}
              </Typography>
            ))}
            <div>
              <button style={{width:"150px", backgroundColor:"red"}} onClick={() => handleDelete(booking._id)}>취소</button>
              <button style={{width:"150px"}} onClick={() => handleTimeSlotChange(booking._id)}>예약시간변경</button>
            </div>
            <FetchQR bookingId={booking._id} />
          </CardContent>
        </Card>
      ))}
       <Dialog open={isModalVisible} onClose={handleCloseModal}>
      <DialogTitle>Change Test</DialogTitle>
      <DialogContent>
        <ChangeTest
          bookingId={editingBooking?._id}  // passing bookingId here
          setBookings={setBookings}
          childData={childData}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};


export default MyTestBooking;
