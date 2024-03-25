import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard flex flex-col items-center justify-center h-screen bg-gray-100">
      <Link
        to="/loan_applications"
        className="dashboard-card bg-blue-500 text-white p-6 m-4 rounded shadow-lg w-1/2 text-center"
      >
        <h2>Start or Track a Loan Application</h2>
      </Link>
      <Link
        to="/tasks"
        className="dashboard-card bg-green-500 text-white p-6 m-4 rounded shadow-lg w-1/2 text-center"
      >
        <h2>View or Create Tasks for Clients</h2>
      </Link>
      <Link
        to="/login-signup"
        className="dashboard-card bg-red-500 text-white p-6 m-4 rounded shadow-lg w-1/2 text-center"
      >
        <h2>Login/Signup</h2>
      </Link>
      <Link
        to="/user_profile"
        className="dashboard-card bg-purple-500 text-white p-6 m-4 rounded shadow-lg w-1/2 text-center"
      >
        <h2>Manage Your Profile</h2>
      </Link>
    </div>
  );
}

export default Dashboard;
