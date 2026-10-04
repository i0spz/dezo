import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  SimulationParams,
  SimulationStatus,
  LiveMetrics,
  ServerNode,
  SimulationEvent,
  TimePointMetrics,
  SimulationResultSummary,
  ScenarioType,
  DefensesConfig,
} from '../types/simulation';
import { SCENARIO_PRESETS } from '../engine/scenarioPresets';
import { initializeServers, computeTick, generatePostMortem } from '../engine/simulationEngine';

interface SimulationContextType {
  params: SimulationParams;
  status: SimulationStatus;
  speed: number;
  currentSecond: number;
  metrics: LiveMetrics;
  servers: ServerNode[];
  events: SimulationEvent[];
  metricsHistory: TimePointMetrics[];
  resultSummary: SimulationResultSummary | null;
  autoScaledCount: number;
  // Controls
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  setSpeed: (speed: number) => void;
  updateParams: (updater: (prev: SimulationParams) => SimulationParams) => void;
  applyScenario: (scenario: ScenarioType) => void;
  toggleDefense: (key: keyof DefensesConfig) => void;
  setDefenseValue: (key: keyof DefensesConfig, value: boolean) => void;
  triggerChaos: (action: 'surge' | 'killServer' | 'dbSlowdown' | 'emergencyShield' | 'addServer' | 'recovery') => void;
  setManualSecond: (second: number) => void;
  closeResultModal: () => void;
}

const DEFAULT_PARAMS: SimulationParams = {
  scenario: 'Normal Traffic',
  attackProfile: 'HTTP Flood Simulation',
  botCount: 5000,
  distributionMode: 'Distributed',
  trafficIntensity: 'Low',
  trafficPattern: 'Constant',
  durationSeconds: 60,
  target: 'Demo Web Server',
  targetIp: '10.0.0.15',
  infrastructure: {
    serverCount: 2,
    serverCapacity: 'Standard',
    cpuCapacity: 60,
    ramCapacity: 60,
    networkCapacity: 70,
    databaseCapacity: 65,
    defenses: {
      rateLimiting: false,
      ipReputationFilter: false,
      cdn: false,
      webApplicationFirewall: false,
      loadBalancer: true,
      caching: true,
      autoScaling: false,
      trafficFiltering: false,
      challengePage: false,
      ddosProtectionService: false,
    },
  },
};

