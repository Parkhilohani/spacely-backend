const express = require("express");
const router = express.Router();
const Task = require("../models/Task"); // adjust if your model is named differently
const sm2Review = require("../utils/sm2");

router.post("/:id", async (req, res) => {
  const { rating, reviewDate } = req.body;
  const taskId = req.params.id;

  if (rating === undefined || !reviewDate) {
    return res.status(400).json({ error: "Missing rating or reviewDate" });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Apply SM2 review logic
    const updatedData = sm2Review(task, rating);

    // Update task fields
    task.reps = updatedData.reps;
    task.lapses = updatedData.lapses;
    task.easiness = updatedData.easiness;
    task.scheduled_days = updatedData.scheduled_days;
    task.last_review = updatedData.last_review;
    task.nextReviewDate = updatedData.nextReviewDate;
    task.elapsed_days = updatedData.elapsed_days;

    await task.save();

    return res.status(200).json({
      updated: {
        card: {
          due: task.nextReviewDate,
        },
        updatedTask:updateTaskObject,
      },
    });
  } catch (err) {
    console.error("Review error:", err);
    return res.status(500).json({ error: "Failed to process review" });
  }
});

module.exports = router;

