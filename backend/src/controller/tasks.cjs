const Tasks = require("../models/Tasks.cjs");

const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, priority } = req.body;

  try {
    const newTask = new Tasks({ title, description, priority });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Tasks.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changeTask = async (req, res) => {
  const { id } = req.params;
  const { priority, status } = req.body;

  try {
    const taskItem = await Tasks.findById(id);
    if (!taskItem) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (priority !== undefined) taskItem.priority = priority;
    if (status !== undefined) taskItem.status = status;

    await taskItem.save();
    res.json(taskItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, deleteTask, changeTask };
