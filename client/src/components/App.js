import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import LoanApps from "./LoanApps";
import LoanView from "./LoanView";
import Footer from "./Footer";
import AllTasks from "./AllTasks";
import LoginSignup from "./LoginSignup"; // Import the LoginSignup component
import UserProfile from "./UserProfile";

function App() {
  const [user, setUser] = useState(null); // Add a state variable for the user

  const updateUser = (user) => {
    setUser(user); // Define the updateUser function
  };

  return (
    <Router>
      <Header user={user} updateUser={updateUser} />

      <Switch>
        <Route path="/loan_applications/:id">
          <LoanView />
        </Route>
        <Route path="/loan_applications">
          <LoanApps />
        </Route>
        <Route path="/tasks">
          <AllTasks />
        </Route>
        <Route path="/login-signup">
          <LoginSignup updateUser={updateUser} />
          {/* Pass updateUser as a prop */}
        </Route>
        <Route path="/user_profile">
          <UserProfile user={user} updateUser={setUser} />
        </Route>
      </Switch>
      <Footer />
    </Router>
    
  );
  
}

export default App;
