const mongoose = require("mongoose");
const { Schema } = mongoose;

const tasksSchema = new Schema({
    title: String,
    description: String,
    status: String,
    priority: Number
});

module.exports = mongoose.models.tasks || mongoose.model("tasks", tasksSchema);