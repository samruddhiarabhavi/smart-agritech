import { useState } from 'react';
import JobCard from './JobCard';
const jobs = [
  { id: 1, title: "Wheat Harvesting", category: "farming", wagePerDay: 400, location: "Nashik" },
  { id: 2, title: "House Construction Helper", category: "construction", wagePerDay: 600, location: "Pune" },
  { id: 3, title: "Household Cleaning", category: "household", wagePerDay: 300, location: "Nashik" },
];

function App(){
  const [searchlocation, setSearchLocation] = useState('');
  const filteredJobs = jobs.filter((job) => 
  job.location.toLowerCase().includes(searchlocation.toLowerCase())
);
  return(
    <div>
      <h1> Smart Agri tech platform</h1>
      <p> connecting rural workers to fair rural job providers</p>
      <input type="text" placeholder="search by location" value = {searchlocation} onChange={(e) => setSearchLocation(e.target.value)}/>
        {filteredJobs.map((job) => (
        <JobCard
          key={job.id}
          title={job.title}
          category={job.category}
          wagePerDay={job.wagePerDay}
          location={job.location}
        />
      ))}
    </div>
    
  );
}
export default App;