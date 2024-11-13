const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos

const GpsPoint = sequelize.define('GpsPoint', {
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  phone_identifier: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true, 
  tableName: 'gps_points' // Nombre de la tabla en la base de datos
});

module.exports = GpsPoint;
