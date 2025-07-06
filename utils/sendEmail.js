const axios = require("axios");

const sendEmail = async ({ toEmail, subject, message }) => {
  try {
    await axios.post("https://api.web3forms.com/submit", {
      access_key: process.env.WEB3FORMS_KEY,
      email: toEmail,
      subject,
      name: "Smart Study Planner",
      message,
    });
    console.log("Web3Forms email sent");
  } catch (err) {
    console.error("Web3Forms email error:", err.response?.data || err.message);
  }
};

module.exports = { sendEmail };
