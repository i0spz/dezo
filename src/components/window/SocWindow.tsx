import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';
import { WindowId, WindowState, SnapState } from '../../types/window';
import { useWindowManager } from '../../context/WindowManagerContext';

interface SocWindowProps {
  windowState: WindowState;
  icon?: React.ReactNode;
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const SocWindow: React.FC<SocWindowProps> = ({
  windowState,
  icon,
  children,
  containerRef,
}) => {
  const {
    activeWindowId,
    focusWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    closeWindow,
    updateWindowBounds,
    isMobile,
  } = useWindowManager();

  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [potentialSnap, setPotentialSnap] = useState<SnapState>('none');
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [initialResize, setInitialResize] = useState({ x: 0, y: 0, w: 0, h: 0, startX: 0, startY: 0 });

  const isActive = activeWindowId === windowState.id;

  // Bring to front on click
  const handlePointerDown = () => {
    focusWindow(windowState.id);
  };

  // Drag start
  const handleDragStart = (e: React.PointerEvent) => {
    if (e.button !== 0 || windowState.isMaximized || isMobile) return;
    e.preventDefault();
    focusWindow(windowState.id);
    setIsDragging(true);

    const clientX = e.clientX;
    const clientY = e.clientY;

    setDragOffset({
      x: clientX - windowState.position.x,
      y: clientY - windowState.position.y,
    });
  };

  // Resize start
  const handleResizeStart = (e: React.PointerEvent, direction: string) => {
    if (e.button !== 0 || windowState.isMaximized || isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    focusWindow(windowState.id);
    setResizeDirection(direction);

    setInitialResize({
      x: windowState.position.x,
      y: windowState.position.y,
      w: windowState.size.width,
      h: windowState.size.height,
      startX: e.clientX,
      startY: e.clientY,
    });
  };

  // Dragging and Resizing Pointer Move / Up Listeners
  useEffect(() => {
    if (!isDragging && !resizeDirection) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      if (isDragging) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        // Workspace boundaries
        const maxX = containerRect.width - 80;
        const maxY = containerRect.height - 40;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        // Edge snap detection
        let snap: SnapState = 'none';
        if (e.clientX <= containerRect.left + 25) {
          snap = 'left';
        } else if (e.clientX >= containerRect.right - 25) {
          snap = 'right';
        } else if (e.clientY <= containerRect.top + 25) {
          snap = 'top-maximize';
        }
        setPotentialSnap(snap);

        updateWindowBounds(windowState.id, { x: newX, y: newY }, 'none');
      } else if (resizeDirection) {
        const deltaX = e.clientX - initialResize.startX;
        const deltaY = e.clientY - initialResize.startY;

        let newW = initialResize.w;
        let newH = initialResize.h;
        let newX = initialResize.x;
        let newY = initialResize.y;

        if (resizeDirection.includes('e')) {
          newW = Math.max(340, initialResize.w + deltaX);
        }
        if (resizeDirection.includes('s')) {
          newH = Math.max(220, initialResize.h + deltaY);
        }
        if (resizeDirection.includes('w')) {
          const proposedW = initialResize.w - deltaX;
          if (proposedW >= 340) {
            newW = proposedW;
            newX = initialResize.x + deltaX;
          }
        }
        if (resizeDirection.includes('n')) {
          const proposedH = initialResize.h - deltaY;
          if (proposedH >= 220) {
            newH = proposedH;
            newY = initialResize.y + deltaY;
          }
        }

        updateWindowBounds(windowState.id, { x: newX, y: newY, width: newW, height: newH }, 'none');
      }
    };

    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (containerRef.current && potentialSnap !== 'none') {
          const containerRect = containerRef.current.getBoundingClientRect();
          if (potentialSnap === 'left') {
            updateWindowBounds(
              windowState.id,
              { x: 0, y: 0, width: Math.floor(containerRect.width / 2), height: containerRect.height },
              'left'
            );
          } else if (potentialSnap === 'right') {
            const halfW = Math.floor(containerRect.width / 2);
            updateWindowBounds(
              windowState.id,
              { x: halfW, y: 0, width: halfW, height: containerRect.height },
              'right'
            );
          } else if (potentialSnap === 'top-maximize') {
            toggleMaximizeWindow(windowState.id);
          }
          setPotentialSnap('none');
        }
      }
      if (resizeDirection) {
        setResizeDirection(null);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [
    isDragging,
    resizeDirection,
    dragOffset,
    initialResize,
    potentialSnap,
    windowState.id,
    containerRef,
    updateWindowBounds,
    toggleMaximizeWindow,
  ]);

  if (!windowState.isOpen || windowState.isMinimized) {
    return null;
  }

  // Calculate actual rendered style based on maximized/snapped state
  const isSnappedOrMaximized = windowState.isMaximized || windowState.snapState !== 'none';

  const windowStyle: React.CSSProperties = isMobile
    ? {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: isActive ? 40 : 10,
      }
    : windowState.isMaximized
    ? {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: windowState.zIndex,
      }
    : windowState.snapState === 'left'
    ? {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '50%',
        height: '100%',
        zIndex: windowState.zIndex,
      }
    : windowState.snapState === 'right'
    ? {
        position: 'absolute',
        left: '50%',
        top: 0,
        width: '50%',
        height: '100%',
        zIndex: windowState.zIndex,
      }
    : {
        position: 'absolute',
        left: `${windowState.position.x}px`,
        top: `${windowState.position.y}px`,
        width: `${windowState.size.width}px`,
        height: `${windowState.size.height}px`,
        zIndex: windowState.zIndex,
      };

  return (
    <>
      {/* Visual Snap Guide Preview */}
      {isDragging && potentialSnap !== 'none' && (
        <div
          className={`absolute pointer-events-none rounded-lg border-2 border-dashed border-soc-accent/80 bg-soc-accent/15 backdrop-blur-sm z-50 transition-all duration-150 ${
            potentialSnap === 'left'
              ? 'left-2 top-2 bottom-2 w-[calc(50%-8px)]'
              : potentialSnap === 'right'
              ? 'right-2 top-2 bottom-2 w-[calc(50%-8px)]'
              : 'inset-2'
          }`}
        />
      )}

      {/* Main Window Frame */}
      <div
        ref={windowRef}
        onPointerDown={handlePointerDown}
        style={windowStyle}
        className={`flex flex-col bg-soc-surface border rounded-lg shadow-window overflow-hidden transition-shadow duration-150 ${
          isActive
            ? 'border-soc-accent/60 ring-1 ring-soc-accent/30 shadow-soc-glow'
            : 'border-soc-border hover:border-soc-border/80'
        } ${isDragging ? 'opacity-95 cursor-grabbing select-none' : ''}`}
      >
        {/* Title Bar Header */}
        <div
          onPointerDown={handleDragStart}
          onDoubleClick={() => toggleMaximizeWindow(windowState.id)}
          className={`h-9 px-3 flex items-center justify-between select-none cursor-grab active:cursor-grabbing border-b transition-colors ${
            isActive
              ? 'bg-soc-surface2/90 border-soc-border text-soc-text'
              : 'bg-soc-surface border-soc-border/60 text-soc-muted'
          }`}
        >
          {/* Title and Icon */}
          <div className="flex items-center gap-2 overflow-hidden">
            <span className={`text-sm ${isActive ? 'text-soc-accent' : 'text-soc-muted'}`}>
              {icon}
            </span>
            <span className="text-xs font-semibold tracking-wide truncate">
              {windowState.title}
            </span>
          </div>

          {/* Window Action Controls */}
          <div className="flex items-center gap-1">
            {/* Minimize */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(windowState.id);
              }}
              title="Minimize"
              className="w-6 h-6 rounded flex items-center justify-center text-soc-muted hover:text-soc-text hover:bg-soc-border/50 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Maximize / Restore */}
            {!isMobile && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMaximizeWindow(windowState.id);
                }}
                title={windowState.isMaximized ? 'Restore' : 'Maximize'}
                className="w-6 h-6 rounded flex items-center justify-center text-soc-muted hover:text-soc-text hover:bg-soc-border/50 transition-colors"
              >
                {windowState.isMaximized ? (
                  <Copy className="w-3 h-3 rotate-180" />
                ) : (
                  <Square className="w-3 h-3" />
                )}
              </button>
            )}

            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(windowState.id);
              }}
              title="Close"
              className="w-6 h-6 rounded flex items-center justify-center text-soc-muted hover:text-soc-critical hover:bg-soc-critical/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Window Body Container */}
        <div className="flex-1 min-h-0 bg-soc-bg/50 overflow-auto relative">
          {children}
        </div>

        {/* 8 Resize Handles (only active when not maximized or on mobile) */}
        {!isSnappedOrMaximized && !isMobile && (
          <>
            {/* Edges */}
            <div
              onPointerDown={(e) => handleResizeStart(e, 'n')}
              className="absolute top-0 left-2 right-2 h-1 cursor-ns-resize"
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 's')}
              className="absolute bottom-0 left-2 right-2 h-1 cursor-ns-resize"
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'w')}
              className="absolute left-0 top-2 bottom-2 w-1 cursor-ew-resize"
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'e')}
              className="absolute right-0 top-2 bottom-2 w-1 cursor-ew-resize"
            />
            {/* Corners */}
            <div
              onPointerDown={(e) => handleResizeStart(e, 'nw')}
              className="absolute top-0 left-0 w-2.5 h-2.5 cursor-nwse-resize"
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'ne')}
              className="absolute top-0 right-0 w-2.5 h-2.5 cursor-nesw-resize"
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'sw')}
              className="absolute bottom-0 left-0 w-2.5 h-2.5 cursor-nesw-resize"
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'se')}
              className="absolute bottom-0 right-0 w-2.5 h-2.5 cursor-nwse-resize"
            />
          </>
        )}
      </div>
    </>
  );
};
