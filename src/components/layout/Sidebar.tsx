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
  Info,
} from 'lucide-react';
import { WindowId } from '../../types/window';
import { useWindowManager } from '../../context/WindowManagerContext';

interface SidebarItem {
  id: WindowId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { windows, activeWindowId, openWindow, focusWindow } = useWindowManager();

  const navItems: SidebarItem[] = [
    { id: 'builder', label: 'Simulation', icon: <Sliders className="w-4 h-4" /> },
    { id: 'metrics', label: 'Live Metrics', icon: <Activity className="w-4 h-4" /> },
    { id: 'serverHealth', label: 'Infrastructure', icon: <Server className="w-4 h-4" /> },
    { id: 'defense', label: 'Defense', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'eventLog', label: 'Event Log', icon: <History className="w-4 h-4" /> },
    { id: 'charts', label: 'Traffic Analysis', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'topology', label: 'Network Topology', icon: <Network className="w-4 h-4" /> },
    { id: 'chaos', label: 'Chaos Controls', icon: <Flame className="w-4 h-4 text-soc-critical" /> },
    { id: 'scenarios', label: 'Scenarios', icon: <FolderArchive className="w-4 h-4" /> },
    { id: 'learning', label: 'Learning Center', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'history', label: 'Simulation History', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: WindowId) => {
    const win = windows[id];
    if (win && win.isOpen && !win.isMinimized) {
      focusWindow(id);
    } else {
      openWindow(id);
    }
  };

  return (
    <aside className="w-56 bg-soc-surface border-r border-soc-border flex flex-col justify-between shrink-0 select-none z-20">
      {/* Top Nav Items */}
      <div className="p-3">
        <div className="px-2 py-1.5 text-[10px] uppercase font-mono tracking-wider text-soc-muted flex items-center justify-between">
          <span>Operations Console</span>
          <span className="w-1.5 h-1.5 rounded-full bg-soc-accent animate-pulse" />
        </div>

        <nav className="space-y-1 mt-1">
          {navItems.map((item) => {
            const win = windows[item.id];
            const isOpen = win?.isOpen && !win?.isMinimized;
            const isActive = activeWindowId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-soc-accent/15 text-soc-accent border border-soc-accent/30 font-semibold'
                    : isOpen
                    ? 'bg-soc-surface2 text-soc-text hover:bg-soc-surface2/80'
                    : 'text-soc-muted hover:text-soc-text hover:bg-soc-surface2/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-soc-accent' : isOpen ? 'text-soc-text' : 'text-soc-muted'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {/* Open Indicator Dot */}
                {isOpen && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-soc-accent ring-2 ring-soc-accent/30' : 'bg-soc-border'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Information & Educational Disclaimer */}
      <div className="p-3 border-t border-soc-border/70 space-y-2 bg-soc-surface2/30">
        <div className="p-2 rounded bg-soc-surface border border-soc-border/80">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-soc-text mb-1">
            <Info className="w-3.5 h-3.5 text-soc-accent shrink-0" />
            <span>Educational Lab</span>
          </div>
          <p className="text-[10px] text-soc-muted leading-relaxed">
            All traffic, attacks, and servers are simulated locally in-browser. Zero real-world packets.
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-soc-muted px-1">
          <span>MODE: VIRTUAL SOC</span>
          <span className="text-soc-success">SECURE</span>
        </div>
      </div>
    </aside>
  );
};
