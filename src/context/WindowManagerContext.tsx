import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  WindowId,
  WindowState,
  WindowBounds,
  SnapState,
  WorkspacePreset,
} from '../types/window';

interface WindowManagerContextType {
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
  highestZIndex: number;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  toggleMaximizeWindow: (id: WindowId) => void;
  updateWindowBounds: (id: WindowId, bounds: Partial<WindowBounds>, snapState?: SnapState) => void;
  saveWorkspace: () => void;
  resetWorkspace: () => void;
  restoreDefaultLayout: () => void;
  applyPreset: (preset: WorkspacePreset) => void;
  isMobile: boolean;
}

const STORAGE_KEY = 'ddos_sim_workspace_layout_v2';

const WINDOW_DEFINITIONS: Record<WindowId, { title: string; defaultWidth: number; defaultHeight: number }> = {
  builder: { title: 'Simulation Builder', defaultWidth: 540, defaultHeight: 640 },
  metrics: { title: 'Live Metrics', defaultWidth: 460, defaultHeight: 400 },
  serverHealth: { title: 'Server Health', defaultWidth: 480, defaultHeight: 420 },
  eventLog: { title: 'Event Log Stream', defaultWidth: 440, defaultHeight: 420 },
  defense: { title: 'Defense Panel', defaultWidth: 440, defaultHeight: 460 },
  topology: { title: 'Network Topology', defaultWidth: 700, defaultHeight: 480 },
  charts: { title: 'Traffic Analysis', defaultWidth: 640, defaultHeight: 440 },
  chaos: { title: 'Chaos Controls', defaultWidth: 420, defaultHeight: 420 },
  scenarios: { title: 'Scenarios & Challenges', defaultWidth: 580, defaultHeight: 520 },
  learning: { title: 'Cyber Learning Center', defaultWidth: 620, defaultHeight: 560 },
  history: { title: 'Simulation History', defaultWidth: 580, defaultHeight: 460 },
  settings: { title: 'Lab Settings', defaultWidth: 420, defaultHeight: 380 },
};

