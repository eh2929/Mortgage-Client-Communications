import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import CreateLoanApplication from "./CreateLoanApplication";
import { Button } from "./ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

function LoanApps() {
  const [loanApps, setLoanApps] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="loan-apps-container p-8">
      <Search />
      <div className="loan-apps-content mt-8 grid grid-cols-1 gap-4">
        <div className="loan-apps-list flex flex-col items-center">
          {loanApps.map((loanApp, index) => (
            <Card
              key={index}
              className="loan-app p-4 rounded shadow mb-3 w-80 h-48"
            >
              <CardHeader>
                <CardTitle className="font-bold text-lg">
                  {loanApp.borrower_name}
                </CardTitle>
                <CardDescription>{loanApp.property_address}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={`/loan_applications/${loanApp.id}`}>
                  <Button className="bg-blue-500 text-white p-2 rounded">
                    View Loan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
          <div className="inline-block text-center w-full">
            <DrawerTrigger
              onClick={handleOpenDrawer}
              className="border-2 border-gray-300 p-2 rounded"
            >
              Start Tracking a New Loan Application
            </DrawerTrigger>
          </div>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="mx-auto">Create a New Loan Application</DrawerTitle>
            </DrawerHeader>
            <CreateLoanApplication
              onLoanApplicationCreated={fetchLoanApps}
              isUserLoggedIn={isUserLoggedIn}
              userRole={userRole}
              closeDrawer={handleCloseDrawer}
            />
            <DrawerFooter>
              <DrawerClose>
                <Button onClick={handleCloseDrawer}>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

export default LoanApps;
