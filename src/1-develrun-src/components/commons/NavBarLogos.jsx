
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NavBarLogos = ({ isHamburger }) => {
  const theme = useSelector((state) => state.app.theme);

  if (isHamburger) return null;

  return (
    <div className="logos">
            <img
        src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
        alt="Logo"
        className="navbar-logo" />
      
        </div>);

};

export default NavBarLogos;