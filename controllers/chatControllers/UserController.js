const config = require("../../config/config");
const jwt = require("jsonwebtoken");
const User = require("../../Models/chatModels/UserModel");
const Request = require("../../Models/chatModels/RequestModel");
const img = "../../assets/images/profile.jpg";
const sequelize = config.sequelizeTZ;
const cloudinary = require("../../config/cloudinary");
const op = config.op;
const apiSecretKey = "userLoginJWTKey";
// const secretKey = crypto.randomBytes(32).toString("hex");

const addUser = async (req, resp) => {
  try {
    data = req.body;
    var pic = "getConnected/blank-profile-picture-973460_1280_gqectr";

    const result = await User.create({
      name: data.name,
      profile: pic,
      email: data.email,
      password: data.password,
    });

    if (result) {
      cloudinary.uploader.upload(
        data.profile,
        { folder: "getConnected" },
        function (error, cloudResult) {
          if (cloudResult) {
            pic = cloudResult.public_id;
          }
        }
      );
      await User.update({
        profile: pic,
        where: {
          id: result.id,
        },
      });
      resp.status(202).json({ Message: "User added succesfully" });
    } else {
      resp.status(400).json({ Message: "User could not be added succesfully" });
    }
  } catch (e) {
    resp.status(400).json({ Message: "Something went wrong!" });
  }
};

const getUsers = async (req, resp) => {
  try {
    const cookieValue = req.signedCookies.getConnected;
    var recieverId = cookieValue.user.id;

    requestTable = await Request.findAll({
      where: {
        senderId: recieverId,
      },
      attributes: ["recieverId"],
    });

    var senderIds = requestTable.map((obj) => obj.recieverId);
    senderIds.push(recieverId);
    const result = await User.findAll({
      order: sequelize.literal("RAND()"),
      where: {
        id: {
          [op.notIn]: senderIds,
        },
      },
      limit: 15,
    });
    if (result) {
      resp.status(202).json(result);
    } else {
      resp.status(402).json({ Message: "Something wrong went wrong!" });
    }
  } catch (e) {
    resp.status(402).json(e);
  }
};

const userLogin = async (req, resp) => {
  const data = req.body;

  try {
    const result = await User.findAll({
      where: data,
    });
    if (result.length == 1) {
      var user = result[0];
      user = user.dataValues;
      const signToken = jwt.sign(user, apiSecretKey, { expiresIn: "7d" });

      if (signToken) {
        const getConnectedCookies = { user, token: signToken };
        resp.cookie("getConnected", getConnectedCookies, {
          expires: new Date(Date.now() + 604800000),
          httpOnly: true,
          secure: true,
          signed: true,
        });
        resp.status(202).json({ Message: true });
      } else {
        resp.status(202).json({ error: "Something went wrong" });
      }
    } else if (result.length == 0) {
      resp.status(202).json({ error: "User does not exist!" });
    } else {
      resp.status(202).json({ error: "Something went wrong" });
    }
  } catch (error) {
    resp.status(402).json({ error: "error" });
  }
};

module.exports = { addUser, getUsers, userLogin };
