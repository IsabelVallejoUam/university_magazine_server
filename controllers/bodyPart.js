const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");
const fs = require("fs");
const path = require("path");
const bodyPart = require("../models/bodyPart");


const storeBodyPart = (req, res) => {
  const bodyPart = new bodyPart();
  const {
    name,
    ubication
  } = req.body;
  bodyPart.name = name;
  bodyPart.ubication = ubication;
  
  if (!name) {
    res
      .status(401)
      .send({ message: "Se require el nombre de la parte" });
  } else {
    bodyPart.save((err, bodyPartStored) => {
      if (err) {
        res.status(500).send({ message: "No se pudo almacenar la parte del cuerpo." });
      } else {
        if (!bodyPartStored) {
          res.status(404).send({ message: "Error al almacenar quemadura." });
        } else {
          res.status(200).send({ bodyPart: bodyPartStored });
        }
      }
    });
  }
};


const getBodyParts = (req, res) => {
  bodyPart.find().then((bodyParts) => {
    !bodyParts
      ? res.status(404).send({ message: "No se ha encontrado ninguna parte del cuerpo en el sistema" })
      : res.status(200).send({ bodyParts });
  });
};


async function updateBodyPart(req, res) {
  let bodyPartData = req.body;
  const params = req.params;

  /* Actualizamos el resto de los datos */
  bodyPart.findByIdAndUpdate({ _id: params.id }, bodyPartData, (err, bodyPartUpdate) => {
    err
      ? res.status(500).send({ message: "Error del servidor." })
      : !bodyPartUpdate
      ? res.status(404).send({ message: "No se encontro la parte del cuerpo." })
      : res.status(200).send({ message: "Quemadura actualizada correctamente." });
  });
}

const deleteBodyPart = (req, res) => {
  const { id } = req.params;

  bodyPart.findByIdAndRemove(id, (err, deletedPart) => {
    err
      ? res.status(500).send({ message: "Error del servidor." })
      : !deletedPart
      ? res.status(404).send({ message: "Parte del cuerpo no encontrada." })
      : res
          .status(200)
          .send({ message: "La parte del cuerpo ha sido eliminado correctamente." });
  });
};


module.exports = {
    deleteBodyPart,
    updateBodyPart,
    getBodyParts,
    storeBodyPart
};