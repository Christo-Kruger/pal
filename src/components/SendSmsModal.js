import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { MdPhone, MdMessage } from "react-icons/md";
import { getAuthHeader } from "../utils/auth";
import "./SendSmsModal.css";

const SendSmsModal = ({ isOpen, onRequestClose, phoneNumbers }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen && phoneNumbers && phoneNumbers.length > 0) {
      setPhoneNumber(phoneNumbers.join(", "));
    }
  }, [isOpen, phoneNumbers]);

  const handleSend = async () => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(
        `${backendURL}/api/sms`,
        { phoneNumber, message },
        getAuthHeader()
      );

      if (response.status === 200) {
        console.log("SMS sent successfully");
        setPhoneNumber("");
        setMessage("");
        onRequestClose("");
      } else {
        console.log("Error sending SMS");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  const handleClose = () => {
    setPhoneNumber("");
    setMessage("");
    onRequestClose();
  };
 
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Send SMS Modal"
      overlayClassName="ReactModal__Overlay"
      className="modal-content"
    >
      <div className="modal-header">
        <h2>Send SMS</h2>
        <div className="input-group">
          <MdPhone className="icon" />
          <input
            className="phone"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone number"
          />
        </div>
        <div className="input-group">
          <MdMessage className="icon" />
          <textarea
            className="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
          />
        </div>
        <div className="buttons-group">
          <button className="button button-primary" onClick={handleSend}>
            Send
          </button>
          <button className="button button-secondary" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SendSmsModal;
