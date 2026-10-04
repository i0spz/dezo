import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const TrafficAnalysisView: React.FC = () => {
  const { metricsHistory, metrics } = useSimulation();

  // Prepare chart data
  const data = metricsHistory.map((pt) => ({
    time: `${pt.second}s`,
    incoming: pt.incomingRequests,
    passed: pt.passedRequests,
    blocked: pt.blockedRequests,
    dropped: pt.droppedRequests,
    cpu: pt.serverCpu,
    latency: pt.responseTimeMs,
  }));

  return (
    <div className="p-4 flex flex-col h-full space-y-3 select-none text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-soc-border">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-soc-accent" />
          <span className="font-bold text-soc-text tracking-wide uppercase text-xs">
            Live Traffic & Resource Telemetry
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-soc-accent">
            <span className="w-2 h-2 rounded-full bg-soc-accent" /> Ingress
          </span>
          <span className="flex items-center gap-1 text-soc-success">
            <span className="w-2 h-2 rounded-full bg-soc-success" /> Blocked
          </span>
          <span className="flex items-center gap-1 text-soc-critical">
            <span className="w-2 h-2 rounded-full bg-soc-critical" /> Dropped
          </span>
        </div>
      </div>

      {/* Main Throughput Area Chart */}
      <div className="flex-1 w-full min-h-[220px] bg-soc-surface2/30 rounded-lg border border-soc-border p-2">
        {data.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C7CFF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6C7CFF" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42D392" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#42D392" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorDropped" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5D6C" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#FF5D6C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#252C38" vertical={false} />
              <XAxis dataKey="time" stroke="#929CAB" fontSize={10} tickLine={false} />
              <YAxis
                stroke="#929CAB"
                fontSize={10}
                tickLine={false}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#10141C',
                  borderColor: '#252C38',
                  borderRadius: '6px',
                  color: '#F4F7FB',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Area
                type="monotone"
                dataKey="incoming"
                stroke="#6C7CFF"
                fillOpacity={1}
                fill="url(#colorIncoming)"
                name="Incoming (req/s)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="blocked"
                stroke="#42D392"
                fillOpacity={1}
                fill="url(#colorBlocked)"
                name="Blocked (req/s)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="dropped"
                stroke="#FF5D6C"
                fillOpacity={1}
                fill="url(#colorDropped)"
                name="Dropped (req/s)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-soc-muted space-y-1 font-mono text-[11px]">
            <Activity className="w-5 h-5 text-soc-muted/60 animate-pulse" />
            <span>Awaiting simulation traffic data...</span>
            <span className="text-[10px] opacity-70">Click 'Start Simulation' to begin live charting</span>
          </div>
        )}
      </div>

      {/* Mini Telemetry Summary */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="p-2 bg-soc-surface2/50 rounded border border-soc-border text-center">
          <div className="text-[10px] font-mono text-soc-muted">CURRENT INGRESS</div>
          <div className="text-xs font-bold font-mono text-soc-accent mt-0.5">
            {metrics.incomingRequests.toLocaleString()} req/s
          </div>
        </div>

        <div className="p-2 bg-soc-surface2/50 rounded border border-soc-border text-center">
          <div className="text-[10px] font-mono text-soc-muted">CURRENT MITIGATION</div>
          <div className="text-xs font-bold font-mono text-soc-success mt-0.5">
            {metrics.blockedRequests.toLocaleString()} req/s
          </div>
        </div>

        <div className="p-2 bg-soc-surface2/50 rounded border border-soc-border text-center">
          <div className="text-[10px] font-mono text-soc-muted">CURRENT DROPPED</div>
          <div
            className={`text-xs font-bold font-mono mt-0.5 ${
              metrics.droppedRequests > 0 ? 'text-soc-critical animate-pulse' : 'text-soc-muted'
            }`}
          >
            {metrics.droppedRequests.toLocaleString()} req/s
          </div>
        </div>
      </div>
    </div>
  );
};
