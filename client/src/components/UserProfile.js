import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function UserProfile({ user, updateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const history = useHistory();

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
    fetch(`http://127.0.0.1:5555/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the user state with the updated user information
        updateUser(data);

        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      fetch(`http://127.0.0.1:5555/users/${user.id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the server
          console.log(data);
          // Log out the user and redirect to the login page
          updateUser(null);
          history.push("/login");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // Display the user's information
  return (
    <div>
      <h1>User Profile</h1>
      {isEditing ? (
        <>
          <label>Name:</label>
          <input
            name="name"
            defaultValue={user.name}
            onChange={handleInputChange}
          />
          <label>Email:</label>
          <input
            name="email"
            defaultValue={user.email}
            onChange={handleInputChange}
          />
          <label>Phone:</label>
          <input
            name="phone_number"
            defaultValue={user.phone_number}
            onChange={handleInputChange}
          />
          <label>Username:</label>
          <input
            name="username"
            defaultValue={user.username}
            onChange={handleInputChange}
          />
          <button onClick={handleSaveClick}>Save</button>
        </>
      ) : (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone_number}</p>
          <p>Username: {user.username}</p>
          <p>Role: {user.role}</p>
          <button onClick={handleEditClick}>Edit Profile</button>
        </>
      )}
      <button onClick={handleDeleteClick}>Delete Account</button>
    </div>
  );
}

export default UserProfile;
