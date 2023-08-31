import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserRole, getUserName, getUserCampus } from "../utils/auth";
import logo from "../media/logo.png";

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  let userRole;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const sidebarRef = useRef(null);
  const userName = getUserName();
  const campus = getUserCampus();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
    }
  };

  useEffect(() => {
    const closeSidebar = (event) => {
      if (
        sidebarRef.current &&
        hamburgerRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", closeSidebar);

    return () => {
      document.removeEventListener("mousedown", closeSidebar);
    };
  }, []);

  if (!isLoggedIn || location.pathname === "/") {
    return null;
  }

  userRole = getUserRole();

  const isAdmin = userRole === "admin" || userRole === "superadmin";
  const isSuperAdmin = userRole === "superadmin";
  const isParent = userRole === "parent";

  const logoLink = isParent ? "/parent" : "/admin";

  const styles = {
    navbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1em",
      backgroundColor: isSuperAdmin ? "#364150" : "#f5f5f5",
    },
    campusName: {
      marginRight: "10px",
      fontSize: "18px",
      color: "black",
    },
    logo: {
      height: "4em",
    },
    hamburger: {
      fontSize: "2em",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#333333",
    },
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
    sidebar: {
      position: "fixed",
      top: "0",
      left: "0",
      height: "100%",
      width: "200px",
      backgroundColor: "#333",
      color: "white",
      padding: "1em",
      transition: "transform 0.3s",
      zIndex: 1000,
    },
    sidebarLink: {
      display: "block",
      padding: "1em 0",
      color: "white",
      textDecoration: "none",
    },
  };

  return (
    <nav
      style={{
        ...styles.navbar,
        backgroundColor: isSuperAdmin ? "#2b3643" : "#f5f5f5",
      }}
    >
      {isParent && (
        <button
          ref={hamburgerRef}
          onClick={toggleSidebar}
          style={styles.hamburger}
        >
          ☰
        </button>
      )}
      <Link to={logoLink}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </Link>
      {isSuperAdmin && (
        <span style={{ ...styles.campusName, color: "white" }}>
          Super Admin
        </span>
      )}
      {isAdmin && !isSuperAdmin && campus && (
        <span style={styles.campusName}>{campus}</span>
      )}
      <button onClick={handleLogout} style={styles.logoutButton}>
        로그 아웃
      </button>

      {isParent && (
        <div
          ref={sidebarRef}
          style={{
            ...styles.sidebar,
            transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <div
            style={{ padding: "1em 0", fontWeight: "bold", fontSize: "1.2em" }}
          >
            {userName}님, 안녕하세요
          </div>
          <Link to="/parent" style={styles.sidebarLink} onClick={() => setIsSidebarOpen(false)}>
  예약 정보
</Link>
          <Link to="/update-child" style={styles.sidebarLink}>
            등록학생정보
          </Link>
          <Link to="/update-details" style={styles.sidebarLink}>
            내 정보
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
