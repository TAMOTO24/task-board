const express = require("express");
const router = express.Router();
const { getTasks, createTask, deleteTask, changeTask } = require("./controller/tasks.cjs");

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.put("/:id", changeTask);

module.exports = router;