// NASA ARTEMIS-7 Mission Mock Data
// Space Health Monitoring System

export const MISSION_DATA = {
  missionName: 'ARTEMIS-7',
  destination: 'Mars Orbital Survey',
  launchDate: '2026-06-25',
  currentDay: 142,
  totalDays: 300,
  crewSize: 4,
  communicationDelay: 1182, // seconds (19m 42s)
  missionPhase: 'AUTONOMOUS DEEP-SPACE TRANSIT',
  vehicleName: 'ISV Perseverance II',
};

export const ASTRONAUTS = [
  {
    id: 'ast-001',
    name: 'Dr. Elena Vasquez',
    role: 'Commander',
    initials: 'EV',
    specialty: 'Aerospace Medicine',
    color: '#00d4ff',
    healthScore: 87,
  },
  {
    id: 'ast-002',
    name: 'Dr. Marcus Chen',
    role: 'Flight Surgeon',
    initials: 'MC',
    specialty: 'Emergency Medicine',
    color: '#00ff88',
    healthScore: 91,
    isMedicalOfficer: true,
  },
  {
    id: 'ast-003',
    name: 'Lt. Priya Sharma',
    role: 'Mission Specialist',
    initials: 'PS',
    specialty: 'Biomedical Engineering',
    color: '#a855f7',
    healthScore: 78,
  },
  {
    id: 'ast-004',
    name: 'Sgt. Dmitri Volkov',
    role: 'Systems Engineer',
    initials: 'DV',
    specialty: 'Structural Engineering',
    color: '#ffcc00',
    healthScore: 83,
  },
];

export const HEALTH_THRESHOLDS = {
  heartRate: { min: 50, max: 100, criticalMin: 40, criticalMax: 120, unit: 'bpm', label: 'Heart Rate' },
  bloodPressureSys: { min: 90, max: 140, criticalMin: 80, criticalMax: 160, unit: 'mmHg', label: 'Systolic BP' },
  bloodPressureDia: { min: 60, max: 90, criticalMin: 50, criticalMax: 100, unit: 'mmHg', label: 'Diastolic BP' },
  spo2: { min: 95, max: 100, criticalMin: 90, criticalMax: 100, unit: '%', label: 'SpO2' },
  sleepHours: { min: 6, max: 9, criticalMin: 4, criticalMax: 12, unit: 'hrs', label: 'Sleep Hours' },
  bloodSugar: { min: 70, max: 140, criticalMin: 60, criticalMax: 180, unit: 'mg/dL', label: 'Blood Glucose' },
  coreTemp: { min: 36.1, max: 37.5, criticalMin: 35.5, criticalMax: 38.5, unit: '°C', label: 'Core Temperature' },
  hydration: { min: 70, max: 100, criticalMin: 50, criticalMax: 100, unit: '%', label: 'Hydration Level' },
  moodRating: { min: 5, max: 10, criticalMin: 3, criticalMax: 10, unit: '/10', label: 'Mood Rating' },
  exerciseCompliance: { min: 60, max: 100, criticalMin: 30, criticalMax: 100, unit: '%', label: 'Exercise Compliance' },
  radiationDose: { min: 0, max: 2, criticalMin: 0, criticalMax: 4, unit: 'mSv/wk', label: 'Radiation Dose' },
  boneDensityLoss: { min: 0, max: 5, criticalMin: 0, criticalMax: 8, unit: '%', label: 'Bone Density Loss' },
  muscleMass: { min: 95, max: 100, criticalMin: 90, criticalMax: 100, unit: '%', label: 'Muscle Mass Index' },
  cognitiveScore: { min: 75, max: 100, criticalMin: 60, criticalMax: 100, unit: '/100', label: 'Cognitive Score' },
  sansRisk: { min: 0, max: 30, criticalMin: 0, criticalMax: 60, unit: '%', label: 'SANS Risk Index' },
};

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateTimeSeriesData(days = 180) {
  const data = [];
  for (let d = 1; d <= days; d++) {
    const r = (offset) => seededRandom(d * 13 + offset);
    const progress = d / days;

    data.push({
      day: d,
      label: `Day ${d}`,
      heartRate: Math.round(60 + progress * 10 + r(1) * 15),
      bloodPressureSys: Math.round(115 + progress * 12 + r(2) * 10),
      bloodPressureDia: Math.round(72 + progress * 8 + r(3) * 8),
      spo2: parseFloat((99 - progress * 2 - r(4) * 2).toFixed(1)),
      sleepHours: parseFloat((7.5 - progress * 1.5 - r(5) * 1.5).toFixed(1)),
      bloodSugar: Math.round(90 + r(6) * 30),
      coreTemp: parseFloat((36.8 + r(7) * 0.6 - 0.1).toFixed(2)),
      hydration: Math.round(85 - progress * 10 - r(8) * 10),
      moodRating: parseFloat((8 - progress * 2 - r(9) * 2).toFixed(1)),
      exerciseCompliance: Math.round(90 - progress * 20 - r(10) * 20),
      radiationDose: parseFloat((0.5 + progress * 1.5 + r(11) * 0.8).toFixed(2)),
      boneDensityLoss: parseFloat((progress * 5 + r(12) * 1.5).toFixed(2)),
      muscleMass: parseFloat((100 - progress * 5 - r(13) * 2).toFixed(1)),
      cognitiveScore: Math.round(95 - progress * 15 - r(14) * 10),
      sansRisk: Math.round(progress * 25 + r(15) * 15),
    });
  }
  return data;
}

