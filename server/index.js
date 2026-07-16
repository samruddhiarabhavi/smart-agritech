require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const Job = require('./models/Job');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/Users');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully! ✅'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get("/", (req, res) => {
  res.send("Smart agriculture platform");
});
app.post("/signup", async (req,res) =>{
  try{
    const {name, email, password, role} = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name, email, password: hashedPassword, role,
    });
    res.status(201).json({message:"User created successfully",userId:User._id});
  }catch(err){
    res.status(500).json({error:err.message})
  }
  }
 )
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

    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
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

app.post("/jobs", async (req, res) => {
  try {
    const newJob = await Job.create(req.body);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});