var express = require('express');
const path = require('path');
const uuid = require('uuid');
var router = express.Router();
const { body, validationResult } = require('express-validator');
let jwt = require('jsonwebtoken');

const DispositivoController = require('../controls/dispositivoController');
var dispositivoController = new DispositivoController();

//validación para tokens de inicio de sesión

var auth = function middleware(req, res, next) {
  const token = req.headers['x-api-token'];
  //console.log(req.headers);
  if (token) {
    require('dotenv').config();
    const llave = process.env.KEY;
    jwt.verify(token, llave, async (err, decoded) => {
      if (err) {
        console.log('aqui', err);
        res.status(401);
        res.json({ msg: "Token no valido!", code: 401 });
      } else {
        var models = require('../models');
        var cuenta = models.cuenta;
        req.decoded = decoded;
        console.log("Aca\n\n");
        console.log(decoded);
        let aux = await cuenta.findOne({ where: { external_id: req.decoded.external } });
        if (aux) {
          next();
        } else {
          res.status(401);
          res.json({ msg: "Token no valido!", code: 401 });
        }
      }

    });
  } else {
    res.status(401);
    res.json({ msg: "No existe token!", code: 401 });
  }
}

var authAdmin = function middleware(req, res, next) {
  const token = req.headers['x-api-token'];
  console.log(token);

  if (token) {

    require('dotenv').config();
    const llave = process.env.KEY;
    jwt.verify(token, llave, async (err, decoded) => {
      if (err) {
        console.log('aqui', err);
        res.status(401);
        res.json({ msg: "Token no validoo!", code: 401 });
      } else {
        var models = require('../models');
        var cuenta = models.cuenta;
        req.decoded = decoded;
        console.log("Aca\n\n");
        console.log(decoded);
        if (decoded.rol == "ADMIN") {
          let aux = await cuenta.findOne({ where: { external_id: req.decoded.external } });
          if (aux) {
            next();
          } else {
            res.status(401);
            res.json({ msg: "Token no valido!", code: 401 });
          }
        } else {

          res.status(401);
          res.json({ msg: "Token no valido!", code: 401 });
        }
      }

    });
  } else {

    res.status(401);
    res.json({ msg: "No existe token!", code: 401 });
  }
}

router.post('/dispositivo', [
  body('identificador', 'Ingrese un identificador para el módulo').trim().exists().not().isEmpty(),
  body('nombre', 'Ingrese el nombre del dispositivo').trim().exists().not().isEmpty(),
  body('latitud', 'Debe incluir la latitud del dispositivo').trim().exists().not().isEmpty(),
  body('longitud', 'Debe incluir la longitud del dispositivo').trim().exists().not().isEmpty(),
  body('ip', 'Ingrese la IP asignada al dispositivo').trim().exists().not().isEmpty()
], dispositivoController.guardar);

router.get('/listar', dispositivoController.listar);
router.get('/activos', dispositivoController.listarActivos);

module.exports = router;
