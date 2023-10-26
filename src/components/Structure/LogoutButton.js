// LogoutButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const styles = {
    logoutButton: {
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      cursor: "pointer",
      width: "120px",
      height: "40px",
      fontSize: "15px",
      borderRadius: "5px",
    },
  };

  return (
    <button onClick={handleLogout} style={styles.logoutButton}>
      로그 아웃
    </button>
  );
};

export default LogoutButton;
