const express = require("express");
const sendMail = require("../utils/sendMail");
const router = express.Router();

router.post("/notify", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await sendMail(to, subject, message);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
