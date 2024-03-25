import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { UserContext } from "./UserContext"; // Import UserContext

function NavBar() {
  const { user } = useContext(UserContext); // Use UserContext

  return (
    <nav className="flex bg-blue-500 p-4">
      <Link to="/" className="text-white mr-4">
        Home
      </Link>
      <Link to="/loan_applications" className="text-white mr-4">
        Loan Applications
      </Link>
      <Link to="/tasks" className="text-white mr-4">
        Tasks
      </Link>
      <Link to="/login-signup" className="text-white mr-4">
        Login/Signup
      </Link>
      {user && (
        <Link to="/user_profile" className="text-white mr-4">
          User Profile
        </Link>
      )}
      {/* Add more links as needed */}
      {user && <Logout />} {/* Conditionally render the Logout button */}
    </nav>
  );
}

export default NavBar;
