const express = require("express");
const router = express.Router();
const StudentModel = require("../models/Student");
const bcrypt = require('bcrypt');

//Signup
router.post('/signup', async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const { name, email, password } = req.body;
    const existingUser = await StudentModel.findOne({ email });

    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await StudentModel.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Signup successful", student: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await StudentModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// routes/auth.js
router.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await StudentModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
