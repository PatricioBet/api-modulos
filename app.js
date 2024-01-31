var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var app = express();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ origin: "*" }));

app.use('/', indexRouter);
app.use('/api', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  // Renderiza la página de error de manera similar a la página principal
  const imagePath = '/archivos/logoComputacion.jpg';
  const imageTag = `<img src="${imagePath}" alt="Página no existe">`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error ${err.status || 500}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        header {
          background-color: #d9534f;
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
        <h1>Error ${err.status || 500}</h1>
      </header>
      ${imageTag}
    </body>
    </html>
  `;

  // Envía la respuesta de error renderizada
  res.send(htmlContent);
});

module.exports = app;
