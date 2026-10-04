import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  X,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Clock,
  Server,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const ResultPostMortemModal: React.FC = () => {
  const {
    resultSummary,
    closeResultModal,
    updateParams,
    startSimulation,
    setDefenseValue,
  } = useSimulation();

  if (!resultSummary) return null;

  const getStatusBadge = () => {
    switch (resultSummary.finalStatus) {
      case 'Infrastructure Survived':
        return {
          bg: 'bg-soc-success/15 border-soc-success/40 text-soc-success',
          icon: <CheckCircle2 className="w-6 h-6 text-soc-success" />,
        };
      case 'Partial Outage':
        return {
          bg: 'bg-soc-warning/15 border-soc-warning/40 text-soc-warning',
          icon: <AlertTriangle className="w-6 h-6 text-soc-warning" />,
        };
      case 'Service Unavailable':
        return {
          bg: 'bg-soc-critical/15 border-soc-critical/40 text-soc-critical animate-pulse',
          icon: <Flame className="w-6 h-6 text-soc-critical" />,
        };
    }
  };

  const statusStyle = getStatusBadge();

  // What-If Handlers
  const handleWhatIf = (action: string) => {
    closeResultModal();
    setTimeout(() => {
      switch (action) {
        case 'cdn':
          setDefenseValue('cdn', true);
          break;
        case 'servers8':
          updateParams((prev) => ({
            ...prev,
            infrastructure: { ...prev.infrastructure, serverCount: 8 },
          }));
          break;
        case 'rateLimit':
          setDefenseValue('rateLimiting', true);
          break;
        case 'doubleTraffic':
          updateParams((prev) => ({
            ...prev,
            botCount: Math.min(1000000, prev.botCount * 2),
          }));
          break;
        case 'disableAutoscale':
          setDefenseValue('autoScaling', false);
          break;
      }
      startSimulation();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fade-in">
      <div className="w-full max-w-2xl bg-soc-surface border border-soc-border rounded-xl shadow-window overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="h-12 px-4 bg-soc-surface2 border-b border-soc-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-soc-text">
              Simulation Incident Post-Mortem
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-soc-surface border border-soc-border text-soc-muted">
              REPORT
            </span>
          </div>

          <button
            onClick={closeResultModal}
            className="w-7 h-7 rounded flex items-center justify-center text-soc-muted hover:text-soc-text hover:bg-soc-border/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-soc-text">
          {/* Status Result Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center gap-4 ${statusStyle.bg}`}
          >
            <div className="shrink-0">{statusStyle.icon}</div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-soc-muted">
                Final Infrastructure Status
              </div>
              <div className="text-lg font-bold">{resultSummary.finalStatus}</div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-soc-surface2/60 border border-soc-border p-2.5 rounded-lg">
              <div className="text-soc-muted text-[10px] font-mono">PEAK TRAFFIC</div>
              <div className="text-base font-bold font-mono text-soc-accent mt-0.5">
                {(resultSummary.peakTrafficReqSec / 1000).toFixed(0)}K req/s
              </div>
            </div>

            <div className="bg-soc-surface2/60 border border-soc-border p-2.5 rounded-lg">
              <div className="text-soc-muted text-[10px] font-mono">PEAK CPU</div>
              <div className="text-base font-bold font-mono text-soc-warning mt-0.5">
                {resultSummary.peakCpuPercent}%
              </div>
            </div>

            <div className="bg-soc-surface2/60 border border-soc-border p-2.5 rounded-lg">
              <div className="text-soc-muted text-[10px] font-mono">REQUESTS PROCESSED</div>
              <div className="text-base font-bold font-mono text-soc-success mt-0.5">
                {(resultSummary.requestsProcessedTotal / 1000).toFixed(0)}K
              </div>
            </div>

            <div className="bg-soc-surface2/60 border border-soc-border p-2.5 rounded-lg">
              <div className="text-soc-muted text-[10px] font-mono">REQUESTS BLOCKED</div>
              <div className="text-base font-bold font-mono text-soc-accent mt-0.5">
                {(resultSummary.requestsBlockedTotal / 1000).toFixed(0)}K
              </div>
            </div>

            <div className="bg-soc-surface2/60 border border-soc-border p-2.5 rounded-lg">
              <div className="text-soc-muted text-[10px] font-mono">HIGHEST LATENCY</div>
              <div className="text-base font-bold font-mono text-soc-text mt-0.5">
                {resultSummary.highestLatencyMs}ms
              </div>
            </div>

            <div className="bg-soc-surface2/60 border border-soc-border p-2.5 rounded-lg">
              <div className="text-soc-muted text-[10px] font-mono">SERVERS LOST</div>
              <div
                className={`text-base font-bold font-mono mt-0.5 ${
                  resultSummary.serversLost > 0 ? 'text-soc-critical' : 'text-soc-muted'
                }`}
              >
                {resultSummary.serversLost}
              </div>
            </div>

            <div className="bg-soc-surface2/60 border border-soc-border p-2.5 rounded-lg">
              <div className="text-soc-muted text-[10px] font-mono">AUTOSCALED NODES</div>
              <div className="text-base font-bold font-mono text-soc-accent mt-0.5">
                +{resultSummary.autoScaledServersCount}
              </div>
            </div>

            <div className="bg-soc-surface2/60 border border-soc-border p-2.5 rounded-lg">
              <div className="text-soc-muted text-[10px] font-mono">REQUESTS DROPPED</div>
              <div
                className={`text-base font-bold font-mono mt-0.5 ${
                  resultSummary.requestsDroppedTotal > 0 ? 'text-soc-critical' : 'text-soc-muted'
                }`}
              >
                {(resultSummary.requestsDroppedTotal / 1000).toFixed(0)}K
              </div>
            </div>
          </div>

          {/* Explanation Panel */}
          <div className="p-3.5 rounded-xl bg-soc-surface2/40 border border-soc-border space-y-2">
            <div className="font-semibold text-xs text-soc-text flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-soc-accent" />
              <span>Incident Explanation & Root Cause Analysis</span>
            </div>
            <div className="text-soc-muted leading-relaxed whitespace-pre-line text-[11px]">
              {resultSummary.explanationText}
            </div>
          </div>

          {/* What-If Mode */}
          <div className="space-y-2 pt-1">
            <div className="font-semibold text-xs text-soc-text flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-soc-accent" />
              <span>"What If?" Hypotheses Testing</span>
            </div>
            <p className="text-[11px] text-soc-muted">
              Rerun this scenario with an altered architectural condition to immediately observe the difference in defense posture.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handleWhatIf('cdn')}
                className="p-2.5 rounded-lg bg-soc-surface2 border border-soc-border hover:border-soc-accent/60 text-left transition-colors flex items-center justify-between"
              >
                <span>What if CDN was enabled?</span>
                <ArrowRight className="w-3.5 h-3.5 text-soc-accent" />
              </button>

              <button
                onClick={() => handleWhatIf('servers8')}
                className="p-2.5 rounded-lg bg-soc-surface2 border border-soc-border hover:border-soc-accent/60 text-left transition-colors flex items-center justify-between"
              >
                <span>What if we used 8 servers?</span>
                <ArrowRight className="w-3.5 h-3.5 text-soc-accent" />
              </button>

              <button
                onClick={() => handleWhatIf('rateLimit')}
                className="p-2.5 rounded-lg bg-soc-surface2 border border-soc-border hover:border-soc-accent/60 text-left transition-colors flex items-center justify-between"
              >
                <span>What if Rate Limiting was enabled?</span>
                <ArrowRight className="w-3.5 h-3.5 text-soc-accent" />
              </button>

              <button
                onClick={() => handleWhatIf('doubleTraffic')}
                className="p-2.5 rounded-lg bg-soc-surface2 border border-soc-border hover:border-soc-critical/60 text-left transition-colors flex items-center justify-between"
              >
                <span>What if traffic doubled?</span>
                <ArrowRight className="w-3.5 h-3.5 text-soc-critical" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-soc-surface2 border-t border-soc-border flex items-center justify-between">
          <button
            onClick={closeResultModal}
            className="px-4 py-1.5 rounded bg-soc-surface border border-soc-border hover:border-soc-muted text-xs text-soc-text font-medium transition-colors"
          >
            Close Report
          </button>

          <button
            onClick={() => {
              closeResultModal();
              startSimulation();
            }}
            className="px-4 py-1.5 rounded bg-soc-accent hover:bg-soc-accentHover text-white font-bold text-xs shadow-soc-glow transition-all"
          >
            Rerun Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
