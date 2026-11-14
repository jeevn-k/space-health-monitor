import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Flame,
  Award,
  Zap,
  Clock,
  Sparkles,
  Dumbbell,
  Brain,
  Stethoscope,
  Wrench,
  CheckCircle2,
  TrendingUp,
  Target
} from 'lucide-react';

export default function RoutineTracker({
  checklistItems = [],
  streakData = {},
  onToggleChecklist,
  missionDay = 142,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Physical', 'Cognitive', 'Medical', 'Equipment'];

  const filteredItems =
    selectedCategory === 'All'
      ? checklistItems
      : checklistItems.filter(item => item.category === selectedCategory);

  const completedCount = checklistItems.filter(i => i.completed).length;
  const totalCount = checklistItems.length;
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  const streaks = [
    { label: 'ARED Resistance', count: streakData.exercise ?? 12, unit: 'Days', color: '#00ff88', icon: Dumbbell },
    { label: '2.5L Hydration', count: streakData.hydration ?? 8, unit: 'Days', color: '#00d4ff', icon: Target },
    { label: 'Sleep Target (7h)', count: streakData.sleep ?? 4, unit: 'Days', color: '#a855f7', icon: Flame },
    { label: 'Ocular SANS Check', count: streakData.eyeCheck ?? 21, unit: 'Days', color: '#ffcc00', icon: Sparkles },
    { label: 'Flight Surgeon Log', count: streakData.medicalLog ?? 142, unit: 'Days', color: '#00d4ff', icon: Award },
  ];

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Physical': return Dumbbell;
      case 'Cognitive': return Brain;
      case 'Medical': return Stethoscope;
      case 'Equipment': return Wrench;
      default: return CheckSquare;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-mono text-slate-100">
      {/* Header & Overall Mission Routine Score */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-bold uppercase">
              Mission Day {missionDay} Protocol
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <Flame size={12} /> CREW STREAK ACTIVE
            </span>
          </div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Daily Preventive Health & Countermeasure Regimen
          </h3>
          <p className="text-xs text-slate-400">
            Microgravity countermeasure adherence directly mitigates neuro-vestibular and bone mineral degradation.
          </p>
        </div>

        {/* Circular Progress Gauge */}
        <div className="flex items-center gap-4 p-2.5 px-4 rounded-xl bg-black/40 border border-white/10">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 transition-all duration-700"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-cyan-300">
              {progressPercent}%
            </span>
          </div>

          <div>
            <div className="text-xs font-bold text-white">
              {completedCount} of {totalCount} Completed
            </div>
            <div className="text-[10px] text-emerald-400 font-bold">
              {progressPercent >= 80 ? 'Peak Adherence' : 'Protocols Pending'}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5 Circular Streak Counters ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {streaks.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col items-center text-center gap-2 hover:border-cyan-500/40 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border"
                style={{
                  borderColor: s.color,
                  backgroundColor: `${s.color}15`,
                  boxShadow: `0 0 12px ${s.color}30`,
                }}
              >
                <Icon size={18} style={{ color: s.color }} />
              </div>

              <div>
                <div className="text-xl font-bold font-mono" style={{ color: s.color }}>
                  {s.count}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                  {s.unit} Streak
                </div>
              </div>

              <span className="text-[10px] text-slate-300 font-semibold truncate w-full">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Weekly Gamified Mission Challenge ── */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-slate-900/60 border border-purple-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Award size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                WEEK 21 MISSION CHALLENGE
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 font-bold">
                +450 CREW XP
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">
              Zero-G Resistance Optimization & LBNP Synchrony
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Complete 6 consecutive ARED resistance sessions with zero missed Lower Body Negative Pressure cycles.
            </p>
          </div>
        </div>

        <div className="w-full md:w-56 flex flex-col gap-1.5 shrink-0">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Challenge Progress</span>
            <span className="text-purple-300 font-bold">5 / 6 Days (83%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-purple-500/30">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_10px_#a855f7]"
              style={{ width: '83%' }}
            />
          </div>
        </div>
      </div>

      {/* ── Daily Preventive Care Checklist ── */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Preventive Care Daily Checklist
            </h4>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/50 border border-white/10 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded transition-colors text-xs ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map(item => {
            const Icon = getCategoryIcon(item.category);
            return (
              <div
                key={item.id}
                onClick={() => onToggleChecklist?.(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                  item.completed
                    ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
                    : 'border-white/10 bg-slate-950/40 hover:border-cyan-500/40'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 focus:outline-none"
                  aria-label={item.completed ? 'Mark uncompleted' : 'Mark completed'}
                >
                  {item.completed ? (
                    <CheckCircle2 size={18} className="text-emerald-400 fill-emerald-400/20" />
                  ) : (
                    <Square size={18} className="text-slate-500 hover:text-cyan-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold ${
                        item.completed ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {item.task}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/50 border border-white/10 text-cyan-300 uppercase shrink-0">
                      {item.frequency}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {item.duration}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Icon size={11} className="text-cyan-400" /> {item.category}
                    </span>
                    {item.completed && item.timestamp && (
                      <span className="text-emerald-400 ml-auto font-bold">
                        Logged {item.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
