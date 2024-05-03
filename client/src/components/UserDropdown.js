// UserDropdown.js
import React, { useState, useEffect } from "react";

function UserDropdown({ role, selectedUserId, setSelectedUser, className }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/users?role=${role}`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        const selectedUser = data.find((user) => user.id === selectedUserId);
        if (selectedUser) {
          setSelectedUser(selectedUser);
        }
      });
  }, [role, selectedUserId, setSelectedUser]);

  const handleChange = (event) => {
    const userId = Number(event.target.value); // Convert to number
    setSelectedUser(users.find((user) => user.id === userId));
  };

  return (
    <select
      value={selectedUserId}
      onChange={handleChange}
      className={className}
    >
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
}

export default UserDropdown;
