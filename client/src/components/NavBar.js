import React from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import "./NavBar.css";

function NavBar({ user, updateUser }) {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/loan_applications">Loan Applications</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/login-signup">Login/Signup</Link>
      {user && <Link to="/user_profile">User Profile</Link>}
      {/* Add more links as needed */}
      {user && <Logout updateUser={updateUser} />}{" "}
      {/* Conditionally render the Logout button */}
    </nav>
  );
}

export default NavBar;
