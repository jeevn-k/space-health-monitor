import React, { useState } from 'react';
import {
  Brain,
  Eye,
  Heart,
  Activity,
  Zap,
  Dumbbell,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Info
} from 'lucide-react';

export default function BodyMap({
  bodyPartStatuses = {},
  currentMetrics = {},
  onSelectPart,
  selectedPart = null,
}) {
  const [hoveredPart, setHoveredPart] = useState(null);

  // Status configuration helper
  const getStatusCfg = (status = 'nominal') => {
    switch (status) {
      case 'critical':
        return {
          color: '#ff3366',
          bg: 'bg-red-500/10',
          border: 'border-red-500/50',
          borderHover: 'hover:border-red-400',
          text: 'text-red-400',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
          badgeText: 'CRITICAL',
          glow: '0 0 25px rgba(255, 51, 102, 0.35)',
          pulse: 'animate-pulse',
        };
      case 'warning':
        return {
          color: '#ffcc00',
          bg: 'bg-yellow-400/10',
          border: 'border-yellow-400/50',
          borderHover: 'hover:border-yellow-300',
          text: 'text-yellow-400',
          badgeBg: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40',
          badgeText: 'CAUTION',
          glow: '0 0 20px rgba(255, 204, 0, 0.3)',
          pulse: '',
        };
      default:
        return {
          color: '#00ff88',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/40',
          borderHover: 'hover:border-emerald-300',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          badgeText: 'NOMINAL',
          glow: '0 0 15px rgba(0, 255, 136, 0.2)',
          pulse: '',
        };
    }
  };

  const headStatus = getStatusCfg(bodyPartStatuses.head);
  const chestStatus = getStatusCfg(bodyPartStatuses.chest);
  const abdomenStatus = getStatusCfg(bodyPartStatuses.abdomen);
  const musculoStatus = getStatusCfg(bodyPartStatuses.musculoskeletal);

  const sectors = [
    {
      id: 'head',
      title: 'HEAD / CNS & OCULAR',
      sub: 'Neuro-Cognitive, SANS, Circadian State',
      icon: Brain,
      cfg: headStatus,
      metrics: [
        { label: 'Sleep Duration', value: `${currentMetrics.sleepHours ?? 6.2} hrs`, target: '6-9h', ok: (currentMetrics.sleepHours ?? 6.2) >= 6 },
        { label: 'Cognitive Score', value: `${currentMetrics.cognitiveScore ?? 82}/100`, target: '>75', ok: (currentMetrics.cognitiveScore ?? 82) >= 75 },
        { label: 'Mood / Behavioral', value: `${currentMetrics.moodRating ?? 7}/10`, target: '>5', ok: (currentMetrics.moodRating ?? 7) >= 5 },
        { label: 'SANS Vision Risk', value: `${currentMetrics.sansRisk ?? 18}%`, target: '<30%', ok: (currentMetrics.sansRisk ?? 18) <= 30 },
      ],
      hazardNote: 'Cephalic fluid shifts elevate intracranial pressure & optic disc edema risk.'
    },
    {
      id: 'chest',
      title: 'CHEST / CARDIOVASCULAR',
      sub: 'Hemodynamic & Pulmonary Status',
      icon: Heart,
      cfg: chestStatus,
      metrics: [
        { label: 'Resting Heart Rate', value: `${currentMetrics.heartRate ?? 72} bpm`, target: '50-100', ok: (currentMetrics.heartRate ?? 72) >= 50 && (currentMetrics.heartRate ?? 72) <= 100 },
        { label: 'Blood Pressure', value: `${currentMetrics.bloodPressureSys ?? 122}/${currentMetrics.bloodPressureDia ?? 78}`, target: '<140/90', ok: (currentMetrics.bloodPressureSys ?? 122) <= 140 },
        { label: 'Blood Oxygen (SpO2)', value: `${currentMetrics.spo2 ?? 97.4}%`, target: '≥95%', ok: (currentMetrics.spo2 ?? 97.4) >= 95 },
        { label: 'Orthostatic Index', value: 'Decond. Gr 1', target: 'Nominal', ok: true },
      ],
      hazardNote: 'Reduced blood volume & myocardial deconditioning from zero-g exposure.'
    },
    {
      id: 'abdomen',
      title: 'ABDOMEN / METABOLIC & IMMUNE',
      sub: 'Endocrine, Core Temp, Radiation Dose',
      icon: Activity,
      cfg: abdomenStatus,
      metrics: [
        { label: 'Blood Glucose', value: `${currentMetrics.bloodSugar ?? 98} mg/dL`, target: '70-140', ok: (currentMetrics.bloodSugar ?? 98) >= 70 && (currentMetrics.bloodSugar ?? 98) <= 140 },
        { label: 'Core Temp', value: `${currentMetrics.coreTemp ?? 37.1} °C`, target: '36.1-37.5', ok: (currentMetrics.coreTemp ?? 37.1) >= 36.1 && (currentMetrics.coreTemp ?? 37.1) <= 37.5 },
        { label: 'Hydration Level', value: `${currentMetrics.hydration ?? 74}%`, target: '≥70%', ok: (currentMetrics.hydration ?? 74) >= 70 },
        { label: 'Radiation Weekly', value: `${currentMetrics.radiationDose ?? 1.8} mSv`, target: '<2.0', ok: (currentMetrics.radiationDose ?? 1.8) <= 2.0 },
      ],
      hazardNote: 'Cosmic radiation ionisation & spaceflight microbiome shifts.'
    },
    {
      id: 'musculoskeletal',
      title: 'BONES & MUSCLES / LOCOMOTOR',
      sub: 'Bone Demineralization & Atrophy Index',
      icon: Dumbbell,
      cfg: musculoStatus,
      metrics: [
        { label: 'Exercise Compliance', value: `${currentMetrics.exerciseCompliance ?? 68}%`, target: '≥60%', ok: (currentMetrics.exerciseCompliance ?? 68) >= 60 },
        { label: 'Bone Density Loss', value: `${currentMetrics.boneDensityLoss ?? 3.2}%`, target: '<5.0%', ok: (currentMetrics.boneDensityLoss ?? 3.2) <= 5.0 },
        { label: 'Muscle Mass Index', value: `${currentMetrics.muscleMass ?? 96.4}%`, target: '≥95%', ok: (currentMetrics.muscleMass ?? 96.4) >= 95 },
        { label: 'ARED Cycle Today', value: 'Completed', target: 'Daily', ok: true },
      ],
      hazardNote: '1-1.5% monthly bone mineral loss in weight-bearing skeleton.'
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Banner with HUD Instructions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-cyan-500/20 text-cyan-300">
            <Sparkles size={16} className="animate-spin-slow" />
          </div>
          <div>
            <div className="text-xs font-bold text-cyan-300 tracking-wider uppercase">
              Interactive Bio-Anatomical HUD Telemetry
            </div>
            <div className="text-[11px] text-slate-400">
              Live anatomical telemetry divided into 4 clinical sectors. Click any zone for deep-dive diagnostics.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ff88]" /> Nominal
          </span>
          <span className="flex items-center gap-1.5 text-yellow-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_#ffcc00]" /> Caution
          </span>
          <span className="flex items-center gap-1.5 text-red-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff3366] animate-pulse" /> Critical
          </span>
        </div>
      </div>

      {/* Main Interactive Stage: Holographic Anatomical Silhouette + Sector Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Sector Cards (Head & Chest) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {[sectors[0], sectors[1]].map(sector => {
            const isSelected = selectedPart === sector.id;
            const isHovered = hoveredPart === sector.id;
            const Icon = sector.icon;

            return (
              <div
                key={sector.id}
                onClick={() => onSelectPart(sector.id)}
                onMouseEnter={() => setHoveredPart(sector.id)}
                onMouseLeave={() => setHoveredPart(null)}
                className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  sector.cfg.bg
                } ${
                  isSelected
                    ? 'border-cyan-400 ring-2 ring-cyan-400/40 bg-cyan-950/40'
                    : `${sector.cfg.border} ${sector.cfg.borderHover}`
                }`}
                style={{
                  boxShadow: isSelected
                    ? '0 0 25px rgba(0, 212, 255, 0.4)'
                    : isHovered
                    ? sector.cfg.glow
                    : 'none',
                  transform: isHovered || isSelected ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-2 rounded-lg border flex items-center justify-center transition-colors"
                      style={{
                        borderColor: sector.cfg.color,
                        background: `${sector.cfg.color}15`,
                      }}
                    >
                      <Icon size={18} style={{ color: sector.cfg.color }} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold tracking-wider uppercase text-white">
                        {sector.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">{sector.sub}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      sector.cfg.badgeBg
                    } ${sector.cfg.pulse}`}
                  >
                    {sector.cfg.badgeText}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 my-3">
                  {sector.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-black/40 border border-white/5 flex flex-col"
                    >
                      <span className="text-[10px] text-slate-400 truncate">{m.label}</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs font-bold font-mono text-cyan-200">
                          {m.value}
                        </span>
                        <span className={`text-[9px] font-mono ${m.ok ? 'text-emerald-400' : 'text-yellow-400'}`}>
                          {m.target}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Microgravity note & CTA */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-[10px] text-slate-400 italic truncate max-w-[200px]">
                    {sector.hazardNote}
                  </span>
                  <span className="text-cyan-400 hover:text-cyan-200 font-bold flex items-center gap-0.5 shrink-0">
                    Open Drawer <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center: Anatomical Vector Body Hologram */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative p-6 rounded-2xl bg-gradient-to-b from-cyan-950/20 via-slate-900/40 to-cyan-950/30 border border-cyan-500/30 backdrop-blur-xl">
          {/* Circular Hologram Base & Grid */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-72 h-72 rounded-full border border-dashed border-cyan-400 animate-spin-slow" />
            <div className="absolute w-56 h-56 rounded-full border border-cyan-400" />
            <div className="absolute w-88 h-88 rounded-full border border-cyan-400/30" />
          </div>

          <div className="relative z-10 w-full max-w-[280px] h-[440px] flex items-center justify-center">
            {/* SVG Astronaut Anatomical Hologram */}
            <svg
              viewBox="0 0 200 400"
              className="w-full h-full filter drop-shadow-[0_0_15px_rgba(0,212,255,0.3)]"
            >
              <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#0d1b3e" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#00ff88" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="scanBeam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* Grid / Coordinate markings */}
              <line x1="100" y1="10" x2="100" y2="390" stroke="#00d4ff" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.3" />
              <line x1="20" y1="60" x2="180" y2="60" stroke="#00d4ff" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.2" />
              <line x1="20" y1="130" x2="180" y2="130" stroke="#00d4ff" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.2" />
              <line x1="20" y1="200" x2="180" y2="200" stroke="#00d4ff" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.2" />
              <line x1="20" y1="300" x2="180" y2="300" stroke="#00d4ff" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.2" />

              {/* ── 1. HEAD SECTOR (Clickable) ── */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectPart('head')}
                onMouseEnter={() => setHoveredPart('head')}
                onMouseLeave={() => setHoveredPart(null)}
              >
                {/* Head Silhouette */}
                <ellipse
                  cx="100"
                  cy="45"
                  rx="24"
                  ry="30"
                  fill={hoveredPart === 'head' || selectedPart === 'head' ? `${headStatus.color}30` : 'rgba(13, 27, 62, 0.7)'}
                  stroke={headStatus.color}
                  strokeWidth={selectedPart === 'head' || hoveredPart === 'head' ? '2.5' : '1.5'}
                  filter={`drop-shadow(0 0 6px ${headStatus.color})`}
                />
                {/* Visor Area */}
                <path
                  d="M 85 40 Q 100 34 115 40 Q 112 55 100 56 Q 88 55 85 40 Z"
                  fill="#00d4ff"
                  opacity="0.5"
                />
                {/* Head Target Ring */}
                <circle
                  cx="100"
                  cy="45"
                  r="34"
                  fill="none"
                  stroke={headStatus.color}
                  strokeWidth="0.75"
                  strokeDasharray="4 3"
                  className={headStatus.pulse ? 'animate-spin-slow' : ''}
                  opacity="0.6"
                />
                <circle cx="100" cy="45" r="3" fill={headStatus.color} />
              </g>

              {/* ── 2. CHEST / CARDIOVASCULAR SECTOR (Clickable) ── */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectPart('chest')}
                onMouseEnter={() => setHoveredPart('chest')}
                onMouseLeave={() => setHoveredPart(null)}
              >
                {/* Torso Chest */}
                <path
                  d="M 72 80 L 128 80 L 122 145 L 78 145 Z"
                  fill={hoveredPart === 'chest' || selectedPart === 'chest' ? `${chestStatus.color}30` : 'rgba(13, 27, 62, 0.7)'}
                  stroke={chestStatus.color}
                  strokeWidth={selectedPart === 'chest' || hoveredPart === 'chest' ? '2.5' : '1.5'}
                  filter={`drop-shadow(0 0 6px ${chestStatus.color})`}
                />
                {/* Heart node */}
                <circle
                  cx="95"
                  cy="110"
                  r="7"
                  fill={`${chestStatus.color}40`}
                  stroke={chestStatus.color}
                  strokeWidth="1.5"
                  className="animate-pulse"
                />
                <circle cx="95" cy="110" r="3" fill={chestStatus.color} />
                {/* Chest ribs indicators */}
                <path d="M 85 100 Q 100 102 115 100" stroke={chestStatus.color} strokeWidth="0.8" opacity="0.5" fill="none" />
                <path d="M 86 115 Q 100 117 114 115" stroke={chestStatus.color} strokeWidth="0.8" opacity="0.5" fill="none" />
                <path d="M 88 130 Q 100 132 112 130" stroke={chestStatus.color} strokeWidth="0.8" opacity="0.5" fill="none" />
              </g>

              {/* ── 3. ABDOMEN / METABOLIC SECTOR (Clickable) ── */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectPart('abdomen')}
                onMouseEnter={() => setHoveredPart('abdomen')}
                onMouseLeave={() => setHoveredPart(null)}
              >
                {/* Abdomen & Pelvis */}
                <path
                  d="M 78 148 L 122 148 L 118 195 L 82 195 Z"
                  fill={hoveredPart === 'abdomen' || selectedPart === 'abdomen' ? `${abdomenStatus.color}30` : 'rgba(13, 27, 62, 0.7)'}
                  stroke={abdomenStatus.color}
                  strokeWidth={selectedPart === 'abdomen' || hoveredPart === 'abdomen' ? '2.5' : '1.5'}
                  filter={`drop-shadow(0 0 6px ${abdomenStatus.color})`}
                />
                {/* Metabolic core node */}
                <circle
                  cx="100"
                  cy="170"
                  r="6"
                  fill={`${abdomenStatus.color}40`}
                  stroke={abdomenStatus.color}
                  strokeWidth="1.2"
                />
                <circle cx="100" cy="170" r="2.5" fill={abdomenStatus.color} />
              </g>

              {/* ── 4. MUSCULOSKELETAL / LIMBS SECTOR (Clickable) ── */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectPart('musculoskeletal')}
                onMouseEnter={() => setHoveredPart('musculoskeletal')}
                onMouseLeave={() => setHoveredPart(null)}
              >
                {/* Left Arm */}
                <path
                  d="M 70 82 L 48 140 L 42 190 L 48 192 L 56 145 L 75 88 Z"
                  fill={hoveredPart === 'musculoskeletal' || selectedPart === 'musculoskeletal' ? `${musculoStatus.color}25` : 'rgba(13, 27, 62, 0.6)'}
                  stroke={musculoStatus.color}
                  strokeWidth={selectedPart === 'musculoskeletal' || hoveredPart === 'musculoskeletal' ? '2' : '1.2'}
                />
                {/* Right Arm */}
                <path
                  d="M 130 82 L 152 140 L 158 190 L 152 192 L 144 145 L 125 88 Z"
                  fill={hoveredPart === 'musculoskeletal' || selectedPart === 'musculoskeletal' ? `${musculoStatus.color}25` : 'rgba(13, 27, 62, 0.6)'}
                  stroke={musculoStatus.color}
                  strokeWidth={selectedPart === 'musculoskeletal' || hoveredPart === 'musculoskeletal' ? '2' : '1.2'}
                />
                {/* Left Leg */}
                <path
                  d="M 82 198 L 76 280 L 72 360 L 84 362 L 90 282 L 96 198 Z"
                  fill={hoveredPart === 'musculoskeletal' || selectedPart === 'musculoskeletal' ? `${musculoStatus.color}25` : 'rgba(13, 27, 62, 0.6)'}
                  stroke={musculoStatus.color}
                  strokeWidth={selectedPart === 'musculoskeletal' || hoveredPart === 'musculoskeletal' ? '2' : '1.2'}
                />
                {/* Right Leg */}
                <path
                  d="M 118 198 L 124 280 L 128 360 L 116 362 L 110 282 L 104 198 Z"
                  fill={hoveredPart === 'musculoskeletal' || selectedPart === 'musculoskeletal' ? `${musculoStatus.color}25` : 'rgba(13, 27, 62, 0.6)'}
                  stroke={musculoStatus.color}
                  strokeWidth={selectedPart === 'musculoskeletal' || hoveredPart === 'musculoskeletal' ? '2' : '1.2'}
                />
                {/* Joint Nodes (Shoulders, Knees) */}
                <circle cx="70" cy="85" r="3" fill={musculoStatus.color} />
                <circle cx="130" cy="85" r="3" fill={musculoStatus.color} />
                <circle cx="80" cy="280" r="3.5" fill={musculoStatus.color} />
                <circle cx="120" cy="280" r="3.5" fill={musculoStatus.color} />
              </g>

              {/* Animated HUD Vertical Scan Line */}
              <line x1="20" y1="0" x2="180" y2="0" stroke="url(#scanBeam)" strokeWidth="4">
                <animate
                  attributeName="y1"
                  values="20;380;20"
                  dur="5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="20;380;20"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </line>
            </svg>
          </div>

          {/* Hologram Bottom Status pill */}
          <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>REALTIME FULL-BODY BIOMETRIC SCAN</span>
          </div>
        </div>

        {/* Right Sector Cards (Abdomen & Musculoskeletal) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {[sectors[2], sectors[3]].map(sector => {
            const isSelected = selectedPart === sector.id;
            const isHovered = hoveredPart === sector.id;
            const Icon = sector.icon;

            return (
              <div
                key={sector.id}
                onClick={() => onSelectPart(sector.id)}
                onMouseEnter={() => setHoveredPart(sector.id)}
                onMouseLeave={() => setHoveredPart(null)}
                className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  sector.cfg.bg
                } ${
                  isSelected
                    ? 'border-cyan-400 ring-2 ring-cyan-400/40 bg-cyan-950/40'
                    : `${sector.cfg.border} ${sector.cfg.borderHover}`
                }`}
                style={{
                  boxShadow: isSelected
                    ? '0 0 25px rgba(0, 212, 255, 0.4)'
                    : isHovered
                    ? sector.cfg.glow
                    : 'none',
                  transform: isHovered || isSelected ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-2 rounded-lg border flex items-center justify-center transition-colors"
                      style={{
                        borderColor: sector.cfg.color,
                        background: `${sector.cfg.color}15`,
                      }}
                    >
                      <Icon size={18} style={{ color: sector.cfg.color }} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold tracking-wider uppercase text-white">
                        {sector.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">{sector.sub}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      sector.cfg.badgeBg
                    } ${sector.cfg.pulse}`}
                  >
                    {sector.cfg.badgeText}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 my-3">
                  {sector.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-black/40 border border-white/5 flex flex-col"
                    >
                      <span className="text-[10px] text-slate-400 truncate">{m.label}</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs font-bold font-mono text-cyan-200">
                          {m.value}
                        </span>
                        <span className={`text-[9px] font-mono ${m.ok ? 'text-emerald-400' : 'text-yellow-400'}`}>
                          {m.target}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Microgravity note & CTA */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-[10px] text-slate-400 italic truncate max-w-[200px]">
                    {sector.hazardNote}
                  </span>
                  <span className="text-cyan-400 hover:text-cyan-200 font-bold flex items-center gap-0.5 shrink-0">
                    Open Drawer <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
