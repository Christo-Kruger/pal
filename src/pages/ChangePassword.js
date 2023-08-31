import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../media/logo.png";

import RequestPasswordResetComponent from '../components/Password Change/RequestPasswordReset';
import ResetPasswordComponent from '../components/Password Change/ResetPassword';

function ChangePassword() {
  const navigate = useNavigate();
  const [showResetPassword, setShowResetPassword] = useState(false);

  return (
    <div style={styles.container}>
      <img src={Logo} alt="Logo" style={styles.logo} onClick={() => navigate('/')} />
      <div style={styles.content}>
        {!showResetPassword ? (
          <RequestPasswordResetComponent onResetRequested={() => setShowResetPassword(true)} />
        ) : (
          <ResetPasswordComponent />
        )}
        <button style={styles.cancelButton} onClick={() => navigate('/')}>
          Cancel
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px',
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: '200px',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  content: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
  },
  cancelButton: {
    marginTop: '20px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#d9534f',
    color: '#ffffff',
    cursor: 'pointer',
  },
};

export default ChangePassword;
