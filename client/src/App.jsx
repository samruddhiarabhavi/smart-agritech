import { useEffect, useState } from 'react';
import JobCard from './JobCard';
import JobForm from './JobForm';

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    async function fetchJobs() {
      const response = await fetch('http://localhost:5000/jobs');
      const data = await response.json();
      setJobs(data);
    }
    fetchJobs();
  }, []);

  function handleJobAdded(newJob) {
    setJobs((prevJobs) => [...prevJobs, newJob]);
  }

  const filteredJobs = jobs.filter((job) =>
    job.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div>
      <h1>Smart Agri Tech Platform</h1>
      <p>Connecting rural workers to fair rural job providers</p>

      <JobForm onJobAdded={handleJobAdded} />

      <input
        type="text"
        placeholder="Search by location"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
      />

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