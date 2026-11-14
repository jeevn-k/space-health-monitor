# ARTEMIS-7: Autonomous Astronaut Health Monitoring System
### NASA Space Apps Challenge Submission

An offline-first, clinically driven astronaut health and physiological monitoring suite engineered for long-duration deep-space transit (Mars Orbital Transit / Autonomous Deep Space).

---

## Key Architecture & Features

### 1. Mission Control Header & Offline-First Badge
- **Mission Status:** Autonomous Deep-Space Transit (ISV *Perseverance II*).
- **Delay-Tolerant Communications:** Real-time 19m 42s one-way Earth light-speed delay countdown.
- **Autonomous Local Processing:** Since ground surgeon intervention is delayed by ~40 minutes roundtrip, all telemetry is analyzed locally by on-board clinical decision engines.
- **Mission Elapsed Time (MET):** Live running mission clock (Day 142).
- **Crew Health Index (CHI):** Multi-system weighted score reflecting overall physiological readiness.

### 2. Interactive Anatomical Body Map (Core UI/UX)
- Central holographic astronaut anatomical figure with scanning laser reticle and interactive target points.
- 4 clickable anatomical sectors with real-time status color coding:
  - **Head / CNS & Ocular:** Sleep hours, cognitive reaction time / score, mood rating, SANS (Spaceflight-Associated Neuro-ocular Syndrome) risk index.
  - **Chest / Cardiovascular:** Resting heart rate, blood pressure (Sys/Dia), pulse oximetry (SpO2), orthostatic deconditioning indicators.
  - **Abdomen / Metabolic & Immune:** Blood glucose, core body temperature, hydration percentage, cumulative cosmic radiation dose.
  - **Bones & Muscles / Musculoskeletal:** ARED exercise compliance, bone mineral density loss rate, muscle atrophy index.
- Clicking any sector opens the **Diagnostic Deep-Dive Drawer** with microgravity physiological mechanisms, telemetry tables, and autonomous clinical guidance.

### 3. NASA Human Research Program (HRP) Clinical Decision Engine
- Evaluates vitals against official NASA HRP hazard thresholds:
  - **Hazard 1 (Radiation):** Monitors GCR and SPE dosimeter thresholds, triggering storm shelter relocation protocols and antioxidant regimens.
  - **Hazard 2 (Isolation & Sleep):** Flags sleep deprivation (<5 hrs) and behavioral dips, enforcing blue-light mitigation and crew peer-checks.
  - **Hazard 3 (Microgravity & Fluid Shifts):** Catches cephalad fluid shifts, SANS optic disc edema, and cardiovascular stroke volume loss.
- **Action Tiers:** Every alert categorizes actions into:
  - *Immediate Crew Medical Officer (CMO) Intervention*
  - *Deferred Ground Surgeon Burst Message*
  - *Crew Self-Action Protocol*

### 4. Multi-Modal Telemetry & Diagnostic Input
- **Manual Input:** Sliders with nominal corridor indicators and quick-test anomaly simulators (Solar Radiation Spike, Cabin Hypoxia, SANS Fatigue, Nominal Reset).
- **IoT Bio-Sensor Feeds:** Real-time mock streams from 6 wearable sensors (Cardiac Patch, Radiation Dosimeter, SpO2 Smart Ring, Actigraphy Band, Thermal Sensor, Continuous Glucose Monitor) with battery and sync statuses.
- **Autonomous Medical AI Computer Vision:** Simulated inference for Ocular Ultrasound (SANS optic nerve sheath diameter), Dermatoscope skin erythema, and Pupil saccadometry.

### 5. Long-Duration Analytics & Trajectory Drift (Recharts)
- 180-day mission timeline with selectable horizons (30d, 60d, 90d, 180d).
- 4 dynamic charts:
  - Cardiovascular Dual-Axis Telemetry (Heart rate & SpO2 with critical reference lines).
  - Circadian Sleep & Behavioral Morale Area Chart.
  - Metabolic Glycemia & Radiation Load Composed Chart.
  - Musculoskeletal Atrophy & Bone Loss Retention Chart.
- 30-Day Trajectory Forecast Table with directional drift arrows and clinical etiology.

### 6. Gamification & Preventive Care Habit Tracker
- 5 Circular Streak Counters (Resistance Training, 2.5L Hydration, Sleep Target, SANS Eye Check, Medical Log).
- Daily Preventive Care Checklist categorized by Physical, Cognitive, Medical, and Equipment tasks with real-time completion tracking.
- Week 21 Mission Challenge card with XP progression.

---

## Getting Started

### Prerequisites
- Node.js (v18+ or v22+)
- npm

### Installation & Launch
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Or build production preview
npm run build
npm run preview
```
Open `http://localhost:5173` in your browser.
