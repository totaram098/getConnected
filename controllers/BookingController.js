const BookingModel = require("../Models/Booking");
const config = require("../config/config");
const sequelize = config.sequelizeTZ;
//insert
const insertBooking = async (req, res) => {
  try {
    const data = req.body;
    await sequelize.sync({ force: false });
    let insert = await BookingModel.create(data);
    res.status(200).json(insert);
  } catch (e) {
    let message = e.errors[0]["message"];
    res.status(400).json({ Message: message });
  }
};
module.exports = {
  insertBooking,
};
