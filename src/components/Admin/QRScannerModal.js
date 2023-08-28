import React, { useState } from 'react';
import QRScanner from 'react-qr-scanner';
import axios from 'axios';

const QRScannerModal = ({ isOpen, onRequestClose }) => {
  const [qrscan, setQrscan] = useState('');

  const handleScan = async (data) => {
    if (data) {
      const qrText = data.text;
      console.log(qrText);
      setQrscan(qrText);
      const userId = qrText.split(',')[3].trim();
      try {
        const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/qr/${userId}/attendedPresentation`, { attended: true });
        console.log('Attendance updated successfully:', response.data);
      } catch (error) {
        console.error('An error occurred while updating attendance:', error);
      }
    }
  };

  const qrParts = qrscan.split(',');
  const name = qrParts[0];
  const phoneNumber = qrParts[1];
  const slotBooked = qrParts[2];
  const userId = qrParts[3];

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <button className="close-modal" onClick={onRequestClose}>
            ×
          </button>
          <QRScanner onScan={handleScan} />
          <p>Name: {name}</p>
          <p>Phone Number: {phoneNumber}</p>
          <p>Slot Booked: {slotBooked}</p>
          <p>User ID: {userId}</p>
        </div>
      </div>
    )
  );
};

export default QRScannerModal;
