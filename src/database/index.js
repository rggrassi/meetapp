const Sequelize = require('sequelize');
const config = require('../config/database');
const sequelize = new Sequelize(config);

const User = sequelize.import('../models/User');
const File = sequelize.import('../models/File');
const Meetup = sequelize.import('../models/Meetup');
const Subscription = sequelize.import('../models/Subscription');

/**
 * Define the relationship between the models
 */
const models = { User, File, Meetup, Subscription };

Object.keys(models).forEach(model => {
    if ('associate' in models[model]) {
        models[model].associate(models)
    }
})

module.exports = { sequelize, models };