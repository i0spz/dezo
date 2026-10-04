import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Monitor, Shield, RotateCcw, Check } from 'lucide-react';
import { useWindowManager } from '../../context/WindowManagerContext';

interface SettingsViewProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, toggleTheme }) => {
  const { restoreDefaultLayout, resetWorkspace } = useWindowManager();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    restoreDefaultLayout();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 select-none text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-soc-border">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-soc-accent" />
          <span className="font-bold text-soc-text tracking-wide uppercase text-xs">
            Lab Configuration & Preferences
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Theme Setting */}
        <div className="p-3 rounded-lg bg-soc-surface2/60 border border-soc-border flex items-center justify-between">
          <div>
            <div className="font-semibold text-soc-text">Theme Mode</div>
            <div className="text-[11px] text-soc-muted">
              Toggle between SOC Dark and Clean Light interfaces.
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded bg-soc-surface border border-soc-border text-soc-text font-medium text-xs hover:border-soc-accent"
          >
            {theme === 'dark' ? 'Dark Mode (Active)' : 'Light Mode (Active)'}
          </button>
        </div>

        {/* Audio Effects */}
        <div className="p-3 rounded-lg bg-soc-surface2/60 border border-soc-border flex items-center justify-between">
          <div>
            <div className="font-semibold text-soc-text">Telemetry Audio Effects</div>
            <div className="text-[11px] text-soc-muted">
              Subtle synthetic clicks and critical alarm tones.
            </div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded border transition-colors ${
              soundEnabled
                ? 'bg-soc-accent/20 border-soc-accent text-soc-accent'
                : 'bg-soc-surface border-soc-border text-soc-muted'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Layout Reset */}
        <div className="p-3 rounded-lg bg-soc-surface2/60 border border-soc-border flex items-center justify-between">
          <div>
            <div className="font-semibold text-soc-text">Reset Desktop Workspace</div>
            <div className="text-[11px] text-soc-muted">
              Restore default window positions, sizes, and layout.
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-soc-surface border border-soc-border hover:border-soc-warning/60 text-soc-text font-medium text-xs transition-colors"
          >
            {resetSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-soc-success" />
                <span className="text-soc-success">Restored</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Default</span>
              </>
            )}
          </button>
        </div>

        {/* Educational Policy */}
        <div className="p-3 rounded-lg bg-soc-surface2/40 border border-soc-border space-y-1">
          <div className="font-semibold text-soc-text text-[11px] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-soc-success" />
            <span>Safety & Simulation Integrity</span>
          </div>
          <p className="text-[10px] text-soc-muted leading-relaxed">
            This platform generates purely synthetic client traffic and simulated queue metrics. No network sockets or real HTTP attack vectors are ever established.
          </p>
        </div>
      </div>
    </div>
  );
};
