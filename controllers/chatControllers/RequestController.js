const config = require("../../config/config");
const Request = require("../../Models/chatModels/RequestModel");
const sequelize = config.sequelizeTZ;
const User = require("../../Models/chatModels/UserModel");
const op = config.op;

const addRequest = async (req, resp) => {
  try {
    const cookieValue = req.signedCookies.getConnected;
    recieverId = cookieValue.user.id;
    senderId = req.body.senderId;
    const result = await Request.create({
      recieverId: senderId,
      senderId: recieverId,
    });
    if (result) {
      resp.status(202).json({ Message: "User Request added succesfully" });
    } else {
      resp
        .status(402)
        .json({ Message: "User Request could not be added succesfully" });
    }
  } catch (e) {
    resp.status(402).json({ Message: "Something Went wrong!" });
  }
};

const getRequest = async (req, resp) => {
  try {
    const cookieValue = req.signedCookies.getConnected;
    const recieverId = cookieValue.user.id;
    const reqStatus = req.body.status;
    const recieverResult = await Request.findAll({
      attributes: ["recieverId"],
      where: {
        senderId: recieverId,
        status: reqStatus,
      },
    });
    var ids = recieverResult.map((obj) => obj.recieverId);
    const senerResult = await Request.findAll({
      attributes: ["senderId"],
      where: {
        recieverId: recieverId,
        status: reqStatus,
      },
    });
    senerResult.map((obj) => {
      ids.push(obj.senderId);
    });

    result = await User.findAll({
      where: {
        id: {
          [op.in]: ids,
        },
      },
    });
    if (result) {
      resp.status(202).json(result);
    } else {
      resp.status(402).json({ Message: "There is no any Request!" });
    }
  } catch (e) {
    resp.status(402).json({ Message: e });
  }
};

const getFriendRequest = async (req, resp) => {
  try {
    const cookieValue = req.signedCookies.getConnected;
    const recieverId = cookieValue.user.id;
    const reqStatus = req.body.status;
    const recieverResult = await Request.findAll({
      attributes: ["senderId"],
      where: {
        recieverId: recieverId,
        status: reqStatus,
      },
    });
    var ids = recieverResult.map((obj) => obj.senderId);

    result = await User.findAll({
      where: {
        id: {
          [op.in]: ids,
        },
      },
    });
    if (result) {
      resp.status(202).json(result);
    } else {
      resp.status(402).json({ Message: "There is no any Request!" });
    }
  } catch (e) {
    resp.status(402).json({ Message: e });
  }
};

const responseRequest = async (req, resp) => {
  try {
    const cookieValue = req.signedCookies.getConnected;
    recieverId = cookieValue.user.id;
    senderId = req.body.senderId;
    const result = await Request.update(
      { status: true },
      {
        where: {
          recieverId: recieverId,
          senderId: senderId,
        },
      }
    );
    if (result) {
      resp.status(202).json({ Message: "Request Accepted" });
    } else {
      resp.status(402).json({ Message: "Could not confirm the Request !" });
    }
  } catch (e) {
    resp.status(402).json(e);
  }
};

const removeRequest = async (req, resp) => {
  try {
    const cookieValue = req.signedCookies.getConnected;
    recieverId = cookieValue.user.id;
    senderId = req.body.senderId;
    const result = await Request.destroy({
      where: {
        recieverId: recieverId,
        senderId: senderId,
      },
    });
    if (result) {
      resp.status(202).json({ Message: "Request Removed" });
    } else {
      resp.status(402).json({ Message: "Could not Remove the Request!" });
    }
  } catch (e) {
    let message = e.errors[0]["message"];
    resp.status(402).json({ Message: message });
  }
};

module.exports = {
  addRequest,
  getRequest,
  responseRequest,
  removeRequest,
  getFriendRequest,
};
