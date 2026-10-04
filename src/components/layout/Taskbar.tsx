import React from 'react';
import {
  Sliders,
  Server,
  BarChart3,
  ShieldAlert,
  FolderArchive,
  BookOpen,
  History,
  Settings as SettingsIcon,
  Activity,
  Flame,
  Network,
} from 'lucide-react';
import { WindowId } from '../../types/window';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useSimulation } from '../../context/SimulationContext';

const ICON_MAP: Record<WindowId, React.ReactNode> = {
  builder: <Sliders className="w-3.5 h-3.5" />,
  metrics: <Activity className="w-3.5 h-3.5" />,
  serverHealth: <Server className="w-3.5 h-3.5" />,
  defense: <ShieldAlert className="w-3.5 h-3.5" />,
  eventLog: <History className="w-3.5 h-3.5" />,
  charts: <BarChart3 className="w-3.5 h-3.5" />,
  topology: <Network className="w-3.5 h-3.5" />,
  chaos: <Flame className="w-3.5 h-3.5" />,
  scenarios: <FolderArchive className="w-3.5 h-3.5" />,
  learning: <BookOpen className="w-3.5 h-3.5" />,
  history: <History className="w-3.5 h-3.5" />,
  settings: <SettingsIcon className="w-3.5 h-3.5" />,
};

export const Taskbar: React.FC = () => {
  const {
    windows,
    activeWindowId,
    focusWindow,
    minimizeWindow,
    restoreWindow,
  } = useWindowManager();

  const { metrics, servers, status } = useSimulation();

  const openWindows = (Object.keys(windows) as WindowId[]).filter((id) => windows[id].isOpen);

  const handleTaskbarItemClick = (id: WindowId) => {
    const win = windows[id];
    if (!win) return;

    if (win.isMinimized) {
      restoreWindow(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  const healthyCount = servers.filter((s) => s.status !== 'Offline').length;

  return (
    <div className="h-10 bg-soc-surface border-t border-soc-border px-3 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left: Window Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[70%]">
        {openWindows.map((id) => {
          const win = windows[id];
          const isActive = activeWindowId === id && !win.isMinimized;
          const isMinimized = win.isMinimized;

          return (
            <button
              key={id}
              onClick={() => handleTaskbarItemClick(id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all max-w-[170px] truncate ${
                isActive
                  ? 'bg-soc-accent text-white shadow-soc-glow'
                  : isMinimized
                  ? 'bg-soc-surface2/60 border border-dashed border-soc-border text-soc-muted hover:text-soc-text'
                  : 'bg-soc-surface2 border border-soc-border text-soc-text hover:border-soc-muted'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-soc-muted'}>
                {ICON_MAP[id]}
              </span>
              <span className="truncate">{win.title}</span>
              {isMinimized && (
                <span className="text-[10px] text-soc-muted font-mono">(min)</span>
              )}
            </button>
          );
        })}

        {openWindows.length === 0 && (
          <span className="text-xs text-soc-muted font-mono italic">
            No windows open. Select a tool from the sidebar.
          </span>
        )}
      </div>

      {/* Right: Real-time Telemetry Mini-Badges */}
      <div className="flex items-center gap-3 text-xs font-mono text-soc-muted shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-soc-muted">FLEET:</span>
          <span className="text-soc-text font-bold">
            {healthyCount}/{servers.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-soc-muted">AVG CPU:</span>
          <span
            className={`font-bold ${
              metrics.serverCpu >= 85
                ? 'text-soc-critical animate-pulse'
                : metrics.serverCpu >= 70
                ? 'text-soc-warning'
                : 'text-soc-success'
            }`}
          >
            {metrics.serverCpu}%
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-soc-muted">INGRESS:</span>
          <span className="text-soc-accent font-bold">
            {metrics.incomingRequests > 1000
              ? `${(metrics.incomingRequests / 1000).toFixed(0)}K`
              : metrics.incomingRequests}{' '}
            req/s
          </span>
        </div>
      </div>
    </div>
  );
};
