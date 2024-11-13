const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gps-app', 'postgres', 'Kakodark5.', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
});

module.exports = sequelize;