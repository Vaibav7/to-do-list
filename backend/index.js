const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./db'); // Your MySQL connection file

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add a task
app.post('/tasks', (req, res) => {
  const { name, description, priority, deadline } = req.body;

  if (!name || !description || !priority || !deadline) {
    return res.status(400).send("All fields are required");
  }

  const sql = `
    INSERT INTO tasks (name, description, priority, deadline, completed)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, description, priority, deadline, false], (err, result) => {
    if (err) return res.status(500).send(err);

    const insertedId = result.insertId;
    db.query('SELECT * FROM tasks WHERE id = ?', [insertedId], (err2, taskResults) => {
      if (err2) return res.status(500).send(err2);
      res.json(taskResults[0]);
    });
  });
});

// Update a task (supports partial updates)
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const fields = req.body;

  const allowedFields = ['name', 'description', 'priority', 'deadline', 'completed'];
  const keys = Object.keys(fields).filter(key => allowedFields.includes(key));

  if (keys.length === 0) {
    return res.status(400).send("No valid fields provided");
  }

  const values = keys.map(key => fields[key]);
  const updates = keys.map(key => `${key} = ?`).join(', ');

  const sql = `UPDATE tasks SET ${updates} WHERE id = ?`;

  db.query(sql, [...values, id], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.affectedRows === 0) {
      return res.status(404).send("Task not found");
    }

    res.json({ message: "Task updated successfully" });
  });
});

// ✅ Toggle task completion status
app.put('/tasks/:id/complete', (req, res) => {
  const id = req.params.id;
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).send("Invalid value for 'completed'");
  }

  const sql = `UPDATE tasks SET completed = ? WHERE id = ?`;
  db.query(sql, [completed, id], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.affectedRows === 0) {
      return res.status(404).send("Task not found");
    }

    res.json({ message: "Task completion status updated" });
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.affectedRows === 0) {
      return res.status(404).send("Task not found");
    }

    res.json({ message: "Task deleted successfully" });
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
