import React, { useState } from 'react';
import { Terminal, Shield, AlertTriangle, Flame, Info, Filter, Trash2 } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { EventSeverity } from '../../types/simulation';

export const EventLogStream: React.FC = () => {
  const { events } = useSimulation();
  const [filter, setFilter] = useState<'all' | EventSeverity>('all');

  const filteredEvents = filter === 'all' ? events : events.filter((e) => e.severity === filter);

  const getSeverityBadge = (sev: EventSeverity) => {
    switch (sev) {
      case 'critical':
        return {
          icon: <Flame className="w-3 h-3 text-soc-critical" />,
          color: 'text-soc-critical bg-soc-critical/10 border-soc-critical/30',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-3 h-3 text-soc-warning" />,
          color: 'text-soc-warning bg-soc-warning/10 border-soc-warning/30',
        };
      case 'defense':
        return {
          icon: <Shield className="w-3 h-3 text-soc-success" />,
          color: 'text-soc-success bg-soc-success/10 border-soc-success/30',
        };
      case 'autoscale':
        return {
          icon: <Shield className="w-3 h-3 text-soc-accent" />,
          color: 'text-soc-accent bg-soc-accent/10 border-soc-accent/30',
        };
      default:
        return {
          icon: <Info className="w-3 h-3 text-soc-muted" />,
          color: 'text-soc-muted bg-soc-surface border-soc-border',
        };
    }
  };

  return (
    <div className="p-3 flex flex-col h-full space-y-2.5 select-none font-mono text-xs">
      {/* Header & Filter Tabs */}
      <div className="flex items-center justify-between pb-2 border-b border-soc-border shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-soc-accent" />
          <span className="font-bold text-soc-text tracking-wide uppercase text-[11px]">
            SOC Event Stream
          </span>
          <span className="text-[10px] text-soc-muted">({events.length})</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1">
          {(['all', 'defense', 'warning', 'critical'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold transition-colors ${
                filter === sev
                  ? 'bg-soc-accent text-white'
                  : 'bg-soc-surface2 text-soc-muted hover:text-soc-text'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
        {filteredEvents.map((item) => {
          const badge = getSeverityBadge(item.severity);

          return (
            <div
              key={item.id}
              className="p-2 rounded bg-soc-surface2/50 border border-soc-border hover:border-soc-border/80 flex items-start gap-2.5 transition-colors"
            >
              {/* Timestamp */}
              <span className="text-soc-muted font-bold tracking-wider shrink-0">
                {item.timeString}
              </span>

              {/* Severity Icon */}
              <span className={`p-0.5 rounded border shrink-0 ${badge.color}`}>
                {badge.icon}
              </span>

              {/* Message */}
              <span className="text-soc-text leading-tight flex-1 break-words font-sans">
                {item.message}
              </span>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-soc-muted italic">
            No events match current filter.
          </div>
        )}
      </div>
    </div>
  );
};
