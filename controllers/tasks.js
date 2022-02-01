const Task = require('../models/Task');

const getAllTasks = async (req, res) => {
    const tasks = await Task.find({});
    res.status(200).json({ tasks });
}

const getTask = async (req, res) => {
    const { id: taskID } = req.params;
    const task = await Task.findOne({ _id: taskID });
    res.status(200).json({ task });
    if(!taskID) {
        return next(`No task with ID: ${taskID}`, 404);
    }
    res.status(200).json({ task })
}

const createTask = async (req, res) => {
    const { id: taskID } = req.body;
    const task = await Task.create({ taskID });
    res.status(201).json({ task });
}

const updateTask = async (req, res) => {
    const { id: taskID } = req.params;
    const task = await Task.findOneAndUpdate({ _id: taskID}, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ task });
}

const deleteTask = async (req, res) => {
    const { id: taskID } = req.params; 
    const task = await Task.findOneAndDelete({ _id: taskID});
    if(!task) {
        return next(`No task with ID: ${ taskID }`, 404);
    }
    res.status(200).json({ task });
}

module.exports = {
    getAllTasks, getTask, createTask,
    updateTask, deleteTask,
}
