const Task = require('../models/Task');
const { CustomTaskError, createTaskError } = require('../errors/task-errors');

const getAllTasks = async (req, res) => {
    const tasks = await Task.find({});
    try {
        if(!tasks) return next('No tasks planned');
    } catch (error) {
        throw new Error('Unable to find tasks');
    }
    res.status(200).json({ tasks });
}

const getTask = async (req, res) => {
    const { id: taskID } = req.params;
    const task = await Task.findOne({ _id: taskID });
    if(!taskID) {
        res.status(404);
        return next(`No task with ID: ${taskID}`)
        // return next(createTaskError(`No task with ID: ${taskID}`, 404));
    }
    res.status(200).json({ task });
}

const createTask = async (req, res) => {
    const task = await Task.create(req.body);
    if(!task) {
        res.status(404);
        return next(`Error creating task. Please try again`)
        // return next(createTaskError(`Error creating task. Please try again`, 404));
    }
    res.status(201).json({ task });
}

const updateTask = async (req, res) => {
    const { id: taskID } = req.params;
    const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
        new: true,
        runValidators: true,
    });
    if(!task) {
        res.status(404);
        return next(`Error updating the task. Please try again`);
        // return next(createTaskError(`Error updating the task. Please try again`, 404));
    }
    res.status(200).json({ task });
}

const deleteTask = async (req, res) => {
    const { id: taskID } = req.params; 
    const task = await Task.findOneAndDelete({ _id: taskID});
    if(!task) {
        return next(createTaskError(`No deleeting task with ID: ${ taskID }`, 404));
    }
    res.status(200).json({ task });
}

module.exports = {
    getAllTasks, getTask, createTask,
    updateTask, deleteTask,
}
