import React from 'react';
import { History, Play, Trash2, Calendar, Shield, ExternalLink } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const SimulationHistoryView: React.FC = () => {
  const { startSimulation } = useSimulation();

  return (
    <div className="p-4 flex flex-col h-full space-y-3 select-none text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-soc-border">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-soc-accent" />
          <span className="font-bold text-soc-text tracking-wide uppercase text-xs">
            Simulation History & Run Archive
          </span>
        </div>
        <span className="text-[10px] font-mono text-soc-muted">LOCALSTORAGE PERSISTENCE</span>
      </div>

      <p className="text-[11px] text-soc-muted">
        Review previously completed simulation runs, compare peak telemetry loads, and inspect post-incident outcomes.
      </p>

      {/* History Sample Cards */}
      <div className="space-y-2">
        <div className="p-3 rounded-lg bg-soc-surface2/60 border border-soc-border space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-soc-text text-xs">Protected Enterprise Attack</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-soc-success/15 border border-soc-success/30 text-soc-success">
              Infrastructure Survived
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-soc-muted pt-1">
            <div>Peak: <span className="text-soc-text font-bold">1.2M req/s</span></div>
            <div>CPU: <span className="text-soc-text font-bold">68%</span></div>
            <div>Duration: <span className="text-soc-text font-bold">60s</span></div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-soc-surface2/60 border border-soc-border space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-soc-text text-xs">Unprotected API Flood</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-soc-critical/15 border border-soc-critical/30 text-soc-critical">
              Service Unavailable
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-soc-muted pt-1">
            <div>Peak: <span className="text-soc-text font-bold">850K req/s</span></div>
            <div>CPU: <span className="text-soc-text font-bold">99%</span></div>
            <div>Duration: <span className="text-soc-text font-bold">45s</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
