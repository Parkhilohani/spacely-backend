const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Save note
router.post("/", async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: "Error saving note" });
  }
});

router.get("/view/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

// Get all notes by user
router.get("/:userId", async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.params.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching notes" });
  }
});


module.exports = router;
