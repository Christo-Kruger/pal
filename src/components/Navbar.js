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

  if (!isLoggedIn) {
    return null;
  }

  userRole = getUserRole();

  const logoLink = userRole === 'parent' ? "/parent" : "/admin";
 

  return (
    <nav style={styles.navbar}>
      <Link to={logoLink}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </Link>
  
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

  logoutButton: {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    width: '90px',
    height: '40px',
    fontSize: '15px', // Responsive font size using vw unit
    borderRadius: '5px',
  },
};

export default Navbar;
