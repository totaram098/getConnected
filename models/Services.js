const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Services = sequelize.define(
  "services",
  {
    service: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "services",
    timestamps: false,
  }
);

module.exports = Services;
