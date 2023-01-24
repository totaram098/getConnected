const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelizeTZ = new Sequelize(
  process.env.MYSQLDATABASE || "booking",
  process.env.MYSQLUSER || "root",
  process.env.MYSQLPASSWORD || "",
  {
    host: process.env.MYSQLHOST || "localhost",
    dialect: "mysql",
    port: process.env.MYSQLPORT || "3308",
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
