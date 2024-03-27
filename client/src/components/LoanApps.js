import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import CreateLoanApplication from "./CreateLoanApplication";
import { Button } from "./ui/button.jsx";


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
    <div className="loan-apps-container p-8">
      <Search />
      <div className="loan-apps-content mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="loan-apps-list">
          {loanApps.map((loanApp, index) => (
            <div key={index} className="loan-app p-4 rounded shadow">
              <div className="loan-app-header">
                <h2 className="font-bold text-lg">{loanApp.borrower_name}</h2>
              </div>
              <div className="loan-app-details mt-2">
                <p>{loanApp.property_address}</p>
                <p>{loanApp.loan_officer_id}</p>
              </div>
              <div className="loan-app-actions mt-4">
                <Link to={`/loan_applications/${loanApp.id}`}>
                  <Button className="bg-blue-500 text-white p-2 rounded">
                    View Loan
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="loan-apps-create">
          <CreateLoanApplication
            onLoanApplicationCreated={fetchLoanApps}
            isUserLoggedIn={isUserLoggedIn}
            userRole={userRole}
            className="bg-white p-4 rounded shadow"
          />
        </div>
      </div>
    </div>
  );
}

export default LoanApps;
