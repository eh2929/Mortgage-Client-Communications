import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import CreateLoanApplication from "./CreateLoanApplication";
import "./LoanApp.css";

function LoanApps() {
  const [loanApps, setLoanApps] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

const fetchLoanApps = () => {
  fetch("http://127.0.0.1:5555/loan_applications")
    .then((response) => response.json())
    .then((data) => {
      console.log("Loan Applications Data", data);
      Array.isArray(data) ? setLoanApps(data) : setLoanApps([]);
    });
};

  useEffect(() => {
    fetchLoanApps();

    const loggedIn = localStorage.getItem("isUserLoggedIn") === "true";
    const role = localStorage.getItem("userRole");

    console.log("Is User Logged In:", loggedIn); // Log the loggedIn status
    console.log("User Role:", role); // Log the user role

    setIsUserLoggedIn(loggedIn);
    setUserRole(role);
  }, []);

  return (
    <div className="loan-apps-container">
      <Search />
      <div className="loan-apps-list">
        {loanApps.map((loanApp, index) => (
          <div key={index} className="loan-app">
            <h2>{loanApp.borrower_name}</h2>
            <p>{loanApp.property_address}</p>
            <p>{loanApp.loan_officer_id}</p>
            <Link to={`/loan_applications/${loanApp.id}`}>
              <button>View Loan</button>
            </Link>
          </div>
        ))}
      </div>
      <CreateLoanApplication
        onLoanApplicationCreated={fetchLoanApps}
        isUserLoggedIn={isUserLoggedIn}
        userRole={userRole}
      />
    </div>
  );
}

export default LoanApps;
