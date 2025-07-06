const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const StudentModel = require('./models/Student');
const sendEmail = require("./mailer");
const reviewRoute = require("./routes/review");
const notesRoutes = require("./routes/notes");
const authRoutes = require('./routes/auth'); 

require("./cron/dailyReminder.js");
require('dotenv').config();

// const notifyRoute = require("./routes/notify");
const taskRoutes = require('./routes/tasks.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// app.use("/api", notifyRoute);

//MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/studyplanner", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("DB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use('/api', taskRoutes);
app.use("/api", reviewRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
