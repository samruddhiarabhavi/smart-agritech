import { useState } from 'react';

function JobCard({ id, title, category, wagePerDay, location, postedBy, currentUserId, onDelete, onUpdate }) {
  const isOwner = postedBy === currentUserId;
  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(title);
  const [editCategory, setEditCategory] = useState(category);
  const [editWage, setEditWage] = useState(wagePerDay);
  const [editLocation, setEditLocation] = useState(location);

  function handleSave() {
    onUpdate(id, {
      title: editTitle,
      category: editCategory,
      wagePerDay: Number(editWage),
      location: editLocation,
    });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="job-card">
        <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
        <input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
        <input
          type="number"
          value={editWage}
          onChange={(e) => setEditWage(e.target.value)}
        />
        <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />

        <button onClick={handleSave}>Save</button>
        <button onClick={() => setIsEditing(false)}>Cancel</button>
      </div>
    );
  }

  return (
  <div className="job-card">
    <h3 className="job-title">{title}</h3>
    <div className="job-meta">
      <span>{category}</span>
      <span>{location}</span>
    </div>
    <div className="wage-tag">
      ₹{wagePerDay}<span className="per-day">/day</span>
    </div>

    {isOwner && (
      <div className="job-card-actions">
        <button onClick={() => onDelete(id)}>Delete</button>
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </div>
    )}
  </div>
);
}

export default JobCard;