const INITIAL_METRICS: LiveMetrics = {
  incomingRequests: 0,
  blockedRequests: 0,
  passedRequests: 0,
  droppedRequests: 0,
  serverCpu: 15,
  memoryUsage: 20,
  networkUsageGbps: 0,
  responseTimeMs: 35,
  errorRatePercent: 0,
  activeConnections: 0,
  databaseLoadPercent: 10,
  cacheHitRatePercent: 0,
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [status, setStatus] = useState<SimulationStatus>('offline');
  const [speed, setSpeedState] = useState<number>(1);
  const [currentSecond, setCurrentSecond] = useState<number>(0);
  const [metrics, setMetrics] = useState<LiveMetrics>(INITIAL_METRICS);
  const [servers, setServers] = useState<ServerNode[]>(() => initializeServers(DEFAULT_PARAMS.infrastructure.serverCount));
  const [events, setEvents] = useState<SimulationEvent[]>([
    {
      id: 'ev-init',
      second: 0,
      timeString: '00:00',
      message: 'System ready. Configure environment and click Start Simulation.',
      severity: 'info',
    },
  ]);
  const [metricsHistory, setMetricsHistory] = useState<TimePointMetrics[]>([]);
  const [resultSummary, setResultSummary] = useState<SimulationResultSummary | null>(null);
  const [autoScaledCount, setAutoScaledCount] = useState<number>(0);

  // Peak tracking refs
  const peakTrafficRef = useRef<number>(0);
  const peakCpuRef = useRef<number>(0);
  const totalProcessedRef = useRef<number>(0);
  const totalBlockedRef = useRef<number>(0);
  const totalDroppedRef = useRef<number>(0);
  const highestLatencyRef = useRef<number>(0);
  const serversLostRef = useRef<number>(0);

  // Synchronous references for tick loop
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const serversRef = useRef(servers);
  serversRef.current = servers;

  const statusRef = useRef(status);
  statusRef.current = status;

  const secondRef = useRef(currentSecond);
  secondRef.current = currentSecond;

  const autoScaledCountRef = useRef(autoScaledCount);
  autoScaledCountRef.current = autoScaledCount;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Reset peak tracking
  const resetPeaks = useCallback(() => {
    peakTrafficRef.current = 0;
    peakCpuRef.current = 0;
    totalProcessedRef.current = 0;
    totalBlockedRef.current = 0;
    totalDroppedRef.current = 0;
    highestLatencyRef.current = 0;
    serversLostRef.current = 0;
  }, []);

  // Update parameters safely
  const updateParams = useCallback((updater: (prev: SimulationParams) => SimulationParams) => {
    setParams(prev => {
      const next = updater(prev);
      if (statusRef.current === 'offline') {
        setServers(initializeServers(next.infrastructure.serverCount));
      }
      return next;
    });
  }, []);

  // Apply Scenario preset
  const applyScenario = useCallback((scenarioName: ScenarioType) => {
    const preset = SCENARIO_PRESETS[scenarioName];
    if (!preset) return;

    setParams(prev => {
      const next: SimulationParams = {
        ...prev,
        ...preset,
        scenario: scenarioName,
        infrastructure: {
          ...prev.infrastructure,
          ...(preset.infrastructure || {}),
          defenses: {
            ...prev.infrastructure.defenses,
            ...(preset.infrastructure?.defenses || {}),
          },
        },
      };
      if (statusRef.current === 'offline') {
        setServers(initializeServers(next.infrastructure.serverCount));
      }
      return next;
    });

    setEvents(prev => [
      {
        id: `ev-scenario-${Date.now()}`,
        second: secondRef.current,
        timeString: `${String(Math.floor(secondRef.current / 60)).padStart(2, '0')}:${String(secondRef.current % 60).padStart(2, '0')}`,
        message: `Scenario configured: [${scenarioName}]`,
        severity: 'info',
      },
      ...prev,
    ]);
  }, []);

  // Toggle single defense
  const toggleDefense = useCallback((key: keyof DefensesConfig) => {
    setParams(prev => {
      const newVal = !prev.infrastructure.defenses[key];
      const next: SimulationParams = {
        ...prev,
        infrastructure: {
          ...prev.infrastructure,
          defenses: {
            ...prev.infrastructure.defenses,
            [key]: newVal,
          },
        },
      };
      return next;
    });

    setEvents(prev => [
      {
        id: `ev-def-toggle-${Date.now()}`,
        second: secondRef.current,
        timeString: `${String(Math.floor(secondRef.current / 60)).padStart(2, '0')}:${String(secondRef.current % 60).padStart(2, '0')}`,
        message: `Defense altered: ${key.replace(/([A-Z])/g, ' $1')} toggled`,
        severity: 'defense',
      },
      ...prev,
    ]);
  }, []);

  const setDefenseValue = useCallback((key: keyof DefensesConfig, value: boolean) => {
    setParams(prev => ({
      ...prev,
      infrastructure: {
        ...prev.infrastructure,
        defenses: {
          ...prev.infrastructure.defenses,
          [key]: value,
        },
      },
    }));
  }, []);

  // Chaos controls
  const triggerChaos = useCallback((action: 'surge' | 'killServer' | 'dbSlowdown' | 'emergencyShield' | 'addServer' | 'recovery') => {
    const sec = secondRef.current;
    const timeStr = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

    switch (action) {
      case 'surge':
        setParams(prev => ({ ...prev, botCount: Math.min(1000000, Math.round(prev.botCount * 2)) }));
        setEvents(prev => [
          { id: `chaos-${Date.now()}`, second: sec, timeString: timeStr, message: 'CHAOS: Injected sudden 200% traffic surge!', severity: 'critical' },
          ...prev,
        ]);
        break;

      case 'killServer':
        setServers(prev => {
          const healthy = prev.filter(s => s.status !== 'Offline');
          if (healthy.length > 0) {
            const victim = healthy[healthy.length - 1];
            serversLostRef.current += 1;
            return prev.map(s => s.id === victim.id ? { ...s, status: 'Offline', cpu: 0, ram: 0, latency: 0 } : s);
          }
          return prev;
        });
        setEvents(prev => [
          { id: `chaos-${Date.now()}`, second: sec, timeString: timeStr, message: 'CHAOS: Injected fatal server crash on instance!', severity: 'critical' },
          ...prev,
        ]);
        break;

      case 'dbSlowdown':
        setMetrics(prev => ({ ...prev, databaseLoadPercent: 100, responseTimeMs: prev.responseTimeMs + 1800 }));
        setEvents(prev => [
          { id: `chaos-${Date.now()}`, second: sec, timeString: timeStr, message: 'CHAOS: Database queries locked up in slow transaction deadlock!', severity: 'warning' },
          ...prev,
        ]);
        break;

      case 'emergencyShield':
        setParams(prev => ({
          ...prev,
          infrastructure: {
            ...prev.infrastructure,
            defenses: {
              rateLimiting: true,
              ipReputationFilter: true,
              cdn: true,
              webApplicationFirewall: true,
              loadBalancer: true,
              caching: true,
              autoScaling: true,
              trafficFiltering: true,
              challengePage: true,
              ddosProtectionService: true,
            },
          },
        }));
        setEvents(prev => [
          { id: `chaos-${Date.now()}`, second: sec, timeString: timeStr, message: 'EMERGENCY: Max defensive shield activated across all layers!', severity: 'defense' },
          ...prev,
        ]);
        break;

      case 'addServer':
        setServers(prev => {
          if (prev.length >= 16) return prev;
          const newId = prev.length + 1;
          return [
            ...prev,
            {
              id: `srv-${newId}`,
              name: `Server ${String(newId).padStart(2, '0')}`,
              cpu: 20,
              ram: 25,
              latency: 35,
              activeConnections: 100,
              requestsHandled: 0,
              status: 'Healthy',
            },
          ];
        });
        setEvents(prev => [
          { id: `chaos-${Date.now()}`, second: sec, timeString: timeStr, message: 'MANUAL SCALE: Added +1 server instance to fleet', severity: 'info' },
          ...prev,
        ]);
        break;

      case 'recovery':
        setServers(prev => prev.map(s => ({ ...s, status: 'Healthy', cpu: 25, ram: 30, latency: 40 })));
        setEvents(prev => [
          { id: `chaos-${Date.now()}`, second: sec, timeString: timeStr, message: 'RECOVERY: All servers restored and stabilized to healthy baseline', severity: 'info' },
          ...prev,
        ]);
        break;
    }
  }, []);

  // Controls
  const startSimulation = useCallback(() => {
    resetPeaks();
    setCurrentSecond(0);
    secondRef.current = 0;
    setAutoScaledCount(0);
    autoScaledCountRef.current = 0;
    setMetricsHistory([]);
    setResultSummary(null);
    setServers(initializeServers(paramsRef.current.infrastructure.serverCount));
    setStatus('active');
    setEvents([
      {
        id: `ev-start-${Date.now()}`,
        second: 0,
        timeString: '00:00',
        message: `Simulation started. Target: ${paramsRef.current.target} [${paramsRef.current.targetIp}].`,
        severity: 'info',
      },
    ]);
  }, [resetPeaks]);

  const pauseSimulation = useCallback(() => {
    setStatus('paused');
  }, []);

  const resumeSimulation = useCallback(() => {
    setStatus('active');
  }, []);

  const resetSimulation = useCallback(() => {
    setStatus('offline');
    setCurrentSecond(0);
    secondRef.current = 0;
    setAutoScaledCount(0);
    resetPeaks();
    setMetrics(INITIAL_METRICS);
    setMetricsHistory([]);
    setResultSummary(null);
    setServers(initializeServers(paramsRef.current.infrastructure.serverCount));
    setEvents([
      {
        id: `ev-reset-${Date.now()}`,
        second: 0,
        timeString: '00:00',
        message: 'Simulation reset. Ready for new configuration.',
        severity: 'info',
      },
    ]);
  }, [resetPeaks]);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
    speedRef.current = newSpeed;
  }, []);

  const setManualSecond = useCallback((sec: number) => {
    setCurrentSecond(sec);
    secondRef.current = sec;
  }, []);

  const closeResultModal = useCallback(() => {
    setResultSummary(null);
  }, []);

  // Main simulation tick loop
  useEffect(() => {
    if (status !== 'active') return;

    const intervalMs = Math.max(100, Math.round(1000 / speed));

    const timer = setInterval(() => {
      const nextSec = secondRef.current + 1;
      secondRef.current = nextSec;
      setCurrentSecond(nextSec);

      const tickRes = computeTick(nextSec, paramsRef.current, serversRef.current, autoScaledCountRef.current);

      // Accumulate stats
      peakTrafficRef.current = Math.max(peakTrafficRef.current, tickRes.metrics.incomingRequests);
      peakCpuRef.current = Math.max(peakCpuRef.current, tickRes.metrics.serverCpu);
      totalProcessedRef.current += tickRes.metrics.passedRequests;
      totalBlockedRef.current += tickRes.metrics.blockedRequests;
      totalDroppedRef.current += tickRes.metrics.droppedRequests;
      highestLatencyRef.current = Math.max(highestLatencyRef.current, tickRes.metrics.responseTimeMs);

      if (tickRes.newServersAdded > 0) {
        setAutoScaledCount(prev => prev + tickRes.newServersAdded);
        autoScaledCountRef.current += tickRes.newServersAdded;
      }

      setMetrics(tickRes.metrics);
      setServers(tickRes.servers);
      serversRef.current = tickRes.servers;

      if (tickRes.events.length > 0) {
        setEvents(prev => [...tickRes.events, ...prev].slice(0, 100));
      }

      setMetricsHistory(prev => [...prev, { ...tickRes.metrics, second: nextSec }].slice(-60));

      // Check for completion if duration is set (non-zero)
      const duration = paramsRef.current.durationSeconds;
      if (duration > 0 && nextSec >= duration) {
        setStatus('completed');
        const summary = generatePostMortem(
          paramsRef.current,
          peakTrafficRef.current,
          peakCpuRef.current,
          totalProcessedRef.current,
          totalBlockedRef.current,
          totalDroppedRef.current,
          highestLatencyRef.current,
          serversLostRef.current,
          autoScaledCountRef.current
        );
        setResultSummary(summary);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [status, speed]);

  return (
    <SimulationContext.Provider
      value={{
        params,
        status,
        speed,
        currentSecond,
        metrics,
        servers,
        events,
        metricsHistory,
        resultSummary,
        autoScaledCount,
        startSimulation,
        pauseSimulation,
        resumeSimulation,
        resetSimulation,
        setSpeed,
        updateParams,
        applyScenario,
        toggleDefense,
        setDefenseValue,
        triggerChaos,
        setManualSecond,
        closeResultModal,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
