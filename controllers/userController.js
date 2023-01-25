const User = require("../Models/User");

const bcrypt = require("bcrypt");

require("dotenv").config();
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(200).json({ message: "No registration data recieved!" });
      return;
    }

    let data = req.body;
    data.password = await bcrypt.hash(data.password, 8);

    User.findOne({ where: { email: data.email } })
      .then(async (result) => {
        if (result) {
          res.status(200).json({ message: "User already exists" });
        } else {
          await User.sync({ force: false });
          console.log(data);
          const userRegistered = await User.create(data);
          res.status(200).json({ message: userRegistered });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(200).json({ message: err });
      });
  } catch (e) {
    res.status(200).json({ message: "An error occured!" });
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
    let result = await User.destroy({
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
      const Userpassword = await bcrypt.hash(user.password, 10);
      let result = await User.findOne({
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
  register,
  deleteData,
  updateData,
  selectData,
  login,
};
