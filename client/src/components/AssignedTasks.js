// AssignedTasks.js
import React, { useState, useEffect } from "react";

function AssignedTasks({ loanId }) {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  

  useEffect(() => {
    fetch(`http://127.0.0.1:5555/assigned_tasks?loanId=${loanId}`)
      .then((response) => response.json())
      .then((data) => {
        setAssignedTasks(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [loanId]);

  const completeTask = (taskId) => {
    fetch(`http://127.0.0.1:5555/assigned_tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_completed: true }),
    }).then(() => {
      // Refresh the assigned tasks
      fetch(`http://127.0.0.1:5555/assigned_tasks?loanId=${loanId}`)
        .then((response) => response.json())
        .then((data) => {
          setAssignedTasks(data);
          setSuccessMessage("Task marked as completed successfully!");
        });
    });
  };

  const removeTask = (taskId) => {
    fetch(`http://127.0.0.1:5555/assigned_tasks/${taskId}`, {
      method: "DELETE",
    }).then(() => {
      // Refresh the assigned tasks
      fetch(`http://127.0.0.1:5555/assigned_tasks?loanId=${loanId}`)
        .then((response) => response.json())
        .then((data) => {
          setAssignedTasks(data);
          setSuccessMessage("Task removed successfully!");
        });
    });
  };

  return (
    <div>
      <h2>Assigned Tasks</h2>
      {successMessage && <p>{successMessage}</p>}
      {assignedTasks.map((assignedTask) => (
        <div key={assignedTask.id}>
          <p>Task Name: {assignedTask.task.name}</p>
          <p>Task Description: {assignedTask.task.description}</p>
          <button onClick={() => completeTask(assignedTask.id)}>
            Complete
          </button>
          <button onClick={() => removeTask(assignedTask.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

export default AssignedTasks;
