# 🪐 Solstice: The Last Long Day

[![Deploy to GitHub](https://img.shields.io/badge/Deploy-GitHub-F27D26?style=for-the-badge&logo=github&logoColor=white)](#)
[![System Status](https://img.shields.io/badge/Planetary_Uplink-ONLINE-00FF41?style=for-the-badge&logo=statuspage&logoColor=00FF41)](#)
[![Stack](https://img.shields.io/badge/React_18-Vite_5_--_TS-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)

> *"The rotation has halted. The sky is split in two. On Hemisphere A, a furnace that never sleeps; on Hemisphere B, an eternal glacial silence. Balance is your mandate. Balance is your cage."*

**Solstice: The Last Long Day** is a deep, narrative-driven planetary strategy simulation and interactive game design workbench. As the designated System Operator (VANCE.E-A1), you must interconnect opposing Day/Night hemisphere resource flows, resolve heavy existential crises, decrypt secret orbital transmissions, and debate with the cynical planetary core intelligence, **TURING**.

---

## 🛰️ Core Tactical Systems & Features

### 1. Planetary System Controls (Hemisphere Simulator)
Manage the fragile equilibrium of a tidally locked Earth by balancing specialized systems:
*   **The Day Side (Solar Core)**: Superheated extremes. Sol siphons generate massive energy but dry out the hydrosphere rapidly.
*   **The Night Side (Glacial Shield)**: Absolute sub-zero freezes. Cooling grids consume enormous power but trap and crystallize freshwater reserves.
*   **Visual Warning Pulsations**: Dynamic alerts that trigger a heavy high-contrast red hazard pulse (`animate-pulse`) and `CRITICAL` beacon indicators on resource panels the instant Energy, Water, or Population index thresholds plunge below **15%**.
*   **Live Telemetry Trend Feed**: A newly integrated real-time dynamic dashboard line chart — engineered with **Recharts** — visualizing sliding-window telemetry trends of planetary levels over the last 60 seconds of operation.

### 2. Game Design Master Docs (GDD Matrix)
Access 20 fully interactive, classified game development files covering:
*   Core design philosophy, progression loops, and mechanic specifications.
*   In-depth atmospheric lore records, worldbuilding journals, and character dossiers.
*   Visual art directives, sound design scopes, and commercial release strategies.

### 3. Decryption Matrix
Reconstruct corrupted trans-orbital communications packets. Engage a grid-based decryption interface, solve checksum offsets, and restore encrypted structural logs.

### 4. TURING Network Uplink
Initialize direct neural channels with **TURING**, the highly analytical planetary super-intelligence. Discuss resource allocations, criticize your own operator statistics, and argue about humanity's post-rotation future through an AI-powered conversational matrix.

### 5. Godot 4 Blueprint Registry
Cross-reference interactive production-grade Godot 4 workspace configurations. Inspect script hierarchies, asset pipelines, node properties (`CharacterBody2D`, `TileMap`), and game system scripts.

---

## 🛠️ Technological Architecture

*   **Frontend**: React 18 & TypeScript compiled via Vite 5.
*   **Visual Styling**: Ultra-custom Tailwind CSS with phosphor glowing UI schemes, atmospheric theme highlights, and customized glassmorphic overlays.
*   **Data Visualization**: High-fidelity line trend plots powered by the `recharts` library for responsive real-time data tracing.
*   **AI Engine**: Server-side Google Gemini Integration mapping adaptive decision-trees, diagnostic narrative feedback, and contextual moral dilemmas.

---

## 🚀 Local Installation & Deployment

### Quick Start
To boot up the station terminal locally on your machine, run the following sequence:

```bash
# 1. Clone the repository
git clone https://github.com/pallasite99/solstice-the-last-long-day.git
cd solstice-the-last-long-day

# 2. Allocate dependencies
npm install

# 3. Initialize development console
npm run dev
```

The operator interface will launch automatically on `http://localhost:3000`.

---

## 📂 System Manifest

```text
├── assets/                 # Vector resources & visual branding assets
├── src/
│   ├── components/         # Interactive elements & HUD controls
│   ├── App.tsx             # Master Core Application Frame
│   ├── gdd.ts              # Game Design Master Database (20 Sections)
│   ├── godotData.ts        # Interactive Godot project directory tree structure
│   ├── turingDialogue.ts   # Core personality prompts & conversational trees
│   ├── turingPuzzles.ts    # Trans-orbital packet encryption schemas
│   ├── types.ts            # Simulation structural type definitions
│   └── index.css           # Global typography definitions & neon animations
├── package.json            # Deployment compilation map
└── server.ts               # Secure Node.js server entry & API routing
```

---

<div align="center">
  <sub>Planetary Simulation Framework. Terminal Authorization VANCE.E-A1. Securing mankind's twilight.</sub>
</div>
