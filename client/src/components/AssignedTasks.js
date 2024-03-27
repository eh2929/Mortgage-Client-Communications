// AssignedTasks.js
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

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
      // Optimistically update the assignedTasks state
      setAssignedTasks(
        assignedTasks.map((task) =>
          task.id === taskId ? { ...task, is_completed: true } : task
        )
      );
      setSuccessMessage("Task marked as completed successfully!");
    });
  };

  const removeTask = (taskId) => {
    fetch(`http://127.0.0.1:5555/assigned_tasks/${taskId}`, {
      method: "DELETE",
    }).then(() => {
      // Optimistically update the assignedTasks state
      setAssignedTasks(assignedTasks.filter((task) => task.id !== taskId));
      setSuccessMessage("Task removed successfully!");
    });
  };

  return (
    <div className="assigned-tasks-container py-8 w-full">
      <h2 className="text-2xl font-bold">Assigned Tasks</h2>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {assignedTasks.map((assignedTask) => {
        if (!assignedTask.task) {
          return null; // Don't render anything if assignedTask.task does not exist
        }

        return (
          <div
            key={assignedTask.id}
            className="assigned-task bg-gray-800 p-4 rounded shadow mt-4"
          >
            <p>Task Name: {assignedTask.task.name}</p>
            <p>Task Description: {assignedTask.task.description}</p>
            <Button
              onClick={() => completeTask(assignedTask.id)}
              className="bg-blue-500 text-white p-2 rounded mr-2"
            >
              Complete
            </Button>
            <Button
              onClick={() => removeTask(assignedTask.id)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Unassign
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export default AssignedTasks;
