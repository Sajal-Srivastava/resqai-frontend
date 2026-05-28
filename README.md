# 🚨 ResQ.AI — AI-Powered Emergency Assistant

> **One tap away from help. Always.**  
> An intelligent, multilingual, offline-first emergency response PWA — powered by HuggingFace Transformers and Google Gemini 1.5 Pro.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-3.x-black?logo=flask)](https://flask.palletsprojects.com)
[![Gemini](https://img.shields.io/badge/Gemini-1.5_Pro-4285F4?logo=google)](https://aistudio.google.com)
[![PWA](https://img.shields.io/badge/PWA-Offline_Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![Tests](https://img.shields.io/badge/Tests-41%2F41_passing-brightgreen)](#testing)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen)](#getting-started)

---

## Table of Contents

- [Why ResQ.AI?](#why-resqai)
- [Live Demo](#live-demo)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How the AI Works](#how-the-ai-works)
- [Getting Started](#getting-started)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [API Reference](#api-reference)
- [Screens & UI](#screens--ui)
- [Configuration](#configuration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Why ResQ.AI?

In India and many developing regions, **the first minutes after an emergency are critical — and wasted.** People in rural areas face:

- 📵 Poor internet connectivity during crises
- 🗣️ Inability to clearly describe the emergency under panic
- 🏥 No quick way to find the nearest hospital or fire station
- 📋 First responders arriving without knowing patient's blood group or allergies
- 👴 Elderly and non-tech-savvy users who can't navigate complex apps

**ResQ.AI solves all of these** with a single, ultra-fast, one-tap emergency platform:

| Problem | ResQ.AI Solution |
|---|---|
| Panic, can't type | Voice input in EN / हिंदी / Español |
| Slow internet | Offline-first — works without any connection |
| Don't know first aid | Gemini AI generates step-by-step guidance instantly |
| Can't find hospital | Overpass API maps hospitals/police/fire within 6km |
| Responders need medical info | Medical profile (blood group, allergies) shared on SOS |
| Accidental SOS triggers | 5-second countdown with visible Cancel button |

---

## Live Demo

| Service | URL |
|---|---|
| **Frontend** | https://resqai-frontend.vercel.app *(deploy with `npm run build`)* |
| **Backend API** | https://resqai-backend.onrender.com |
| **Health Check** | `GET https://resqai-backend.onrender.com/api/health` |

---

## Features

### 🏠 Home Screen
- **7 Emergency Category Buttons** — Medical 🏥, Fire 🔥, Crime 🚨, Accident 🚗, Disaster 🌪️, Women Safety 🛡️, Child Emergency 👶
- One tap pre-fills the AI analysis text and triggers classification
- **Live network status** badge (Online/Offline) in header
- Quick dial grid for 112, 108, 100, 101, 1091, 1098
- Warnings if medical profile or emergency contacts are not set up

### 🎙️ Voice Input
- Tap the mic button — Web Speech API transcribes speech in real time
- Supports **English (en-IN)**, **Hindi (hi-IN)**, **Spanish (es-ES)**
- Press Enter or tap "Get Help Now" to submit
- Interim transcript shown while speaking

### 🤖 AI Emergency Classification
- **Dual-engine classifier**: keyword-based (instant, offline) + HuggingFace sentiment (online)
- Keyword engine covers 70+ emergency terms across 7 categories
- Severity detection: **Critical / High / Medium / Low**
- Confidence score displayed as animated progress bar with color coding (red/amber/green)
- Google Gemini 1.5 Pro generates 4-step numbered first-aid guidance
- Falls back to carefully written offline guidance when no internet

### 🆘 SOS System
- Pulsing animated SOS button with 3 expanding rings
- **5-second SVG countdown ring** with visible Cancel button (prevents accidental triggers)
- On activation: vibrates device, logs location, shows medical profile, lists emergency contacts
- One-tap **Call 112** and **Call 108 (Ambulance)** buttons
- All emergency contacts shown for quick dialing
- "I'm Safe Now" button to deactivate

### 🗺️ Nearby Services Map
- Uses **OpenStreetMap Overpass API** (free, no API key needed)
- Finds hospitals, clinics, police stations, and fire departments within 6km
- **Leaflet interactive map** with color-coded markers per service type
- Filter tabs: All / Hospitals / Police / Fire
- Distance calculated from your GPS coordinates
- Tap service to see name + call button (if phone number available)

### 👤 Medical Profile
- Stored **100% locally** (localStorage) — never uploaded
- Fields: Name, Blood Group (selector), Allergies, Medications, Conditions, Emergency Note
- Displayed automatically during SOS activation and on Result screen
- Blood group grid with 8 options (A+, A−, B+, B−, AB+, AB−, O+, O−)

### 👥 Emergency Contacts
- Add unlimited contacts with name, phone, relation
- Phone number validated (7–15 digits)
- Auto-shown during SOS with one-tap dial buttons
- Color-coded avatars based on name initial
- Stored locally via localStorage

### ⚙️ Settings
- **Dark / Light mode toggle** (default: dark)
- **Language selector**: English, हिंदी, Español — changes all UI text instantly
- **Push notifications** — requests Notification API permission
- Quick dial shortcuts for all national emergency numbers
- Clear all data option
- App version and description

### ♿ Accessibility & UX
- Minimum 44px touch targets on all interactive elements
- High contrast dark theme by default
- Large typography (16px base, 22–28px headings)
- Haptic feedback (Vibration API) on SOS, button taps
- Smooth CSS transitions (200ms cubic-bezier)
- Screen animation: slide-in-up on each screen change
- Emoji icons — no font icon dependency, works everywhere

### 📱 PWA (Progressive Web App)
- **Installable** on Android/iOS from browser ("Add to Home Screen")
- Portrait orientation locked
- Theme color: Emergency Red `#EF4444`
- Background color: Deep Navy `#0B0F1A`
- Works as a standalone full-screen app without browser chrome

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     USER DEVICE (PWA)                       │
│                                                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  React App   │  │ Web APIs     │  │  localStorage    │  │
│  │  (CRA v5)   │  │ - Geolocation│  │  - profile       │  │
│  │             │  │ - SpeechRec  │  │  - contacts      │  │
│  │  AppContext │  │ - Vibration  │  │  - theme/lang    │  │
│  │  (Reducer)  │  │ - Notification│ │                  │  │
│  └──────┬──────┘  └──────────────┘  └──────────────────┘  │
│         │                                                   │
└─────────┼───────────────────────────────────────────────────┘
          │  HTTPS (with offline fallback)
          ▼
┌─────────────────────────┐     ┌────────────────────────────┐
│   ResQ.AI Backend        │     │   Third-Party APIs          │
│   (Flask + Python 3.11) │     │                            │
│                         │     │  • Overpass API (OSM)      │
│  POST /api/classify ─── ┼─────►    Nearby services (free) │
│  POST /api/sos          │     │                            │
│  GET  /api/health       │     │  • Google Gemini 1.5 Pro   │
│                         │     │    First-aid guidance      │
│  ┌──────────────────┐   │     │                            │
│  │ Keyword Engine   │   │     │  • HuggingFace Transformer │
│  │ (7 categories,   │   │     │    Sentiment classifier    │
│  │  70+ keywords)   │   │     │                            │
│  └──────────────────┘   │     └────────────────────────────┘
│  ┌──────────────────┐   │
│  │ Severity Detect  │   │
│  │ Critical/High/   │   │
│  │ Medium/Low       │   │
│  └──────────────────┘   │
└─────────────────────────┘
```

### Data Flow

```
User Input (voice/text/category tap)
    │
    ▼
VoiceInput.jsx / EmergencyGrid.jsx
    │  sets emergencyText in AppContext
    ▼
HomeScreen → classifyEmergency(text, location)
    │
    ├─ [ONLINE]  → POST /api/classify
    │                  │
    │              Keyword Engine → confidence score
    │              Gemini API     → 4-step guidance
    │              Severity Engine → Critical/High/Medium/Low
    │              └─► JSON response
    │
    └─ [OFFLINE] → local keyword matching + cached guidance
    │
    ▼
ResultScreen → AIGuidanceCard + ConfidenceBar + LiveMap
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.1.0 | UI framework |
| React Leaflet | 5.0.0 | Interactive map |
| Leaflet | 1.9.4 | Map engine (OpenStreetMap) |
| Lucide React | 0.517.0 | Icon library |
| Framer Motion | ^11 | Installed, available for animations |
| Socket.io-client | ^4 | Installed, available for real-time |
| Web Speech API | Native | Voice recognition |
| Vibration API | Native | Haptic feedback |
| Notification API | Native | Push notifications |
| Geolocation API | Native | GPS coordinates |
| localStorage | Native | Persistent data storage |
| CSS Variables | Native | Design tokens + theming |
| PWA / Workbox | CRA built-in | Offline caching |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11 | Runtime |
| Flask | 3.x | Web framework |
| Flask-CORS | 6.x | Cross-origin resource sharing |
| HuggingFace Transformers | 4.36.2 | Sentiment-based classification |
| PyTorch | 2.5.1 | ML backend for Transformers |
| Google Generative AI | 0.8.x | Gemini 1.5 Pro API client |
| python-dotenv | 1.x | Environment variable management |
| Gunicorn | 23.x | Production WSGI server |

### External APIs (Free)

| API | Usage | Key Required? |
|---|---|---|
| OpenStreetMap Overpass API | Nearby hospitals/police/fire | ❌ No |
| Google Gemini 1.5 Pro | First-aid guidance generation | ✅ Yes (free tier) |
| HuggingFace `distilbert` | Emergency sentiment analysis | ❌ No |

---

## Project Structure

```
resqai-frontend/
├── public/
│   ├── index.html          ← Meta tags, PWA config
│   ├── manifest.json       ← PWA manifest (name, icons, theme)
│   └── favicon.ico
│
├── src/
│   ├── App.js              ← Root component, screen router
│   ├── index.js            ← React DOM entry point
│   ├── index.css           ← Complete design system (CSS variables, all styles)
│   │
│   ├── context/
│   │   └── AppContext.jsx  ← Global state (useReducer), theme, language, SOS
│   │
│   ├── hooks/
│   │   ├── useLocation.js  ← Geolocation (current + live tracking)
│   │   ├── useVoice.js     ← Web Speech API (speech-to-text)
│   │   └── useOffline.js   ← navigator.onLine watcher
│   │
│   ├── utils/
│   │   ├── api.js          ← classifyEmergency(), getNearbyServices(), offline fallback
│   │   ├── storage.js      ← localStorage wrapper (save/load/remove)
│   │   ├── haptics.js      ← Vibration API wrappers
│   │   └── (notifications.js) ← Push notification helpers
│   │
│   ├── i18n/
│   │   └── translations.js ← EN / HI / ES string tables
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx          ← App bar (logo, online badge, theme toggle)
│   │   │   └── NavBar.jsx          ← Bottom navigation (5 tabs)
│   │   │
│   │   ├── common/
│   │   │   ├── Toast.jsx           ← Toast notification system
│   │   │   ├── Modal.jsx           ← Bottom sheet modal
│   │   │   └── LoadingSpinner.jsx  ← Animated spinner
│   │   │
│   │   ├── emergency/
│   │   │   ├── EmergencyGrid.jsx   ← 7 category tap buttons
│   │   │   ├── SOSButton.jsx       ← Animated SOS trigger button
│   │   │   ├── VoiceInput.jsx      ← Textarea + mic button
│   │   │   ├── AIGuidanceCard.jsx  ← Step-numbered Gemini output
│   │   │   ├── ConfidenceBar.jsx   ← Animated confidence meter
│   │   │   ├── NearbyServices.jsx  ← Filterable services list
│   │   │   └── LiveMap.jsx         ← Leaflet map with markers
│   │   │
│   │   └── profile/
│   │       └── MedicalCard.jsx     ← Compact medical info display
│   │
│   └── screens/
│       ├── HomeScreen.jsx          ← Main screen (entry point UX)
│       ├── SOSScreen.jsx           ← SOS countdown + triggered state
│       ├── ResultScreen.jsx        ← AI classification results
│       ├── NearbyServicesScreen.jsx← Map + nearby emergency services
│       ├── MedicalProfileScreen.jsx← Edit blood group, allergies, etc.
│       ├── ContactsScreen.jsx      ← Add/delete emergency contacts
│       └── SettingsScreen.jsx      ← Theme, language, notifications
│
└── package.json

resqai-backend/
├── app.py              ← Flask application (all logic)
├── test_app.py         ← 41-test suite (runs without torch/transformers)
├── requirements.txt    ← Python dependencies
├── .env.example        ← Environment variable template
└── README.md
```

---

## How the AI Works

### Step 1 — Dual Emergency Classifier

When a user submits text, two classifiers run in parallel:

**Keyword Engine (fast, offline-capable)**
```python
EMERGENCY_KEYWORDS = {
    'Medical':   ['heart', 'bleeding', 'unconscious', 'seizure', ...],  # 25 keywords
    'Fire':      ['fire', 'flame', 'smoke', 'explosion', ...],           # 9 keywords
    'Crime':     ['robbery', 'theft', 'assault', 'shooting', ...],       # 17 keywords
    'Accident':  ['accident', 'crash', 'collision', 'car', ...],         # 16 keywords
    'Disaster':  ['earthquake', 'flood', 'tsunami', 'cyclone', ...],     # 14 keywords
    'Women Safety':    ['women', 'molestation', 'domestic violence', ...], # 10 keywords
    'Child Emergency': ['child', 'baby', 'infant', 'abduction', ...],    # 8 keywords
}
# Confidence = min(0.95, 0.6 + matches × 0.07)
```

**HuggingFace Sentiment (fallback)**
```python
classifier = pipeline('sentiment-analysis')  # distilbert-base-uncased-finetuned-sst-2
# NEGATIVE → Medical, POSITIVE → General Distress
```

**Selection Rule**: Keyword engine wins when it finds a match (more specific). Sentiment used only as fallback.

### Step 2 — Severity Detection

```python
Critical  ← contains 'unconscious', 'not breathing', 'cardiac arrest' OR confidence > 90%
High      ← contains 'urgent', 'immediately', 'serious' OR confidence > 75%
Medium    ← confidence > 55%
Low       ← everything else
```

### Step 3 — Gemini Guidance Generation

```python
prompt = f"""You are a calm emergency response assistant.
A user is reporting a {emergency_type} emergency: "{user_text}"

Provide exactly 4 clear, numbered first-response steps they must take RIGHT NOW.
Rules: Direct, actionable, simple language (assume panic), under 20 words each."""
```

### Step 4 — Offline Fallback

If no internet or Gemini fails, each emergency type has a pre-written 4-step guidance that is always available — no API call needed.

---

## Getting Started

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 18.x |
| npm | 9.x |
| Python | 3.11 |
| pip | 23.x |

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/Sajal-Srivastava/resqai-frontend.git
cd resqai-frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm start
# Opens http://localhost:3000
```

**Available Scripts**

| Command | Description |
|---|---|
| `npm start` | Start development server (hot reload) |
| `npm run build` | Create optimized production build (124 kB gzipped) |
| `npm test` | Run React component tests |

**Environment Variables (optional)**

Create `.env` in the frontend root:
```env
REACT_APP_BACKEND_URL=http://localhost:5000
```
Defaults to `https://resqai-backend.onrender.com` if not set.

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/Sajal-Srivastava/resqai-backend.git
cd resqai-backend

# 2. Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt
# Note: torch + transformers = ~2GB download on first install

# 4. Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 5. Start development server
python app.py
# Backend running at http://localhost:5000
```

**Get a Free Gemini API Key**

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Add it to your `.env` file:
   ```env
   GEMINI_API_KEY=AIza...your_key_here
   ```

> ⚠️ **Security Warning**: Never commit `.env` to git. The `.gitignore` already excludes it.

---

## API Reference

Base URL: `https://resqai-backend.onrender.com` (or `http://localhost:5000` locally)

---

### `POST /api/classify`

Classifies an emergency and returns AI-generated first-aid guidance.

**Request Body**
```json
{
  "text": "Someone is bleeding heavily from a wound on their arm",
  "location": {
    "lat": 28.6139,
    "lon": 77.2090
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | ✅ | Emergency description (max 2000 chars) |
| `location` | object | ❌ | User GPS coordinates |
| `location.lat` | number | ❌ | Latitude |
| `location.lon` | number | ❌ | Longitude |

**Response `200 OK`**
```json
{
  "emergencyType": "Medical",
  "confidence": 74.0,
  "severity": "High",
  "locationReceived": true,
  "guidance": "1. Apply firm pressure to the wound with a clean cloth.\n2. Keep the person still and calm.\n3. Elevate the injured limb above heart level.\n4. Call 112 immediately if you have not already.",
  "coordinates": {
    "lat": 28.6139,
    "lon": 77.209
  }
}
```

| Field | Type | Description |
|---|---|---|
| `emergencyType` | string | One of: Medical, Fire, Crime, Accident, Disaster, Women Safety, Child Emergency, General Distress |
| `confidence` | number | 0–100 (percentage) |
| `severity` | string | Critical / High / Medium / Low |
| `locationReceived` | boolean | Whether GPS coordinates were provided |
| `guidance` | string | Numbered first-aid steps (4 steps) |
| `coordinates` | object or null | Echo of input coordinates |

**Error Responses**

| Code | Condition |
|---|---|
| `400` | Empty text, text > 2000 chars, invalid JSON |
| `500` | Unexpected server error |

---

### `POST /api/sos`

Logs an SOS event server-side. Used for audit trail.

**Request Body**
```json
{
  "location": { "lat": 28.6139, "lon": 77.2090 },
  "profile": {
    "name": "Rahul Sharma",
    "bloodGroup": "O+",
    "allergies": "Penicillin"
  }
}
```

**Response `200 OK`**
```json
{
  "status": "received",
  "message": "SOS event logged. Emergency services should be called via 112."
}
```

---

### `GET /api/health`

Health check for monitoring and uptime services.

**Response `200 OK`**
```json
{
  "status": "ok",
  "gemini": true,
  "version": "2.0"
}
```

---

## Screens & UI

### Screen Navigation

```
NavBar
├── 🏠 Home          → HomeScreen
├── 🆘 SOS           → SOSScreen (countdown + triggered)
├── 🗺️ Map           → NearbyServicesScreen
├── 👤 Profile       → MedicalProfileScreen
└── ⚙️ Settings      → SettingsScreen
                        └── (contacts button) → ContactsScreen
```

### HomeScreen
- Welcome greeting (personalized with user's name if profile is set)
- Quick stats row (emergency number / contact count / location / network status)
- Offline banner when no internet detected
- Profile setup nudge if medical profile is empty
- Voice/text input bar (expandable textarea + mic button)
- "Get Help Now" button → triggers AI analysis
- Emergency grid (7 categories, 2-column + 1 full-width)
- SOS button with pulse rings
- Emergency numbers quick-dial grid

### SOSScreen
- SVG countdown ring (5 → 0 seconds) drawn with `stroke-dashoffset` animation
- Large countdown number in emergency red
- Cancel button always visible
- After trigger: pulse icon + "SOS Activated!" + SOS info cards
- Info cards: GPS coordinates / timestamp / contact count / blood group
- Animated Call 112 button + Call 108 button
- Emergency contacts list (tap-to-call)
- Medical profile card
- "I'm Safe Now" button

### ResultScreen
- Large emergency category emoji
- Emergency type badge (color-coded by category)
- Severity badge (Critical/High/Medium/Low)
- Animated confidence bar (color: red <60%, amber 60–80%, green >80%)
- Gemini AI guidance card (step-numbered, indigo theme)
- Location map (if GPS available)
- Emergency contacts quick-dial
- Call 112 button, Share Location button, New Emergency button

### NearbyServicesScreen
- Leaflet map (260px) with user pin + service markers
- "Find Nearby Services" button (triggers Overpass API query)
- Filter tabs (All / Hospitals / Police / Fire)
- Services list with icon, name, distance, call button

### MedicalProfileScreen
- Full name field
- Blood group selector (8 options as tap-buttons)
- Allergy, medication, conditions textareas
- Emergency note field
- Local storage note (privacy assurance)

### ContactsScreen
- Add Contact floating button
- Bottom sheet modal for add form (name, phone, relation)
- Contact cards with color-coded initials avatar
- Call and delete action buttons per contact

### SettingsScreen
- Dark/Light theme toggle
- Language selector (3 languages)
- Notifications permission toggle
- Quick dial list for all national helplines
- App version / about section
- Clear all data button

---

## Configuration

### Design Tokens (CSS Variables)

All design values are defined as CSS custom properties in `src/index.css`:

```css
:root {
  /* Colors */
  --c-red: #EF4444;        /* Primary emergency color */
  --c-orange: #F97316;     /* Fire */
  --c-purple: #7C3AED;     /* Crime */
  --c-amber: #F59E0B;      /* Accident */
  --c-indigo: #4F46E5;     /* Disaster + AI card */
  --c-pink: #DB2777;       /* Women Safety */
  --c-teal: #0D9488;       /* Child Emergency */

  /* Dark theme backgrounds */
  --bg-base: #0B0F1A;
  --bg-surface: #131929;
  --bg-card: #1A2236;

  /* Typography scale */
  --font-size-sm: 13px;
  --font-size-md: 16px;    /* Base */
  --font-size-lg: 18px;
  --font-size-xl: 22px;
}

/* Light theme overrides */
[data-theme="light"] {
  --bg-base: #F0F4FF;
  --bg-card: #FFFFFF;
  --t-primary: #0F172A;
}
```

### Adding a New Emergency Category

1. Add to `EMERGENCIES` array in `src/components/emergency/EmergencyGrid.jsx`:
   ```js
   { id: 'gas', label: 'Gas Leak', icon: '💨', color: '#64748B', text: 'There is a gas leak emergency' }
   ```
2. Add keywords to `EMERGENCY_KEYWORDS` in `resqai-backend/app.py`:
   ```python
   'Gas Leak': ['gas', 'leak', 'lpg', 'cylinder', 'smell gas'],
   ```
3. Add offline guidance to `OFFLINE_GUIDANCE` in `app.py` and `api.js`
4. Add translation strings in `src/i18n/translations.js`

### Adding a New Language

In `src/i18n/translations.js`, add a new key (e.g., `'ta'` for Tamil):
```js
ta: {
  appName: 'ResQ.AI',
  home: 'முகப்பு',
  sos: 'SOS',
  // ... all keys
}
```
Then add it to the `LANGS` array in `src/screens/SettingsScreen.jsx`.

---

## Testing

### Backend Tests — 41/41 passing ✅

The test suite runs **without** requiring PyTorch or Transformers installed (uses mocks):

```bash
cd resqai-backend
python test_app.py
```

**Test coverage:**

| Test Class | Tests | What It Covers |
|---|---|---|
| `TestKeywordClassifier` | 9 | All 7 emergency types, empty/unknown inputs |
| `TestSeverityDetection` | 6 | Critical/High/Medium/Low detection rules |
| `TestOfflineGuidance` | 2 | All emergency types have guidance + 112 mention |
| `TestAPIEndpoints` | 18 | All routes, error codes, CORS, location, SOS |
| `TestAPIResponseStructure` | 4 | Field types, valid categories, guidance length |

**Sample test run output:**
```
============================================================
  ResQ.AI Backend Test Suite
============================================================

test_accident_keywords ... ok
test_child_emergency_keywords ... ok
test_crime_keywords ... ok
test_disaster_keywords ... ok
test_medical_keywords ... ok
...
test_classify_medical_emergency ... ok
test_classify_fire_emergency ... ok
test_classify_empty_text_returns_400 ... ok
test_cors_header_on_classify ... ok
test_sos_endpoint_returns_200 ... ok
test_health_endpoint_returns_200 ... ok
...
----------------------------------------------------------------------
Ran 41 tests in 0.022s
OK

============================================================
  RESULTS: 41/41 tests passed
============================================================
```

### Frontend Build — Passing ✅

```bash
cd resqai-frontend
npm run build
```

Output:
```
File sizes after gzip:
  124.7 kB  build/static/js/main.js
   11.9 kB  build/static/css/main.css
    1.76 kB  build/static/js/453.chunk.js

The build folder is ready to be deployed.
```

### Frontend Dev Tests

```bash
npm test
```

Runs React Testing Library tests in `src/App.test.js`.

---

## Deployment

### Option A — Render.com (Backend) + Vercel (Frontend) ✅ Recommended

This is the recommended free-tier stack. Follow the steps in order.

---

#### 1. Push both repos to GitHub

You need two GitHub repositories before deploying.

```bash
# Backend
cd resqai-backend
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/resqai-backend.git
git push -u origin main

# Frontend
cd ../resqai-frontend
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/resqai-frontend.git
git push -u origin main
```

---

#### 2. Deploy Backend to Render.com

1. Go to **https://render.com** → Sign up / Log in
2. Click **"New" → "Web Service"**
3. Select **"Build and deploy from a Git repository"**
4. Connect your GitHub and select **resqai-backend**
5. Render will auto-detect the settings from `render.yaml` — verify:
   - **Name**: `resqai-backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free
6. Under **"Environment Variables"**, click **"Add Environment Variable"**:

   | Key | Value |
   |---|---|
   | `GEMINI_API_KEY` | `AIza...your_key_here` |
   | `ALLOWED_ORIGINS` | `https://resqai-frontend.vercel.app,http://localhost:3000` |
   | `FLASK_ENV` | `production` |
   | `FLASK_DEBUG` | `false` |

7. Click **"Create Web Service"**
8. Wait ~3 minutes for first deploy
9. ✅ Backend live at: **`https://resqai-backend.onrender.com`**
10. Verify: `https://resqai-backend.onrender.com/api/health` → should return `{"status":"ok"}`

> ⚠️ **Free tier note**: Render free services spin down after 15 minutes of inactivity. The first request after sleep takes ~30 seconds. Upgrade to Starter ($7/mo) for always-on.

---

#### 3. Deploy Frontend to Vercel

1. Go to **https://vercel.com** → Sign up / Log in with GitHub
2. Click **"Add New Project"**
3. Import **resqai-frontend** from your GitHub
4. Vercel will auto-detect Create React App. Verify settings:
   - **Framework**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Under **"Environment Variables"**, add:

   | Key | Value |
   |---|---|
   | `REACT_APP_BACKEND_URL` | `https://resqai-backend.onrender.com` |

6. Click **"Deploy"**
7. ✅ Frontend live at: **`https://resqai-frontend.vercel.app`**

---

#### 4. Connect Frontend → Backend (CORS Update)

After you know your Vercel URL, update the backend `ALLOWED_ORIGINS` on Render:

1. Go to Render dashboard → resqai-backend → **Environment**
2. Update `ALLOWED_ORIGINS` to your exact Vercel URL:
   ```
   https://resqai-frontend.vercel.app,http://localhost:3000
   ```
3. Click **Save** — Render will redeploy automatically

---

### Option B — Netlify (Frontend Alternative)

Instead of Vercel, you can use Netlify:

1. Go to **https://netlify.com** → New site from Git
2. Connect resqai-frontend repo
3. Build settings are auto-read from `netlify.toml` in the repo
4. Add environment variable: `REACT_APP_BACKEND_URL=https://resqai-backend.onrender.com`
5. Deploy → your site at `https://resqai-frontend.netlify.app`

---

### Local Full-Stack Development

Run both servers with one command from the root `req/` folder:

```powershell
# Windows PowerShell
.\dev.ps1
```

This starts:
- Backend at `http://localhost:5000`
- Frontend at `http://localhost:3000` (auto-opens in browser)
- Frontend automatically talks to local backend (via `.env.development`)

**Or start manually in two terminals:**

```bash
# Terminal 1 — Backend
cd resqai-backend
py -3.11 app.py

# Terminal 2 — Frontend
cd resqai-frontend
npm start
```

---

### Option C — Docker Compose (Advanced)

```yaml
# docker-compose.yml (create in root req/ folder)
version: '3.8'
services:
  backend:
    build: ./resqai-backend
    ports: ["5000:5000"]
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - ALLOWED_ORIGINS=http://localhost:3000

  frontend:
    build: ./resqai-frontend
    ports: ["3000:80"]
    depends_on: [backend]
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:5000
```

```bash
GEMINI_API_KEY=AIza... docker-compose up
```

---

## Roadmap

- [ ] **SMS Fallback** — Twilio integration to send location via SMS when internet is unavailable
- [ ] **Real-time WebSocket** — Flask-SocketIO for live location tracking with responders
- [ ] **Firebase Push** — Background SOS notifications when app is closed
- [ ] **Wearable Integration** — Detect SOS trigger from watch/wearband via Web Bluetooth
- [ ] **Fake Call Mode** — Fake incoming call to escape dangerous situations
- [ ] **ETA Tracker** — Show estimated time for responders to arrive
- [ ] **More Languages** — Bengali, Tamil, Telugu, Marathi, Punjabi
- [ ] **Audio Recording** — Record ambient audio during SOS for evidence
- [ ] **AR Location** — Augmented reality mode to point camera and see nearby services
- [ ] **Community SOS** — Alert other ResQ.AI users nearby

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Add tests for new backend functionality
4. Ensure `python test_app.py` passes (41/41)
5. Ensure `npm run build` succeeds without errors
6. Submit a Pull Request with a clear description

**Code Style**
- Frontend: Standard React patterns, CSS variables (no inline styles except dynamic values)
- Backend: PEP 8, type hints on function signatures, log all API requests
- Never hardcode API keys or secrets

---

## Security Notes

- All API keys must be stored in `.env` (excluded from git via `.gitignore`)
- Medical profile and contacts are stored locally — **never transmitted** except during active SOS
- Input validation: text limited to 2000 chars, type checked on all endpoints
- CORS configured to accept all origins (restrict in production to your frontend domain)
- No authentication required by design — emergency apps must work without login

---

## License

MIT License — free to use, modify, and distribute. Built for saving lives.

---

## Repositories

| Repo | URL |
|---|---|
| Frontend | https://github.com/Sajal-Srivastava/resqai-frontend |
| Backend | https://github.com/Sajal-Srivastava/resqai-backend |

---

<div align="center">

**Built with ❤️ for emergency preparedness**

*In an emergency, every second counts. ResQ.AI is designed to save them.*

**⚠️ Always call 112 first in a life-threatening emergency.**

</div>
