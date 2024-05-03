import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserContext"; // Import UserContext
import { Button } from "./ui/button.jsx";

function UserProfile() {
  const { user, setUser } = useContext(UserContext); // Use UserContext
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const history = useHistory();

  useEffect(() => {
    setUpdatedUser(user);
  }, [user]);

  // Check if user is null (i.e., no user is logged in)
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleInputChange = (event) => {
    setUpdatedUser({
      ...updatedUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    fetch(`http://127.0.0.1:5000/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the user state with the updated user information
        setUser(data);

        // Store the updated user data in localStorage
        localStorage.setItem("user", JSON.stringify(data));

        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      fetch(`http://127.0.0.1:5000/users/${user.id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the server
          console.log(data);
          // Log out the user and redirect to the login page
          setUser(null);

          // Remove the user data from localStorage
          localStorage.removeItem("user");

          history.push("/login");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // Display the user's information
  return (
    <div className="user-profile-container p-8 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {isEditing ? (
        <div className="w-full max-w-md p-8 rounded shadow">
          <label className="block mt-4 font-bold">Name:</label>
          <input
            name="name"
            defaultValue={user.name}
            onChange={handleInputChange}
            className="border p-2 rounded bg-gray-800 text-white w-full mt-2"
          />
          <label className="block mt-4 font-bold">Email:</label>
          <input
            name="email"
            defaultValue={user.email}
            onChange={handleInputChange}
            className="border p-2 rounded bg-gray-800 text-white w-full mt-2"
          />
          <label className="block mt-4 font-bold">Phone:</label>
          <input
            name="phone_number"
            defaultValue={user.phone_number}
            onChange={handleInputChange}
            className="border p-2 rounded bg-gray-800 text-white w-full mt-2"
          />
          <label className="block mt-4 font-bold">Username:</label>
          <input
            name="username"
            defaultValue={user.username}
            onChange={handleInputChange}
            className="border p-2 rounded bg-gray-800 text-white w-full mt-2"
          />
          <button
            onClick={handleSaveClick}
            className="bg-blue-500 text-white p-2 rounded mt-4 w-full"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-gray-800 p-8 rounded shadow">
          <p className="mt-4">
            <span className="font-bold">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-bold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-bold">Phone:</span> {user.phone_number}
          </p>
          <p>
            <span className="font-bold">Username:</span> {user.username}
          </p>
          <p>
            <span className="font-bold">Role:</span> {user.role}
          </p>
          <Button
            onClick={handleEditClick}
            className="bg-blue-500 text-white p-2 rounded mt-4 w-full"
          >
            Edit Profile
          </Button>
        </div>
      )}
      <Button
        onClick={handleDeleteClick}
        className="bg-red-500 text-white p-2 rounded mt-4 w-full max-w-md"
      >
        Delete Account
      </Button>
    </div>
  );
}

export default UserProfile;
