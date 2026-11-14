import { useEffect, useRef, useState } from 'react';
import { Shield } from 'lucide-react';

// ── Animated radar/satellite SVG icon ──────────────────────────────────────
function RadarIcon() {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Outer ring */}
      <circle cx="26" cy="26" r="24" stroke="#00d4ff" strokeWidth="1" strokeDasharray="4 3" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="0 26 26" to="360 26 26" dur="8s" repeatCount="indefinite" />
      </circle>
      {/* Mid ring */}
      <circle cx="26" cy="26" r="16" stroke="#00d4ff" strokeWidth="1" opacity="0.35" />
      {/* Inner ring */}
      <circle cx="26" cy="26" r="8" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
      {/* Centre dot */}
      <circle cx="26" cy="26" r="2.5" fill="#00d4ff" />
      {/* Sweep arm */}
      <line x1="26" y1="26" x2="26" y2="4" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" opacity="0.9">
        <animateTransform attributeName="transform" type="rotate" from="0 26 26" to="360 26 26" dur="3s" repeatCount="indefinite" />
      </line>
      {/* Blip */}
      <circle cx="26" cy="10" r="2" fill="#00ff88" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.1;0.8" dur="3s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="rotate" from="0 26 26" to="360 26 26" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Cross-hairs */}
      <line x1="26" y1="2" x2="26" y2="6" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
      <line x1="26" y1="46" x2="26" y2="50" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
      <line x1="2" y1="26" x2="6" y2="26" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
      <line x1="46" y1="26" x2="50" y2="26" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

// ── Formats seconds → MM:SS ────────────────────────────────────────────────
function formatDelay(seconds) {
  if (seconds == null || isNaN(seconds)) return '--:--';
  const m = Math.floor(Math.abs(seconds) / 60);
  const s = Math.floor(Math.abs(seconds) % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ── Crew Health Index colour ───────────────────────────────────────────────
function healthColor(index) {
  if (index >= 85) return { text: 'text-neon-green', glow: '#00ff88' };
  if (index >= 65) return { text: 'text-yellow-400', glow: '#ffcc00' };
  return { text: 'text-neon-red', glow: '#ff3366' };
}

// ── Scanline overlay (pure Tailwind + inline style) ────────────────────────
const scanlineStyle = {
  backgroundImage:
    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.025) 2px, rgba(0,212,255,0.025) 4px)',
  pointerEvents: 'none',
};

