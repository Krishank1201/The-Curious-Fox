# 🦊 Curious Fox — Adaptive AI Learning Platform for Unsupervised Learning

Curious Fox is an AI-powered, student-centric learning platform designed to help undergraduate Computer Science and Engineering students learn, practice, and master Unsupervised Learning concepts in a structured, personalized, and engaging way. The platform combines learning style assessment, Bloom’s Taxonomy–based knowledge evaluation, AI-driven content curation, interactive coding labs, and visual learning roadmaps into a single cohesive experience.

## 🚀 Key Idea

Students struggle not because they are weak — but because content is not delivered in a way their brain prefers. Curious Fox adapts what is taught, how it is taught, and in what order, based on:

- The student’s learning style
- Their current conceptual understanding
- The cognitive level required (Bloom’s L1–L6)

## 🎯 Core Objectives

- Personalize learning for every student
- Reduce cognitive overload
- Make abstract ML algorithms intuitive
- Encourage confidence before correctness
- Provide measurable learning progress
- Align learning strictly with university course objectives

## 📚 Supported Topics (Phase 1)

Unsupervised Learning:
- K-Means Clustering
- Principal Component Analysis (PCA)
- Apriori Algorithm (Association Rule Mining)

All content is curated from official university-provided materials:
- K_Means.pdf
- PCA.pdf
- APRIORI.pdf

## 🧠 Learning Style Assessment (One-Time)

On first login, students complete:
- A static learning style quiz
- A 5–10 minute conversational interaction with Dr. Fox 🦊

This generates a Learning Blueprint, which includes:
- Learning Style Profile Code (e.g., ASVS, RSVbSq)
- Persona label (e.g., Methodical Tactician)
- 8-pole radar visualization
- Personalized study strategies
- Contextual insights from conversation

This blueprint is stored and used throughout the platform.

## 📊 Topic-Level Knowledge Assessment (Bloom’s Taxonomy)

When a student selects a topic for the first time, Dr. Fox conducts a short interactive assessment to determine:
- Current Bloom’s level (L1–L6)
- Safe learning ceiling
- Knowledge gaps

Results are shown in a Bloom’s Progress Dashboard with visual indicators.

## 🧭 AI-Generated Learning Roadmap

Based on:
- Learning style profile
- Bloom’s level
- Course objectives

Curious Fox generates a personalized roadmap that:
- Covers all modules in the subject
- Orders content logically
- Adjusts depth and format
- Estimates time per module
- Unlocks progress step-by-step

## 🎨 Roadmap Visualization

- Interactive roadmap (Three.js supported)
- Fox-themed journey (fox moving toward the den 🦊🏕️)
- Start / Stop / Resume controls
- Completion celebration screens
- Motivational messages after milestones

## 🧪 Coding Labs (Core Feature)

Each algorithm includes a 3-Mode Coding Lab:

1) Learn Mode
   - Read-only code
   - Line-by-line explanation
   - Real-world intuition
   - Visual references

2) Practice Mode
   - Two sub-modes:
     - Dependent Mode: Partial code with blanks, hints only when requested. Max score: +12 (each hint: −1)
     - Independent Mode: Mostly empty editor where student writes full logic. Max score: +25 (hint penalties: −1, −2, −4 exponential)

3) Test Mode
   - Full coding environment
   - No hints, no scaffolding
   - Pipeline validation and detailed feedback after submission

## 📝 Quiz System (Anti-Cheat)

Students can generate customized quizzes:
- MCQs
- MSQs
- Fill-in-the-Blanks (Numerical)
- Match the Following
- Short & Long Answers

Features:
- Full-screen enforcement
- Tab-switch detection
- Copy/paste blocking
- Timed sections
- AI-based answer evaluation
- Bloom’s level tagging
- AI-generated feedback

## 📈 Progress Tracking & Feedback

- Module completion tracking
- Bloom’s level progression
- Performance analytics
- Strengths & improvement areas
- Motivational messages after milestones

## 🧑‍🏫 Dr. Fox 🦊 — The AI Companion

Dr. Fox is not a chatbot — but a mentor AI who:
- Assesses understanding
- Curates content
- Guides learning
- Explains mistakes kindly
- Encourages reflection
- Adapts difficulty automatically

## 🛠️ Tech Stack (Indicative)

- Frontend: HTML, CSS, JavaScript / React
- Visualization: Three.js
- Backend: Node.js, Express
- Database: MySQL
- AI Integration: Google Gemini (Studio / API)
- PDF Processing: Pre-chunked university materials

## 📌 Target Users

- Undergraduate CSE / AIML students
- Beginners with no prior ML background
- Students preparing for exams, labs, and projects
- Institutions seeking adaptive learning solutions

## 🔮 Future Enhancements

- Instructor dashboard
- Cross-subject roadmaps
- Research paper recommendation agent
- Peer collaboration modes
- Skill-based certifications
- Learning analytics for faculty

## 🤝 Contribution

This project is under active development. Contributions, suggestions, and academic feedback are welcome.

## 📜 License

This project is for educational and research purposes. License details can be added as required.

## 🌟 Final Note

Curious Fox is built with one belief: Every student can learn complex concepts — if we teach the right way.

---

## 🚧 Getting started — Run locally (Development)

Prerequisites
- Node.js (v16+ recommended)
- npm (v8+) or yarn
- MySQL (8.x recommended) or compatible SQL server
- Google Gemini / AI credentials (optional)

1) Clone the repository

```bash
git clone https://github.com/Krishank1201/The-Curious-Fox.git
cd The-Curious-Fox
```

2) Repo layout (adjust if different)

- `backend/` — Express API
- `frontend/` — React app

3) Backend — install & configure

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=password
DB_NAME=curious_fox_dev
JWT_SECRET=your_jwt_secret
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

Create the database in MySQL:

```sql
CREATE DATABASE curious_fox_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations / seeds if available:

```bash
npm run migrate
npm run seed
```

Start backend:

```bash
npm run dev
```

4) Frontend — install & run

```bash
cd ../frontend
npm install
npm start
```

Open http://localhost:3000 and the API at http://localhost:5000 (or the PORT in your .env).

5) Run both concurrently

```bash
npx concurrently "cd backend && npm run dev" "cd frontend && npm start"
```

6) Tests

```bash
cd backend && npm test
cd frontend && npm test
```

Notes & troubleshooting
- Check CORS and API base URL if frontend can't reach backend.
- Verify DB credentials and privileges.
- AI features require valid API keys and may incur usage costs.

If you'd like, I can also add a `.env.example`, CONTRIBUTING.md, LICENSE, or demo seed SQL. Please confirm which files to add.