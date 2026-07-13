const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart agriculture platform");
});

const jobs = [
  { id: 1, title: "Wheat Harvesting", category: "farming", wagePerDay: 400, location: "Nashik" },
  { id: 2, title: "House Construction Helper", category: "construction", wagePerDay: 600, location: "Pune" },
  { id: 3, title: "Household Cleaning", category: "household", wagePerDay: 300, location: "Nashik" },
];

app.get("/jobs", (req, res) => {
  res.json(jobs);
});

app.get("/jobs/:id", (req, res) => {
  const jobId = Number(req.params.id);
  const job = jobs.find(j => j.id === jobId);
  res.json(job);
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
async function getJobById() {
    const response = await fetch('http://localhost:5000/jobs/1');
    const data = await response.json()
    console.log(data)
  // your code here
}

getJobById();