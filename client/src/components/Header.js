// Header.js
import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
// import logo from "./Logo.jpg"; // Import your logo image

function Header() {
  return (
    <header className="header bg-blue-500 p-4 flex justify-between items-center">
      <div className="logo-container">
        {/* <img src={logo} alt="Logo" className="logo h-16" /> */}
      </div>
      <div className="nav-container">
        <div className="navbar">
          <NavBar />
        </div>
      </div>
      {/* Other header content */}
    </header>
  );
}

export default Header;
