import { useState, useEffect } from "react";

export default function AddTaskCard({ onAdd, onCancel, loading, initialData }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    priority: "Low",
    deadline: "",
  });
  const [error, setError] = useState("");

  // Load initial data if editing a task
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        priority: initialData.priority || "Low",
        deadline: initialData.deadline?.split("T")[0] || "", // for date input format
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return setError("Task name is required");
    if (!form.description.trim()) return setError("Description is required");
    if (!form.deadline) return setError("Deadline is required");

    onAdd({
      ...form,
      completed: initialData?.completed || false, // keep completed status if editing
    });
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Task Name"
        className="border rounded px-3 py-2 w-full mb-3"
        disabled={loading}
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border rounded px-3 py-2 w-full mb-3"
        rows={3}
        disabled={loading}
      />

      <div className="flex gap-4 mb-3">
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border rounded px-3 py-2 flex-1"
          disabled={loading}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="border rounded px-3 py-2 flex-1"
          disabled={loading}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`flex-1 py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? initialData
              ? "Updating..."
              : "Adding..."
            : initialData
            ? "Update Task"
            : "Add Task"}
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2 rounded border border-gray-400 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
