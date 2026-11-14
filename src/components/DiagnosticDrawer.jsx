import React from 'react';
import {
  X,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Brain,
  Heart,
  Activity,
  Dumbbell,
  Shield,
  Stethoscope,
  Send,
  UserCheck,
  Radio,
  FileText,
  ChevronRight
} from 'lucide-react';
import { HEALTH_THRESHOLDS } from '../data/mockData.js';
import { evaluateMetric, getMetricStatus } from '../utils/decisionEngine.js';

export default function DiagnosticDrawer({
  isOpen = false,
  bodyPart = null,
  healthData = {},
  onClose,
  alerts = [],
  onUpdateMetric,
}) {
  if (!isOpen || !bodyPart) return null;

  // Sector metadata configuration
  const sectorConfigs = {
    head: {
      name: 'HEAD / CNS & OCULAR SYSTEM',
      code: 'NASA-HRP-HAZARD-02 / SANS-01',
      icon: Brain,
      color: '#00d4ff',
      summary:
        'Cephalad fluid redistribution in zero-gravity increases intracranial pressure (ICP), causing posterior globe flattening, optic disc edema (SANS), and circadian phase shifting.',
      metrics: ['sleepHours', 'cognitiveScore', 'moodRating', 'sansRisk'],
      protocols: [
        'Perform weekly high-resolution ocular ultrasound (optic nerve sheath diameter).',
        'Deploy Lower Body Negative Pressure (LBNP) for 2 hours daily to counteract cephalad fluid shift.',
        'Enforce 450nm blue-light filtering visor 2 hours prior to scheduled sleep block.',
        'Conduct Psychomotor Vigilance Test (PVT) upon wake cycle.',
      ],
      tier: 'Crew Medical Officer (CMO) & Peer Check',
      tierType: 'cmo',
    },
    chest: {
      name: 'CHEST / CARDIOVASCULAR & PULMONARY',
      code: 'NASA-HRP-HAZARD-03 / CARDIO-01',
      icon: Heart,
      color: '#ff3366',
      summary:
        'Microgravity removes hydrostatic pressure gradients, prompting significant blood volume contraction (-15%), left ventricular mass atrophy, and severe orthostatic intolerance risk.',
      metrics: ['heartRate', 'bloodPressureSys', 'bloodPressureDia', 'spo2'],
      protocols: [
        'Daily T2 treadmill cardiovascular protocol (30 min interval cardio at 75-85% VO2 max).',
        'Compression garment fit verification prior to heavy operational shifts.',
        'Continuous electrocardiographic patch monitoring for zero-g dysrhythmias.',
        'Oral rehydration solution (0.9% saline equivalent) prior to simulated EVA/landing.',
      ],
      tier: 'Immediate CMO Review & Action',
      tierType: 'urgent',
    },
    abdomen: {
      name: 'ABDOMEN / METABOLIC & IMMUNE',
      code: 'NASA-HRP-HAZARD-01 / IMMUNO-01',
      icon: Activity,
      color: '#ffcc00',
      summary:
        'Galactic Cosmic Radiation (GCR) and Solar Particle Events (SPE) induce DNA double-strand breaks. Stress hormones and altered microbiome compromise systemic immune response.',
      metrics: ['bloodSugar', 'coreTemp', 'hydration', 'radiationDose'],
      protocols: [
        'Administer daily antioxidant cocktail (Alpha-Lipoic Acid, N-acetylcysteine, Vitamin E).',
        'Verify personal active dosimeter readings at 12-hour mission intervals.',
        'Maintain minimum fluid intake of 2.5 Liters/day with electrolyte supplementation.',
        'If dosimeter > 2.0 mSv/week: Relocate sleeping quarters to water-wall storm shelter.',
      ],
      tier: 'Deferred Ground Surgeon Advisory',
      tierType: 'ground',
    },
    musculoskeletal: {
      name: 'BONES & MUSCLES / LOCOMOTOR',
      code: 'NASA-HRP-HAZARD-04 / MUSC-01',
      icon: Dumbbell,
      color: '#00ff88',
      summary:
        'Absence of gravitational axial loading induces 1.0% to 1.5% monthly bone mineral density loss in calcaneus/femur, alongside selective atrophy of slow-twitch postural muscle fibers.',
      metrics: ['exerciseCompliance', 'boneDensityLoss', 'muscleMass'],
      protocols: [
        'Mandatory Advanced Resistive Exercise Device (ARED) session: deadlifts, squats, heel raises.',
        'Dietary protein intake verification at 1.6 g/kg crew member bodyweight.',
        'Bisphosphonate / Vitamin D3 micro-dosing protocol compliance check.',
        'Ultrasonic bone mineral estimation every 14 mission days.',
      ],
      tier: 'Crew Self-Action Protocol',
      tierType: 'self',
    },
  };

  const config = sectorConfigs[bodyPart] || sectorConfigs.head;
  const SectorIcon = config.icon;

  // Filter alerts for this sector
  const sectorAlerts = alerts.filter(a => config.metrics.includes(a.metric));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className="relative z-50 w-full max-w-xl h-full flex flex-col font-mono text-slate-100 border-l border-cyan-500/30 overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, #02050f 0%, #060d1f 50%, #0d1b3e 100%)',
          boxShadow: '-10px 0 35px rgba(0, 212, 255, 0.15)',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-start justify-between p-5 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-lg border flex items-center justify-center"
              style={{
                borderColor: config.color,
                background: `${config.color}20`,
                boxShadow: `0 0 15px ${config.color}40`,
              }}
            >
              <SectorIcon size={22} style={{ color: config.color }} />
            </div>

            <div>
              <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">
                {config.code}
              </span>
              <h2 className="text-base font-bold text-white tracking-wider">
                {config.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 hover:border-cyan-400 text-slate-400 hover:text-white transition-colors"
            aria-label="Close diagnostic panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-6 flex-1">
          {/* Physiological Hazard Summary */}
          <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Shield size={14} className="text-cyan-400" />
              Physiological Microgravity Mechanism
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {config.summary}
            </p>
          </div>

          {/* Section 1: Telemetry Metrics Status Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                <FileText size={14} className="text-cyan-400" />
                Regional Telemetry Logs
              </span>
              <span className="text-[10px] text-cyan-400/70">
                NASA HRP STD-3001 COMPLIANT
              </span>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[10px] uppercase text-slate-400">
                    <th className="py-2.5 px-3">Metric</th>
                    <th className="py-2.5 px-3">Current</th>
                    <th className="py-2.5 px-3">Nominal Band</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {config.metrics.map(metricKey => {
                    const threshold = HEALTH_THRESHOLDS[metricKey];
                    const val = healthData[metricKey];
                    const status = getMetricStatus(metricKey, val);

                    let statusBadge;
                    if (status === 'critical') {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold text-[10px] animate-pulse">
                          CRITICAL
                        </span>
                      );
                    } else if (status === 'warning') {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-bold text-[10px]">
                          CAUTION
                        </span>
                      );
                    } else {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px]">
                          NOMINAL
                        </span>
                      );
                    }

                    return (
                      <tr key={metricKey} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-200">
                          {threshold?.label || metricKey}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-cyan-300">
                          {val != null ? `${val} ${threshold?.unit || ''}` : '--'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                          {threshold?.min} – {threshold?.max} {threshold?.unit || ''}
                        </td>
                        <td className="py-2.5 px-3 text-right">{statusBadge}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Active Sector Alerts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                <AlertTriangle size={14} className="text-yellow-400" />
                Active Diagnostic Deviations ({sectorAlerts.length})
              </span>
            </div>

            {sectorAlerts.length === 0 ? (
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-emerald-400">All Metrics Nominal:</span> No medical anomalies or threshold deviations detected in this anatomical sector.
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {sectorAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                      alert.status === 'critical'
                        ? 'border-red-500/40 bg-red-500/10'
                        : 'border-yellow-400/40 bg-yellow-400/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        {alert.status === 'critical' ? (
                          <AlertCircle size={14} className="text-red-400" />
                        ) : (
                          <AlertTriangle size={14} className="text-yellow-400" />
                        )}
                        {alert.label} Deviation
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-black/40 text-cyan-300 border border-cyan-800/40">
                        {alert.tier}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="p-2 rounded bg-black/40 border border-white/5 text-[11px] text-cyan-200">
                      <span className="font-bold text-cyan-400">Prescribed Intervention: </span>
                      {alert.action}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Autonomous Countermeasure Protocols */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                <Stethoscope size={14} className="text-cyan-400" />
                Autonomous Clinical Protocols
              </span>
              <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                DELAY TOLERANT (19m 42s)
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {config.protocols.map((protocol, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-white/10 bg-slate-900/60 flex items-start gap-2.5 text-xs text-slate-300"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{protocol}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer: Ground Message vs Local CMO Resolution */}
          <div className="mt-auto pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                alert(`Protocol Acknowledged: Autonomous logging sequence saved to local blackbox database.`);
              }}
              className="flex-1 py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.3)]"
            >
              <UserCheck size={14} />
              Acknowledge & Apply Protocol
            </button>

            <button
              onClick={() => {
                alert(`Burst Telemetry Packet queued for Deep Space Network uplink with 19m 42s transit time.`);
              }}
              className="py-2.5 px-4 rounded-lg border border-cyan-500/40 hover:bg-cyan-950/40 text-cyan-300 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={14} />
              Queue Ground Burst Msg
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
