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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [myApplications, setMyApplications] = useState([]);
  const [showMyApplications, setShowMyApplications] = useState(false);

  // Check if user already logged in (on page load/refresh)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    async function fetchJobs() {
      const response = await fetch('https://smart-agritech.onrender.com/jobs');
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

  fetch(`https://smart-agritech.onrender.com/jobs/${jobId}`, {
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
async function handleViewMyApplications() {
  if (!showMyApplications) {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://smart-agritech.onrender.com/my-applications', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setMyApplications(data);
    } catch (err) {
      console.log(err);
    }
  }
  setShowMyApplications(!showMyApplications);
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
   {
  const matchesLocation = job.location.toLowerCase().includes(searchLocation.toLowerCase());
  const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
  return matchesLocation && matchesCategory;
});
function getAverageWage(category) {
  const categoryJobs = jobs.filter((job) => job.category === category);
  if (categoryJobs.length === 0) return 0;
  
  const total = categoryJobs.reduce((sum, job) => sum + job.wagePerDay, 0);
  return Math.round(total / categoryJobs.length);
}
async function handleApplyToJob(jobId) {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`https://smart-agritech.onrender.com/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || 'Failed to apply');
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function handleFetchApplications(jobId) {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`https://smart-agritech.onrender.com/jobs/${jobId}/applications`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function handleUpdateApplicationStatus(applicationId, newStatus) {
  const token = localStorage.getItem('token');

  try {
    await fetch(`https://smart-agritech.onrender.com/applications/${applicationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
  } catch (err) {
    console.log(err);
  }
}

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
        {user.role === 'worker' && (
  <div style={{ marginBottom: '24px' }}>
    <button className="btn-primary" onClick={handleViewMyApplications} style={{ width: 'auto', padding: '10px 20px' }}>
      {showMyApplications ? 'Hide' : 'View'} My Applications
    </button>

    {showMyApplications && (
      <div className="auth-card" style={{ marginTop: '14px', maxWidth: 'none' }}>
        {myApplications.length === 0 ? (
          <p style={{ color: 'var(--sage)' }}>You haven't applied to any jobs yet</p>
        ) : (
          myApplications.map((app) => (
            <div key={app._id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '10px 0', 
              borderBottom: '1px solid var(--border)' 
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{app.job.title}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--sage)' }}>
                  {app.job.category} • {app.job.location} • ₹{app.job.wagePerDay}/day
                </p>
              </div>
              <span style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.8rem',
                fontWeight: 600,
                color: app.status === 'accepted' ? '#4A6741' : app.status === 'rejected' ? '#A85C36' : '#E3A93B',
                textTransform: 'uppercase'
              }}>
                {app.status}
              </span>
            </div>
          ))
        )}
      </div>
    )}
  </div>
)}

        <div className="job-form">
          <h3>Post a Job</h3>
          <JobForm onJobAdded={handleJobAdded} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
  <input
    className="search-input"
    style={{ marginBottom: 0, flex: 2 }}
    type="text"
    placeholder="Search by location"
    value={searchLocation}
    onChange={(e) => setSearchLocation(e.target.value)}
  />
  <select
    style={{ flex: 1 }}
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    <option value="all">All Categories</option>
    <option value="farming">Farming</option>
    <option value="construction">Construction</option>
    <option value="household">Household</option>
  </select>
</div>

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
              averageWage={getAverageWage(job.category)}
              onApply={handleApplyToJob}
              currentUserRole={user.role}
              onFetchApplications={handleFetchApplications}
              onUpdateStatus={handleUpdateApplicationStatus}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);
}

export default App;