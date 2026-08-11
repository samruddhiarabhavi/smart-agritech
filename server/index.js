require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const Job = require('./models/Job');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/Users');
const authMiddleware = require('./middleware/auth');
const Application = require('./models/Application');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully! '))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get("/", (req, res) => {
  res.send("Smart agriculture platform");
});

//  YE ROUTE ADD KARO - GET all jobs (missing tha)
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sirf EK POST /jobs route rakho (authMiddleware wala)
app.post("/jobs", authMiddleware, async (req, res) => {
  try {
    const newJob = await Job.create({
      ...req.body,
      postedBy: req.user.userId,
    });
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put("/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to edit this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete("/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check karo ki ye job usi user ne post kiya tha jo delete kar raha hai
    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name, email, password: hashedPassword, role,
    });
    res.status(201).json({ message: "User created successfully", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, user: { name: user.name,  userId: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/jobs/:id/apply", authMiddleware, async (req, res) => {
  try {
    const existingApplication = await Application.findOne({
      job: req.params.id,
      applicant: req.user.userId,
    });

    if (existingApplication) {
      return res.status(400).json({ error: "Already applied to this job" });
    }

    const application = await Application.create({
      job: req.params.id,
      applicant: req.user.userId,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/jobs/:id/applications", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to view applications" });
    }

    const applications = await Application.find({ job: req.params.id })
      .populate('applicant', 'name email');

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/applications/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    application.status = req.body.status;
    await application.save();

    res.json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});