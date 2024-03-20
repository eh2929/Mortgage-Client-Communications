// AllTasks.js
import React, { useState, useEffect } from "react";
import "./AllTasks.css";

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", description: "" });
  const [editedTask, setEditedTask] = useState(null);
  const [loanApps, setLoanApps] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [assignSuccessMessage, setAssignSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data));

    fetch("http://127.0.0.1:5555/loan_applications")
      .then((response) => response.json())
      .then((data) => setLoanApps(data));
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && loanApps.length > 0) {
      setIsLoading(false);
    }
  }, [tasks, loanApps]);

  const createTask = () => {
    fetch("http://127.0.0.1:5555/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => setTasks([...tasks, data]))
      .catch((error) => console.error("Error:", error));
  };

  const startUpdateTask = (id, updatedTask) => {
    setEditedTask({ id, ...updatedTask });
  };

  const updateTask = (id, updatedTask) => {
    fetch(`http://127.0.0.1:5555/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => response.json())
      .then((data) =>
        setTasks(tasks.map((task) => (task.id === id ? data : task)))
      )
      .catch((error) => console.error("Error:", error));
  };

  const deleteTask = (id) => {
    fetch(`http://127.0.0.1:5555/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.error("Error:", error));
  };

  const assignTask = (taskId) => {
    if (!selectedLoanId) {
      alert("Please select a loan to assign the task to.");
      return;
    }

    
    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      console.error(`No task found with id ${taskId}`);
      return;
    }

    fetch("http://127.0.0.1:5555/assigned_tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_id: taskId,
        loan_application_id: selectedLoanId,
        name: task.name,
        description: task.description,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        
        setAssignSuccessMessage("Task assigned successfully!");
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      {assignSuccessMessage && (
        <p className="success-message">{assignSuccessMessage}</p>
      )}
      {tasks.length === 0 ? (
        <p>No tasks currently assigned.</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id}>
            <input
              type="text"
              defaultValue={task.name}
              onChange={(e) =>
                startUpdateTask(task.id, { ...task, name: e.target.value })
              }
            />
            <input
              type="text"
              defaultValue={task.description}
              onChange={(e) =>
                startUpdateTask(task.id, {
                  ...task,
                  description: e.target.value,
                })
              }
            />
            <button onClick={() => updateTask(task.id, editedTask)}>
              Update
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
            <select onChange={(e) => setSelectedLoanId(e.target.value)}>
              <option value="">Assign to loan</option>
              {loanApps.map((loanApp) => (
                <option key={loanApp.id} value={loanApp.id}>
                  {loanApp.property_address}
                </option>
              ))}
            </select>
            <button onClick={() => assignTask(task.id)}>Assign Task</button>
          </div>
        ))
      )}
      <div className="input-group">
        <label>Title:</label>
        <input
          type="text"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          placeholder="Task name"
        />
        <label>Description:</label>
        <input
          type="text"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          placeholder="Task description"
        />
        <button onClick={createTask}>Add Task</button>
      </div>
    </div>
  );
}

export default AllTasks;
