const express = require("express");
const BodyPartController = require("../controllers/bodyPart");
const multipart = require("connect-multiparty");
const middleware_user_authenticated = require("../middlewares/authenticated");
const md_upload_avatar = multipart({ uploadDir: "./uploads/burnPhotos" });

const api = express.Router();

api.post("/bodyparts", BodyPartController.storeBodyPart);
api.get(
  "/bodyparts",
  [middleware_user_authenticated.asureAuth],
  BodyPartController.getBodyParts
);

api.put(
  "/bodyparts/:id",
  [middleware_user_authenticated.asureAuth],
  BodyPartController.updateBodyPart
);

api.delete(
  "/bodyparts/:id",
  [middleware_user_authenticated.asureAuth],
  BodyPartController.deleteBodyPart
);

module.exports = api;