import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserRole } from "../utils/auth";
import logo from '../media/logo.png';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  let userRole; 

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoggedIn) {
    userRole = getUserRole();
  } else {
    return null;
  }

  const logoLink = userRole === 'parent' ? "/parent" : "/admin";
  const headerText = userRole === 'parent' ? "Welcome to the Jlee Parent Booking Portal" : "Welcome to the Jlee Admin Portal";

  return (
    <nav style={styles.navbar}>
      <Link to={logoLink}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </Link>
      <h1 style={styles.header}>{headerText}</h1>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1em',
    backgroundColor: '#f5f5f5',
  },
  logo: {
    height: '3em',
  },
  header: {
    margin: 0,
    fontSize: 'calc(12px + 2vw)', // Responsive font size using vw unit
    fontWeight: 'bold',
    textAlign: 'center', // Center align the text
  },
  logoutButton: {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    padding: '0.5em 1em',
    cursor: 'pointer',
  },
};

export default Navbar;
