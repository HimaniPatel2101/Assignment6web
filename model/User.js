
const Sequelize = require('sequelize');
const sequelize = require('../DB/connectDB');

var User = sequelize.define('User', {
    email: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    dob: Sequelize.DATE,
    street: Sequelize.STRING,
    city: Sequelize.STRING,
    province: Sequelize.STRING
});

module.exports = User;
