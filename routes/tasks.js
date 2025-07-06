const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const sm2Review = require("../utils/sm2");

router.post("/task", async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.json({ success: true, task: saved });
  } catch (err) {
    console.error("Task creation failed:", err);
    res.status(400).json({
      error: "Failed to create task",
      details: err.message,
    });
  }
});

router.get("/tasks/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const today = new Date();

    const tasks = await Task.find({
      userId,
      nextReviewDate: { $lte: today },
      stopped: false,
    });

    res.json(tasks);
  } catch (err) {
    console.error("Failed to fetch due tasks:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.patch("/task/:id/review", async (req, res) => {
  try {
    const { quality } = req.body; 

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const updated = sm2Review(task, quality);

    task.reps = updated.reps;
    task.lapses = updated.lapses;
    task.stability = updated.easiness;
    task.scheduled_days = updated.scheduled_days;
    task.elapsed_days = updated.elapsed_days;
    task.last_review = updated.last_review;
    task.nextReviewDate = updated.nextReviewDate;
    task.state = updated.state;
    task.reviewHistory.push(quality.toString());

    await task.save();

    res.json({ success: true, task });
  } catch (err) {
    console.error("Review update failed:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

// POST /api/review/:id
router.post("/review/:id", async (req, res) => {
  const taskId = req.params.id;
  const today = new Date();

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    let interval;
    let stability = task.stability;

    // Simulate SM-2 effect based on difficulty
    switch (task.difficulty.toLowerCase()) {
      case "easy":
        interval = Math.round(stability * 3);
        stability += 0.3;
        break;
      case "medium":
        interval = Math.round(stability * 2);
        stability += 0.1;
        break;
      case "hard":
        interval = Math.max(1, Math.round(stability));
        stability = Math.max(1.3, stability - 0.2);
        break;
      default:
        interval = 1;
        break;
    }

    // Update task
    const nextReview = new Date();
    nextReview.setDate(today.getDate() + interval);

    task.reps += 1;
    task.elapsed_days = task.last_review
      ? Math.floor((today - task.last_review) / (1000 * 60 * 60 * 24))
      : 1;
    task.scheduled_days = interval;
    task.last_review = today;
    task.nextReviewDate = nextReview;
    task.stability = stability;
    task.reviewHistory.push(today.toISOString().split("T")[0]);

    await task.save();

    res.json({
      message: "Review successful",
      updated: {
        card: {
          due: task.nextReviewDate,
        },
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update review", details: err.message });
  }
});

module.exports = router;
