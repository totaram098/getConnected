const RegistrationModel = require("../Models/RegistrationModel");
const config = require("../config/config");
const Model = config.Sequelize.Model;
const sequelize = config.sequelizeTZ;
require("dotenv").config();
const jwt = require("jsonwebtoken");

const insertData = async (req, res) => {
  try {
    await sequelize.sync({ force: false });
    let insert = await RegistrationModel.create({
      fname: "Totaram",
      lname: "Meghwar",
      phoneNumber: "03313171143",
      email: "totataram@gmail.com",
      password: "ramrama",
    });
    res.status(200).json(insert);
  } catch (e) {
    let message = e.errors[0]["message"];
    res.status(200).json({ Message: message });
  }
};

//update
const updateData = async (req, res) => {
  try {
    let update = await RegistrationModel.update(
      {
        fname: "RAM",
        lname: "KUMAR",
      },
      {
        where: {
          fname: "Totaram",
        },
      }
    );
    res.status(200).json(update);
  } catch (e) {
    res.status(200).json(e);
  }
};

//select
const selectData = async (req, res) => {
  try {
    let data = await RegistrationModel.findAll(
      {
        attributes: ["fname", "lname", "email"],
      },
      {
        where: {
          fname: "RAM",
        },
      }
    );
    res.status(200).json(data);
  } catch (e) {
    res.status(200).json(e);
  }
};

//delete
const deleteData = async (req, res) => {
  try {
    let result = await RegistrationModel.destroy({
      where: {
        fname: "Totaram",
      },
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(200).json(e);
  }
};
module.exports = {
  insertData,
  deleteData,
  updateData,
  selectData,
};
