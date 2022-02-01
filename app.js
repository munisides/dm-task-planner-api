require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const tasks = require('./routes/tasks');

// sec
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

//
const app = express();
app.use(express.json());

// swagger docs
const swaggerUI = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');

const yamlFile = fs.readFileSync('./swagger.yaml', 'utf-8');
const swaggerDocument = YAML.parse(yamlFile);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// swagger 

// sec
app.use(helmet());
app.use(cors());
app.use(xss());
app.set('trust proxy', 1);

const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

//
app.get('/', (req, res)  => { 
    res.json('< h1 >TASK PLANNER API</h1 > <a href="/api-docs">Documentation</a>');
});
//swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use('/api/v1/tasks', tasks);

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something wet wrong!'
    res.status(statusCode).render('error', { err })
});

const dbUrl = process.env.MONGO_URI;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const BACKEND_PORT = process.env.PORT || 3000;
app.listen(BACKEND_PORT, () => {
    console.log(`Server listening on port ${BACKEND_PORT}...`);
});
