const express = require("express");
const cors = require("cors");
const app = express()
app.use(cors());
app.use(express.json());

const jobs = [
  { title: "Wheat Harvesting", category: "farming", wagePerDay: 400, location: "Nashik" },
  { title: "House Construction Helper", category: "construction", wagePerDay: 600, location: "Pune" },
  { title: "Household Cleaning", category: "household", wagePerDay: 300, location: "Nashik" },
  { title: "Cotton Picking", category: "farming", wagePerDay: 350, location: "Nashik" },
];

const nashikJobs = jobs.filter(job => job.location === "Nashik");
console.log(nashikJobs);
const jobTitles = jobs.map(job => job.title);
console.log(jobTitles);
const totalWage = jobs.reduce((total, job) => total + job.wagePerDay, 0);
console.log(totalWage);
const averageWage = totalWage / jobs.length;
console.log(averageWage);
app.get("/",(req, res) =>{
    res.send("smart agriculture platform")
})
const PORT = 5000;
app.listen(PORT,() =>{
    console.log(`Server running on http://localhost:${PORT}`);

}
)
