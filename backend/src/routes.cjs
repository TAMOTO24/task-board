const express = require("express");
const router = express.Router();
const { getTasks, createTask, deleteTask } = require("./controller/tasks.cjs");

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);

module.exports = router;