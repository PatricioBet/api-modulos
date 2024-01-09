'use strict';
module.exports = (sequalize, DataTypes) => {
    const dispositivo = sequalize.define('dispositivo', {
        identificador: { type: DataTypes.INTEGER, defaultValue: 0 },      
        nombre: {type: DataTypes.STRING(50), defaultValue: 'NULL'},
        latitud: { type: DataTypes.FLOAT, defaultValue: 0.0 },     
        longitud: { type: DataTypes.FLOAT, defaultValue: 0.0 },
        ip: {type: DataTypes.STRING(15), defaultValue: 'NULL'},
        external_id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
    }, {freezeTableName: true});

    return dispositivo;
}
