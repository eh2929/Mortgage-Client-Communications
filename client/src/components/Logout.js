import React from "react";

function Logout({ updateUser }) {
  const handleLogout = () => {
    // Make a request to the server to end the session
    fetch("/logout", { method: "DELETE" })
      .then(() => {
        // Clear the user session on the client side
        updateUser(null);

        // Clear the user's login status and role from localStorage
        localStorage.setItem("isUserLoggedIn", "false");
        localStorage.removeItem("userRole");
      })
      .catch((error) => console.error(error));
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
