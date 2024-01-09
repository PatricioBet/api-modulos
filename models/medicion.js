'use strict';
module.exports = (sequelize, DataTypes) => {
    const medicion = sequelize.define('medicion', {
        uv: { type: DataTypes.STRING, allowNull: false },
        fecha: { type: DataTypes.DATE, defaultValue: false },
        external_id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4}
    }, { freezeTableName: true });

    medicion.associate = function (models) {
        medicion.belongsTo(models.dispositivo, { foreignKey: 'dispositivoId', allowNull: true });
    };

    return medicion;
};
