import React, { useState, useEffect } from 'react';
import QRScanner from 'react-qr-scanner';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QRScannerModal = ({ isOpen, onRequestClose }) => {
  const [qrscan, setQrscan] = useState('');
  const [displayData, setDisplayData] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    console.log("QRScan state updated:", qrscan);
  }, [qrscan]);

  const handleScan = async (data) => {
    if (data) {
      setIsScanning(false); 

      const qrText = data.text;
      console.log(qrText);

      setQrscan(qrText);
      setDisplayData(qrText);  

      const qrParts = qrText.split(',');
      const userId = qrParts[3].trim();

      try {
        const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/qr/validateAndUpdateAttendance`, { userId });

        if (response.status === 200) {
          console.log('Attendance validated and updated successfully:', response.data);
          toast.success('Welcome!');  // Toast notification for success
        } else {
          if (response.data.error === "Wrong presentation.") {
            alert('You are at the wrong presentation. Please call the staff member.');
          } else {
            setErrorMessage(response.data.error || 'An unexpected error occurred.');
          }
        }
      } catch (error) {
        if (error.response && error.response.data) {
            console.log('Backend error:', error.response.data);
            if (error.response.data.error === "Wrong presentation.") {
                alert('You are at the wrong presentation. Please call the staff member.');
            } else {
                setErrorMessage(error.response.data.error || 'An unexpected error occurred.');
            }
        } else {
            console.error('Network or other error:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
      } finally {
        setTimeout(() => {
          setIsScanning(true);
          setErrorMessage('');
        }, 500);  
      }
    }
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <button className="close-modal" onClick={onRequestClose}>
            ×
          </button>
          {isScanning ? <QRScanner onScan={handleScan} /> : <div>Scanner paused...</div>}
          <p>Name: {displayData.split(',')[0]}</p>
          <p>Phone Number: {displayData.split(',')[1]}</p>
          <p>Slot Booked: {displayData.split(',')[2]}</p>
          <p>User ID: {displayData.split(',')[3]}</p>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    )
  );
};

export default QRScannerModal;
