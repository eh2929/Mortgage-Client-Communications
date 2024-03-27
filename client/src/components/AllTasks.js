// AllTasks.js
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", description: "" });
  const [editedTask, setEditedTask] = useState(null);
  const [loanApps, setLoanApps] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [assignSuccessMessage, setAssignSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

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
    <div className="all-tasks-container p-8">
      {assignSuccessMessage && (
        <p className="success-message text-green-500">{assignSuccessMessage}</p>
      )}
      <div className="tasks-list space-y-4">
        {tasks.length === 0 ? (
          <p>No tasks currently assigned.</p>
        ) : (
          tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle>{task.name}</CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="task-inputs space-y-2">
                  <div className="input-group">
                    <p>Title:</p>
                    <input
                      type="text"
                      defaultValue={task.name}
                      onChange={(e) =>
                        startUpdateTask(task.id, {
                          ...task,
                          name: e.target.value,
                        })
                      }
                      className="border p-2 rounded bg-gray-800 text-white"
                    />
                  </div>
                  <div className="input-group">
                    <p>Description:</p>
                    <textarea
                      defaultValue={task.description}
                      onChange={(e) =>
                        startUpdateTask(task.id, {
                          ...task,
                          description: e.target.value,
                        })
                      }
                      className="border p-2 rounded bg-gray-800 text-white"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="task-buttons space-x-2">
                  <Button
                    onClick={() => updateTask(task.id, editedTask)}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </Button>
                </div>
                <div className="task-assign space-x-2">
                  <select
                    onChange={(e) => setSelectedLoanId(e.target.value)}
                    className="border p-2 rounded bg-gray-800 text-white"
                  >
                    <option value="">Assign to loan</option>
                    {loanApps.map((loanApp) => (
                      <option key={loanApp.id} value={loanApp.id}>
                        {loanApp.property_address}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={() => assignTask(task.id)}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    Assign Task
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
        <div className="inline-block text-center w-full">
          <DrawerTrigger
            onClick={handleOpenDrawer}
            className="border-2 border-gray-300 p-2 rounded mx-auto text-white"
          >
            Start Tracking a New Task
          </DrawerTrigger>
        </div>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="mx-auto">Create a New Task</DrawerTitle>
          </DrawerHeader>
          <div className="new-task-form mx-auto mt-8">
            <label>Title:</label>
            <input
              type="text"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              placeholder="Task title"
              className="border p-2 rounded bg-gray-800 text-white"
            />
            <label>Description:</label>
            <input
              type="text"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              placeholder="Task description"
              className="border p-2 rounded bg-gray-800 text-white"
            />
            <Button
              onClick={createTask}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Create Task
            </Button>
          </div>
          <DrawerFooter>
            <DrawerClose>
              <Button onClick={handleCloseDrawer}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default AllTasks;