// ══════════════════════════════════════════════════════════════════════════
export default function MissionHeader({ missionData, communicationDelay, crewHealthIndex }) {
  const phase        = missionData?.missionPhase  ?? 'AUTONOMOUS DEEP-SPACE TRANSIT';
  const missionDay   = missionData?.missionDay    ?? 142;
  const chi          = crewHealthIndex            ?? 87;
  const delay        = communicationDelay         ?? 1320; // seconds
  const hc           = healthColor(chi);

  // Live countdown ticker (counts down within the current minute, then wraps)
  const [tick, setTick] = useState(delay);
  useEffect(() => {
    setTick(delay);
    const id = setInterval(() => setTick(t => (t > 0 ? t - 1 : delay)), 1000);
    return () => clearInterval(id);
  }, [delay]);

  return (
    <header
      className="relative w-full overflow-hidden font-mono"
      style={{
        background: 'linear-gradient(to right, #02050f, #060d1f, #0d1b3e)',
        borderBottom: '1px solid rgba(0,212,255,0.3)',
        boxShadow: '0 2px 32px rgba(0,212,255,0.12)',
      }}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 z-0" style={scanlineStyle} />

      {/* Corner decorations */}
      <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-blue/60 z-10" />
      <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-neon-blue/60 z-10" />
      <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-neon-blue/60 z-10" />
      <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-blue/60 z-10" />

      <div className="relative z-10 px-6 py-4 flex flex-col gap-4">

        {/* ── Row 1: Icon + Title ── */}
        <div className="flex items-center gap-4">
          <RadarIcon />

          <div className="flex flex-col">
            <span
              className="text-2xl font-bold tracking-[0.25em] uppercase text-neon-blue"
              style={{ textShadow: '0 0 12px #00d4ff, 0 0 24px #00d4ff55' }}
            >
              ARTEMIS-7 MISSION CONTROL
            </span>
            <span className="text-xs tracking-widest text-neon-blue/50 mt-0.5">
              NASA HUMAN RESEARCH PROGRAM — AUTONOMOUS HEALTH MONITOR v4.1
            </span>
          </div>

          {/* NASA logo stub (top-right) */}
          <div className="ml-auto flex items-center gap-2 opacity-60">
            <span className="text-xs tracking-widest text-neon-blue/70 uppercase">NASA / HRP</span>
          </div>
        </div>

        {/* ── Row 2: Status pills ── */}
        <div className="flex flex-wrap gap-3 items-center">

          {/* Mission Phase */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs border border-neon-green/40 bg-neon-green/5"
            style={{ boxShadow: '0 0 10px rgba(0,255,136,0.2)' }}
          >
            <span
              className="w-2 h-2 rounded-full bg-neon-green animate-pulse"
              style={{ boxShadow: '0 0 6px #00ff88' }}
            />
            <span className="text-neon-green/70 uppercase tracking-widest">Phase</span>
            <span
              className="text-neon-green font-bold tracking-wider uppercase"
              style={{ textShadow: '0 0 8px #00ff88' }}
            >
              {phase}
            </span>
          </div>

          {/* Comm Delay */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs border border-neon-blue/40 bg-neon-blue/5"
            style={{ boxShadow: '0 0 10px rgba(0,212,255,0.15)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#00d4ff" strokeWidth="1" />
              <path d="M6 3v3l2 1.5" stroke="#00d4ff" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span className="text-neon-blue/60 uppercase tracking-widest">Comm Delay</span>
            <span className="text-neon-blue font-bold tabular-nums" style={{ textShadow: '0 0 8px #00d4ff' }}>
              {formatDelay(tick)}
            </span>
          </div>

          {/* Mission Day */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs border border-yellow-400/40 bg-yellow-400/5"
            style={{ boxShadow: '0 0 10px rgba(255,204,0,0.15)' }}
          >
            <span className="text-yellow-400/60 uppercase tracking-widest">Mission Day</span>
            <span className="text-yellow-400 font-bold" style={{ textShadow: '0 0 8px #ffcc00' }}>
              Day {missionDay}
            </span>
          </div>

          {/* Crew Health Index */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs border ${
              chi >= 85 ? 'border-neon-green/40 bg-neon-green/5' :
              chi >= 65 ? 'border-yellow-400/40 bg-yellow-400/5' :
                          'border-red-500/40 bg-red-500/5'
            }`}
            style={{ boxShadow: `0 0 10px ${hc.glow}30` }}
          >
            <span className="text-neon-blue/60 uppercase tracking-widest">Crew Health</span>
            <span
              className={`font-bold ${hc.text}`}
              style={{ textShadow: `0 0 8px ${hc.glow}` }}
            >
              {chi}%
            </span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                chi >= 85 ? 'bg-neon-green/20 text-neon-green' :
                chi >= 65 ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
              }`}
            >
              {chi >= 85 ? 'NOMINAL' : chi >= 65 ? 'CAUTION' : 'CRITICAL'}
            </span>
          </div>

          {/* Offline-first badge — bottom-right */}
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-neon-purple/40 bg-neon-purple/5"
            style={{ boxShadow: '0 0 8px rgba(168,85,247,0.2)' }}
          >
            <Shield size={12} className="text-purple-400" />
            <span className="text-purple-400 uppercase tracking-widest font-bold">Offline-First Processing</span>
          </div>
        </div>
      </div>
    </header>
  );
}
