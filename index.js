const express = require("express");
const config = require("./config/config");
const cookieParser = require("cookie-parser");
const sequelizeTZ = config.sequelizeTZ;
const auth = require("./auth/auth");
require("dotenv").config();

const userController = require("./controllers/userController");
const BookingController = require("./controllers/BookingController");

const port = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cookieParser());

console.log(process.env.MYSQLDATABASE);
const { insertData, deleteData, updateData, selectData } = userController;

app.get("/", (req, res) => {
  res.send("Welcome to booking app!");
});

app.post("/insert", insertData);
app.delete("/delete", deleteData);
app.put("/update", updateData);
app.get("/select", selectData);

app.get("/profile", auth.tokenVerify, (req, res) => {
  res.status(202).json({ message: "Verified Now" });
});

app.post("/booking", BookingController.insertBooking);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
