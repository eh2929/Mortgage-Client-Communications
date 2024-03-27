import React, { useContext } from "react";
import { UserContext } from "./UserContext"; // Import UserContext
import { Button } from "./ui/button.jsx";

function Logout() {
  const { setUser } = useContext(UserContext); // Use UserContext

  const handleLogout = () => {
    // Make a request to the server to end the session
    fetch("/logout", { method: "DELETE" })
      .then(() => {
        // Clear the user session on the client side
        setUser(null); // Use setUser instead of updateUser

        // Clear the user's login status and role from localStorage
        localStorage.setItem("isUserLoggedIn", "false");
        localStorage.removeItem("userRole");
      })
      .catch((error) => console.error(error));
  };

  return (
<Button
  onClick={handleLogout}
  className="bg-red-500 text-white p-2 rounded flex items-center"
>
  Logout
</Button>
  );
}

export default Logout;
