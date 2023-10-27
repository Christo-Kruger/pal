// Logo.js
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../media/logo.png";

const Logo = ({ logoLink }) => {
  const styles = {
    logo: {
      height: "3em",
    },
  };

  return (
    <Link to={logoLink}>
      <img src={logo} alt="Logo" style={styles.logo} />
    </Link>
  );
};

export default Logo;
