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
