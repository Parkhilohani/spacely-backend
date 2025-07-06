// server/models/Task.js

const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  cardName: {
    type: String,
    required: true,
  },
  topicName: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  stability: {
    type: Number,
    default: 2.5,
  },
  scheduled_days: {
    type: Number,
    default: 1,
  },
  elapsed_days: {
    type: Number,
    default: 0,
  },
  reps: {
    type: Number,
    default: 0,
  },
  lapses: {
    type: Number,
    default: 0,
  },
  last_review: {
    type: Date,
  },
  nextReviewDate: {
    type: Date,
  },
  stopped: {
    type: Boolean,
    default: false,
  },
  notifications: {
    type: Boolean,
    default: true,
  },
  reviewHistory: {
    type: [String], 
    default: [],
  },
  state: {
    type: String,
    default: "new",
  }
});

module.exports = mongoose.model("Task", TaskSchema);
