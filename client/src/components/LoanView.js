// LoanView.js
import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Comments from "./Comments";
import AssignedTasks from "./AssignedTasks";
import UserDropdown from "./UserDropdown";
import { Button } from "./ui/button";

function LoanView() {
  const { id } = useParams();
  const [loanApp, setLoanApp] = useState(null);
  const [loanOfficer, setLoanOfficer] = useState(null);
  const [realEstateAgent, setRealEstateAgent] = useState(null);
  const [borrower, setBorrower] = useState(null);
  const [loanOfficers, setLoanOfficers] = useState([]);
  const [realEstateAgents, setRealEstateAgents] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [propertyAddress, setPropertyAddress] = useState("");

  useEffect(() => {
    // Update propertyAddress when loanApp changes
    if (loanApp) {
      setPropertyAddress(loanApp.property_address);
    }
  }, [loanApp]);

  useEffect(() => {
    // Fetch the loan application data whenever the id changes
    fetch(`http://127.0.0.1:5555/loan_applications/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setLoanApp(data);
      });
  }, [id]);

  useEffect(() => {
    // Fetch all loan officers, real estate agents, and borrowers
    Promise.all([
      fetch(`http://127.0.0.1:5555/users?role=loan officer`),
      fetch(`http://127.0.0.1:5555/users?role=real estate agent`),
      fetch(`http://127.0.0.1:5555/users?role=borrower`),
      fetch(`http://127.0.0.1:5555/loan_applications/${id}`),
    ])
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then(
        ([
          loanOfficersData,
          realEstateAgentsData,
          borrowersData,
          loanAppData,
        ]) => {
          console.log("Loan officers:", loanOfficersData);
          console.log("Real estate agents:", realEstateAgentsData);
          console.log("Borrowers:", borrowersData);
          console.log("Loan application:", loanAppData);
          setLoanOfficers(loanOfficersData);
          setRealEstateAgents(realEstateAgentsData);
          setBorrowers(borrowersData);
          setLoanApp(loanAppData);
          const loanOfficer = loanOfficersData.find(
            (officer) => officer.id === loanAppData.loan_officer_id
          );
          const realEstateAgent = realEstateAgentsData.find(
            (agent) => agent.id === loanAppData.real_estate_agent_id
          );
          const borrower = borrowersData.find(
            (borrower) => borrower.id === loanAppData.borrower_id
          );
          if (loanOfficer) {
            setLoanOfficer(loanOfficer);
          }
          if (realEstateAgent) {
            setRealEstateAgent(realEstateAgent);
          }
          if (borrower) {
            setBorrower(borrower);
          }
        }
      );
  }, [id]);

  const handleLoanOfficerChange = useCallback((newLoanOfficer) => {
    console.log("New Loan Officer:", newLoanOfficer);

    if (newLoanOfficer) {
      setLoanOfficer(newLoanOfficer);
    } else {
      console.error("Could not set new loan officer");
    }
  }, []);

  const handleRealEstateAgentChange = useCallback((newRealEstateAgent) => {
    console.log("New Real Estate Agent:", newRealEstateAgent);

    if (newRealEstateAgent) {
      setRealEstateAgent(newRealEstateAgent);
    } else {
      console.error("Could not set new real estate agent");
    }
  }, []);

  if (!loanApp) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const updateLoanOfficer = () => {
    fetch(`http://127.0.0.1:5555/loan_applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loan_officer_id: loanOfficer.id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Updated loan application:", data);
        setLoanApp(data);
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      });
  };

  const updateRealEstateAgent = () => {
    fetch(`http://127.0.0.1:5555/loan_applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        real_estate_agent_id: realEstateAgent.id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Updated loan application:", data);
        setLoanApp(data);
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      });
  };

  const updatePropertyAddress = () => {
    fetch(`http://127.0.0.1:5555/loan_applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        property_address: propertyAddress,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Updated loan application:", data);
        setLoanApp(data);
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      });
  };

  return (
    <div className="loan-view-container p-8">
      <div className="loan-view space-y-4">
        <h2 className="text-2xl font-bold">Contact Information</h2>
        <p>Name: {loanApp.borrower.name}</p>
        <p>Email: {loanApp.borrower.email}</p>
        <p>Phone Number: {loanApp.borrower.phone_number}</p>
        <p>Property Address: {loanApp.property_address}</p>
        <input
          type="text"
          value={propertyAddress}
          onChange={(e) => setPropertyAddress(e.target.value)}
          className="border p-2 rounded bg-gray-800 text-white"
        />
        <Button
          onClick={updatePropertyAddress}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Update Property Address
        </Button>
        <p>Loan Officer Name: {loanOfficer?.name}</p>
        <UserDropdown 
          role="loan officer"
          selectedUserId={loanApp?.loan_officer_id}
          setSelectedUser={handleLoanOfficerChange}
          className="bg-gray-800 text-white"
        />
        <Button
          onClick={updateLoanOfficer}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Update Assigned LOa
        </Button>
        <p>Real Estate Agent Name: {realEstateAgent?.name}</p>
        <UserDropdown
          role="real estate agent"
          selectedUserId={loanApp?.real_estate_agent_id}
          setSelectedUser={handleRealEstateAgentChange}
          className="bg-gray-800 text-white"
        />
        <Button
          onClick={updateRealEstateAgent}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Update Assigned Agent
        </Button>

        <AssignedTasks loanId={id} />
        <h2 className="text-2xl font-bold mt-4">Add A Note</h2>
        <Comments loanApplicationId={id} comments={loanApp.comments} />
      </div>
      <Link to="/loan_applications" className="mt-4">
        <Button className="back-to-loan-apps-button bg-blue-500 text-white p-2 rounded">
          Back to Loan Applications
        </Button>
      </Link>
    </div>
  );
}

export default LoanView;
