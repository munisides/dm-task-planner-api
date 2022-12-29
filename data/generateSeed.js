require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('../models/Task');

const seedTasks = require('./tasksList.json');
const dbUrl = 'mongodb://localhost:27017/dm-task-planner-api';

const genSeed = async () => {
  try {
    mongoose.connect(dbUrl);   
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", () => {
        console.log("Database connected");
    });
    
    await Task.deleteMany();
    await Task.create(seedTasks);
    console.log('Tasks added successfully...');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

genSeed();
