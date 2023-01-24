const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelizeTZ = new Sequelize("booking", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: "3308",
  logging: false,
});

const connection = {};
connection.Sequelize = Sequelize;
connection.sequelizeTZ = sequelizeTZ;
connection.Model = Model;
connection.DataTypes = DataTypes;

module.exports = connection;