export const INITIAL_METRICS = {
  heartRate: 72,
  bloodPressureSys: 122,
  bloodPressureDia: 78,
  spo2: 97.4,
  sleepHours: 6.2,
  bloodSugar: 98,
  coreTemp: 37.1,
  hydration: 74,
  moodRating: 7,
  exerciseCompliance: 68,
  radiationDose: 1.8,
  boneDensityLoss: 3.2,
  muscleMass: 96.4,
  cognitiveScore: 82,
  sansRisk: 18,
};

export const DAILY_CHECKLIST = [
  { id: 'ex-01', category: 'Physical', task: 'Resistance Training (ARED)', frequency: 'Daily', duration: '90 min', completed: true, timestamp: '06:30' },
  { id: 'ex-02', category: 'Physical', task: 'Cardiovascular Exercise (T2)', frequency: 'Daily', duration: '30 min', completed: true, timestamp: '07:15' },
  { id: 'ex-03', category: 'Physical', task: 'Compression Suit Protocol', frequency: 'Daily', duration: '15 min', completed: false, timestamp: null },
  { id: 'cg-01', category: 'Cognitive', task: 'Psychomotor Vigilance Test (PVT)', frequency: 'Daily', duration: '10 min', completed: true, timestamp: '08:00' },
  { id: 'cg-02', category: 'Cognitive', task: 'Spatial Orientation Exercise', frequency: '3x/week', duration: '20 min', completed: false, timestamp: null },
  { id: 'cg-03', category: 'Cognitive', task: 'Blue-Light Mitigation (2h pre-sleep)', frequency: 'Daily', duration: 'Evening', completed: false, timestamp: null },
  { id: 'md-01', category: 'Medical', task: 'Ocular Ultrasound Self-Assessment', frequency: 'Weekly', duration: '5 min', completed: true, timestamp: '09:00' },
  { id: 'md-02', category: 'Medical', task: 'Blood Pressure Monitoring', frequency: 'Daily', duration: '5 min', completed: true, timestamp: '09:05' },
  { id: 'md-03', category: 'Medical', task: 'Radiation Dosimeter Log', frequency: 'Daily', duration: '2 min', completed: true, timestamp: '09:10' },
  { id: 'md-04', category: 'Medical', task: 'Hydration Intake Log (2.5L target)', frequency: 'Daily', duration: 'All day', completed: false, timestamp: null },
  { id: 'md-05', category: 'Medical', task: 'Antioxidant Supplement Protocol', frequency: 'Daily', duration: '5 min', completed: true, timestamp: '07:30' },
  { id: 'eq-01', category: 'Equipment', task: 'Medical Gear Calibration Check', frequency: 'Daily', duration: '10 min', completed: false, timestamp: null },
  { id: 'eq-02', category: 'Equipment', task: 'Wearable Sensor Battery Check', frequency: 'Daily', duration: '5 min', completed: true, timestamp: '08:30' },
  { id: 'eq-03', category: 'Equipment', task: 'Emergency Medical Kit Inventory', frequency: 'Weekly', duration: '15 min', completed: false, timestamp: null },
];

export const STREAK_DATA = {
  exercise: 12,
  hydration: 8,
  sleep: 4,
  eyeCheck: 21,
  medicalLog: 142,
};

export const SENSOR_FEEDS = [
  { id: 'sf-01', name: 'Cardiac Patch', icon: 'heart', metric: 'heartRate', unit: 'bpm', battery: 78, lastSync: '2s ago', status: 'active' },
  { id: 'sf-02', name: 'Radiation Dosimeter', icon: 'radiation', metric: 'radiationDose', unit: 'mSv/wk', battery: 92, lastSync: '1m ago', status: 'active' },
  { id: 'sf-03', name: 'SpO2 Ring', icon: 'activity', metric: 'spo2', unit: '%', battery: 65, lastSync: '5s ago', status: 'active' },
  { id: 'sf-04', name: 'Actigraphy Band', icon: 'moon', metric: 'sleepHours', unit: 'hrs', battery: 45, lastSync: '12h ago', status: 'warning' },
  { id: 'sf-05', name: 'Thermal Sensor', icon: 'thermometer', metric: 'coreTemp', unit: '°C', battery: 88, lastSync: '30s ago', status: 'active' },
  { id: 'sf-06', name: 'Glucose Monitor', icon: 'droplets', metric: 'bloodSugar', unit: 'mg/dL', battery: 23, lastSync: '15m ago', status: 'low' },
];
