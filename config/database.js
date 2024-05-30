const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    charset: 'utf8mb4', // Specify the character encoding
    collate: 'utf8mb4_unicode_ci' // Specify the collation
  }
);

module.exports = sequelize;
