const User = require("../models/User");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
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

    User.findOne({
      where: { email: data.email },
      attributes: { exclude: ["password"] },
    })
      .then(async (result) => {
        if (result) {
          res.status(200).json({ message: "User already exists!" });
        } else {
          await User.sync({ force: false });
          let userRegistered = null;
          if (data.email === "kelash@kenduit.com") {
            userRegistered = await User.create({ ...data, role: "admin" });
          } else {
            userRegistered = await User.create({ ...data, role: "user" });
          }
          res.status(200).json({
            message: "Registeration Successful",
            user: userRegistered,
          });
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

/* This route is for checking whether user logged in? */
const userLoggedIn = async (req, res) => {
  try {
    if (!req.user_email) {
      res.status(404).json({ exists: false, message: "User doesn't exist!" });
      return;
    }
    const user = await User.findOne({
      where: {
        email: req.user_email,
      },
      attributes: { exclude: ["password"] },
    });
    res.status(202).json({ exists: true, message: "User exists!", user });
  } catch (e) {
    res.status(400).json(e);
  }
};

const login = async (req, res) => {
  try {
    let userDetails = await User.findOne({
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
      maxAge: 190000,
    });

    userDetails = {
      id: userDetails?.id,
      fname: userDetails?.fname,
      lname: userDetails?.lname,
      phoneNumber: userDetails?.phoneNumber,
      email: userDetails?.email,
      role: userDetails?.role,
      createdAt: userDetails?.createdAt,
      updatedAt: userDetails?.updatedAt,
    };

    res.status(200).json({ message: "Login Successful", user: userDetails });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e });
  }
};

const logout = async (req, res) => {
  res.status(200).clearCookie("jwt_token").json({ message: "Logged out!" });
};

const profile = async (req, res) => {
  try {
    if (!req.user_email) {
      res.status(404).json({ exists: false, message: "User doesn't exist!" });
      return;
    }
    const user = await User.findOne({
      where: {
        email: req.user_email,
      },
      attributes: { exclude: ["password"] },
    });
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(202).json({ exists: true, message: "User exists!", user });
      return;
    }

    const { fname, lname, phoneNumber } = req.body;
    const updatedUser = await User.update(
      {
        fname,
        lname,
        phoneNumber,
      },
      {
        where: {
          email: req.user_email,
        },
      }
    );
    if (updatedUser[0] <= 0) {
      res.status(400).json({ updated: false, message: "User did not update!" });
      return;
    }
    res
      .status(200)
      .json({ updated: true, message: "User has been updated successfully!" });
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

const generateOTP = (req, res) => {
  try {
    req.app.locals.OTP = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    res.status(201).json({ otp: req.app.locals.OTP });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const verifyOTP = (req, res) => {
  try {
    const { otp } = req.body;
    if (parseInt(req.app.locals.OTP) === parseInt(otp)) {
      req.app.locals.OTP = null;
      return res
        .status(201)
        .json({ verified: true, message: "OTP verified successfully!" });
    }
    res.status(400).json({ verified: false, message: "Invalid OTP" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  profile,
  register,
  login,
  logout,
  userLoggedIn,
  generateOTP,
  verifyOTP,
};
