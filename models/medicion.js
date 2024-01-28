'use strict';
module.exports = (sequelize, DataTypes) => {
    const Medicion = sequelize.define('medicion', {
        uv: { type: DataTypes.STRING, allowNull: false },
        fecha: { type: DataTypes.DATE, defaultValue: null },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { freezeTableName: true });

    Medicion.associate = function (models) {
        Medicion.belongsTo(models.dispositivo, { foreignKey: 'dispositivoId', allowNull: true });
    };

    return Medicion;
};
