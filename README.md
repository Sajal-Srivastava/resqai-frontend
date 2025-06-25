# 🚨 ResQ.AI – AI-Powered Emergency Assistant

**Empowering emergency response for everyone, anywhere.**

---

## 🌐 Overview

In rural or remote areas, accessing emergency help can be difficult due to poor internet, lack of services, or even the inability to describe the situation clearly. **ResQ.AI** solves this with an intelligent, multilingual assistant that classifies emergencies from voice or text, offers first-response guidance, shares your location, and can trigger an SOS with one tap.

> 🧠 Powered by AI & built with accessibility, speed, and reliability at its core.

---

## 📦 Repositories

- **Frontend (this repo)**: [https://github.com/Sajal-Srivastava/resqai-frontend](https://github.com/Sajal-Srivastava/resqai-frontend)
- **Backend**: [https://github.com/Sajal-Srivastava/resqai-backend](https://github.com/Sajal-Srivastava/resqai-backend)

---

## ✨ Key Features

- 🗣️ Input via **text or voice**
- 🤖 AI-based **emergency classification**
- 📍 **Live location sharing**
- 🆘 One-tap **SOS alert**
- 🧭 Step-by-step **first aid guidance**
- 🧠 AI-powered **response generation (planned)**
- 🛰️ Works with **low or no internet** (PWA + Offline-ready)
- 🔒 Emergency contacts auto-detection (Planned)
- 🗺️ Map integration for **location visualization**

---

## ⚙️ Tech Stack

### 🧠 AI/ML:
- HuggingFace Transformers (sentiment-based emergency classification)
- Future: Google Gemini / GPT (for dynamic guidance)

### 🌐 Frontend:
- React + Tailwind CSS
- PWA (Offline-first design)
- Mapbox or Leaflet (for location)
- Web Speech API (Voice input)

### 🔧 Backend:
- Python + Flask (API server)
- Transformers Pipeline
- Flask-CORS for cross-origin support

### 🛠️ Others:
- GitHub (Version control)
- Render.com / Vercel (Hosting)

---

## 🚀 Getting Started (Frontend)

### 🔧 Prerequisites

- Node.js (v18 or above)
- Backend running on Render or local server (`http://localhost:5000`)

### 📦 Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Sajal-Srivastava/resqai-frontend.git
cd resqai-frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
