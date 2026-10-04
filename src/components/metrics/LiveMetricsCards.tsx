import React from 'react';
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  AlertTriangle,
  Users,
  Database,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const LiveMetricsCards: React.FC = () => {
  const { metrics, status } = useSimulation();

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="p-4 space-y-3 select-none">
      {/* Top Banner Status */}
      <div className="flex items-center justify-between pb-1 border-b border-soc-border text-xs text-soc-muted">
        <span className="font-mono uppercase tracking-wider">Telemetry Stream</span>
        <span className="font-mono text-[10px] text-soc-success flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-soc-success animate-pulse" />
          SAMPLING: 1000MS
        </span>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* Incoming Requests */}
        <div className="bg-soc-surface2/60 border border-soc-border p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-soc-muted">
            <span className="text-[11px] font-medium">Incoming Requests</span>
            <Activity className="w-3.5 h-3.5 text-soc-accent" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-soc-accent">
              {formatNumber(metrics.incomingRequests)}
            </div>
            <div className="text-[10px] text-soc-muted font-mono flex items-center gap-1">
              <span>req/sec</span>
              {metrics.incomingRequests > 0 && (
                <ArrowUpRight className="w-3 h-3 text-soc-accent" />
              )}
            </div>
          </div>
        </div>

        {/* Blocked Requests */}
        <div className="bg-soc-surface2/60 border border-soc-border p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-soc-muted">
            <span className="text-[11px] font-medium">Blocked Requests</span>
            <ShieldCheck className="w-3.5 h-3.5 text-soc-success" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-soc-success">
              {formatNumber(metrics.blockedRequests)}
            </div>
            <div className="text-[10px] text-soc-muted font-mono flex items-center gap-1">
              <span>mitigated at edge</span>
            </div>
          </div>
        </div>

        {/* Successful / Passed Requests */}
        <div className="bg-soc-surface2/60 border border-soc-border p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-soc-muted">
            <span className="text-[11px] font-medium">Successful Requests</span>
            <ShieldAlert className="w-3.5 h-3.5 text-soc-accent" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-soc-text">
              {formatNumber(metrics.passedRequests)}
            </div>
            <div className="text-[10px] text-soc-muted font-mono">
              handled by origin
            </div>
          </div>
        </div>

        {/* Dropped Requests */}
        <div className="bg-soc-surface2/60 border border-soc-border p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-soc-muted">
            <span className="text-[11px] font-medium">Dropped Requests</span>
            <AlertTriangle className="w-3.5 h-3.5 text-soc-critical" />
          </div>
          <div className="mt-2">
            <div
              className={`text-xl font-bold font-mono ${
                metrics.droppedRequests > 0 ? 'text-soc-critical animate-pulse' : 'text-soc-muted'
              }`}
            >
              {formatNumber(metrics.droppedRequests)}
            </div>
            <div className="text-[10px] text-soc-muted font-mono">
              timeout / 503 errors
            </div>
          </div>
        </div>

        {/* Server CPU */}
        <div className="bg-soc-surface2/60 border border-soc-border p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-soc-muted">
            <span className="text-[11px] font-medium">Server CPU</span>
            <Cpu className="w-3.5 h-3.5 text-soc-warning" />
          </div>
          <div className="mt-2">
            <div
              className={`text-xl font-bold font-mono ${
                metrics.serverCpu >= 85
                  ? 'text-soc-critical'
                  : metrics.serverCpu >= 70
                  ? 'text-soc-warning'
                  : 'text-soc-success'
              }`}
            >
              {metrics.serverCpu}%
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-soc-border h-1 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  metrics.serverCpu >= 85
                    ? 'bg-soc-critical'
                    : metrics.serverCpu >= 70
                    ? 'bg-soc-warning'
                    : 'bg-soc-success'
                }`}
                style={{ width: `${metrics.serverCpu}%` }}
              />
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-soc-surface2/60 border border-soc-border p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-soc-muted">
            <span className="text-[11px] font-medium">Memory Usage</span>
            <HardDrive className="w-3.5 h-3.5 text-soc-accent" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-soc-text">
              {metrics.memoryUsage}%
            </div>
            <div className="w-full bg-soc-border h-1 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-soc-accent transition-all duration-300"
                style={{ width: `${metrics.memoryUsage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Response Time (Latency) */}
        <div className="bg-soc-surface2/60 border border-soc-border p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-soc-muted">
            <span className="text-[11px] font-medium">Response Time</span>
            <Clock className="w-3.5 h-3.5 text-soc-muted" />
          </div>
          <div className="mt-2">
            <div
              className={`text-xl font-bold font-mono ${
                metrics.responseTimeMs > 1000
                  ? 'text-soc-critical'
                  : metrics.responseTimeMs > 300
                  ? 'text-soc-warning'
                  : 'text-soc-text'
              }`}
            >
              {metrics.responseTimeMs > 1000
                ? `${(metrics.responseTimeMs / 1000).toFixed(2)}s`
                : `${metrics.responseTimeMs}ms`}
            </div>
            <div className="text-[10px] text-soc-muted font-mono">
              round-trip average
            </div>
          </div>
        </div>

        {/* Error Rate */}
        <div className="bg-soc-surface2/60 border border-soc-border p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-soc-muted">
            <span className="text-[11px] font-medium">Error Rate</span>
            <AlertTriangle className="w-3.5 h-3.5 text-soc-critical" />
          </div>
          <div className="mt-2">
            <div
              className={`text-xl font-bold font-mono ${
                metrics.errorRatePercent > 10 ? 'text-soc-critical' : 'text-soc-text'
              }`}
            >
              {metrics.errorRatePercent}%
            </div>
            <div className="text-[10px] text-soc-muted font-mono">
              HTTP non-200 responses
            </div>
          </div>
        </div>

        {/* Active Connections */}
        <div className="bg-soc-surface2/60 border border-soc-border p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-soc-muted">
            <span className="text-[11px] font-medium">Active Connections</span>
            <Users className="w-3.5 h-3.5 text-soc-accent" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-soc-accent">
              {metrics.activeConnections.toLocaleString()}
            </div>
            <div className="text-[10px] text-soc-muted font-mono">
              concurrent sockets
            </div>
          </div>
        </div>

        {/* Network Bandwidth */}
        <div className="bg-soc-surface2/60 border border-soc-border p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-soc-muted">
            <span className="text-[11px] font-medium">Network Usage</span>
            <Wifi className="w-3.5 h-3.5 text-soc-accent" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-soc-text">
              {metrics.networkUsageGbps} Gbps
            </div>
            <div className="text-[10px] text-soc-muted font-mono">
              simulated line throughput
            </div>
          </div>
        </div>

        {/* Database Load */}
        <div className="bg-soc-surface2/60 border border-soc-border p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-soc-muted">
            <span className="text-[11px] font-medium">Database Load</span>
            <Database className="w-3.5 h-3.5 text-soc-warning" />
          </div>
          <div className="mt-2">
            <div
              className={`text-xl font-bold font-mono ${
                metrics.databaseLoadPercent >= 85 ? 'text-soc-critical' : 'text-soc-text'
              }`}
            >
              {metrics.databaseLoadPercent}%
            </div>
            <div className="text-[10px] text-soc-muted font-mono">
              query queue saturation
            </div>
          </div>
        </div>

        {/* Cache Hit Rate */}
        <div className="bg-soc-surface2/60 border border-soc-border p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-soc-muted">
            <span className="text-[11px] font-medium">Cache Hit Rate</span>
            <Layers className="w-3.5 h-3.5 text-soc-success" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-soc-success">
              {metrics.cacheHitRatePercent}%
            </div>
            <div className="text-[10px] text-soc-muted font-mono">
              edge & redis absorption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
