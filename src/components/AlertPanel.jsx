import { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  Bell,
  Activity,
  ArrowRight
} from 'lucide-react';

// Severity configuration
function severityConfig(severity) {
  const s = (severity ?? 'nominal').toLowerCase();
  switch (s) {
    case 'critical':
      return {
        border: 'border-l-red-500',
        bg: 'bg-red-500/10 border-red-500/30',
        text: 'text-red-400',
        badge: 'bg-red-500/20 text-red-400 border border-red-500/40',
        icon: <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />,
        glow: '0 0 12px rgba(255,51,102,0.4)',
        pulse: true,
      };
    case 'warning':
      return {
        border: 'border-l-yellow-400',
        bg: 'bg-yellow-400/10 border-yellow-400/30',
        text: 'text-yellow-400',
        badge: 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40',
        icon: <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />,
        glow: '0 0 8px rgba(255,204,0,0.3)',
        pulse: false,
      };
    default:
      return {
        border: 'border-l-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
        icon: <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />,
        glow: '0 0 8px rgba(0,255,136,0.2)',
        pulse: false,
      };
  }
}

function AlertRow({ alert, onDismiss, onSelectPart }) {
  const severity = alert.severity || alert.status;
  const cfg = severityConfig(severity);

  // Map metric to body part for quick navigation
  const getPartFromMetric = (m) => {
    if (['sleepHours', 'moodRating', 'cognitiveScore', 'sansRisk'].includes(m)) return 'head';
    if (['heartRate', 'bloodPressureSys', 'bloodPressureDia', 'spo2'].includes(m)) return 'chest';
    if (['bloodSugar', 'coreTemp', 'hydration', 'radiationDose'].includes(m)) return 'abdomen';
    if (['exerciseCompliance', 'boneDensityLoss', 'muscleMass'].includes(m)) return 'musculoskeletal';
    return null;
  };

  const part = getPartFromMetric(alert.metric);

  return (
    <div
      className={`relative border-l-4 ${cfg.border} ${cfg.bg} border rounded-r-md p-3 flex gap-2.5 items-start transition-all duration-200 ${
        cfg.pulse ? 'animate-pulse' : ''
      }`}
      style={{ boxShadow: cfg.glow }}
    >
      {cfg.icon}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-xs font-semibold text-white/95 uppercase tracking-wide truncate">
            {alert.label || alert.metric || 'Telemetry Flag'}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${cfg.badge}`}>
            {(severity ?? 'info').toUpperCase()}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-1.5">
          {alert.message}
        </p>

        {alert.action && (
          <div className="text-[11px] text-cyan-300/90 bg-cyan-950/40 p-1.5 rounded border border-cyan-800/40 mb-1.5 flex items-start gap-1">
            <span className="text-cyan-400 font-bold shrink-0">Action:</span>
            <span>{alert.action}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[10px]">
          <div className="flex items-center gap-2">
            {alert.value != null && (
              <span className={`font-mono font-bold ${cfg.text}`}>
                Val: {alert.value} {alert.unit ?? ''}
              </span>
            )}
            {alert.tier && (
              <span className="px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40 font-mono">
                {alert.tier}
              </span>
            )}
          </div>

          {part && onSelectPart && (
            <button
              onClick={() => onSelectPart(part)}
              className="text-cyan-400 hover:text-cyan-200 flex items-center gap-0.5 font-bold transition-colors"
            >
              Examine <ArrowRight size={10} />
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => onDismiss(alert.id)}
        className="shrink-0 text-white/30 hover:text-white/80 p-0.5 rounded transition-colors"
        title="Dismiss Alert"
        aria-label="Dismiss alert"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function AlertPanel({ alerts = [], onDismiss, onSelectPart }) {
  const [collapsed, setCollapsed] = useState(false);

  const criticalCount = alerts.filter(a => ((a.severity || a.status) ?? '').toLowerCase() === 'critical').length;
  const warningCount = alerts.filter(a => ((a.severity || a.status) ?? '').toLowerCase() === 'warning').length;

  return (
    <div
      className="font-mono rounded-lg border border-cyan-500/20 overflow-hidden flex flex-col"
      style={{
        background: 'rgba(6, 13, 31, 0.95)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 0 24px rgba(0, 212, 255, 0.08)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 cursor-pointer select-none bg-gradient-to-r from-cyan-950/40 to-slate-900/60"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Bell size={15} className="text-cyan-400" />
            {(criticalCount > 0 || warningCount > 0) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
            Clinical Hazard Engine
          </span>
        </div>

        {/* Badges & Collapse */}
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-bold animate-pulse">
              {criticalCount} CRIT
            </span>
          )}
          {warningCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-bold">
              {warningCount} WARN
            </span>
          )}
          {alerts.length === 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
              ALL NOMINAL
            </span>
          )}

          {collapsed ? <ChevronDown size={14} className="text-cyan-400/60" /> : <ChevronUp size={14} className="text-cyan-400/60" />}
        </div>
      </div>

      {/* Alert Feed */}
      {!collapsed && (
        <div className="p-3 flex flex-col gap-2.5 max-h-[520px] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3">
                <CheckCircle2
                  size={24}
                  className="text-emerald-400"
                  style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }}
                />
              </div>
              <span
                className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1"
                style={{ textShadow: '0 0 10px #00ff88' }}
              >
                TELEMETRY NOMINAL
              </span>
              <p className="text-[11px] text-slate-400 max-w-[220px]">
                No bio-marker deviations or NASA HRP hazard violations currently detected.
              </p>
            </div>
          ) : (
            alerts.map(alert => (
              <AlertRow
                key={alert.id || alert.metric}
                alert={alert}
                onDismiss={onDismiss}
                onSelectPart={onSelectPart}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
