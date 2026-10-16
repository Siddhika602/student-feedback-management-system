# 🎓 CampusVoice – Student Feedback Management System

A full-stack, enterprise-grade web application built with **React + Vite**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB Atlas**, inspired by the sleek design aesthetics of **Linear** and **Stripe**.

---

## ✨ Features

### 1. 🔐 Modern Authentication & Role-Based Access Control (RBAC)
- **JWT Authentication** with bcrypt password hashing (salt factor 10).
- Dual role system: **Student** and **Administrator**.
- Protected client-side routing and protected backend middleware with automatic token verification.
- Quick 1-click demo login buttons for instant access as either Student or Admin.

### 2. 👥 Student Directory & Discovery
- Visual student cards featuring avatar, name, roll number, department badge, semester, CGPA, and recognition tags.
- Dynamic search bar with instant query matching across student name, roll number, branch, and email.
- Department filter chips (Computer Science, Data Science & AI, Information Technology, Electrical, Mechanical, Civil).
- Filters for semester, minimum star ratings (e.g. 4.5+ stars), and sorting options (highest rating, most reviews, alphabetical).

### 3. ⭐ Interactive Peer Feedback Modal
- Multi-criteria **5-star ratings**:
  - Overall Evaluation Rating
  - Academic Performance & Depth
  - Teamwork & Project Synergy
  - Communication & Presentation
  - Punctuality & Reliability
- Categorized feedback (Academic Performance, Project Collaboration, Extracurricular, Leadership & Conduct, General).
- Detailed constructive feedback comments & growth suggestions.
- **Anonymous Submission toggle** (masks student name and institutional email).
- Recognition tags selector (`#Helpful`, `#TeamPlayer`, `#CreativeThinker`, `#Leadership`, etc.).
- Celebration confetti animation on submission.
- Real-time automatic recalculation of student average ratings and review counts via MongoDB hooks.

### 4. 📊 Admin Command Console & Analytics
- **KPI Stat Cards**: Total registered scholars, total evaluations received, campus average rating, and pending moderation queue.
- **Interactive Visualizations (Recharts)**:
  - Rating Distribution Bar Chart (1 to 5 stars)
  - Department Engagement & Activity Chart
  - Evaluation Category Breakdown Donut Chart
- **Live Recent Activity Feed**: Real-time display of recent submissions.

### 5. 🛡️ Comprehensive Feedback Management Table
- Searchable and filterable data table for administrators.
- Status filters: `All`, `Pending`, `Reviewed`, `Action Taken`, `Flagged`.
- Category & star rating filters.
- **Status & Moderation Modal**: Change status and add internal administrative audit notes (e.g., faculty acknowledgment, committee notes).
- **Delete Feedback**: Irreversible deletion with confirmation modal and auto-recalculated student ratings.
- **CSV Report Export**: Single-click export of all feedback records to formatted CSV.

### 6. 🎨 Premium UI / UX
- **Linear & Stripe inspired design**: Obsidian dark mode default, subtle glowing ambient radial gradients, crisp borders, and glassmorphism.
- **Dark & Light Mode Switcher**: Seamless toggle persisted to `localStorage`.
- **Framer Motion Animations**: Micro-interactions, smooth page transitions, modal spring physics, and card hover elevations.
- **Sleek Toast Notifications**: Animated status feedback with `react-hot-toast`.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile displays.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React, Recharts, Axios, Canvas Confetti, React Hot Toast |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js, Morgan, CORS, Dotenv |
| **Database** | MongoDB Atlas (with automatic zero-config in-memory fallback for instant setup) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- Optional: MongoDB Atlas cluster URI (a built-in in-memory MongoDB is included for instant zero-config testing!)

---

### Step 1: Clone or Navigate to the Workspace
```bash
cd "student feedback"
```

---

### Step 2: Install Dependencies
You can install all dependencies across the root, client, and server with one command:
```bash
npm run install:all
```
*Or install separately:*
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

---

### Step 3: Configure Environment Variables
Copy `.env.example` in the `server` directory:
```bash
cp server/.env.example server/.env
```

`server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusvoice?retryWrites=true&w=majority
JWT_SECRET=campusvoice_super_secure_jwt_secret_key_2026_xyz123
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> 💡 **Note on MongoDB Atlas Connection:**
> - If you paste your MongoDB Atlas cluster URI into `MONGODB_URI`, CampusVoice connects directly to your Atlas cluster.
> - If `MONGODB_URI` is left blank, CampusVoice automatically initializes an integrated high-performance database instance and seeds demo data on the fly.

---

### Step 4: Run the Application

You can start both backend and frontend concurrently with a single command from the project root:
```bash
npm run dev
```

Alternatively, start them in two separate terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

---

## 🔑 Pre-Configured Demo Accounts

For immediate testing, CampusVoice comes with pre-seeded accounts and 1-click quick fill buttons on the login page:

| Role | Email | Password | Features Accessible |
|---|---|---|---|
| **Administrator** | `admin@campusvoice.edu` | `AdminPassword123!` | Admin Analytics, Recharts, Feedback Manager, Edit/Delete, CSV Export |
| **Student** | `student@campusvoice.edu` | `StudentPassword123!` | Student Directory, Peer 5-Star Evaluations, My Submissions |

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create student or admin account
- `POST /api/auth/login` - Authenticate and retrieve JWT token
- `GET /api/auth/me` - Get current authenticated user profile
- `PUT /api/auth/profile` - Update user profile information

### Student Directory (`/api/students`)
- `GET /api/students` - Get all students with search, filter, and pagination
- `GET /api/students/:id` - Get student profile and received reviews
- `POST /api/students` - Create new student (*Admin only*)
- `PUT /api/students/:id` - Update student profile (*Admin only*)
- `DELETE /api/students/:id` - Delete student (*Admin only*)

### Feedback (`/api/feedback`)
- `POST /api/feedback` - Submit 5-star multi-criteria peer evaluation
- `GET /api/feedback/my` - Get feedback submitted by the authenticated user
- `GET /api/feedback/student/:studentId` - Get feedback received by a student

### Admin Console (`/api/admin`)
- `GET /api/admin/stats` - Institutional KPIs, rating distribution, branch statistics
- `GET /api/admin/feedback` - Search, filter, and paginate all submitted feedback
- `PUT /api/admin/feedback/:id` - Update feedback status and internal admin notes
- `DELETE /api/admin/feedback/:id` - Delete feedback and auto-recalculate averages
- `GET /api/admin/export-csv` - Export complete feedback dataset to CSV

---

## 📂 Project Structure

```
student feedback/
├── client/                      # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── EditFeedbackModal.jsx
│   │   │   ├── ExportCSVButton.jsx
│   │   │   ├── FeedbackDetailModal.jsx
│   │   │   ├── FeedbackModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── StudentCard.jsx
│   │   ├── context/             # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/               # Application views
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminFeedbackList.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyFeedback.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── StudentDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios instance with interceptors
│   │   ├── App.jsx              # Main routing & layout
│   │   ├── index.css            # Design system tokens & Tailwind v4
│   │   └── main.jsx
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB Atlas connection & fallback
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── feedbackController.js
│   │   │   └── studentController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── Feedback.js
│   │   │   ├── Student.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── feedbackRoutes.js
│   │   │   └── studentRoutes.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── seeder.js        # Initial data seeder
│   │   └── server.js            # Express app entry point
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── package.json                 # Monorepo root script runner
└── README.md
```

---

## 🛡️ License
This project is open-source and available under the [MIT License](LICENSE).
