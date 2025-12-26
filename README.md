# 🧠 NeuralNest  
**Real-time Cognitive Load Monitoring & Burnout Prediction Platform**

NeuralNest is a browser-based AI system that continuously analyzes user behavior signals to measure cognitive load, detect overload, and predict burnout before it happens.  
It helps individuals and teams maintain peak focus, reduce mental fatigue, and optimize task flow — all in real time.

---

## 🚀 What NeuralNest Does

NeuralNest passively monitors **how you work**, not **what you work on**.

By analyzing behavioral signals like eye movement patterns, typing rhythm, and context switching, it generates a live cognitive load score and actionable insights to:

- Prevent burnout  
- Improve sustained focus  
- Reduce mental overload  
- Optimize task sequencing  

No intrusive tracking. No productivity spying. Just cognitive intelligence.

---

## 🔍 Core Features

### 🧠 Real-Time Cognitive Load Scoring
- Continuously computes a brain load score (0–100%)
- Classifies mental state into:
  - Optimal
  - Elevated
  - Overload
- Updates live on the dashboard

---

### 👁️ Eye Movement & Attention Signals
- Detects gaze stability and blink patterns (via browser APIs)
- Identifies early signs of mental fatigue and distraction
- Works without external hardware

---

### ⌨️ Typing Rhythm Analysis
- Measures typing speed and pause frequency
- Detects cognitive friction during tasks
- Converts keystroke behavior into mental load signals

---

### 🔁 Context Switching Intelligence
- Tracks app / tab switching frequency
- Calculates switch rate based on behavioral events
- Uses context switching patterns as an overload indicator

---

### 🔮 Burnout Prediction (Early Warning)
- Predicts burnout ~30 minutes before it happens
- Uses trend analysis across multiple signals
- Displays proactive alerts instead of reactive reports

---

### 📊 Live Analytics Dashboard
- Clean, real-time visual dashboard
- Focus score, load reduction trends, burnout alerts
- No page refresh required

---

### 👥 Team Performance View
- Designed for squads, pods, or teams
- Shows:
  - Average focus score
  - Stability status (Stable / Watch / At Risk)
- Helps managers detect overload without micromanagement

---

### 📄 PDF Cognitive Load Reports
- Auto-generated, professional reports
- Includes:
  - Cognitive load score
  - Task load
  - Typing performance
  - Context switching metrics
- Clean, branded NeuralNest layout suitable for sharing

---

### 🔐 Authentication & Protected Routes
- Secure login/signup modal
- Protected dashboard routes
- Clean auth context using React Context API

---

## 🧩 Tech Stack

### Frontend
- React + Vite  
- Tailwind CSS  
- Framer Motion  
- ScrollReveal  
- Lucide Icons  

### Backend
- Java / Spring Boot  
- REST APIs  
- PostgreSQL  

### Database
- Currently hosted on **Render PostgreSQL**
- Planned migration to **Neon** for:
  - Fully managed cloud database
  - Better scaling and observability
  - Long-term production reliability

### Local Development / Testing
- PostgreSQL tested using a **Docker container**
- Matches production schema and behavior

---

## 🛡️ Privacy-First by Design
- No screen recording
- No keystroke logging
- No content inspection
- Only behavioral patterns, fully anonymized

**NeuralNest measures cognitive load, not productivity.**

---

## 🌐 Live Links

- 🔗 Frontend App: https://neuralnest-prod.netlify.app/
- 📦 GitHub Repository: https://github.com/Nakkshh/neuralnest-prod

---

## 📦 Local Development

```bash
# Clone repo
git clone https://github.com/Nakkshh/neuralnest-prod.git
cd neuralnest-prod

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
mvn spring-boot:run
```

---

## 🧠 Vision

NeuralNest aims to become the standard cognitive layer for modern work — helping humans work with their brain, not against it.

---

## 👨‍💻 Author

**Nakshatra Jain**  
GitHub: [@Nakkshh](https://github.com/Nakkshh)

