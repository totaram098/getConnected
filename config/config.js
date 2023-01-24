const { Sequelize, Model, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelizeTZ = new Sequelize(
  process.env.DB_NAME || "booking",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: process.env.DB_PORT || "3308",
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
