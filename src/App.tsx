import React, { useState, useEffect } from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { WindowManagerProvider } from './context/WindowManagerContext';
import { TopHeader } from './components/layout/TopHeader';
import { Sidebar } from './components/layout/Sidebar';
import { SocWorkspace } from './components/layout/SocWorkspace';
import { Taskbar } from './components/layout/Taskbar';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ddos_sim_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('ddos_sim_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <SimulationProvider>
      <WindowManagerProvider>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-soc-bg text-soc-text font-sans select-none">
          {/* Top Header */}
          <TopHeader theme={theme} toggleTheme={toggleTheme} />

          {/* Center: Sidebar + Desktop Workspace */}
          <div className="flex-1 flex min-h-0 overflow-hidden relative">
            <Sidebar />
            <SocWorkspace theme={theme} toggleTheme={toggleTheme} />
          </div>

          {/* Bottom Taskbar */}
          <Taskbar />
        </div>
      </WindowManagerProvider>
    </SimulationProvider>
  );
}

export default App;
