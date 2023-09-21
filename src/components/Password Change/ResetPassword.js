import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {useNavigate } from 'react-router-dom';  // Import useHistory

function ResetPassword() {
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendURL}/api/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword }),
      });
  
      if (response.ok) {
        toast.success('비밀번호가 변경되었습니다.');
        navigate('/login');  // Use navigate to redirect to the login page
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('인증코드가 발송되지 않았습니다. 다시한번 실행하여주시기 바랍니다.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        type="text"
        placeholder="인증코드"
        value={resetToken}
        onChange={(e) => setResetToken(e.target.value)}
      />
      <input
        style={styles.input}
        type="password"
        placeholder="새로운 비밀번호"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button style={styles.button} onClick={handleResetPassword} disabled={loading}>
        {loading ? "변경하기..." : "변경하기"}
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
