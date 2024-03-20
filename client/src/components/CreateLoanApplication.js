import React, { useState } from "react";

function CreateLoanApplication({ onLoanApplicationCreated, isUserLoggedIn, userRole }) {
  const [propertyAddress, setPropertyAddress] = useState("");
  const [isPropertyToBeDetermined, setIsPropertyToBeDetermined] =
    useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isUserLoggedIn || userRole !== "borrower") {
      alert(
        "You must be signed in first."
      );
      return;
    }

    const borrowerId = localStorage.getItem("userId");

    fetch("http://127.0.0.1:5555/loan_applications", {
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
        onLoanApplicationCreated();
      });
  };

  const handlePropertyToBeDeterminedClick = () => {
    setIsPropertyToBeDetermined(!isPropertyToBeDetermined);
    setPropertyAddress(isPropertyToBeDetermined ? "" : "TBD");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        color: "#333",
      }}
    >
      <p style={{ marginBottom: "20px" }}>
        To track a new loan application, enter the property address.
      </p>
      <label style={{ marginBottom: "10px" }}>
        Property Address:
        <input
          type="text"
          name="property_address"
          placeholder="Enter property address or TBD"
          value={propertyAddress}
          onChange={(e) => setPropertyAddress(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </label>
      <label
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <span
          style={{
            display: "inline-block",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            marginRight: "10px",
            background: isPropertyToBeDetermined ? "#4CAF50" : "gray",
            transition: "background 0.5s",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={handlePropertyToBeDeterminedClick}
        >
          {isPropertyToBeDetermined && (
            <span
              style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "white",
              }}
            ></span>
          )}
        </span>
        No property address yet
      </label>
      <input
        type="submit"
        value="Submit"
        style={{
          padding: "10px 20px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "#46379c",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
    </form>
  );
}

export default CreateLoanApplication;
