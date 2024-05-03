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
  const [propertyAddress, setPropertyAddress] = useState("");

  useEffect(() => {
    // Update propertyAddress when loanApp changes
    if (loanApp) {
      setPropertyAddress(loanApp.property_address);
    }
  }, [loanApp]);

  useEffect(() => {
    // Fetch all loan officers, real estate agents, and borrowers
    Promise.all([
      fetch(`http://127.0.0.1:5000/users?role=loan officer`),
      fetch(`http://127.0.0.1:5000/users?role=real estate agent`),
      fetch(`http://127.0.0.1:5000/users?role=borrower`),
      fetch(`http://127.0.0.1:5000/loan_applications/${id}`),
    ])
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then(
        ([
          loanOfficersData,
          realEstateAgentsData,
          borrowersData,
          loanAppData,
        ]) => {
          const loanOfficer = loanOfficersData.find(
            (officer) => officer.id === loanAppData.loan_officer_id
          );
          const realEstateAgent = realEstateAgentsData.find(
            (agent) => agent.id === loanAppData.real_estate_agent_id
          );
          const borrower = borrowersData.find(
            (borrower) => borrower.id === loanAppData.borrower_id
          );

          setLoanApp({
            ...loanAppData,
            loanOfficer,
            realEstateAgent,
            borrower,
            loanOfficers: loanOfficersData,
            realEstateAgents: realEstateAgentsData,
            borrowers: borrowersData,
          });
        }
      );
  }, [id]);

  const handleLoanOfficerChange = useCallback((newLoanOfficer) => {
    console.log("New Loan Officer:", newLoanOfficer);

    if (newLoanOfficer) {
      setLoanApp((prevLoanApp) => ({
        ...prevLoanApp,
        loanOfficer: newLoanOfficer,
      }));
    } else {
      console.error("Could not set new loan officer");
    }
  }, []);

  const handleRealEstateAgentChange = useCallback((newRealEstateAgent) => {
    console.log("New Real Estate Agent:", newRealEstateAgent);

    if (newRealEstateAgent) {
      setLoanApp((prevLoanApp) => ({
        ...prevLoanApp,
        realEstateAgent: newRealEstateAgent,
      }));
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
    fetch(`http://127.0.0.1:5000/loan_applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loan_officer_id: loanApp.loanOfficer.id,
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
    fetch(`http://127.0.0.1:5000/loan_applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        real_estate_agent_id: loanApp.realEstateAgent.id,
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
    fetch(`http://127.0.0.1:5000/loan_applications/${id}`, {
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
    <div className="loan-view-container p-8 flex flex-col items-center justify-center">
      <div className="loan-view space-y-4 w-full max-w-3xl">
        <h2 className="text-2xl font-bold">Contact Information</h2>
        <p>Name: {loanApp.borrower?.name}</p>
        <p>Email: {loanApp.borrower?.email}</p>
        <p>Phone Number: {loanApp.borrower?.phone_number}</p>
        <p>Property Address: {loanApp.property_address}</p>
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            className="border p-2 rounded bg-gray-800 text-white flex-grow mr-2"
          />
          <Button
            onClick={updatePropertyAddress}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Update Property Address
          </Button>
        </div>
        <p>Loan Officer Name: {loanApp.loanOfficer?.name}</p>
        <div className="flex justify-between items-center">
          <UserDropdown
            role="loan officer"
            selectedUserId={loanApp?.loan_officer_id}
            setSelectedUser={handleLoanOfficerChange}
            className="bg-gray-800 text-white flex-grow mr-2"
          />
          <Button
            onClick={updateLoanOfficer}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Update Assigned LO
          </Button>
        </div>
        <p>Real Estate Agent Name: {loanApp.realEstateAgent?.name}</p>
        <div className="flex justify-between items-center">
          <UserDropdown
            role="real estate agent"
            selectedUserId={loanApp?.real_estate_agent_id}
            setSelectedUser={handleRealEstateAgentChange}
            className="bg-gray-800 text-white flex-grow mr-2"
          />
          <Button
            onClick={updateRealEstateAgent}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Update Assigned Agent
          </Button>
        </div>
        <div className="w-full">
          <AssignedTasks loanId={id} className="w-full" />
        </div>
        <div className="w-full">
          <h2 className="text-2xl font-bold mt-4">Add A Note</h2>
          <Comments
            loanApplicationId={id}
            comments={loanApp.comments}
            className="w-full"
          />
        </div>
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
