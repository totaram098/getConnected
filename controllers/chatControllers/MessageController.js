const { Socket } = require("socket.io");
const config = require("../../config/config");
const Message = require("../../Models/chatModels/MesssageModel");
const User = require("../../Models/chatModels/UserModel");

// const express = require("express");
// const app = express();
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);
const op = config.op;

const addMessage = async (req, resp) => {
  // try {
  //   // console.log(socket);
  //   const cookieValue = req.signedCookies.getConnected;
  //   recieverId = req.body.senderId;
  //   senderId = cookieValue.user.id;
  //   userMessage = req.body.message;

  //   const data = {
  //     name: cookieValue.user.name,
  //     message: userMessage,
  //     recieverId: recieverId,
  //     userId: senderId,
  //   };
  //   const result = await Message.create(data);

  //   if (result) {
  //     resp.status(202).json({ Message: "User Message added succesfully" });
  //   } else {
  //     resp
  //       .status(402)
  //       .json({ Message: "User Message could not be added succesfully" });
  //   }
  // } catch (e) {
  //   console.log(e);
  //   resp.status(402).json({ Message: e });
  // }
};

const getMessage = async (req, resp) => {
  try {
    const cookieValue = req.signedCookies.getConnected;
    recieverId = cookieValue.user.id;
    senderId = req.body.senderId;
    const sender = await User.findAll({
      where: {
        id: senderId,
      },
    });
    const result = await Message.findAll({
      where: {
        [op.or]: [
          { recieverId: recieverId, userId: senderId },
          { recieverId: senderId, userId: recieverId },
        ],
      },
      order: [["created_at"]],
    });
    if (result && sender) {
      resp.status(202).json({ message: result, user: sender });
    } else {
      resp.status(402).json({ Message: "There is no any message" });
    }
  } catch (e) {
    resp.status(402).json(e);
  }
};

module.exports = { addMessage, getMessage };
