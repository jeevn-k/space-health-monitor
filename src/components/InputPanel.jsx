import React, { useState } from 'react';
import {
  Sliders,
  Radio,
  Camera,
  Activity,
  Heart,
  Moon,
  Droplets,
  Thermometer,
  Zap,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  Eye,
  FileSearch,
  Check
} from 'lucide-react';
import { HEALTH_THRESHOLDS, SENSOR_FEEDS } from '../data/mockData.js';
import { getMetricStatus } from '../utils/decisionEngine.js';

export default function InputPanel({
  onUpdateMetric,
  currentMetrics = {},
  onLogData,
}) {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'sensors' | 'imaging'
  const [logSuccess, setLogSuccess] = useState(false);

  // Imaging state
  const [selectedScanType, setSelectedScanType] = useState('sans');
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState(null);

  // Handle manual input change
  const handleSliderChange = (metric, val) => {
    onUpdateMetric(metric, parseFloat(val));
  };

  const handleLogSubmit = (e) => {
    e.preventDefault();
    onLogData?.();
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 2500);
  };

  // Anomaly injection presets for testing clinical engine
  const injectAnomaly = (type) => {
    switch (type) {
      case 'radiation':
        onUpdateMetric('radiationDose', 4.8);
        break;
      case 'hypoxia':
        onUpdateMetric('spo2', 88.5);
        onUpdateMetric('heartRate', 108);
        break;
      case 'sans':
        onUpdateMetric('sansRisk', 48);
        onUpdateMetric('sleepHours', 4.2);
        onUpdateMetric('moodRating', 3);
        break;
      case 'nominal':
        onUpdateMetric('heartRate', 72);
        onUpdateMetric('bloodPressureSys', 120);
        onUpdateMetric('bloodPressureDia', 78);
        onUpdateMetric('spo2', 98.2);
        onUpdateMetric('sleepHours', 7.4);
        onUpdateMetric('bloodSugar', 95);
        onUpdateMetric('coreTemp', 36.8);
        onUpdateMetric('hydration', 82);
        onUpdateMetric('moodRating', 8);
        onUpdateMetric('exerciseCompliance', 85);
        onUpdateMetric('radiationDose', 0.8);
        onUpdateMetric('sansRisk', 12);
        break;
      default:
        break;
    }
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 2500);
  };

  // Sample Scans for Imaging Mock
  const sampleScans = {
    sans: {
      name: 'Ocular Ultrasound (Posterior Globe)',
      organ: 'Optic Nerve & Retina',
      simulatedFinding:
        'Optic Nerve Sheath Diameter (ONSD) measured at 6.4mm (Threshold: >5.8mm indicates elevated intracranial pressure). Mild optic disc protrusion detected. Grade 2 SANS positive.',
      confidence: 94.2,
      risk: 'warning',
      action: 'Schedule LBNP session (30 mmHg x 2 hrs). Repeat scan in 48 hours.',
    },
    radiation: {
      name: 'Dermatoscope Erythema Assessment',
      organ: 'Dermal / Cutaneous Radiation',
      simulatedFinding:
        'Sub-epidermal vascular dilation observed on forearm region. Secondary to high-Z solar cosmic particle flux. No blistering or ulceration.',
      confidence: 91.8,
      risk: 'warning',
      action: 'Apply topical antioxidant hydrogel. Relocate to shielded quarters.',
    },
    pupil: {
      name: 'Pupil Infrared Saccadometry',
      organ: 'Oculomotor & Neurological Reflex',
      simulatedFinding:
        'Saccadic latency prolonged by 38ms compared to pre-launch baseline. Cognitive fatigue index consistent with circadian desynchrony.',
      confidence: 96.5,
      risk: 'warning',
      action: 'Mandatory rest block. Suspend EVA robotic manipulator arm duty.',
    },
  };

  const handleSimulateScan = (typeKey) => {
    setSelectedScanType(typeKey);
    setAnalyzingImage(true);
    setScanResult(null);

    setTimeout(() => {
      setAnalyzingImage(false);
      setScanResult(sampleScans[typeKey]);
    }, 1800);
  };

  return (
    <div className="w-full flex flex-col gap-5 font-mono text-slate-100">
      {/* Header & Mode Switcher */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders size={16} className="text-cyan-400" />
            Multi-Modal Telemetry & Diagnostic Input
          </h3>
          <p className="text-[11px] text-slate-400">
            Log crew vitals manually, simulate IoT bio-sensor streams, or run autonomous medical AI image evaluation.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/50 border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all ${
              activeTab === 'manual'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sliders size={13} /> Manual Inputs
          </button>

          <button
            onClick={() => setActiveTab('sensors')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all ${
              activeTab === 'sensors'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Radio size={13} /> IoT Sensor Streams
          </button>

          <button
            onClick={() => setActiveTab('imaging')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all ${
              activeTab === 'imaging'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Camera size={13} /> Medical AI Scans
          </button>
        </div>
      </div>

      {/* ── TAB 1: MANUAL INPUT FORM ── */}
      {activeTab === 'manual' && (
        <form onSubmit={handleLogSubmit} className="flex flex-col gap-5">
          {/* Quick Simulation Presets */}
          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={13} className="text-yellow-400" />
              Quick Mission Anomaly Simulators:
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => injectAnomaly('nominal')}
                className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all"
              >
                Reset All Nominal
              </button>
              <button
                type="button"
                onClick={() => injectAnomaly('radiation')}
                className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[11px] font-bold transition-all"
              >
                ⚡ Solar Radiation Spike
              </button>
              <button
                type="button"
                onClick={() => injectAnomaly('hypoxia')}
                className="px-2.5 py-1 rounded bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-yellow-400/40 text-[11px] font-bold transition-all"
              >
                ⚠️ Cabin Hypoxia Event
              </button>
              <button
                type="button"
                onClick={() => injectAnomaly('sans')}
                className="px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold transition-all"
              >
                👁️ SANS & Sleep Fatigue
              </button>
            </div>
          </div>

          {/* Metric Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Heart Rate */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Heart size={14} className="text-red-400" /> Resting Heart Rate
                </span>
                <span className="font-bold text-cyan-300">{currentMetrics.heartRate} bpm</span>
              </div>
              <input
                type="range"
                min="40"
                max="140"
                value={currentMetrics.heartRate ?? 72}
                onChange={e => handleSliderChange('heartRate', e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>40 (Bradycardia)</span>
                <span className="text-emerald-400">Nominal: 50-100</span>
                <span>140 (Tachycardia)</span>
              </div>
            </div>

            {/* 2. Blood Pressure Sys */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity size={14} className="text-cyan-400" /> Systolic Blood Pressure
                </span>
                <span className="font-bold text-cyan-300">{currentMetrics.bloodPressureSys} mmHg</span>
              </div>
              <input
                type="range"
                min="70"
                max="180"
                value={currentMetrics.bloodPressureSys ?? 120}
                onChange={e => handleSliderChange('bloodPressureSys', e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>70 (Hypotension)</span>
                <span className="text-emerald-400">Nominal: 90-140</span>
                <span>180 (Hypertensive)</span>
              </div>
            </div>

            {/* 3. Blood Oxygen SpO2 */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity size={14} className="text-emerald-400" /> Blood Oxygen (SpO2)
                </span>
                <span className="font-bold text-cyan-300">{currentMetrics.spo2}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="100"
                step="0.5"
                value={currentMetrics.spo2 ?? 98}
                onChange={e => handleSliderChange('spo2', e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>80% (Hypoxia)</span>
                <span className="text-emerald-400">Nominal: 95-100%</span>
                <span>100%</span>
              </div>
            </div>

            {/* 4. Sleep Hours */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Moon size={14} className="text-purple-400" /> Sleep Duration
                </span>
                <span className="font-bold text-cyan-300">{currentMetrics.sleepHours} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={currentMetrics.sleepHours ?? 6.5}
                onChange={e => handleSliderChange('sleepHours', e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0h (Severe Depriv.)</span>
                <span className="text-emerald-400">Nominal: 6-9h</span>
                <span>12h</span>
              </div>
            </div>

            {/* 5. Blood Sugar */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Droplets size={14} className="text-amber-400" /> Blood Glucose
                </span>
                <span className="font-bold text-cyan-300">{currentMetrics.bloodSugar} mg/dL</span>
              </div>
              <input
                type="range"
                min="50"
                max="220"
                value={currentMetrics.bloodSugar ?? 98}
                onChange={e => handleSliderChange('bloodSugar', e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>50 (Hypoglycemia)</span>
                <span className="text-emerald-400">Nominal: 70-140</span>
                <span>220 (Hyperglycemia)</span>
              </div>
            </div>

            {/* 6. Core Temp */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Thermometer size={14} className="text-orange-400" /> Core Body Temp
                </span>
                <span className="font-bold text-cyan-300">{currentMetrics.coreTemp} °C</span>
              </div>
              <input
                type="range"
                min="35.0"
                max="39.5"
                step="0.1"
                value={currentMetrics.coreTemp ?? 37.0}
                onChange={e => handleSliderChange('coreTemp', e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>35.0 (Hypothermia)</span>
                <span className="text-emerald-400">Nominal: 36.1-37.5</span>
                <span>39.5 (Pyrexia)</span>
              </div>
            </div>

            {/* 7. Hydration Level */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Droplets size={14} className="text-blue-400" /> Hydration Level
                </span>
                <span className="font-bold text-cyan-300">{currentMetrics.hydration}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={currentMetrics.hydration ?? 75}
                onChange={e => handleSliderChange('hydration', e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>40% (Dehydrated)</span>
                <span className="text-emerald-400">Target: ≥70%</span>
                <span>100%</span>
              </div>
            </div>

            {/* 8. Mood & Behavioral */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity size={14} className="text-yellow-400" /> Mood / Behavioral Score
                </span>
                <span className="font-bold text-cyan-300">{currentMetrics.moodRating}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={currentMetrics.moodRating ?? 7}
                onChange={e => handleSliderChange('moodRating', e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 (Acute Distress)</span>
                <span className="text-emerald-400">Nominal: 5-10</span>
                <span>10 (Peak Morale)</span>
              </div>
            </div>

            {/* 9. Radiation Dose */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap size={14} className="text-red-400" /> Radiation Dose (Weekly)
                </span>
                <span className="font-bold text-cyan-300">{currentMetrics.radiationDose} mSv</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="6.0"
                step="0.1"
                value={currentMetrics.radiationDose ?? 1.5}
                onChange={e => handleSliderChange('radiationDose', e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.1 mSv</span>
                <span className="text-emerald-400">Limit: &lt;2.0 mSv/wk</span>
                <span>6.0 mSv (Acute)</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              {logSuccess ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={14} /> Telemetry packet verified and logged locally.
                </span>
              ) : (
                'All changes trigger immediate local Clinical Decision Engine evaluation.'
              )}
            </span>

            <button
              type="submit"
              className="py-3 px-6 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,212,255,0.4)]"
            >
              <CheckCircle2 size={16} /> Log Mission Telemetry Point
            </button>
          </div>
        </form>
      )}

      {/* ── TAB 2: IOT SENSOR STREAM SIMULATION ── */}
      {activeTab === 'sensors' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/10 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              6 Active Wireless Bio-Patches & Dosimeters Connected via Low-Power Mesh
            </div>
            <span className="text-[10px] text-slate-400">
              Sampling frequency: 0.33 Hz (Local Edge Gateway)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SENSOR_FEEDS.map(sensor => {
              const currentValue = currentMetrics[sensor.metric];
              return (
                <div
                  key={sensor.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-col justify-between gap-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-cyan-400/80 font-mono">
                        {sensor.id}
                      </span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        {sensor.name}
                      </h4>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between my-1">
                    <span className="text-2xl font-bold font-mono text-cyan-200">
                      {currentValue ?? '--'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {sensor.unit}
                    </span>
                  </div>

                  {/* Battery and Sync Status */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span>Battery:</span>
                      <span className={sensor.battery > 30 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {sensor.battery}%
                      </span>
                    </div>
                    <span>Last Sync: {sensor.lastSync}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 3: MEDICAL AI SCAN IMAGING ── */}
      {activeTab === 'imaging' && (
        <div className="flex flex-col gap-5">
          <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs flex items-center justify-between">
            <span className="text-cyan-300 font-bold flex items-center gap-2">
              <Camera size={15} className="text-cyan-400" />
              Autonomous On-Board Diagnostic Computer Vision Engine
            </span>
            <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              ZERO-ROUNDTRIP LOCAL INFERENCE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Sample Selector Cards */}
            {Object.entries(sampleScans).map(([key, item]) => (
              <div
                key={key}
                onClick={() => handleSimulateScan(key)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedScanType === key
                    ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                    : 'border-white/10 bg-slate-900/50 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">
                    {item.organ}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-white/10">
                    Scan Preset
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-2">{item.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {item.simulatedFinding}
                </p>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-cyan-400 font-bold">
                  <span>Run Inference</span>
                  <Play size={12} />
                </div>
              </div>
            ))}
          </div>

          {/* Scan Analysis Output Box */}
          <div className="p-5 rounded-xl border border-cyan-500/30 bg-black/50 backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileSearch size={16} className="text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Diagnostics Analysis: {sampleScans[selectedScanType]?.name}
                </span>
              </div>

              {analyzingImage ? (
                <span className="text-xs text-yellow-400 flex items-center gap-1.5 animate-pulse">
                  <RefreshCw size={12} className="animate-spin" />
                  Running Neural Feature Extraction...
                </span>
              ) : scanResult ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 size={13} /> Scan Complete ({scanResult.confidence}% confidence)
                </span>
              ) : (
                <span className="text-xs text-slate-400">Awaiting Trigger</span>
              )}
            </div>

            {analyzingImage ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <span className="text-xs text-cyan-300 font-mono tracking-wider">
                  Analyzing microgravity tissue morphology...
                </span>
              </div>
            ) : scanResult ? (
              <div className="flex flex-col gap-3">
                <div className="p-3.5 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-yellow-300 uppercase tracking-wide block mb-1">
                      Pathological Feature Detection
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {scanResult.simulatedFinding}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-2 text-xs">
                  <span className="font-bold text-cyan-400 shrink-0">Prescribed Crew Action:</span>
                  <span className="text-slate-300">{scanResult.action}</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                Click any scan preset above or upload an image to begin autonomous deep-space medical imaging.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
