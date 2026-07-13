import { useState } from 'react';

function JobForm({ onJobAdded }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [wagePerDay, setWagePerDay] = useState('');
  const [location, setLocation] = useState('');

  async function handleSubmit(e) {
    e.preventDefault(); // stops the page from refreshing (default form behavior)

    const newJob = {
      title,
      category,
      wagePerDay: Number(wagePerDay), // convert string input to number
      location,
    };

    const response = await fetch('http://localhost:5000/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newJob),
    });

    const savedJob = await response.json();
    onJobAdded(savedJob); // tell the parent (App) a new job was added

    // Clear the form
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