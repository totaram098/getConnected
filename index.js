const express = require("express");
const config = require("./config/config");
const cookieParser = require("cookie-parser");
const sequelizeTZ = config.sequelizeTZ;
const auth = require("./auth/auth");

const port = 3001;
const app = express();
app.use(express.json());
app.use(cookieParser());

const userController = require("./controllers/userController");
const BookingController = require("./controllers/BookingController");
app.post("/insert", userController.insertData);
app.delete("/delete", userController.deleteData);
app.put("/update", userController.updateData);
app.get("/select", userController.selectData);

app.get("/profile", auth.tokenVerify, (req, resp) => {
  resp.status(202).json({ message: "Verified Now" });
});

app.post("/booking", BookingController.insertBooking);

app.get("/insert", userController.insertData);
app.get("/delete", userController.deleteData);
app.post("/update", userController.updateData);
app.get("/select", userController.selectData);
// (req,res)=>{
//     try {
//         sequelizeTZ.authenticate();
//         console.log('Connection has been established successfully.');
//         res.send("successfully connected")
//       } catch (error) {
//         console.error('Unable to connect to the database:', error);
//       }
// })
app.listen(port, () => {
  console.log("Connected");
});
