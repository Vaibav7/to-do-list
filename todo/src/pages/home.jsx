import { useState, useEffect } from "react";
import axios from "axios";
import AddTaskCard from "../components/AddTaskCard";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://to-do-list-xy38.onrender.com");
      setTasks(res.data);
      setError("");
    } catch {
      setError("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddOrUpdateTask = async (formData) => {
    setLoading(true);
    setError("");
    try {
      if (editTask) {
        await axios.put(`https://to-do-list-xy38.onrender.com/${editTask.id}`, formData);
        setEditTask(null);
      } else {
        await axios.post("https://to-do-list-xy38.onrender.com", formData);
      }
      await fetchTasks();
      setShowForm(false);
    } catch {
      setError("Error saving task");
    }
    setLoading(false);
  };

  // UPDATED toggleComplete to use /complete route
  const toggleComplete = async (task) => {
    try {
      await axios.put(`https://to-do-list-xy38.onrender.com/${task.id}/complete`, {
        completed: !task.completed,
      });
      fetchTasks();
    } catch {
      setError("Failed to update task");
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`https://to-do-list-xy38.onrender.com/${id}`);
      fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">To-Do List</h1>

      {!showForm && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              setEditTask(null);
              setShowForm(true);
            }}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add New Task
          </button>
        </div>
      )}

      {showForm && (
        <AddTaskCard
          onAdd={handleAddOrUpdateTask}
          onCancel={() => {
            setShowForm(false);
            setEditTask(null);
          }}
          loading={loading}
          initialData={editTask}
        />
      )}

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="bg-white p-6 rounded shadow max-h-[400px] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Done</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Priority</th>
                  <th className="border px-4 py-2">Deadline</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr
                    key={task.id}
                    className={`hover:bg-gray-50 ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task)}
                      />
                    </td>
                    <td className="border px-4 py-2">{task.name}</td>
                    <td className="border px-4 py-2">{task.description}</td>
                    <td className="border px-4 py-2">{task.priority}</td>
                    <td className="border px-4 py-2">
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleEditClick(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
