'use strict';
const models = require('../models');
const { validationResult } = require("express-validator");
const { Op } = require('sequelize');
const { sequelize, dispositivo, medicion } = require('../models');

class MedicionController {
  async promedioPorDias(req, res) {
    try {
      // Validar si hay errores en la solicitud
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ msg: "Datos no encontrados", code: 400 });
        return;
      }

      // Obtener las fechas de inicio y fin desde el cuerpo de la solicitud
      const { fechaInicio, fechaFin } = req.body;

      // Realizar la consulta para obtener el promedio de mediciones por día
      const promedioMediciones = await models.medicion.findAll({
        attributes: [
          // Calcular el promedio de la columna 'uv'
          [models.sequelize.fn('AVG', models.sequelize.col('uv')), 'promedio'],
          // Truncar la fecha al inicio del día y llamarlo 'dia'
          [models.sequelize.fn('date_trunc', 'day', models.sequelize.col('fecha')), 'dia']
        ],
        where: {
          fecha: {
            // Filtrar por fechas dentro del rango especificado
            [Op.between]: [fechaInicio, fechaFin]
          }
        },
        group: [
          // Agrupar por el inicio del día
          models.sequelize.fn('date_trunc', 'day', models.sequelize.col('fecha'))
        ],
        order: [
          // Ordenar los resultados por fecha de manera ascendente
          [models.sequelize.fn('date_trunc', 'day', models.sequelize.col('fecha')), 'ASC']
        ]
      });

      // Enviar la respuesta con los resultados
      res.status(200).json({ promedioMediciones, code: 200 });
    } catch (error) {
      // Manejar cualquier error interno y enviar una respuesta de error
      console.error(error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }


  async promedioPorSemanas(req, res) {
    try {
      // Validar si hay errores en la solicitud
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ msg: "Datos no encontrados", code: 400 });
        return;
      }

      // Obtener las fechas de inicio y fin desde el cuerpo de la solicitud
      const { fechaInicio, fechaFin } = req.body;

      // Realizar la consulta para obtener el promedio de mediciones por semana
      const promedioMediciones = await models.medicion.findAll({
        attributes: [
          // Calcular el promedio de la columna 'uv'
          [models.sequelize.fn('AVG', models.sequelize.col('uv')), 'promedio'],
          // Truncar la fecha al inicio de la semana y llamarlo 'semana'
          [models.sequelize.fn('date_trunc', 'week', models.sequelize.col('fecha')), 'semana']
        ],
        where: {
          fecha: {
            // Filtrar por fechas dentro del rango especificado
            [Op.between]: [fechaInicio, fechaFin]
          }
        },
        group: [
          // Agrupar por el inicio de la semana
          models.sequelize.fn('date_trunc', 'week', models.sequelize.col('fecha'))
        ],
        order: [
          // Ordenar los resultados por fecha de manera ascendente
          [models.sequelize.fn('date_trunc', 'week', models.sequelize.col('fecha')), 'ASC']
        ]
      });

      // Enviar la respuesta con los resultados
      res.status(200).json({ promedioMediciones, code: 200 });
    } catch (error) {
      // Manejar cualquier error interno y enviar una respuesta de error
      console.error(error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }


  async promedioPorMeses(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ msg: "Datos no encontrados", code: 400 });
        return;
      }

      const { fechaInicio, fechaFin } = req.body;

      const promedioMediciones = await models.medicion.findAll({
        attributes: [
          [models.sequelize.fn('AVG', models.sequelize.col('uv')), 'promedio'],
          [models.sequelize.fn('date_trunc', 'month', models.sequelize.col('fecha')), 'mes']
        ],
        where: {
          fecha: {
            [Op.between]: [fechaInicio, fechaFin]
          }
        },
        group: [models.sequelize.fn('date_trunc', 'month', models.sequelize.col('fecha'))],
        order: [[models.sequelize.fn('date_trunc', 'month', models.sequelize.col('fecha')), 'ASC']]
      });

      res.status(200).json({ promedioMediciones, code: 200 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }

  async medicionDispositivosActivos(req, res) {
    try {
      const ultimasMediciones = await models.dispositivo.findAll({
        attributes: ['nombre', 'latitud', 'longitud', 'external_id'],
        include: [{
          model: models.medicion,
          attributes: ['uv', 'fecha'],
          limit: 1,
          order: [['fecha', 'DESC']],
          where: {
            fecha: {
              [Op.not]: null // Excluye dispositivos sin mediciones
            }
          }
        }],
        where: {
          activo: true // Asumiendo que existe una columna "activo" en la tabla dispositivo
        }
      });

      res.status(200).json({ ultimasMediciones, code: 200 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }

  async promedioMedicion(req, res) {
    try {
      const promedioUltimasMediciones = await models.medicion.findOne({
        attributes: [
          [models.sequelize.fn('AVG', models.sequelize.col('uv')), 'promedio'],
        ],
        include: [{
          model: models.dispositivo,
          attributes: [],
          where: {
            activo: true // Asumiendo que existe una columna "activo" en la tabla dispositivo
          }
        }],
        where: {
          fecha: {
            [Op.not]: null // Excluye mediciones sin fecha
          }
        },
        raw: true, // Retorna solo los resultados, sin metadata
      });

      res.status(200).json({ promedioUltimasMediciones, code: 200 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }

  async medicionesFechas(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.body;
  
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ msg: 'Se requieren fechas de inicio y fin', code: 400 });
      }
  
      const mediciones = await models.medicion.findAll({
        where: {
          fecha: {
            [Op.between]: [fechaInicio, fechaFin], // Utiliza directamente las fechas proporcionadas por el cliente
          },
        },
        include: [{
          model: models.dispositivo,
          attributes: [],
          where: {
            activo: true,
          },
        }],
        attributes: ['uv', 'fecha', 'dispositivoId'],
      });
  
      res.status(200).json({ mediciones, code: 200 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error interno del servidor', code: 500 });
    }
  }

  async guardarMedicion(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ msg: "Datos no encontrados", code: 400 });
        return;
      }
  
      const { identificador, uv } = req.body;
      const fecha = new Date();
      fecha.setHours(fecha.getHours() - 5);
  
      // Buscar el dispositivo correspondiente al identificador
      const dispositivoEncontrado = await dispositivo.findOne({ where: { identificador } });
  
      if (!dispositivoEncontrado) {
        res.status(400).json({ msg: "Dispositivo no encontrado", code: 400 });
        return;
      }
  
      // Crear la medición asociada al dispositivo encontrado
      const nuevaMedicion = await medicion.create({ 
        uv, 
        fecha, // Suponiendo que fecha es proporcionada por el cliente
        dispositivoId: dispositivoEncontrado.id 
      });
  
      res.status(200).json({ msg: "Medición guardada exitosamente", code: 200 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }
}
  
module.exports = MedicionController;