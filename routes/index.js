const models = require('../models/');

const bcrypt = require('bcrypt');
const saltRounds = 8;
var express = require('express');
var router = express.Router();

var cuenta = models.cuenta;


/* GET home page. */
router.get('/', function (req, res, next) {
  const imagePath = '/archivos/logoComputacion.jpg';
  const imageTag = `<img src="${imagePath}" alt="Descripción de la imagen">`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Api de radiación UV - Carrera de computación</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        header {
          background-color: #333;
          color: #fff;
          padding: 10px;
          text-align: center;
        }
        h1 {
          margin-top: 20px;
          text-align: center;
        }
        img {
          display: block;
          margin: 20px auto;
          max-width: 100%;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Api de radiación UV - Carrera de computación</h1>
      </header>
      ${imageTag}
    </body>
    </html>
  `;

  res.send(htmlContent);
});



router.get('/privado/:external', function (req, res, next) {
  require('dotenv').config();
  const llave = req.params.external;
  const env = process.env.KEY;
  console.log(env);
  //res.send(env);
  if (llave === env) {
    var models = require('../models/');
    models.sequelize.sync().then(() => {
      console.log('Se ha conectado la bd');
      res.send('OK!');
    }).catch(err => {
      console.log(err, "Hubo un error");
      res.send("Error");
    })
  } else {
    res.send("Llave incorrecta!");
  }
});

module.exports = router;
