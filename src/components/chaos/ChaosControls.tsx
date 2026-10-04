import React from 'react';
import { Flame, Zap, Skull, Database, Shield, Server, RefreshCw } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const ChaosControls: React.FC = () => {
  const { triggerChaos, status } = useSimulation();

  const isSimActive = status === 'active';

  return (
    <div className="p-4 space-y-4 select-none text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-soc-border">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-soc-critical" />
          <span className="font-bold text-soc-text tracking-wide uppercase text-xs">
            Chaos Engineering Suite
          </span>
        </div>
        <span className="text-[10px] font-mono text-soc-critical bg-soc-critical/10 px-1.5 py-0.5 rounded border border-soc-critical/30">
          LIVE INJECTION
        </span>
      </div>

      <p className="text-[11px] text-soc-muted">
        Trigger dynamic stress events and hardware failures during the active simulation to observe how the infrastructure adapts or degrades.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Traffic Surge */}
        <button
          disabled={!isSimActive}
          onClick={() => triggerChaos('surge')}
          className="p-3 rounded-lg bg-soc-surface2 border border-soc-border hover:border-soc-warning/60 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center gap-2 mb-1 text-soc-warning font-semibold">
            <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Traffic Surge (+200%)</span>
          </div>
          <p className="text-[10px] text-soc-muted">
            Instantaneous flood spike from simulated bots.
          </p>
        </button>

        {/* Server Failure */}
        <button
          disabled={!isSimActive}
          onClick={() => triggerChaos('killServer')}
          className="p-3 rounded-lg bg-soc-surface2 border border-soc-border hover:border-soc-critical/60 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center gap-2 mb-1 text-soc-critical font-semibold">
            <Skull className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Kill Server Instance</span>
          </div>
          <p className="text-[10px] text-soc-muted">
            Simulate sudden node hardware failure or kernel panic.
          </p>
        </button>

        {/* Database Slowdown */}
        <button
          disabled={!isSimActive}
          onClick={() => triggerChaos('dbSlowdown')}
          className="p-3 rounded-lg bg-soc-surface2 border border-soc-border hover:border-soc-warning/60 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center gap-2 mb-1 text-soc-warning font-semibold">
            <Database className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Database Lockup</span>
          </div>
          <p className="text-[10px] text-soc-muted">
            Pin query queue to 100% and spike latency +1800ms.
          </p>
        </button>

        {/* Max Emergency Shield */}
        <button
          disabled={!isSimActive}
          onClick={() => triggerChaos('emergencyShield')}
          className="p-3 rounded-lg bg-soc-surface2 border border-soc-border hover:border-soc-success/60 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center gap-2 mb-1 text-soc-success font-semibold">
            <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Emergency Max Shield</span>
          </div>
          <p className="text-[10px] text-soc-muted">
            Instantly engage all 10 defensive layers.
          </p>
        </button>

        {/* Add Server */}
        <button
          disabled={!isSimActive}
          onClick={() => triggerChaos('addServer')}
          className="p-3 rounded-lg bg-soc-surface2 border border-soc-border hover:border-soc-accent/60 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center gap-2 mb-1 text-soc-accent font-semibold">
            <Server className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Add Server Node</span>
          </div>
          <p className="text-[10px] text-soc-muted">
            Manually provision +1 instance to cluster.
          </p>
        </button>

        {/* Recovery Mode */}
        <button
          disabled={!isSimActive}
          onClick={() => triggerChaos('recovery')}
          className="p-3 rounded-lg bg-soc-surface2 border border-soc-border hover:border-soc-accent/60 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center gap-2 mb-1 text-soc-accent font-semibold">
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
            <span>Recovery Mode</span>
          </div>
          <p className="text-[10px] text-soc-muted">
            Normalize traffic and revive crashed servers.
          </p>
        </button>
      </div>
    </div>
  );
};
