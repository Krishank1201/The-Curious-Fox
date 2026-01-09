# 🦊 Curious Fox — Adaptive AI Learning Platform for Unsupervised Learning

Curious Fox is an AI-powered, student-centric learning platform designed to help undergraduate Computer Science and Engineering students learn, practice, and master Unsupervised Learning concepts in a structured, personalized, and engaging way.

The platform combines learning style assessment, Bloom’s Taxonomy–based knowledge evaluation, AI-driven content curation, interactive coding labs, and visual learning roadmaps into a single cohesive experience.

---

## 🚀 Key Idea

Students struggle not because they are weak — but because content is not delivered in a way their brain prefers. Curious Fox adapts what is taught, how it is taught, and in what order based on:

- The student’s learning style
- Their current conceptual understanding
- The cognitive level required (Bloom’s L1–L6)

---

## 🎯 Core Objectives

- Personalize learning for every student
- Reduce cognitive overload
- Make abstract ML algorithms intuitive
- Encourage confidence before correctness
- Provide measurable learning progress
- Align learning strictly with university course objectives

---

## 📚 Supported Topics (Phase 1)

Unsupervised Learning:
- K-Means Clustering
- Principal Component Analysis (PCA)
- Apriori Algorithm (Association Rule Mining)

All content is curated from official university-provided materials:
- `K_Means.pdf`
- `PCA.pdf`
- `APRIORI.pdf`

---

## 🧠 Learning Style Assessment (One-Time)

On first login, students complete:
- A static learning style quiz
- A 5–10 minute conversational interaction with Dr. Fox 🦊

This generates a Learning Blueprint, which includes:
- Learning Style Profile Code (e.g., `ASVS`, `RSVbSq`)
- Persona label (e.g., Methodical Tactician)
- 8-pole radar visualization
- Personalized study strategies
- Contextual insights from conversation

The blueprint is stored and used throughout the platform to tailor content and pacing.

---

## 📊 Topic-Level Knowledge Assessment (Bloom’s Taxonomy)

When a student selects a topic for the first time, Dr. Fox conducts a short interactive assessment to determine:
- Current Bloom’s level (L1–L6)
- Safe learning ceiling
- Knowledge gaps

Results are shown in a Bloom’s Progress Dashboard with visual indicators.

---

## 🧭 AI-Generated Learning Roadmap

Based on the learning style profile, Bloom’s level, and course objectives, Curious Fox generates a personalized roadmap that:

- Covers all modules in the subject
- Orders content logically
- Adjusts depth and format
- Estimates time per module
- Unlocks progress step-by-step

---

## 🎨 Roadmap Visualization

- Interactive roadmap (Three.js supported)
- Fox-themed journey (fox moving toward the den 🦊🏕️)
- Start / Stop / Resume controls
- Completion celebration screens and motivational messages after milestones

---

## 🧪 Coding Labs (Core Feature)

Each algorithm includes a 3-Mode Coding Lab:

1. Learn Mode
   - Read-only code
   - Line-by-line explanation
   - Real-world intuition
   - Visual references

2. Practice Mode
   - Two sub-modes:
     - Dependent Mode: partial code with blanks, hints only when requested. Max score: +12 (each hint: −1)
     - Independent Mode: mostly empty editor where student writes full logic. Max score: +25 (hint penalties: −1, −2, −4 exponential)

3. Test Mode
   - Full coding environment with no hints or scaffolding
   - Pipeline validation and detailed feedback after submission

---

## 📝 Quiz System (Anti-Cheat)

Students can generate customized quizzes (MCQs, MSQs, Fill-in-the-Blanks, Match the Following, Short & Long Answers) with features:

- Full-screen enforcement
- Tab-switch detection
- Copy/paste blocking
- Timed sections
- AI-based answer evaluation and feedback
- Bloom’s level tagging

---

## 📈 Progress Tracking & Feedback

- Module completion tracking
- Bloom’s level progression
- Performance analytics showing strengths & improvement areas
- Motivational messages after milestones

---

## 🧑‍🏫 Dr. Fox 🦊 — The AI Companion

Dr. Fox is a mentor AI who:
- Assesses understanding
- Curates content
- Guides learning and explains mistakes kindly
- Encourages reflection and adapts difficulty automatically

---

## 🛠️ Tech Stack (Indicative)

- Frontend: HTML, CSS, JavaScript / React
- Visualization: Three.js
- Backend: Node.js, Express
- Database: MySQL
- AI Integration: Google Gemini (Studio / API)
- PDF Processing: Pre-chunked university materials

