const config = require("../../config/config");
const DataTypes = config.DataTypes;
const Model = config.Sequelize.Model;
const sequelize = config.sequelizeTZ;
const User = require("./UserModel");

class Request extends Model {}

Request.init(
  {
    recieverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    senderId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      primaryKey: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: new Date(),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "request",
    timestamps: false,
  }
);

//relation with request
User.hasMany(Request, {
  foreignKey: "senderId",
});
Request.belongsTo(User, {
  foreignKey: "senderId",
});
module.exports = Request;
