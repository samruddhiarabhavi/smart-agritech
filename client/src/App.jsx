import { useEffect, useState } from 'react';
import JobCard from './JobCard';
import JobForm from './JobForm';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  // Check if user already logged in (on page load/refresh)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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

  function handleLoginSuccess(loggedInUser) {
    setUser(loggedInUser);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }
  function handleDeleteJob(jobId) {
  const token = localStorage.getItem('token');

  fetch(`http://localhost:5000/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then(() => {
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    })
    .catch((err) => console.log(err));
}

  const filteredJobs = jobs.filter((job) =>
    job.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div>
      <h1>Smart Agri Tech Platform</h1>
      <p>Connecting rural workers to fair rural job providers</p>

      {/* Agar user login nahi hai, toh Login/Signup dikhao */}
      {!user ? (
        <div>
          {showSignup ? (
            <>
              <SignupForm onSignupSuccess={() => setShowSignup(false)} />
              <p>Already have an account? <button onClick={() => setShowSignup(false)}>Login</button></p>
            </>
          ) : (
            <>
              <LoginForm onLoginSuccess={handleLoginSuccess} />
              <p>New here? <button onClick={() => setShowSignup(true)}>Sign Up</button></p>
            </>
          )}
        </div>
      ) : (
        <div>
          <p>Welcome, {user.name} ({user.role})</p>
          <button onClick={handleLogout}>Logout</button>

          <JobForm onJobAdded={handleJobAdded} />

          <input
            type="text"
            placeholder="Search by location"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />

          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              title={job.title}
              category={job.category}
              wagePerDay={job.wagePerDay}
              location={job.location}
            />
          ))}
          {filteredJobs.map((job) => (
  <JobCard
    key={job._id}
    id={job._id}
    title={job.title}
    category={job.category}
    wagePerDay={job.wagePerDay}
    location={job.location}
    postedBy={job.postedBy}
    currentUserId={JSON.parse(localStorage.getItem('user'))?.userId}
    onDelete={handleDeleteJob}
  />
))}
        </div>
      )}
    </div>
  );
}

export default App;