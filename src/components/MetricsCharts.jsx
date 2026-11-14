import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  Heart,
  Moon,
  Dumbbell,
  AlertTriangle,
  Info
} from 'lucide-react';
import { HEALTH_THRESHOLDS } from '../data/mockData.js';

// Custom Dark Glassmorphism Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-lg bg-slate-950/95 border border-cyan-500/40 font-mono text-xs shadow-[0_0_15px_rgba(0,212,255,0.2)] backdrop-blur-md">
        <p className="font-bold text-cyan-300 border-b border-white/10 pb-1 mb-1.5 uppercase">
          {label}
        </p>
        <div className="flex flex-col gap-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-bold font-mono" style={{ color: entry.color }}>
                {entry.value} {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function MetricsCharts({
  timeSeriesData = [],
  currentMetrics = {},
}) {
  const [dayRange, setDayRange] = useState(60); // 30, 60, 90, 180

  // Filter time series data based on chosen day range
  const filteredData = timeSeriesData.slice(0, dayRange);

  return (
    <div className="w-full flex flex-col gap-6 font-mono text-slate-100">
      {/* Analytics Header & Range Selector */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-cyan-400" />
            Long-Duration Physiological Drift & Trajectory Analytics
          </h3>
          <p className="text-[11px] text-slate-400">
            Microgravity adaptation trends from Day 1 to Day {dayRange} of Mars transit. Catch progressive degradation early.
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/50 border border-white/10 text-xs">
          <span className="text-[10px] text-slate-400 px-2 flex items-center gap-1">
            <Calendar size={12} /> Horizon:
          </span>
          {[30, 60, 90, 180].map(days => (
            <button
              key={days}
              onClick={() => setDayRange(days)}
              className={`px-2.5 py-1 rounded transition-all text-xs ${
                dayRange === days
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* 2x2 Grid of Detailed Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── PANEL 1: Cardiovascular Dynamics (LineChart Dual-Axis) ── */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-cyan-500/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Cardiovascular Telemetry & SpO2
              </h4>
            </div>
            <span className="text-[10px] text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              DUAL AXIS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#132252" opacity={0.6} />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" domain={[50, 110]} stroke="#00d4ff" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" domain={[90, 100]} stroke="#00ff88" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine y={100} yAxisId="left" stroke="#ff3366" strokeDasharray="3 3" label={{ value: 'Tachycardia', fill: '#ff3366', fontSize: 9 }} />
                <ReferenceLine y={95} yAxisId="right" stroke="#ffcc00" strokeDasharray="3 3" label={{ value: 'Hypoxia Min', fill: '#ffcc00', fontSize: 9 }} />
                <Line yAxisId="left" type="monotone" dataKey="heartRate" name="Heart Rate (bpm)" stroke="#00d4ff" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="spo2" name="Blood Oxygen (%)" stroke="#00ff88" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── PANEL 2: Sleep & Behavioral Health (AreaChart + Line) ── */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-cyan-500/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon size={16} className="text-purple-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Circadian Sleep & Behavioral Morale
              </h4>
            </div>
            <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              FATIGUE RISK
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#132252" opacity={0.6} />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 10]} stroke="#a855f7" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine y={5.0} stroke="#ff3366" strokeDasharray="3 3" label={{ value: 'Critical Sleep (5h)', fill: '#ff3366', fontSize: 9 }} />
                <Area type="monotone" dataKey="sleepHours" name="Sleep (Hours)" stroke="#a855f7" fillOpacity={1} fill="url(#sleepColor)" strokeWidth={2} />
                <Line type="monotone" dataKey="moodRating" name="Mood Rating (/10)" stroke="#ffcc00" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── PANEL 3: Metabolic & Radiation Load (ComposedChart) ── */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-cyan-500/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Metabolic Glycemia & Cosmic Radiation
              </h4>
            </div>
            <span className="text-[10px] text-yellow-300 bg-yellow-950/60 px-2 py-0.5 rounded border border-yellow-800/40">
              BIO-STRESS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#132252" opacity={0.6} />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="glucose" domain={[60, 160]} stroke="#f59e0b" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="rad" orientation="right" domain={[0, 5]} stroke="#ff3366" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine y={2.0} yAxisId="rad" stroke="#ff3366" strokeDasharray="3 3" label={{ value: 'Weekly Rad Limit', fill: '#ff3366', fontSize: 9 }} />
                <Bar yAxisId="glucose" dataKey="bloodSugar" name="Glucose (mg/dL)" fill="#f59e0b" opacity={0.6} barSize={8} />
                <Line yAxisId="rad" type="monotone" dataKey="radiationDose" name="Radiation (mSv/wk)" stroke="#ff3366" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── PANEL 4: Musculoskeletal Demineralization (Area & Line) ── */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-cyan-500/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell size={16} className="text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Musculoskeletal Atrophy & Bone Loss
              </h4>
            </div>
            <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              ARED COMPLIANCE
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="exerciseColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#132252" opacity={0.6} />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#00ff88" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine y={60} stroke="#ffcc00" strokeDasharray="3 3" label={{ value: 'Min Compliance (60%)', fill: '#ffcc00', fontSize: 9 }} />
                <Area type="monotone" dataKey="exerciseCompliance" name="Exercise Compliance (%)" stroke="#00ff88" fill="url(#exerciseColor)" strokeWidth={2} />
                <Line type="monotone" dataKey="boneDensityLoss" name="Cumulative Bone Loss (%)" stroke="#ff3366" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="muscleMass" name="Muscle Mass Retention (%)" stroke="#00d4ff" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Trajectory Forecast & Clinical Drift Summary Table ── */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-cyan-500/30 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Info size={14} className="text-cyan-400" />
            30-Day Trajectory Drift & Autonomous Risk Stratification
          </span>
          <span className="text-[10px] text-slate-400">
            COMPARED AGAINST PRE-FLIGHT BASELINE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase text-slate-400">
                <th className="py-2.5 px-3">Physiological System</th>
                <th className="py-2.5 px-3">Current Metric</th>
                <th className="py-2.5 px-3">Baseline</th>
                <th className="py-2.5 px-3">30-Day Drift</th>
                <th className="py-2.5 px-3">Microgravity Etiology</th>
                <th className="py-2.5 px-3 text-right">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5">
                <td className="py-2.5 px-3 font-semibold text-slate-200">Resting Heart Rate</td>
                <td className="py-2.5 px-3 font-bold text-cyan-300">{currentMetrics.heartRate ?? 72} bpm</td>
                <td className="py-2.5 px-3 text-slate-400">62 bpm</td>
                <td className="py-2.5 px-3 text-yellow-400 font-bold flex items-center gap-1">
                  <TrendingUp size={13} /> +10 bpm
                </td>
                <td className="py-2.5 px-3 text-slate-400 text-[11px]">Stroke volume loss from cephalad fluid shift</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 text-[10px] font-bold">
                    MODERATE
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-white/5">
                <td className="py-2.5 px-3 font-semibold text-slate-200">Sleep Duration</td>
                <td className="py-2.5 px-3 font-bold text-cyan-300">{currentMetrics.sleepHours ?? 6.2} hrs</td>
                <td className="py-2.5 px-3 text-slate-400">7.8 hrs</td>
                <td className="py-2.5 px-3 text-yellow-400 font-bold flex items-center gap-1">
                  <TrendingDown size={13} /> -1.6 hrs
                </td>
                <td className="py-2.5 px-3 text-slate-400 text-[11px]">Circadian disruption & acoustic cabin noise</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 text-[10px] font-bold">
                    MODERATE
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-white/5">
                <td className="py-2.5 px-3 font-semibold text-slate-200">Bone Mineral Density</td>
                <td className="py-2.5 px-3 font-bold text-cyan-300">-{currentMetrics.boneDensityLoss ?? 3.2}%</td>
                <td className="py-2.5 px-3 text-slate-400">0.0%</td>
                <td className="py-2.5 px-3 text-red-400 font-bold flex items-center gap-1">
                  <TrendingDown size={13} /> -0.8% / mo
                </td>
                <td className="py-2.5 px-3 text-slate-400 text-[11px]">Absence of gravitational osteoblast stimulation</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold">
                    ELEVATED
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-white/5">
                <td className="py-2.5 px-3 font-semibold text-slate-200">SpO2 (Pulse Oximetry)</td>
                <td className="py-2.5 px-3 font-bold text-cyan-300">{currentMetrics.spo2 ?? 97.4}%</td>
                <td className="py-2.5 px-3 text-slate-400">98.5%</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold flex items-center gap-1">
                  <span>→</span> -1.1%
                </td>
                <td className="py-2.5 px-3 text-slate-400 text-[11px]">Adequate cabin ventilation and scrubbers</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    NOMINAL
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-white/5">
                <td className="py-2.5 px-3 font-semibold text-slate-200">Cumulative Radiation</td>
                <td className="py-2.5 px-3 font-bold text-cyan-300">{currentMetrics.radiationDose ?? 1.8} mSv/wk</td>
                <td className="py-2.5 px-3 text-slate-400">0.05 mSv</td>
                <td className="py-2.5 px-3 text-yellow-400 font-bold flex items-center gap-1">
                  <TrendingUp size={13} /> High GCR
                </td>
                <td className="py-2.5 px-3 text-slate-400 text-[11px]">Interplanetary galactic cosmic ray flux</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 text-[10px] font-bold">
                    MONITORED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
