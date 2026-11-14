import React from 'react';
import {
  Users,
  Shield,
  Stethoscope,
  Heart,
  Activity,
  Award,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export default function CrewPanel({
  astronauts = [],
  selectedAstronaut = null,
  onSelectAstronaut,
}) {
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
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 to-slate-900/60">
        <div className="flex items-center gap-2">
          <Users size={15} className="text-cyan-400" />
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
            Crew Telemetry Roster
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
          4 / 4 MONITORED
        </span>
      </div>

      {/* Roster Cards */}
      <div className="p-3 flex flex-col gap-2.5">
        {astronauts.map(ast => {
          const isSelected = selectedAstronaut?.id === ast.id;
          return (
            <div
              key={ast.id}
              onClick={() => onSelectAstronaut?.(ast)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400/50 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                  : 'border-white/10 bg-black/40 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {/* Initials Avatar */}
                  <div
                    className="w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs"
                    style={{
                      borderColor: ast.color,
                      backgroundColor: `${ast.color}20`,
                      color: ast.color,
                    }}
                  >
                    {ast.initials}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white tracking-wide">
                        {ast.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span>{ast.role}</span>
                      {ast.isMedicalOfficer && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                          CMO
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Overall Score */}
                <div className="text-right">
                  <div
                    className={`text-xs font-bold font-mono ${
                      ast.healthScore >= 85
                        ? 'text-emerald-400'
                        : ast.healthScore >= 75
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {ast.healthScore}%
                  </div>
                  <div className="text-[9px] text-slate-400 uppercase">Index</div>
                </div>
              </div>

              {/* System dots status */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">{ast.specialty}</span>
                <div className="flex items-center gap-1.5" title="Systems: CNS, Cardio, Metabolic, Bone, Morale">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className={`w-2 h-2 rounded-full ${ast.healthScore < 80 ? 'bg-yellow-400' : 'bg-emerald-400'}`} />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Crew Behavioral Health Indicator */}
      <div className="m-3 mt-1 p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-slate-300 flex flex-col gap-1.5">
        <div className="flex items-center justify-between font-bold text-cyan-300">
          <span>Crew Cohesion Index</span>
          <span className="text-emerald-400">92% Nominal</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-normal">
          Autonomous crew psychological telemetry indicates low friction and synchronized circadian schedule.
        </p>
      </div>
    </div>
  );
}
