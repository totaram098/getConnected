const RegistrationModel = require("../Models/RegistrationModel");
const config = require("../config/config");
const bcrypt = require("bcryptjs");
const sequelize = config.sequelizeTZ;
require("dotenv").config();
const jwt = require("jsonwebtoken");

//insert
const insertData = async (req, res) => {
  try {
    const data = req.body;
    data.password = await bcrypt.hash(data.password, 10);
    await sequelize.sync({ force: false });
    let insert = await RegistrationModel.create(data);
    res.status(200).json(insert);
  } catch (e) {
    let message = e.errors[0]["message"];
    res.status(200).json({ Message: message });
  }
};

//update
const updateData = async (req, res) => {
  const data = req.body;
  try {
    let update = await RegistrationModel.update(data, {
      where: {
        fname: data.fname,
      },
    });
    res.status(200).json(update);
  } catch (e) {
    res.status(200).json(e);
  }
};

//select
const selectData = async (req, res) => {
  // const data = req.body
  try {
    let result = await RegistrationModel.findAll();
    res.status(200).json(result);
  } catch (e) {
    res.status(200).json(e);
  }
};

//delete
const deleteData = async (req, res) => {
  const data = req.body;
  try {
    let result = await RegistrationModel.destroy({
      where: data,
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(200).json(e);
  }
};
const login = async (req, resp) => {
  try {
    if (!req.cookies.jwt_token) {
      const user = req.body;
      Userpassword = await bcrypt.hash(user.password, 10);
      let result = await RegistrationModel.findOne({
        where: {
          email: user.email,
          password: Userpassword,
        },
      });
      if (!result) {
        resp.status(404).json({ Message: "User does not exist" });
      }
      //   const isPasswordValid = await bcrypt.compare(user.password,foundUser.password);
      if (result) {
        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
          expiresIn: "5h",
        });
        // resp.cookie("jwt_token",{user,token:token},{
        //     maxAge: 60*60*5,
        //     expires: new Date(),
        // });

        resp.cookie("jwt_token", { user, token: token });
        resp.status(404).json({ Token: token });
      }
      resp.status(200).json(result);
    }

    resp.status(202).json({ message: "Already logged in" });
  } catch (e) {
    resp.status(402).json(e);
  }
};
module.exports = {
  insertData,
  deleteData,
  updateData,
  selectData,
  login,
};