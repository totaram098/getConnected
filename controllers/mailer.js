const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text, html) => {
  try {
    const response = await sgMail.send({
      to,
      from: {
        name: "Kenduit Inc.",
        email: process.env.MY_EMAIL,
      },
      subject,
      text,
      html,
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendEmail };
