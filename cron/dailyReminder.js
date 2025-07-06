const cron = require("node-cron");
const Task = require("../models/Task");
const Student = require("../models/Student");
const sendEmail = require("../mailer");

// Every day at 11:00 AM
cron.schedule("0 11 * * *", async () => {
  console.log("⏰ Running Daily Reminder Job");

  try {
    // Find active tasks with notifications enabled
    const tasks = await Task.find({ stopped: false, notifications: true }).populate("userId");

    for (const task of tasks) {
      const email = task.userId.email; // Assuming "email" field exists in Student model
      const topic = task.topicName;
      const card = task.cardName;

      const message = `📘 Reminder: Review "${topic}" in your card "${card}". Stay consistent!`;

      await sendEmail(email, "Daily Study Reminder", message);
    }

    console.log("✅ Daily emails sent.");
  } catch (err) {
    console.error("❌ Error in daily reminder job:", err.message);
  }
});
