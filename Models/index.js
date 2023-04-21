const Booking = require("./Booking");
const Services = require("./Services");

/* Booking and Services relationship i.e. booking table has many services  */

Booking.hasMany(Services, {
  foreignKey: "bookingId",
  as: "services",
});

Services.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "bookings",
});
