import { useState } from 'react';

function JobForm({ onJobAdded }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [wagePerDay, setWagePerDay] = useState('');
  const [location, setLocation] = useState('');

  async function handleSubmit(e) {
  e.preventDefault();

  const newJob = {
    title,
    category,
    wagePerDay: Number(wagePerDay),
    location,
  };

  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:5000/jobs', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(newJob),
  });

  const savedJob = await response.json();
  onJobAdded(savedJob);

  setTitle('');
  setCategory('');
  setWagePerDay('');
  setLocation('');
}
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Job title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category (farming/construction/household)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Wage per day"
        value={wagePerDay}
        onChange={(e) => setWagePerDay(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button type="submit">Post Job</button>
    </form>
  );
}

export default JobForm;