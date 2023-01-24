const config = require("../config/config");
const DataTypes = config.DataTypes;
const Model = config.Sequelize.Model;
const sequelize = config.sequelizeTZ;

class BookingModel extends Model {}
BookingModel.init(
  {
    bookingId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validator: {
        isEmail: true,
      },
    },
    date: {
      type: DataTypes.DATE,
    },
    people: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    services: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shootLocation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
    },
    durationFrom: {
      type: DataTypes.TIME,
    },
    durationTo: {
      type: DataTypes.TIME,
    },
    meetingLocation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    additionalRequests: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    additionalServices: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  },
  {
    sequelize,
    modelName: "booking",
    timestamps: false,
  }
);

module.exports = BookingModel;
