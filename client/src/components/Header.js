// Header.js
import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import logo from "./Logo.jpg"; // Import your logo image
import "./Header.css";

function Header({ user, updateUser}) {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="nav-container">
        <div className="navbar">
          <NavBar user={user} updateUser={updateUser} />
        </div>
      </div>
      {/* Other header content */}
    </header>
  );
}

export default Header;
