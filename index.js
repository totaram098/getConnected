const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const route = express.Router();
const verifyToken = require("./auth/chatVerifyToken");
app.use(bodyParser.json({ limit: "50mb" }));

const Message = require("./Models/chatModels/MesssageModel");
const {
  userLogin,
  addUser,
  getUsers,
} = require("./controllers/chatControllers/UserController");

const {
  addMessage,
  getMessage,
} = require("./controllers/chatControllers/MessageController");
const {
  getFriendRequest,
  addRequest,
  getRequest,
  responseRequest,
  removeRequest,
} = require("./controllers/chatControllers/RequestController");

app.use(cookieParser("secretKey"));
route.use(verifyToken);

app.use(express.json());
app.use(express.static(__dirname));
app.set("view engine", "ejs");

route.get("/", (req, resp) => {
  const user = req.signedCookies.getConnected.user;
  resp.render("index", { user });
});

app.get("/signup", (req, resp) => {
  resp.render("signup");
});

app.get("/login", (req, resp) => {
  const cookieValue = req.signedCookies.getConnected;
  if (cookieValue != undefined) {
    resp.redirect("/");
  } else {
    resp.render("login");
  }
});

app.post("/userLogin", userLogin);
//logout

app.get("/logout", (req, resp) => {
  resp.clearCookie("getConnected");
  resp.redirect("/");
});
//users
app.post("/addUser", addUser);
route.get("/getUsers", getUsers);

//messages
io.on("connection", (socket) => {
  route.post("/addMessage", async (req, resp) => {
    try {
      const cookieValue = req.signedCookies.getConnected;
      recieverId = req.body.senderId;
      senderId = cookieValue.user.id;
      userMessage = req.body.message;

      const data = {
        name: cookieValue.user.name,
        message: userMessage,
        recieverId: recieverId,
        userId: senderId,
      };

      const result = await Message.create(data);

      if (result) {
        io.emit(recieverId, data);
        resp.status(202).json({ Message: "User Message added succesfully" });
      } else {
        resp
          .status(402)
          .json({ Message: "User Message could not be added succesfully" });
      }
    } catch (e) {
      console.log(e);
      resp.status(402).json({ Message: e });
    }
  });
});
route.post("/getMessage", getMessage);

//request
route.post("/addRequest", addRequest);
route.post("/getRequest", getRequest);
route.put("/responseRequest", responseRequest);
route.delete("/removeRequest", removeRequest);
route.post("/getFriendRequest", getFriendRequest);

// io.on("connection", (socket) => {
//   console.log("socket");
// });

app.use("/", route);
server.listen(3000, () => {
  console.log("server is running on port 3000");
});

module.exports = server;
