'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 8;
const models = require('../models');
const { validationResult } = require("express-validator");
const dispositivo = require('../models/dispositivo');



class MedicionController {
    async guardar(req, res) {
        let errors = validationResult(req);
        if (errors.isEmpty()) {

            console.log(req.body);
            var data = {
                identificador: req.body.identificador,
                nombre: req.body.nombre,
                latitud: req.body.latitud,
                longitud: req.body.longitud,
                ip: req.body.ip
            };
            res.status(200);
            let transaction = await models.sequelize.transaction();

            try {
                await dispositivo.create(data, {transaction });
                console.log('guardado');
                await transaction.commit();
                res.json({ msg: "Se han reguistrado sus datos", code: 200 });
            } catch (error) {
                if (transaction) await transaction.rollback();
                if (error.error && error.error[0].message) {
                    res.json({ msg: error.error[0].message, code: 200 });
                } else {
                    res.json({ msg: error.message, code: 200 });
                }
            }

        } else {
            res.status(400);
            res.json({ msg: "Datos no encontrados", code: 400 });
        }
    }

    async listar(req, res) {

    }

}


module.exports = MedicionController;