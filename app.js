const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { API_VERSION } = require("./constants");
const burnRoutes = require("./router/burn");
const bodyRoutes = require("./router/bodyPart");

const app = express();

// Import routings
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user");

// Configure Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure static folder
app.use(express.static("uploads"));

// Configure Header HTTP - CORS
app.use(cors());

// Configure routings

app.use(`/api/${API_VERSION}`, burnRoutes);
app.use(`/api/${API_VERSION}`, bodyRoutes);
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);

module.exports = app;