function createInitialWindows(): Record<WindowId, WindowState> {
  const result: Partial<Record<WindowId, WindowState>> = {};

  (Object.keys(WINDOW_DEFINITIONS) as WindowId[]).forEach((id, index) => {
    const def = WINDOW_DEFINITIONS[id];
    // Default open set: builder, metrics, serverHealth, eventLog, defense
    const isInitiallyOpen = ['builder', 'metrics', 'serverHealth', 'eventLog', 'defense'].includes(id);

    // Initial curated positions
    let posX = 20 + (index % 4) * 35;
    let posY = 20 + (index % 4) * 35;

    if (id === 'builder') {
      posX = 20;
      posY = 20;
    } else if (id === 'metrics') {
      posX = 580;
      posY = 20;
    } else if (id === 'serverHealth') {
      posX = 580;
      posY = 440;
    } else if (id === 'eventLog') {
      posX = 1060;
      posY = 20;
    } else if (id === 'defense') {
      posX = 1060;
      posY = 460;
    }

    result[id] = {
      id,
      title: def.title,
      isOpen: isInitiallyOpen,
      isMinimized: false,
      isMaximized: false,
      position: { x: posX, y: posY },
      size: { width: def.defaultWidth, height: def.defaultHeight },
      previousBounds: { x: posX, y: posY, width: def.defaultWidth, height: def.defaultHeight },
      zIndex: isInitiallyOpen ? 10 + index : 1,
      snapState: 'none',
    };
  });

  return result as Record<WindowId, WindowState>;
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

export const WindowManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const defaults = createInitialWindows();
        // Merge with defaults to ensure all current window IDs exist
        return { ...defaults, ...parsed };
      }
    } catch {
      // ignore
    }
    return createInitialWindows();
  });

  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>('builder');
  const [highestZIndex, setHighestZIndex] = useState<number>(30);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const cascadeOffsetRef = useRef<number>(0);

  // Resize listener for mobile switch
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save to localStorage automatically on window changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(windows));
    } catch {
      // Storage quota or disabled
    }
  }, [windows]);

  // Focus Window (Bring to Front)
  const focusWindow = useCallback((id: WindowId) => {
    setHighestZIndex(prev => {
      const nextZ = prev + 1;
      setWindows(curr => {
        if (!curr[id]) return curr;
        return {
          ...curr,
          [id]: {
            ...curr[id],
            zIndex: nextZ,
            isMinimized: false,
          },
        };
      });
      return nextZ;
    });
    setActiveWindowId(id);
  }, []);

  // Open Window with Smart Cascade
  const openWindow = useCallback((id: WindowId) => {
    setWindows(curr => {
      const win = curr[id];
      if (!win) return curr;

      // If already open, just restore and bring to front
      if (win.isOpen) {
        return {
          ...curr,
          [id]: {
            ...win,
            isMinimized: false,
          },
        };
      }

      // Smart Cascade positioning: stagger offset based on current open count
      cascadeOffsetRef.current = (cascadeOffsetRef.current + 1) % 6;
      const staggerX = 40 + cascadeOffsetRef.current * 32;
      const staggerY = 30 + cascadeOffsetRef.current * 32;

      return {
        ...curr,
        [id]: {
          ...win,
          isOpen: true,
          isMinimized: false,
          position: { x: staggerX, y: staggerY },
          previousBounds: { ...win.previousBounds, x: staggerX, y: staggerY },
        },
      };
    });

    focusWindow(id);
  }, [focusWindow]);

  // Close Window
  const closeWindow = useCallback((id: WindowId) => {
    setWindows(curr => {
      if (!curr[id]) return curr;
      return {
        ...curr,
        [id]: {
          ...curr[id],
          isOpen: false,
          isMinimized: false,
        },
      };
    });
    setActiveWindowId(prev => (prev === id ? null : prev));
  }, []);

  // Minimize Window
  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows(curr => {
      if (!curr[id]) return curr;
      return {
        ...curr,
        [id]: {
          ...curr[id],
          isMinimized: true,
        },
      };
    });
    setActiveWindowId(prev => (prev === id ? null : prev));
  }, []);

  // Restore Window
  const restoreWindow = useCallback((id: WindowId) => {
    setWindows(curr => {
      if (!curr[id]) return curr;
      return {
        ...curr,
        [id]: {
          ...curr[id],
          isMinimized: false,
          isOpen: true,
        },
      };
    });
    focusWindow(id);
  }, [focusWindow]);

  // Toggle Maximize Window
  const toggleMaximizeWindow = useCallback((id: WindowId) => {
    setWindows(curr => {
      const win = curr[id];
      if (!win) return curr;

      if (win.isMaximized || win.snapState !== 'none') {
        // Restore to exact previous bounds!
        return {
          ...curr,
          [id]: {
            ...win,
            isMaximized: false,
            snapState: 'none',
            position: { x: win.previousBounds.x, y: win.previousBounds.y },
            size: { width: win.previousBounds.width, height: win.previousBounds.height },
          },
        };
      } else {
        // Maximize: save current bounds first!
        return {
          ...curr,
          [id]: {
            ...win,
            isMaximized: true,
            snapState: 'top-maximize',
            previousBounds: {
              x: win.position.x,
              y: win.position.y,
              width: win.size.width,
              height: win.size.height,
            },
          },
        };
      }
    });
    focusWindow(id);
  }, [focusWindow]);

  // Update bounds from drag or resize
  const updateWindowBounds = useCallback((id: WindowId, bounds: Partial<WindowBounds>, snapState?: SnapState) => {
    setWindows(curr => {
      const win = curr[id];
      if (!win) return curr;

      const nextPos = {
        x: bounds.x !== undefined ? bounds.x : win.position.x,
        y: bounds.y !== undefined ? bounds.y : win.position.y,
      };

      const nextSize = {
        width: bounds.width !== undefined ? bounds.width : win.size.width,
        height: bounds.height !== undefined ? bounds.height : win.size.height,
      };

      const isSnapping = snapState && snapState !== 'none';

      return {
        ...curr,
        [id]: {
          ...win,
          position: nextPos,
          size: nextSize,
          isMaximized: snapState === 'top-maximize',
          snapState: snapState || (win.isMaximized ? 'top-maximize' : 'none'),
          // Only update previousBounds if NOT currently snapped or maximized
          previousBounds: !isSnapping && !win.isMaximized
            ? { ...nextPos, ...nextSize }
            : win.previousBounds,
        },
      };
    });
  }, []);

  // Save Workspace manually
  const saveWorkspace = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(windows));
    } catch {
      // ignore
    }
  }, [windows]);

  // Reset Workspace (close all except builder)
  const resetWorkspace = useCallback(() => {
    const defaults = createInitialWindows();
    const clean: Record<WindowId, WindowState> = { ...defaults };
    (Object.keys(clean) as WindowId[]).forEach(k => {
      clean[k].isOpen = k === 'builder';
      clean[k].isMinimized = false;
      clean[k].isMaximized = false;
      clean[k].snapState = 'none';
    });
    setWindows(clean);
    setActiveWindowId('builder');
  }, []);

  // Restore Default Layout
  const restoreDefaultLayout = useCallback(() => {
    const defaults = createInitialWindows();
    setWindows(defaults);
    setActiveWindowId('builder');
  }, []);

  // Apply Presets (Monitoring, Defense, Analysis, Full SOC)
  const applyPreset = useCallback((preset: WorkspacePreset) => {
    const defaults = createInitialWindows();
    const updated: Record<WindowId, WindowState> = { ...defaults };

    // Close all first
    (Object.keys(updated) as WindowId[]).forEach(k => {
      updated[k].isOpen = false;
      updated[k].isMinimized = false;
      updated[k].isMaximized = false;
      updated[k].snapState = 'none';
    });

    const wWidth = typeof window !== 'undefined' ? window.innerWidth - 240 : 1200;
    const wHeight = typeof window !== 'undefined' ? window.innerHeight - 90 : 800;

    switch (preset) {
      case 'monitoring':
        // Metrics (top-left), Server Health (top-right), Topology or EventLog (bottom)
        updated.metrics = {
          ...updated.metrics,
          isOpen: true,
          position: { x: 20, y: 20 },
          size: { width: Math.max(420, Math.floor(wWidth * 0.48)), height: Math.floor(wHeight * 0.45) },
          zIndex: 10,
        };
        updated.serverHealth = {
          ...updated.serverHealth,
          isOpen: true,
          position: { x: Math.floor(wWidth * 0.52), y: 20 },
          size: { width: Math.max(420, Math.floor(wWidth * 0.46)), height: Math.floor(wHeight * 0.45) },
          zIndex: 11,
        };
        updated.eventLog = {
          ...updated.eventLog,
          isOpen: true,
          position: { x: 20, y: Math.floor(wHeight * 0.50) },
          size: { width: Math.max(420, Math.floor(wWidth * 0.48)), height: Math.floor(wHeight * 0.45) },
          zIndex: 12,
        };
        updated.builder = {
          ...updated.builder,
          isOpen: true,
          position: { x: Math.floor(wWidth * 0.52), y: Math.floor(wHeight * 0.50) },
          size: { width: Math.max(420, Math.floor(wWidth * 0.46)), height: Math.floor(wHeight * 0.45) },
          zIndex: 13,
        };
        break;

      case 'defense':
        // Defense Panel (left half), Server Health (top-right), Metrics & Event Log (bottom-right)
        updated.defense = {
          ...updated.defense,
          isOpen: true,
          position: { x: 20, y: 20 },
          size: { width: Math.max(400, Math.floor(wWidth * 0.42)), height: Math.floor(wHeight * 0.94) },
          zIndex: 15,
        };
        updated.serverHealth = {
          ...updated.serverHealth,
          isOpen: true,
          position: { x: Math.floor(wWidth * 0.45), y: 20 },
          size: { width: Math.max(400, Math.floor(wWidth * 0.53)), height: Math.floor(wHeight * 0.48) },
          zIndex: 16,
        };
        updated.metrics = {
          ...updated.metrics,
          isOpen: true,
          position: { x: Math.floor(wWidth * 0.45), y: Math.floor(wHeight * 0.52) },
          size: { width: Math.max(400, Math.floor(wWidth * 0.53)), height: Math.floor(wHeight * 0.42) },
          zIndex: 17,
        };
        break;

      case 'analysis':
        // Event Log (left), Metrics (top right), Builder (bottom right)
        updated.eventLog = {
          ...updated.eventLog,
          isOpen: true,
          position: { x: 20, y: 20 },
          size: { width: Math.max(420, Math.floor(wWidth * 0.45)), height: Math.floor(wHeight * 0.94) },
          zIndex: 20,
        };
        updated.metrics = {
          ...updated.metrics,
          isOpen: true,
          position: { x: Math.floor(wWidth * 0.48), y: 20 },
          size: { width: Math.max(420, Math.floor(wWidth * 0.50)), height: Math.floor(wHeight * 0.45) },
          zIndex: 21,
        };
        updated.serverHealth = {
          ...updated.serverHealth,
          isOpen: true,
          position: { x: Math.floor(wWidth * 0.48), y: Math.floor(wHeight * 0.50) },
          size: { width: Math.max(420, Math.floor(wWidth * 0.50)), height: Math.floor(wHeight * 0.44) },
          zIndex: 22,
        };
        break;

      case 'fullSoc':
        // 4-panel quadrant grid
        const halfW = Math.floor((wWidth - 60) / 2);
        const halfH = Math.floor((wHeight - 60) / 2);

        updated.builder = {
          ...updated.builder,
          isOpen: true,
          position: { x: 20, y: 20 },
          size: { width: halfW, height: halfH },
          zIndex: 25,
        };
        updated.metrics = {
          ...updated.metrics,
          isOpen: true,
          position: { x: halfW + 40, y: 20 },
          size: { width: halfW, height: halfH },
          zIndex: 26,
        };
        updated.serverHealth = {
          ...updated.serverHealth,
          isOpen: true,
          position: { x: 20, y: halfH + 40 },
          size: { width: halfW, height: halfH },
          zIndex: 27,
        };
        updated.defense = {
          ...updated.defense,
          isOpen: true,
          position: { x: halfW + 40, y: halfH + 40 },
          size: { width: halfW, height: halfH },
          zIndex: 28,
        };
        break;
    }

    setWindows(updated);
    setActiveWindowId(preset === 'defense' ? 'defense' : 'metrics');
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        highestZIndex,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        restoreWindow,
        toggleMaximizeWindow,
        updateWindowBounds,
        saveWorkspace,
        resetWorkspace,
        restoreDefaultLayout,
        applyPreset,
        isMobile,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
};
