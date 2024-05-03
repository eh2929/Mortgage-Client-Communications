import React, { useState } from "react";
import { Button } from "./ui/button";

function CreateLoanApplication({
  onLoanApplicationCreated,
  isUserLoggedIn,
  userRole, closeDrawer,
}) {
  const [propertyAddress, setPropertyAddress] = useState("");
  const [isPropertyToBeDetermined, setIsPropertyToBeDetermined] =
    useState(false);

  const handlePropertyToBeDeterminedClick = () => {
    setIsPropertyToBeDetermined(!isPropertyToBeDetermined);
    setPropertyAddress(isPropertyToBeDetermined ? "" : "TBD");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("isUserLoggedIn:", isUserLoggedIn);
    console.log("userRole:", userRole);

    if (!isUserLoggedIn || (userRole !== "borrower" && userRole !== "admin")) {
      alert("You must be signed in first.");
      return;
    }

    const borrowerId = localStorage.getItem("userId");
    console.log("borrowerId:", borrowerId);

    if (!borrowerId) {
      alert("You must be logged in to create a loan application.");
      return;
    }

    console.log("borrowerId:", borrowerId);
    console.log("propertyAddress:", propertyAddress);
    fetch("http://127.0.0.1:5000/loan_applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        borrower_id: borrowerId,
        property_address: propertyAddress,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // After the loan application is created, get the user's name
        fetch(`http://127.0.0.1:5000/users/${borrowerId}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((userData) => {
            if (userData && userData.name) {
              data.borrower_name = userData.name;
              onLoanApplicationCreated(data);
              window.alert("Loan application created successfully");
              closeDrawer();
            } else {
              throw new Error("User data is null or name is not defined");
            }
          })
          .catch((error) => {
            console.error(
              "There has been a problem with your fetch operation:",
              error
            );
          });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="loan-app-form mx-auto">
      <div className="loan-app-input-group">
        <label className="loan-app-label">
          Property Address:
          <input
            type="text"
            name="property_address"
            placeholder="Enter property address"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            required
            className="loan-app-input bg-gray-800 text-white border border-gray-800 rounded p-2 mt-1 text-sm"
          />
        </label>
      </div>
      <div className="loan-app-checkbox-group">
        <label className="loan-app-checkbox-label">
          <input
            type="checkbox"
            checked={isPropertyToBeDetermined}
            onChange={handlePropertyToBeDeterminedClick}
            className="p-2 mr-2"
          />
          I don't have a property address yet!
        </label>
      </div>
      <div className="loan-app-submit-group">
        <Button
          type="submit"
          value="Submit"
          className="loan-app-submit bg-blue-500 text-white p-2 rounded"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

export default CreateLoanApplication;
