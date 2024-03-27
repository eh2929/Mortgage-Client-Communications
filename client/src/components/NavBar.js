import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { UserContext } from "./UserContext"; // Import UserContext

function NavBar() {
  const { user } = useContext(UserContext); // Use UserContext

  return (
    <nav className="flex justify-between items-center p-4 flex-grow">
      <div className="flex items-center">
        <Link to="/" className="text-white mr-4">
          Home
        </Link>
        <Link to="/loan_applications" className="text-white mr-4">
          Loan Applications
        </Link>
        <Link to="/tasks" className="text-white mr-4">
          Tasks
        </Link>
      </div>
      <div className="flex items-center">
        <Link to="/login-signup" className="text-white mr-4">
          Login/Signup
        </Link>
        {user && (
          <Link to="/user_profile" className="text-white mr-4">
            User Profile
          </Link>
        )}
        {user && <Logout />}
      </div>
    </nav>
  );
}

export default NavBar;
