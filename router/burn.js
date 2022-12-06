const express = require("express");
const BurnController = require("../controllers/burn");
const multipart = require("connect-multiparty");
const md_auth = require("../middlewares/authenticated");
const md_upload_avatar = multipart({ uploadDir: "./uploads/burnPhotos" });

const api = express.Router();

api.post("/burns", BurnController.storeBurn);
//api.post("/burns/photo", BurnController.uploadPhoto);
api.get("/burns/photo/:photoUrl", BurnController.getPhoto);
api.get(
  "/burns",
  [md_auth.asureAuth],
  BurnController.getBurns
);
api.get(
  "/burns/active",
  [md_auth.asureAuth],
  BurnController.getActiveBurns
);

api.put(
  "/burns/photo/:id",
  [md_auth.asureAuth, md_upload_avatar],
  BurnController.uploadPhoto
);
api.put(
  "/burns/:id",
  [md_auth.asureAuth],
  BurnController.updateBurn
);
api.put(
  "/burns/deactivate/:id",
  [md_auth.asureAuth],
  BurnController.deactivateBurn
);

api.delete(
  "/burns/:id",
  [md_auth.asureAuth],
  BurnController.deleteBurn
);

module.exports = api;