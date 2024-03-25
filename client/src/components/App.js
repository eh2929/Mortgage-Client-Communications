import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import LoanApps from "./LoanApps";
import LoanView from "./LoanView";
import Footer from "./Footer";
import AllTasks from "./AllTasks";
import LoginSignup from "./LoginSignup";
import UserProfile from "./UserProfile";
import { UserProvider } from "./UserContext";
import Dashboard from "./Dashboard";
// import "./Dashboard.css";

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route
            path="/loan_applications/:id"
            render={(props) => (
              <LoanView key={props.match.params.id} {...props} />
            )}
          />
          <Route path="/loan_applications">
            <LoanApps />
          </Route>
          <Route path="/tasks">
            <AllTasks />
          </Route>
          <Route path="/login-signup">
            <LoginSignup />
          </Route>
          <Route path="/user_profile">
            <UserProfile />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
