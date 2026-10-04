import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sun,
  Moon,
  Shield,
  LayoutGrid,
  Save,
  RotateCw,
  Activity,
  Layers,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { WorkspacePreset } from '../../types/window';

interface TopHeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ theme, toggleTheme }) => {
  const {
    status,
    speed,
    currentSecond,
    params,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    setSpeed,
  } = useSimulation();

  const {
    saveWorkspace,
    resetWorkspace,
    restoreDefaultLayout,
    applyPreset,
  } = useWindowManager();

  const duration = params.durationSeconds;
  const timeFormatted = `${String(Math.floor(currentSecond / 60)).padStart(2, '0')}:${String(currentSecond % 60).padStart(2, '0')}`;
  const totalFormatted = duration > 0 ? `${String(Math.floor(duration / 60)).padStart(2, '0')}:${String(duration % 60).padStart(2, '0')}` : '∞';

  return (
    <header className="h-14 bg-soc-surface border-b border-soc-border px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left: App Title & Status Indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-soc-accent/15 border border-soc-accent/40 flex items-center justify-center text-soc-accent shadow-soc-glow">
            <Shield className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-soc-text">
                DDoS Simulation Lab
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-soc-accent/10 border border-soc-accent/30 text-soc-accent">
                SOC v2.0
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-soc-muted">
              <span>{params.target}</span>
              <span className="font-mono text-[10px] text-soc-muted/70">[{params.targetIp}]</span>
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-soc-surface2 border border-soc-border">
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'active'
                ? 'bg-soc-success animate-pulse'
                : status === 'paused'
                ? 'bg-soc-warning'
                : status === 'completed'
                ? 'bg-soc-accent'
                : 'bg-soc-muted/50'
            }`}
          />
          <span className="text-xs font-medium text-soc-text capitalize">
            {status === 'active' ? (
              <span className="text-soc-success">Simulation Active</span>
            ) : status === 'paused' ? (
              <span className="text-soc-warning">Simulation Paused</span>
            ) : status === 'completed' ? (
              <span className="text-soc-accent">Simulation Completed</span>
            ) : (
              <span className="text-soc-muted">Simulation Offline</span>
            )}
          </span>
          <span className="text-[11px] font-mono text-soc-muted pl-1 border-l border-soc-border/60">
            {timeFormatted} / {totalFormatted}
          </span>
        </div>
      </div>

      {/* Center: Playback Controls & Speed Toggle */}
      <div className="flex items-center gap-2">
        {/* Play/Pause/Resume */}
        {status === 'offline' || status === 'completed' ? (
          <button
            onClick={startSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-soc-accent hover:bg-soc-accentHover text-white font-medium text-xs shadow-soc-glow transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Simulation</span>
          </button>
        ) : status === 'active' ? (
          <button
            onClick={pauseSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-soc-warning/20 border border-soc-warning/40 hover:bg-soc-warning/30 text-soc-warning font-medium text-xs transition-all active:scale-95"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={resumeSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-soc-success/20 border border-soc-success/40 hover:bg-soc-success/30 text-soc-success font-medium text-xs transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume</span>
          </button>
        )}

        {/* Reset */}
        <button
          onClick={resetSimulation}
          title="Reset Simulation"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-soc-surface2 border border-soc-border hover:border-soc-muted/60 text-soc-muted hover:text-soc-text font-medium text-xs transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        {/* Speed Selector */}
        <div className="flex items-center bg-soc-surface2 border border-soc-border rounded-md p-0.5 ml-2">
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                speed === s
                  ? 'bg-soc-accent text-white font-semibold shadow-sm'
                  : 'text-soc-muted hover:text-soc-text'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Right: Workspace Presets, Actions & Theme Toggle */}
      <div className="flex items-center gap-2">
        {/* Workspace Preset Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-soc-surface2 border border-soc-border hover:border-soc-accent/50 text-xs font-medium text-soc-text transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-soc-accent" />
            <span>Presets</span>
          </button>

          {/* Preset Menu */}
          <div className="absolute right-0 mt-1 w-44 bg-soc-surface border border-soc-border rounded-md shadow-window p-1 hidden group-hover:block z-50">
            <div className="px-2 py-1 text-[10px] uppercase font-mono text-soc-muted">
              Workspace Presets
            </div>
            {(['monitoring', 'defense', 'analysis', 'fullSoc'] as WorkspacePreset[]).map((p) => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className="w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-soc-surface2 text-soc-text capitalize flex items-center justify-between"
              >
                <span>{p === 'fullSoc' ? 'Full SOC Grid' : `${p} Preset`}</span>
              </button>
            ))}
            <div className="border-t border-soc-border/60 my-1" />
            <button
              onClick={saveWorkspace}
              className="w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-soc-surface2 text-soc-text flex items-center gap-1.5"
            >
              <Save className="w-3 h-3 text-soc-accent" />
              <span>Save Workspace</span>
            </button>
            <button
              onClick={restoreDefaultLayout}
              className="w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-soc-surface2 text-soc-text flex items-center gap-1.5"
            >
              <RotateCw className="w-3 h-3 text-soc-warning" />
              <span>Restore Default</span>
            </button>
            <button
              onClick={resetWorkspace}
              className="w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-soc-surface2 text-soc-critical flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Workspace</span>
            </button>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-8 h-8 rounded-md bg-soc-surface2 border border-soc-border flex items-center justify-center text-soc-muted hover:text-soc-text hover:border-soc-accent/50 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
