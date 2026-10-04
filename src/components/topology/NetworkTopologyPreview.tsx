import React from 'react';
import { Network, Shield, Server, Database, Layers, ArrowRight, Activity } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const NetworkTopologyPreview: React.FC = () => {
  const { params, servers, metrics, status } = useSimulation();
  const { defenses } = params.infrastructure;

  const isRunning = status === 'active';

  return (
    <div className="p-4 flex flex-col h-full space-y-3 select-none text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-soc-border">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-soc-accent" />
          <span className="font-bold text-soc-text tracking-wide uppercase text-xs">
            Network Topology Architecture
          </span>
        </div>
        <span className="text-[10px] font-mono text-soc-accent px-2 py-0.5 rounded bg-soc-accent/10 border border-soc-accent/30">
          FLOW DIAGRAM
        </span>
      </div>

      {/* Interactive Topology Diagram */}
      <div className="flex-1 bg-soc-surface2/30 rounded-lg border border-soc-border p-4 flex flex-col justify-around relative overflow-hidden">
        {/* Step 1: Clients / Botnet */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-soc-surface border border-soc-border flex flex-col items-center justify-center text-center p-1">
              <span className="text-[10px] font-mono font-bold text-soc-critical">
                {params.botCount > 1000 ? `${(params.botCount / 1000).toFixed(0)}K` : params.botCount}
              </span>
              <span className="text-[8px] text-soc-muted uppercase">Bots</span>
            </div>
            <div>
              <div className="font-bold text-xs text-soc-text">Simulated Client Sources</div>
              <div className="text-[10px] text-soc-muted font-mono">{params.distributionMode}</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-soc-muted font-mono text-[10px]">
            <span>{(metrics.incomingRequests / 1000).toFixed(0)}K req/s</span>
            <ArrowRight className="w-4 h-4 text-soc-accent" />
          </div>
        </div>

        {/* Step 2: Defensive Perimeter */}
        <div className="p-2.5 rounded-lg bg-soc-surface border border-soc-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-soc-accent/15 border border-soc-accent/40 flex items-center justify-center text-soc-accent">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-soc-text">Defensive Shield Perimeter</div>
              <div className="text-[10px] text-soc-muted font-mono">
                WAF: {defenses.webApplicationFirewall ? 'ON' : 'OFF'} • CDN: {defenses.cdn ? 'ON' : 'OFF'} • Rate Limit: {defenses.rateLimiting ? 'ON' : 'OFF'}
              </div>
            </div>
          </div>

          <div className="text-right font-mono text-[10px]">
            <div className="text-soc-success font-bold">
              -{(metrics.blockedRequests / 1000).toFixed(0)}K req/s
            </div>
            <div className="text-soc-muted text-[9px]">Mitigated at Edge</div>
          </div>
        </div>

        {/* Step 3: Load Balancer & Origin Fleet */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-soc-surface border border-soc-border flex flex-col items-center justify-center text-center p-1">
              <Server className="w-5 h-5 text-soc-accent" />
              <span className="text-[8px] text-soc-muted font-mono">{servers.length} Nodes</span>
            </div>
            <div>
              <div className="font-bold text-xs text-soc-text">Origin Server Cluster</div>
              <div className="text-[10px] text-soc-muted font-mono">
                Avg CPU: {metrics.serverCpu}% • Latency: {metrics.responseTimeMs}ms
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-soc-muted font-mono text-[10px]">
            <span>{(metrics.passedRequests / 1000).toFixed(0)}K req/s</span>
            <ArrowRight className="w-4 h-4 text-soc-success" />
          </div>
        </div>

        {/* Step 4: Storage & Caching */}
        <div className="p-2.5 rounded-lg bg-soc-surface border border-soc-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-soc-warning/15 border border-soc-warning/40 flex items-center justify-center text-soc-warning">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-soc-text">Persistence & In-Memory Layer</div>
              <div className="text-[10px] text-soc-muted font-mono">
                Cache: {defenses.caching ? 'Redis (Active)' : 'Disabled'} • DB Load: {metrics.databaseLoadPercent}%
              </div>
            </div>
          </div>

          <div className="text-right font-mono text-[10px]">
            <div className="text-soc-text font-bold">{metrics.cacheHitRatePercent}% Hit Rate</div>
            <div className="text-soc-muted text-[9px]">Cache Absorption</div>
          </div>
        </div>
      </div>
    </div>
  );
};
