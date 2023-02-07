const User = require("../models/User");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./mailer");
require("dotenv").config();

const register = async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(201).json({ message: "No registration data recieved!" });
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
          res.status(201).json({ message: "User already exists!" });
        } else {
          await User.sync({ force: false });
          let userRegistered = null;
          if (data.email === "kelash@kenduit.com") {
            userRegistered = await User.create({ ...data, role: "admin" });
          } else {
            userRegistered = await User.create({ ...data, role: "user" });
          }
          res.status(201).json({
            message: "Registeration Successful",
            user: userRegistered,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(201).json({ message: err });
      });
  } catch (e) {
    res.status(201).json({ message: "An error occured!" });
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
      maxAge: 590000,
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

    res.status(201).json({ message: "Login Successful", user: userDetails });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e });
  }
};

const logout = async (req, res) => {
  res.status(201).clearCookie("jwt_token").json({ message: "Logged out!" });
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
      .status(201)
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

const generateOTP = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ message: "Please provide email also!" });
    }

    req.app.locals.OTP = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const emailHTML = `
      <h3>OTP</h3>
      <p>Please use this OTP to change your password on http://localhost:3000/verifyOTP </p>
      <code>${req.app.locals.OTP}</code>
    `;
    const response = await sendEmail(
      req.body.email,
      "Password Recovery OTP",
      "Use this OTP for verification",
      emailHTML
    );
    if (
      !response[0] ||
      Object.keys(response[0]).length <= 0 ||
      response[0].statusCode >= 300
    ) {
      res.status(500).json({
        message:
          "Unfortunately sending you OTP email failed this time, try again!",
      });
    }
    response[0].statusCode >= 201 &&
      response[0].statusCode <= 250 &&
      res.status(201).json({
        message: "OTP has been sent to your email!",
        otp: req.app.locals.OTP,
      });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const verifyOTP = (req, res) => {
  try {
    const { otp } = req.body;
    console.log(otp);
    console.log(req.app.locals.OTP);
    if (parseInt(req.app.locals.OTP) === parseInt(otp)) {
      req.app.locals.OTP = null;
      req.app.locals.resetSession = true;
      return res.status(201).json({ message: "OTP verified successfully!" });
    }
    res.status(400).json({ message: "Invalid OTP" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const createResetSession = (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).json({ flag: req.app.locals.resetSession });
  }
  return res.status(400).json({ message: "session expired!" });
};

const resetPassword = async (req, res) => {
  if (!req.app.locals.resetSession)
    return res.status(400).json({ message: "session expired!" });

  try {
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        bcrypt
          .hash(req.body.password, 8)
          .then(async (hashedPassword) => {
            const updatedUser = await User.update(
              {
                password: hashedPassword,
              },
              {
                where: {
                  email: user.email,
                },
              }
            );
            if (updatedUser[0] <= 0) {
              return res.status(400).json({ message: "User did not update!" });
            }
            req.app.locals.resetSession = false;
            return res.status(201).json({
              message: "Your password has been changed now!",
            });
          })
          .catch((error) => {
            res.status(404).json({ message: "Internal error occured!" });
          });
      })
      .catch((error) => {
        res.status(404).json({ message: "User not found!" });
      });
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
  resetPassword,
  createResetSession,
};
