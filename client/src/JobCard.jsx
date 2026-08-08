function JobCard({ id, title, category, wagePerDay, location, postedBy, currentUserId, onDelete }) {
  const isOwner = postedBy === currentUserId;

  return (
    <div className="job-card">
      <h3>Job Card</h3>
      <h4>{title}</h4>
      <h4>{category}</h4>
      <h4>{location}</h4>
      <p>₹{wagePerDay}/day</p>

      {isOwner && (
        <button onClick={() => onDelete(id)}>Delete</button>
      )}
    </div>
  );
}

export default JobCard;