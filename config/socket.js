const soket = (req, resp) => {
  io.on("connection", (socket) => {
    console.log("userconnected");
  });

  resp.redirect("/signup");
};
module.exports = soket;
