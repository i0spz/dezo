import React from 'react';
import { Server, AlertCircle, CheckCircle2, Flame, PowerOff, Cpu, HardDrive, Clock } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { ServerNode, ServerStatus } from '../../types/simulation';

export const ServerHealthGrid: React.FC = () => {
  const { servers, autoScaledCount, triggerChaos } = useSimulation();

  const getStatusColor = (status: ServerStatus) => {
    switch (status) {
      case 'Healthy':
        return {
          badge: 'bg-soc-success/15 text-soc-success border-soc-success/30',
          border: 'border-soc-border hover:border-soc-success/50',
          glow: '',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-soc-success" />,
        };
      case 'Busy':
        return {
          badge: 'bg-soc-accent/15 text-soc-accent border-soc-accent/30',
          border: 'border-soc-border hover:border-soc-accent/50',
          glow: '',
          icon: <Server className="w-3.5 h-3.5 text-soc-accent" />,
        };
      case 'Overloaded':
        return {
          badge: 'bg-soc-warning/15 text-soc-warning border-soc-warning/30',
          border: 'border-soc-warning/60',
          glow: 'ring-1 ring-soc-warning/40',
          icon: <AlertCircle className="w-3.5 h-3.5 text-soc-warning" />,
        };
      case 'Critical':
        return {
          badge: 'bg-soc-critical/15 text-soc-critical border-soc-critical/40 animate-pulse',
          border: 'border-soc-critical/80',
          glow: 'ring-1 ring-soc-critical/60 shadow-soc-glow-critical',
          icon: <Flame className="w-3.5 h-3.5 text-soc-critical" />,
        };
      case 'Offline':
        return {
          badge: 'bg-soc-muted/20 text-soc-muted border-soc-muted/30',
          border: 'border-dashed border-soc-muted/40 opacity-60',
          glow: '',
          icon: <PowerOff className="w-3.5 h-3.5 text-soc-muted" />,
        };
    }
  };

  return (
    <div className="p-4 space-y-4 select-none">
      {/* Fleet Header */}
      <div className="flex items-center justify-between pb-1 border-b border-soc-border text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-soc-muted uppercase tracking-wider">Cluster Fleet</span>
          <span className="px-1.5 py-0.5 rounded bg-soc-surface2 border border-soc-border font-mono text-[10px] text-soc-text">
            {servers.length} Instances
          </span>
          {autoScaledCount > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-soc-accent/15 border border-soc-accent/30 font-mono text-[10px] text-soc-accent">
              +{autoScaledCount} Auto-scaled
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => triggerChaos('addServer')}
            className="px-2 py-1 rounded bg-soc-surface2 border border-soc-border hover:border-soc-accent/50 text-[11px] font-medium text-soc-text transition-colors"
          >
            + Add Server
          </button>
        </div>
      </div>

      {/* Grid of Server Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {servers.map((server) => {
          const style = getStatusColor(server.status);

          return (
            <div
              key={server.id}
              className={`bg-soc-surface2/60 rounded-lg p-3 border transition-all ${style.border} ${style.glow}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-soc-surface border border-soc-border flex items-center justify-center">
                    {style.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-soc-text">{server.name}</div>
                    <div className="text-[10px] font-mono text-soc-muted">
                      {server.activeConnections.toLocaleString()} conns
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${style.badge}`}
                >
                  {server.status}
                </span>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2 text-[10px] font-mono">
                {/* CPU */}
                <div>
                  <div className="flex justify-between text-soc-muted mb-0.5">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-soc-warning" /> CPU
                    </span>
                    <span
                      className={`font-bold ${
                        server.cpu >= 85 ? 'text-soc-critical' : 'text-soc-text'
                      }`}
                    >
                      {server.cpu}%
                    </span>
                  </div>
                  <div className="w-full bg-soc-surface h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        server.cpu >= 88
                          ? 'bg-soc-critical'
                          : server.cpu >= 70
                          ? 'bg-soc-warning'
                          : 'bg-soc-success'
                      }`}
                      style={{ width: `${server.cpu}%` }}
                    />
                  </div>
                </div>

                {/* RAM */}
                <div>
                  <div className="flex justify-between text-soc-muted mb-0.5">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-soc-accent" /> RAM
                    </span>
                    <span className="text-soc-text font-bold">{server.ram}%</span>
                  </div>
                  <div className="w-full bg-soc-surface h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-soc-accent transition-all duration-300"
                      style={{ width: `${server.ram}%` }}
                    />
                  </div>
                </div>

                {/* Latency and Requests */}
                <div className="flex items-center justify-between pt-1 border-t border-soc-border/50 text-[10px] text-soc-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{server.latency}ms</span>
                  </span>
                  <span>{(server.requestsHandled / 1000).toFixed(0)}k reqs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
