import React, { useState } from 'react';
import { toast } from 'react-toastify';

function RequestPasswordReset({ onResetRequested }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleRequestPasswordReset = async () => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendURL}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
  
      if (response.ok) {
        toast.success('SMS has been sent. Please check your phone.');
        onResetRequested();
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while processing your request.');
    }
  };
  

  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button style={styles.button} onClick={handleRequestPasswordReset}>
        Request Password Reset
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: '#ffffff',
    border: 'none',
  },
};

export default RequestPasswordReset;
