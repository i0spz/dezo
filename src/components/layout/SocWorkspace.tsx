import React, { useRef } from 'react';
import {
  Sliders,
  Activity,
  Server,
  ShieldAlert,
  History,
  BarChart3,
  Network,
  Flame,
  FolderArchive,
  BookOpen,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { WindowId } from '../../types/window';
import { SocWindow } from '../window/SocWindow';
import { SimulationBuilder } from '../builder/SimulationBuilder';
import { LiveMetricsCards } from '../metrics/LiveMetricsCards';
import { ServerHealthGrid } from '../infrastructure/ServerHealthGrid';
import { DefensePanel } from '../defense/DefensePanel';
import { EventLogStream } from '../events/EventLogStream';
import { TrafficAnalysisView } from '../charts/TrafficAnalysisView';
import { NetworkTopologyPreview } from '../topology/NetworkTopologyPreview';
import { ChaosControls } from '../chaos/ChaosControls';
import { ScenariosView } from '../scenarios/ScenariosView';
import { LearningCenterView } from '../learning/LearningCenterView';
import { SimulationHistoryView } from '../history/SimulationHistoryView';
import { SettingsView } from '../settings/SettingsView';
import { ResultPostMortemModal } from '../report/ResultPostMortemModal';

interface SocWorkspaceProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const SocWorkspace: React.FC<SocWorkspaceProps> = ({ theme, toggleTheme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { windows, isMobile, activeWindowId, focusWindow } = useWindowManager();

  const renderWindowContent = (id: WindowId) => {
    switch (id) {
      case 'builder':
        return <SimulationBuilder />;
      case 'metrics':
        return <LiveMetricsCards />;
      case 'serverHealth':
        return <ServerHealthGrid />;
      case 'defense':
        return <DefensePanel />;
      case 'eventLog':
        return <EventLogStream />;
      case 'charts':
        return <TrafficAnalysisView />;
      case 'topology':
        return <NetworkTopologyPreview />;
      case 'chaos':
        return <ChaosControls />;
      case 'scenarios':
        return <ScenariosView />;
      case 'learning':
        return <LearningCenterView />;
      case 'history':
        return <SimulationHistoryView />;
      case 'settings':
        return <SettingsView theme={theme} toggleTheme={toggleTheme} />;
      default:
        return null;
    }
  };

  const getWindowIcon = (id: WindowId) => {
    switch (id) {
      case 'builder':
        return <Sliders className="w-3.5 h-3.5" />;
      case 'metrics':
        return <Activity className="w-3.5 h-3.5" />;
      case 'serverHealth':
        return <Server className="w-3.5 h-3.5" />;
      case 'defense':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'eventLog':
        return <History className="w-3.5 h-3.5" />;
      case 'charts':
        return <BarChart3 className="w-3.5 h-3.5" />;
      case 'topology':
        return <Network className="w-3.5 h-3.5" />;
      case 'chaos':
        return <Flame className="w-3.5 h-3.5 text-soc-critical" />;
      case 'scenarios':
        return <FolderArchive className="w-3.5 h-3.5" />;
      case 'learning':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'history':
        return <History className="w-3.5 h-3.5" />;
      case 'settings':
        return <SettingsIcon className="w-3.5 h-3.5" />;
    }
  };

  const windowIds = Object.keys(windows) as WindowId[];

  return (
    <main
      ref={containerRef}
      className="flex-1 relative bg-soc-bg overflow-hidden select-none"
    >
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(var(--soc-border) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Render all open windows */}
      {windowIds.map((id) => (
        <SocWindow
          key={id}
          windowState={windows[id]}
          icon={getWindowIcon(id)}
          containerRef={containerRef}
        >
          {renderWindowContent(id)}
        </SocWindow>
      ))}

      {/* Post-Mortem Incident Report Modal */}
      <ResultPostMortemModal />
    </main>
  );
};
