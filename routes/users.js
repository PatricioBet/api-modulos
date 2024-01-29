var express = require('express');
const path = require('path');
const uuid = require('uuid');
var router = express.Router();
const { body, validationResult } = require('express-validator');
let jwt = require('jsonwebtoken');

const DispositivoController = require('../controls/dispositivoController');
var dispositivoController = new DispositivoController();

const MedicionController = require('../controls/medicionController');
var medicionController = new MedicionController();

//validación para tokens de inicio de sesión

var authBackend = function middleware(req, res, next) {
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
        req.decoded = decoded;
        console.log("Aca\n\n");
        console.log(decoded);
        if (decoded.rol == "BACKEND") {
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

var authDispositivo = function middleware(req, res, next) {
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
        req.decoded = decoded;
        console.log("Aca\n\n");
        console.log(decoded);
        if (decoded.rol == "DISPOSITIVO") {
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

router.post('/dispositivo', authDispositivo, [
  body('identificador', 'Ingrese un identificador para el módulo').trim().exists().not().isEmpty(),
  body('nombre', 'Ingrese el nombre del dispositivo').trim().exists().not().isEmpty(),
  body('latitud', 'Debe incluir la latitud del dispositivo').trim().exists().not().isEmpty(),
  body('longitud', 'Debe incluir la longitud del dispositivo').trim().exists().not().isEmpty(),
  body('ip', 'Ingrese la IP asignada al dispositivo').trim().exists().not().isEmpty()
], dispositivoController.guardar);

router.get('/listar', dispositivoController.listar);
router.get('/activos', dispositivoController.listarActivos);

//Mediciones
router.post('/medicionDia', authBackend, [
  body('fechaInicio', 'Ingrese la fecha de inicio').trim().exists().not().isEmpty(),
  body('fechaFin', 'Ingrese la fecha de fin').trim().exists().not().isEmpty()
], medicionController.promedioPorDias);

router.post('/medicionSemana', authBackend, [
  body('fechaInicio', 'Ingrese la fecha de inicio').trim().exists().not().isEmpty(),
  body('fechaFin', 'Ingrese la fecha de fin').trim().exists().not().isEmpty()
], medicionController.promedioPorSemanas);

router.post('/medicionMes', authBackend,[
  body('fechaInicio', 'Ingrese la fecha de inicio').trim().exists().not().isEmpty(),
  body('fechaFin', 'Ingrese la fecha de fin').trim().exists().not().isEmpty()
], medicionController.promedioPorMeses);

router.post('/medicionFechas', authBackend,[
  body('fechaInicio', 'Ingrese la fecha de inicio').trim().exists().not().isEmpty(),
  body('fechaFin', 'Ingrese la fecha de fin').trim().exists().not().isEmpty()
], medicionController.medicionesFechas);

router.get('/medicionDispositivos', medicionController.medicionDispositivosActivos);
router.get('/medicionPromedio', medicionController.promedioMedicion);



router.get('/tokenDispositivo', dispositivoController.generarTokenDispositivo)
router.get('/tokenBackend', dispositivoController.generarTokenBackend)


module.exports = router;
