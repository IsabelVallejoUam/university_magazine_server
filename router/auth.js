const express = require("express");
const AuthController = require("../controllers/auth");

const api = express.Router();

api.post("/auth/signup", AuthController.register);
api.post("/auth/signin", AuthController.login);
api.post("/auth/refresh_access_token", AuthController.refreshAccessToken);

module.exports = api;
