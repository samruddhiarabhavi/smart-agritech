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
      const response = await fetch('hhttps://smart-agritech.onrender.com/jobs');
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
function handleUpdateJob(jobId, updatedData) {
  const token = localStorage.getItem('token');

  fetch(`https://smart-agritech.onrender.com/${jobId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  })
    .then((res) => res.json())
    .then((updatedJob) => {
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === jobId ? updatedJob : job))
      );
    })
    .catch((err) => console.log(err));
}

  function handleDeleteJob(jobId) {
  const token = localStorage.getItem('token');

  fetch(`https://smart-agritech.onrender.com/jobs/${jobId}`, {
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
  <div className="app">
    <div className="app-header">
      <h1>Smart AgriTech</h1>
      <p className="tagline">Connecting rural workers to fair rural job providers</p>
      <div className="underline"></div>
    </div>

    {!user ? (
      <div className="auth-card">
        {showSignup ? (
          <>
            <SignupForm onSignupSuccess={() => setShowSignup(false)} />
            <p className="auth-switch">
              Already have an account? <button onClick={() => setShowSignup(false)}>Login</button>
            </p>
          </>
        ) : (
          <>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
            <p className="auth-switch">
              New here? <button onClick={() => setShowSignup(true)}>Sign Up</button>
            </p>
          </>
        )}
      </div>
    ) : (
      <div>
        <div className="welcome-bar">
          <p>Welcome, {user.name} <span className="role-tag">{user.role}</span></p>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>

        <div className="job-form">
          <h3>Post a Job</h3>
          <JobForm onJobAdded={handleJobAdded} />
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Search by location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />

        <div className="job-grid">
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
              onUpdate={handleUpdateJob}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);
}

export default App;