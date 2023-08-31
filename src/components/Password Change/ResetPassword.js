import React, { useState } from 'react';
import { toast } from 'react-toastify';

function ResetPassword() {
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendURL}/api/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password has been successfully reset.');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('An error occurred while processing your request.');
    }
  };

  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        type="text"
        placeholder="Reset Token"
        value={resetToken}
        onChange={(e) => setResetToken(e.target.value)}
      />
      <input
        style={styles.input}
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button style={styles.button} onClick={handleResetPassword}>
        Reset Password
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

export default ResetPassword;
