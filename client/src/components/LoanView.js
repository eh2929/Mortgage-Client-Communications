// LoanView.js
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Comments from "./Comments";
import AssignedTasks from "./AssignedTasks";
import "./LoanView.css"; // Import the CSS file

function LoanView() {
  const { id } = useParams();
  const [loanApp, setLoanApp] = useState(null);
  const [loanOfficer, setLoanOfficer] = useState(null);
  const [realEstateAgent, setRealEstateAgent] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5555/loan_applications/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setLoanApp(data);
        return data;
      })
      .then((data) => {
        fetch(`http://127.0.0.1:5555/users/${data.loan_officer_id}`)
          .then((response) => response.json())
          .then((data) => setLoanOfficer(data));
        fetch(`http://127.0.0.1:5555/users/${data.real_estate_agent_id}`)
          .then((response) => response.json())
          .then((data) => setRealEstateAgent(data));
      });
  }, [id]);

  if (!loanApp || !loanOfficer || !realEstateAgent) {
    return null; // or return a loading indicator
  }

  return (
    <div className="loan-view-container">
      <div className="loan-view">
        <h2>Contact Information</h2>
        <p>Name: {loanApp.borrower.name}</p>
        <p>Email: {loanApp.borrower.email}</p>
        <p>Phone Number: {loanApp.borrower.phone_number}</p>
        <p>Property Address: {loanApp.property_address}</p>
        <p>Loan Officer Name: {loanOfficer.name}</p>
        <p>Real Estate Agent Name: {realEstateAgent.name}</p>
        <AssignedTasks loanId={id} />
        <h2>Add A Note</h2>
        <Comments comments={loanApp.comments} />
      </div>
      <Link to="/loan_applications">
        <button className="back-to-loan-apps-button">
          Back to Loan Applications
        </button>
      </Link>
    </div>
  );
}

export default LoanView;
