const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dmoj2zagh",
  api_key: "388659671243881",
  api_secret: "DM9nRwxsPq9fFiEw2btnQtT_lBw",
});

module.exports = cloudinary;
