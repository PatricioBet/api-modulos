'use strict';
module.exports = (sequelize, DataTypes) => {
    const Dispositivo = sequelize.define('dispositivo', {
        identificador: { type: DataTypes.INTEGER, defaultValue: 0 },
        nombre: { type: DataTypes.STRING(50), defaultValue: 'NULL' },
        latitud: { type: DataTypes.FLOAT, defaultValue: 0.0 },
        longitud: { type: DataTypes.FLOAT, defaultValue: 0.0 },
        ip: { type: DataTypes.STRING(15), defaultValue: 'NULL' },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        activo: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, { freezeTableName: true });
    
    Dispositivo.associate = function (models) {
        Dispositivo.hasMany(models.medicion, { foreignKey: 'dispositivoId' });
    };

    return Dispositivo;
};
