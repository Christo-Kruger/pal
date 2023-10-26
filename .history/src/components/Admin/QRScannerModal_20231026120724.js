import React, { useState, useEffect } from 'react';
import QRScanner from 'react-qr-scanner';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './QRScannerModal.css';  // Assuming you have a CSS file named QRScannerModal.css in the same directory


const QRScannerModal = ({ isOpen, onRequestClose }) => {
  const [qrscan, setQrscan] = useState(null);
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

      try {
        const qrData = JSON.parse(qrText);
        const userId = qrData.userId;

        setQrscan(qrData);

        const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/qr/validateAndUpdateAttendance`, { userId });

        if (response.status === 200) {
          console.log('Attendance validated and updated successfully:', response.data);
          toast.success('Welcome!', { position: toast.POSITION.TOP_CENTER });
        } else {
          if (response.data.error === "Wrong presentation.") {
            toast.error('You are at the wrong presentation. Please call the staff member.', { position: toast.POSITION.TOP_CENTER });
          } else {
            setErrorMessage(response.data.error || 'An unexpected error occurred.');
          }
        }

      } catch (error) {
        if (error.response && error.response.data) {
          console.log('Backend error:', error.response.data);
          if (error.response.data.error === "Wrong presentation.") {
            toast.error('You are at the wrong presentation. Please call the staff member.', { position: toast.POSITION.TOP_RIGHT });
          } else {
            toast.error(error.response.data.error || 'An unexpected error occurred.', { position: toast.POSITION.TOP_RIGHT });
          }
        } else {
          console.error('Network or other error:', error);
          toast.error('An unexpected error occurred. Please try again.', { position: toast.POSITION.TOP_RIGHT });
        }
      } finally {
        setTimeout(() => {
          setIsScanning(true);
          setErrorMessage('');
        }, 500);
      }
    }
  }

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <button className="close-modal" onClick={onRequestClose}>
            ×
          </button>
          <div className="scanner-container">
            {isScanning ? <QRScanner onScan={handleScan} /> : <div className="scanner-paused">Scanner paused...</div>}
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    )
  );
};

export default QRScannerModal;
