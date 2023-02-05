const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/database");
require("dotenv").config();
const auth = require("./auth");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Connecting to database
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

(async () => {
  await sequelize.sync({ alter: true });
})();

app.get("/", (req, res) => {
  res.send("Welcome to booking app!");
});

// User routes
app.use("/users", require("./routes/User"));

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
