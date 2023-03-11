const config = require("../../config/config");
const DataTypes = config.DataTypes;
const Model = config.Sequelize.Model;
const sequelize = config.sequelizeTZ;

class Message extends Model {}

Message.init(
  {
    messageId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recieverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "message",
    timestamps: false,
  }
);

module.exports = Message;
