'use strict';
const { validationResult } = require("express-validator");
const { sequelize, dispositivo } = require('../models');
const jwt = require('jsonwebtoken');

class MedicionController {
    async guardar(req, res) {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.status(400).json({ msg: "Datos no encontrados", code: 400 });
            return;
          }
      
          console.log(req.body);
          const { identificador, nombre, latitud, longitud, ip } = req.body;
      
          const [registro, creado] = await dispositivo.findOrCreate({
            where: { identificador },
            defaults: { nombre, latitud, longitud, ip, activo: true } // Agregar el campo activo
          });
      
          const transaction = await sequelize.transaction();
      
          try {
            if (!creado) {
              // Si el registro ya existía, actualiza sus datos incluyendo el campo activo
              await dispositivo.update({ nombre, latitud, longitud, ip, activo: true }, { where: { identificador }, transaction });
            }
      
            console.log('guardado/actualizado');
            await transaction.commit();
            res.status(200).json({ msg: "Se han registrado/actualizado sus datos", code: 200 });
          } catch (error) {
            await transaction.rollback();
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
      }
      

    async listar(req, res) {
        try {
            const dispositivos = await dispositivo.findAll({
                attributes: ['nombre', 'latitud', 'longitud', 'external_id', 'activo']
            });
            res.status(200).json({ dispositivos, code: 200 });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }

    async listarActivos(req, res) {
        try {
            const dispositivosActivos = await dispositivo.findAll({
                attributes: ['nombre', 'latitud', 'longitud', 'external_id'],
                where: { activo: true }
            });
            res.status(200).json({ dispositivos: dispositivosActivos, code: 200 });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }

    async generarTokenDispositivo(req, res) {
      require('dotenv').config();
      const payload = {
        rol: 'DISPOSITIVO'
      };
      const token = jwt.sign(payload, process.env.KEY);
      res.status(200).json({ msg: "Token de dispositivo generado", code: 200, token });
    }

    async generarTokenBackend(req, res) {
      require('dotenv').config();
      const payload = {
        rol: 'BACKEND'
      };
      const token = jwt.sign(payload, process.env.KEY);
      res.status(200).json({ msg: "Token de dispositivo generado", code: 200, token });
    }
}

module.exports = MedicionController;
