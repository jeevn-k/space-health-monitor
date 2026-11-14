import React, { useState, useMemo } from 'react';
import {
  Activity,
  BarChart3,
  CheckSquare,
  Sliders,
  Radio,
  Shield,
  Clock,
  Database,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

// Components
import MissionHeader from './components/MissionHeader.jsx';
import BodyMap from './components/BodyMap.jsx';
import DiagnosticDrawer from './components/DiagnosticDrawer.jsx';
import AlertPanel from './components/AlertPanel.jsx';
import InputPanel from './components/InputPanel.jsx';
import MetricsCharts from './components/MetricsCharts.jsx';
import RoutineTracker from './components/RoutineTracker.jsx';
import CrewPanel from './components/CrewPanel.jsx';

// Hooks & Data
import { useHealthStore } from './hooks/useHealthStore.js';
import {
  MISSION_DATA,
  ASTRONAUTS,
  generateTimeSeriesData
} from './data/mockData.js';
import { getBodyPartStatus } from './utils/decisionEngine.js';

export default function App() {
  const {
    currentMetrics,
    alerts,
    checklistItems,
    streakData,
    selectedBodyPart,
    isDrawerOpen,
    activeTab,
    commDelay,
    missionElapsed,
    lastSync,
    crewHealthIndex,
    updateMetric,
    logDataPoint,
    toggleBodyPart,
    closeDrawer,
    setActiveTab,
    toggleChecklist,
    dismissAlert,
    formatCommDelay,
    formatElapsed,
  } = useHealthStore();

  const [selectedAstronaut, setSelectedAstronaut] = useState(ASTRONAUTS[0]);

  // Generate 180-day time series data for analytics
  const timeSeriesData = useMemo(() => generateTimeSeriesData(180), []);

  // Compute status for each of the 4 anatomical sectors
  const bodyPartStatuses = useMemo(() => {
    return {
      head: getBodyPartStatus('head', currentMetrics),
      chest: getBodyPartStatus('chest', currentMetrics),
      abdomen: getBodyPartStatus('abdomen', currentMetrics),
      musculoskeletal: getBodyPartStatus('musculoskeletal', currentMetrics),
    };
  }, [currentMetrics]);

  const elapsed = formatElapsed(missionElapsed);

  return (
    <div className="min-h-screen bg-[#02050f] text-slate-100 font-mono flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background CRT scanline overlay */}
      <div className="fixed inset-0 pointer-events-none scanline-overlay z-40" />

      {/* ── 1. Mission Control Header ── */}
      <MissionHeader
        missionData={MISSION_DATA}
        communicationDelay={commDelay}
        crewHealthIndex={crewHealthIndex}
      />

      {/* ── 2. Primary Layout ── */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity size={14} />
              Vitals Anatomical Map
            </button>

            <button
              onClick={() => setActiveTab('trends')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTab === 'trends'
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 size={14} />
              Historical Analytics & Drift
            </button>

            <button
              onClick={() => setActiveTab('routine')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTab === 'routine'
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <CheckSquare size={14} />
              Habits & Mission Protocols
            </button>

            <button
              onClick={() => setActiveTab('input')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTab === 'input'
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders size={14} />
              Multi-Modal Telemetry Input
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-cyan-400" />
              MET: <span className="text-white font-bold">{elapsed.days}d {String(elapsed.hrs).padStart(2, '0')}:{String(elapsed.mins).padStart(2, '0')}:{String(elapsed.secs).padStart(2, '0')}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <Database size={12} className="text-emerald-400" />
              Synced: <span className="text-white font-bold">{lastSync}</span>
            </span>
          </div>
        </div>

        {/* 3-Column Grid Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Crew Telemetry Roster */}
          <div className="lg:col-span-3 xl:col-span-2 flex flex-col gap-4">
            <CrewPanel
              astronauts={ASTRONAUTS}
              selectedAstronaut={selectedAstronaut}
              onSelectAstronaut={setSelectedAstronaut}
            />

            {/* Quick Vehicle Life Support Status Widget */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-white/10 text-cyan-400 font-bold">
                <span>ECLSS Cabin Telemetry</span>
                <span className="text-emerald-400 text-[10px]">NOMINAL</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Cabin Pressure:</span>
                <span className="font-bold text-white">14.7 psi (101.3 kPa)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Cabin O2 Partial:</span>
                <span className="font-bold text-emerald-400">21.2%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Cabin CO2 Scrubber:</span>
                <span className="font-bold text-white">0.24% (Low)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Ambient Temp:</span>
                <span className="font-bold text-white">21.5 °C</span>
              </div>
            </div>
          </div>

          {/* Center Column: Dynamic View Based on Active Tab */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
            {activeTab === 'dashboard' && (
              <BodyMap
                bodyPartStatuses={bodyPartStatuses}
                currentMetrics={currentMetrics}
                onSelectPart={toggleBodyPart}
                selectedPart={selectedBodyPart}
              />
            )}

            {activeTab === 'trends' && (
              <MetricsCharts
                timeSeriesData={timeSeriesData}
                currentMetrics={currentMetrics}
              />
            )}

            {activeTab === 'routine' && (
              <RoutineTracker
                checklistItems={checklistItems}
                streakData={streakData}
                onToggleChecklist={toggleChecklist}
                missionDay={MISSION_DATA.currentDay}
              />
            )}

            {activeTab === 'input' && (
              <InputPanel
                onUpdateMetric={updateMetric}
                currentMetrics={currentMetrics}
                onLogData={logDataPoint}
              />
            )}
          </div>

          {/* Right Column: Live Clinical Hazard Engine Feed */}
          <div className="lg:col-span-3 xl:col-span-3 flex flex-col gap-4">
            <AlertPanel
              alerts={alerts}
              onDismiss={dismissAlert}
              onSelectPart={toggleBodyPart}
            />

            {/* Offline-First Autonomous Decision Matrix Notice */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-slate-300 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-purple-300 uppercase tracking-wider">
                <Shield size={14} className="text-purple-400" />
                Autonomous Deep-Space Protocol
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Earth ground control communication currently exhibits a <span className="text-cyan-300 font-bold">{formatCommDelay(commDelay)}</span> one-way speed-of-light delay.
                All clinical decisions and countermeasure alerts are evaluated locally by the on-board NASA HRP expert engine.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── 3. Diagnostic Deep-Dive Drawer ── */}
      <DiagnosticDrawer
        isOpen={isDrawerOpen}
        bodyPart={selectedBodyPart}
        healthData={currentMetrics}
        onClose={closeDrawer}
        alerts={alerts}
        onUpdateMetric={updateMetric}
      />

      {/* ── 4. Fixed Bottom Status Bar ── */}
      <footer className="w-full border-t border-cyan-500/20 bg-slate-950/90 backdrop-blur-md px-6 py-2.5 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono z-30">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <Cpu size={12} className="text-cyan-400" />
            ISV Perseverance II Primary Medical Server: <span className="text-emerald-400 font-bold">ONLINE</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-400">
            Deep Space Network (DSN) Canberra Link: <span className="text-yellow-400">19m 42s Latency</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40 font-bold">
            NASA SPACE APPS CHALLENGE 2026
          </span>
          <span className="text-slate-500">v4.1.0-STABLE</span>
        </div>
      </footer>
    </div>
  );
}
