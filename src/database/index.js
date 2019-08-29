const Sequelize = require('sequelize');
const config = require('../config/database');
const sequelize = new Sequelize(config);

const User = sequelize.import('../models/User');

module.exports = { User }