---

## 📌 Target Users

- Undergraduate CSE / AIML students
- Beginners with no prior ML background
- Students preparing for exams, labs, and projects
- Institutions seeking adaptive learning solutions

---

## 🔮 Future Enhancements

- Instructor dashboard
- Cross-subject roadmaps
- Research paper recommendation agent
- Peer collaboration modes
- Skill-based certifications
- Learning analytics for faculty

---

## 🤝 Contribution

This project is under active development. Contributions, suggestions, and academic feedback are welcome. Please open issues or pull requests to propose changes.

---

## 📜 License

This project is for educational and research purposes. License details can be added as required.

---

## 🌟 Final Note

Curious Fox is built with one belief: Every student can learn complex concepts — if we teach the right way.

---

## 🚧 Getting started — Run locally (Development)

The project contains a Node.js / Express backend and a React frontend. The instructions below are intentionally generic — update paths if your repository structure differs (e.g., single-app, `backend/` and `frontend/` folders, or a monorepo setup).

Prerequisites
- Node.js (v16+ recommended)
- npm (v8+) or yarn
- MySQL (8.x recommended) or compatible SQL server
- Google Gemini / AI credentials (if you want to enable AI features)

1) Clone the repository

```bash
git clone https://github.com/Krishank1201/The-Curious-Fox.git
cd The-Curious-Fox
```

2) Repo layout (common patterns)

- Option A — Monorepo with folders:
  - `backend/` — Express API
  - `frontend/` — React app
- Option B — Single project (API + frontend in same root). Adjust commands below accordingly.

3) Backend — install & configure

```bash
cd backend
npm install
# or: yarn
```

Create a `.env` file in `backend/` (example):

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

Run migrations (if you use an ORM). Common commands — update according to your stack:

```bash
npm run migrate          # if scripts/migrate exists
# or, for Sequelize:
npx sequelize db:migrate
# or run SQL migration scripts in `migrations/`
```

Seed initial data (optional):

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev    # nodemon or similar
# or
npm start
```

The API should be available at http://localhost:5000 (or the PORT from `.env`).

4) Frontend — install & run

```bash
cd ../frontend
npm install
npm start
```

The React app will typically run at http://localhost:3000. If API runs on another port, ensure the frontend's environment (e.g., `.env.development`) points to the backend API base URL.

5) Full-stack local run (concurrently)

If you want to run both at once from the repo root and a `dev` script exists:

```bash
npm run dev:all
# or use concurrently
npx concurrently "cd backend && npm run dev" "cd frontend && npm start"
```

6) Testing

Run unit / integration tests where available:

```bash
cd backend
npm test
cd ../frontend
npm test
```

7) AI / Google Gemini

- Place your Gemini API key (or service credentials) in the backend `.env` as `GOOGLE_GEMINI_API_KEY` and follow any platform-specific setup in `docs/` or `README` files.
- For local testing without Gemini, you may stub or mock the AI endpoints in a local dev config.

---

## ⚙️ How to use (Quick walkthrough)

1. Open the frontend (`http://localhost:3000`) and create a student account or use a seeded demo user.
2. On first login, complete the learning style quiz and the short conversation with Dr. Fox to generate your Learning Blueprint.
3. Select a topic (e.g., K-Means). Dr. Fox will run a short Bloom’s-style assessment to set your starting level.
4. Follow the AI-generated Learning Roadmap, which unlocks modules progressively.
5. Use the Coding Labs:
   - Learn Mode — read-only guided walkthroughs
   - Practice Mode — complete partial or full code and earn scores
   - Test Mode — final assessment without hints
6. Generate quizzes using the Quiz System; complete timed sections and review AI feedback.
7. Track progress in the Dashboard to see Bloom’s level changes, strengths, and suggested next steps.

---

## 🧾 Notes & troubleshooting

- If the frontend cannot reach the backend, verify CORS settings and API_BASE_URL in the frontend environment.
- If migrations fail, ensure your DB credentials are correct and the user has privileges to create tables.
- AI features require valid API credentials — confirm quota/permissions on the provider portal.

---

If you want, I can now:
- Add a CONTRIBUTING.md, LICENSE, and sample `.env.example` file
- Add a concise Table of Contents and CI badges
- Create a demo seed user and SQL seed file

Tell me which of these you'd like and I'll update the repo accordingly.
