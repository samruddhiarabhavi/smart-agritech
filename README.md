# Smart AgriTech

A full-stack MERN platform connecting rural workers with local job providers — farmers, construction contractors, and households — with wage transparency to help ensure fair pay for daily and casual work.

**Live Demo:** [https://smart-agritech-1.onrender.com/](https://smart-agritech-1.onrender.com/)
**Backend API:** [https://smart-agritech.onrender.com](https://smart-agritech.onrender.com)

> Note: Backend is hosted on Render's free tier, so the first request after inactivity may take 30–50 seconds to spin up.

---

## About

Smart AgriTech addresses a real problem in rural India — casual and daily-wage workers (farming, construction, household work) often struggle to find consistent job opportunities and are frequently underpaid due to lack of wage transparency. This platform connects **Workers** directly with **Job Providers**, letting providers post jobs with clear wage information and letting workers search, filter, apply, and track their applications — all while seeing whether a job's pay is fair relative to the market.

---

##  Features

- **Role-based authentication** — separate signup/login for Workers and Job Providers, secured with JWT and bcrypt password hashing
- **Job posting** — providers can create job listings with title, category, wage per day, and location
- **Search & category filter** — workers can filter jobs by location and category (farming / construction / household) simultaneously
- **Fair Wage Indicator** — each job is automatically compared against the average wage for its category, flagging listings as "above average," "below average," or "fair wage" (built using `reduce()` to compute live category averages)
- **Job Applications** — workers can apply to jobs directly from the listing; providers can view all applicants for their posted jobs
- **Application status tracking** — providers can Accept/Reject applicants; workers can see real-time status via "My Applications"
- **Profile dashboard** — role-based stats (providers see jobs posted; workers see applications sent and accepted)
- **Full CRUD** — job providers can edit or delete their own postings (ownership-protected via backend authorization)
- **Protected routes** — sensitive actions (posting, editing, deleting, applying) require a valid JWT token
- **Persistent sessions** — login state persists across page refreshes using localStorage

---

## Tech Stack

**Frontend**
- React (Vite)
- JavaScript (ES6+)
- Fetch API for backend communication

**Backend**
- Node.js
- Express.js
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing

**Database**
- MongoDB Atlas (cloud-hosted)
- Mongoose ODM (with referenced relationships between Users, Jobs, and Applications via `populate()`)

**Deployment**
- Frontend & Backend: Render

---

##  Architecture

```
Client (React)  →  REST API (Express)  →  MongoDB Atlas
      │                    │
   localStorage        JWT Middleware
   (token, user)        (route protection)
```

**Data model relationships:**
```
User ──< postedBy ── Job
User ──< applicant ── Application ── job >── Job
```

---

## Project Structure

```
smart-agritech/
├── client/               # React frontend
│   └── src/
│       ├── App.jsx
│       ├── JobCard.jsx
│       ├── JobForm.jsx
│       ├── LoginForm.jsx
│       └── SignupForm.jsx
├── server/                # Express backend
│   ├── models/
│   │   ├── Job.js
│   │   ├── Users.js
│   │   └── Application.js
│   ├── middleware/
│   │   └── auth.js
│   └── index.js
```

---

## API Endpoints

| Method | Endpoint                  | Description                              | Auth Required |
|--------|----------------------------|--------------------------------------------|:--------------:|
| POST   | `/signup`                  | Register a new user                       | No |
| POST   | `/login`                   | Login, returns JWT token                  | No |
| GET    | `/jobs`                    | Get all job listings                      | No |
| GET    | `/jobs/:id`                | Get a single job                          | No |
| POST   | `/jobs`                    | Create a new job                          | Yes |
| PUT    | `/jobs/:id`                | Update a job (owner only)                 | Yes |
| DELETE | `/jobs/:id`                | Delete a job (owner only)                 | Yes |
| POST   | `/jobs/:id/apply`          | Apply to a job (worker)                   | Yes |
| GET    | `/jobs/:id/applications`   | View applicants for a job (owner only)    | Yes |
| PUT    | `/applications/:id`        | Update application status (owner only)    | Yes |
| GET    | `/my-applications`         | Get logged-in worker's applications       | Yes |
| GET    | `/profile`                 | Get logged-in user's profile + stats      | Yes |

---

##  Running Locally

### Prerequisites
- Node.js installed
- A MongoDB Atlas account (or local MongoDB)

### Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

The app will run on `http://localhost:5173`, connecting to the backend on `http://localhost:5000`.

---

##  Future Improvements

- Ratings and reviews for workers and providers
- SMS/notification alerts for new job matches
- Map-based job search by proximity
- Pagination for large job listings

---

##  Author

**Samruddhi Arabhavi**
[GitHub](https://github.com/samruddhiarabhavi)