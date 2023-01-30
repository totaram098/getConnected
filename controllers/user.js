const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
          res.status(200).json({ message: "User already exists!" });
        } else {
          await User.sync({ force: false });
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

const get = async (req, res) => {
  try {
    let result = await User.findAll();
    res.status(200).json(result);
  } catch (e) {
    res.status(200).json(e);
  }
};

const login = async (req, res) => {
  try {
    if (req.cookies.jwt_token) {
      res.status(202).json({ message: "Already logged in" });
      return;
    }

    const userDetails = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!userDetails || userDetails === null) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    const correctPassword = await bcrypt.compare(
      req.body.password,
      userDetails.password
    );
    if (!correctPassword) {
      res.status(404).json({ message: "Invalid credientials!" });
      return;
    }

    const token = await generateToken(req.body.email);

    res.cookie("jwt_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 150000),
    });

    res.status(200).json({ user: userDetails });
  } catch (e) {
    res.status(400).json(e);
  }
};

const generateToken = async (email) => {
  try {
    return await jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  register,
  login,
  get,
};
