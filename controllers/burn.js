const bcrypt = require("bcryptjs");
const Burn = require("../models/burn");
const jwt = require("../utils/jwt");
const fs = require("fs");
const path = require("path");

const storeBurn = (req, res) => {
  const burn = new Burn();
  const {
    user_id,
    body_part,
    ubication,
    burn_degree,
    initial_pain_level,
    date,
    aspect,
    photo
  } = req.body;
  burn.body_part = body_part;
  burn.ubication = ubication;
  burn.burn_degree = burn_degree;
  burn.initial_pain_level = initial_pain_level;
  if (!date) burn.date = Date.now();
  else burn.date = date;
  burn.aspect = aspect;
  if (!photo) burn.photo = "defaultBurn";
  else burn.photo = photo;
  burn.active = true;
  if (!body_part || !ubication) {
    res
      .status(401)
      .send({ message: "Se require la ubicación de la quemadura completa" });
  } else {
    burn.save((err, burnStored) => {
      if (err) {
        res.status(500).send({ message: "No se pudo almacenar la quemadura." });
      } else {
        if (!burnStored) {
          res.status(404).send({ message: "Error al almacenar quemadura." });
        } else {
          res.status(200).send({ burn: burnStored });
        }
      }
    });
  }
};


const getBurns = (req, res) => {
  Burn.find().then((burns) => {
    !burns
      ? res.status(404).send({ message: "No se ha encontrado ninguna quemadura en el sistema" })
      : res.status(200).send({ burns });
  });
};

const getActiveBurns = (req, res) => {
  const activeBurns = req.query;
  Burn.find({ active: true }).then((burns) => {
    !burns
      ? res.status(404).send({ message: "No se ha encontrado ningún resultado" })
      : res.status(200).send({ burns });
  });
};

function uploadPhoto(req, res) {
  const params = req.params;

  Burn.findById({ _id: params.id }, (err, burnData) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!burnData) {
        res.status(404).send({ message: "Nose ha encontrado la quemadura." });
      } else {
        let burn = burnData;

        if (req.files) {
          let filePath = req.files.photo.path;
          console.log(filePath);
          let fileSplit = filePath.split("\\");
          let fileName = fileSplit[2];
          console.log(fileName);
          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];

          if (fileExt !== "png" && fileExt !== "jpg") {
            res.status(400).send({
              message:
                "La extension de la imagen no es valida. (Extensiones permitidas: .png y .jpg)"
            });
          } else {
            burn.photo = fileName;
            Burn.findByIdAndUpdate(
              { _id: params.id },
              burn,
              (err, burnResult) => {
                if (err) {
                  res.status(500).send({ message: "Error del servidor." });
                } else {
                  if (!burnResult) {
                    res
                      .status(404)
                      .send({ message: "No se ha encontrado la quemadura." });
                  } else {
                    res.status(200).send({ burnFile: fileName });
                  }
                }
              }
            );
          }
        }
      }
    }
  });
}

function getPhoto(req, res) {
  const photoName = req.params.photoUrl;
  const filePath = "./uploads/burnPhotos/" + photoName;

  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.status(404).send({ message: "La foto que buscas no existe." });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}

async function updateBurn(req, res) {
  let burnData = req.body;
  const params = req.params;

  /* Actualizamos el resto de los datos */
  Burn.findByIdAndUpdate({ _id: params.id }, burnData, (err, burnUpdate) => {
    err
      ? res.status(500).send({ message: "Error del servidor." })
      : !burnUpdate
      ? res.status(404).send({ message: "No se encontro la quemadura." })
      : res.status(200).send({ message: "Quemadura actualizada correctamente." });
  });
}

const deleteBurn = (req, res) => {
  const { id } = req.params;

  Burn.findByIdAndRemove(id, (err, userDeleted) => {
    err
      ? res.status(500).send({ message: "Error del servidor." })
      : !userDeleted
      ? res.status(404).send({ message: "Quemadura no encontrada." })
      : res
          .status(200)
          .send({ message: "La quemadura ha sido eliminado correctamente." });
  });
};

const deactivateBurn = (req, res) => {
    const { id } = req.params;
    const { active } = req.body;
  
    Burn.findByIdAndUpdate(id, { active }, (err, userStored) => {
      err
        ? res.status(500).send({ message: "Error del servidor." })
        : !userStored
        ? res.status(404).send({ message: "No se ha encontrado la quemadura." })
        : active === false
        ? res.status(200).send({ message: "Qemadura desactivada correctamente." })
        : res.status(200).send({ message: "Quemadura desactivada correctamente." });
    });
  };


module.exports = {
    storeBurn,
    getBurns,
    getActiveBurns,
    uploadPhoto,
    getPhoto,
    updateBurn,
    deleteBurn,
    deactivateBurn
};