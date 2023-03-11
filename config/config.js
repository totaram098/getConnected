const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const sequelizeTZ = new Sequelize("get_connected", "root", "", {
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
connection.op = Op;
sequelizeTZ.sync({ force: false });
module.exports = connection;
