const { Sequelize, Model, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelizeTZ = new Sequelize(
  process.env.MYSQLDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    dialect: "mysql",
    port: process.env.MYSQLPORT,
    logging: false,
  }
);

sequelizeTZ
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const connection = {};
connection.Sequelize = Sequelize;
connection.sequelizeTZ = sequelizeTZ;
connection.Model = Model;
connection.DataTypes = DataTypes;

module.exports = connection;
