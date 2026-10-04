export type WindowId =
  | 'builder'
  | 'metrics'
  | 'serverHealth'
  | 'eventLog'
  | 'defense'
  | 'topology'
  | 'charts'
  | 'chaos'
  | 'scenarios'
  | 'learning'
  | 'history'
  | 'settings';

export type SnapState = 'none' | 'left' | 'right' | 'top-maximize';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowBounds extends WindowPosition, WindowSize {}

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: WindowPosition;
  size: WindowSize;
  previousBounds: WindowBounds;
  zIndex: number;
  snapState: SnapState;
}

export type WorkspacePreset = 'monitoring' | 'defense' | 'analysis' | 'fullSoc';

export interface WorkspaceLayout {
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
}
