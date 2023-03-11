const config = require("../../config/config");
const Message = require("./MesssageModel");
const DataTypes = config.DataTypes;
const Model = config.Sequelize.Model;
const sequelize = config.sequelizeTZ;

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    profile: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
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
    modelName: "user",
    timestamps: false,
  }
);

//relation with message
User.hasMany(Message, {
  foreignKey: {
    allowNull: false,
  },
});
Message.belongsTo(User);

module.exports = User;
