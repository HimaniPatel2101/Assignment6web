const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('dcghjjmqsu7h79', 'qoyksiderbftzz', 'fbdf616801eb32904de30ed37c2a2a2942c9dfba6bbd3fd740d7b63482f7e3d8', {
    host: 'ec2-23-21-229-200.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

sequelize
    .authenticate()
    .then(function () {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

module.exports = sequelize;