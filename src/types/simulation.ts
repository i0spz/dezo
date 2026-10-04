export type ScenarioType =
  | 'Normal Traffic'
  | 'Traffic Spike'
  | 'Flash Crowd'
  | 'DDoS Simulation'
  | 'Protected Infrastructure'
  | 'Overloaded API'
  | 'Gaming Server Attack Simulation'
  | 'E-commerce Peak Traffic'
  | 'Login Endpoint Pressure'
  | 'CDN Stress Scenario';

export type AttackProfileType =
  | 'HTTP Flood Simulation'
  | 'HTTPS Request Flood'
  | 'SYN Flood Simulation'
  | 'UDP Flood Simulation'
  | 'DNS Amplification Concept'
  | 'Slow Request Simulation'
  | 'API Endpoint Flood'
  | 'Login Flood'
  | 'Layer 7 Traffic Surge'
  | 'Mixed Traffic Simulation';

export type DistributionMode = 'Centralized' | 'Distributed' | 'Highly Distributed';

export type TrafficIntensity = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Extreme' | 'Overwhelming';

export type TrafficPattern =
  | 'Constant'
  | 'Gradual Increase'
  | 'Sudden Spike'
  | 'Wave'
  | 'Burst'
  | 'Random'
  | 'Adaptive'
  | 'Multi-stage';

export type TargetEnvironment =
  | 'Demo Web Server'
  | 'Online Store'
  | 'Game Server'
  | 'Public API'
  | 'Authentication Service'
  | 'Streaming Platform'
  | 'University Portal'
  | 'Banking Demo Platform';

export type ServerCapacityLevel = 'Low' | 'Standard' | 'High' | 'Enterprise';

export type ServerStatus = 'Healthy' | 'Busy' | 'Overloaded' | 'Critical' | 'Offline';

export interface ServerNode {
  id: string;
  name: string;
  cpu: number; // 0 - 100
  ram: number; // 0 - 100
  latency: number; // ms
  activeConnections: number;
  requestsHandled: number;
  status: ServerStatus;
}

export interface DefensesConfig {
  rateLimiting: boolean;
  ipReputationFilter: boolean;
  cdn: boolean;
  webApplicationFirewall: boolean;
  loadBalancer: boolean;
  caching: boolean;
  autoScaling: boolean;
  trafficFiltering: boolean;
  challengePage: boolean;
  ddosProtectionService: boolean;
}

export interface InfrastructureConfig {
  serverCount: number; // 1, 2, 4, 8, 16
  serverCapacity: ServerCapacityLevel;
  cpuCapacity: number; // 1-100 scale factor
  ramCapacity: number;
  networkCapacity: number;
  databaseCapacity: number;
  defenses: DefensesConfig;
}

export interface SimulationParams {
  scenario: ScenarioType;
  attackProfile: AttackProfileType;
  botCount: number;
  distributionMode: DistributionMode;
  trafficIntensity: TrafficIntensity;
  trafficPattern: TrafficPattern;
  durationSeconds: number; // 15, 30, 60, 120, 300, or 0 (Manual)
  target: TargetEnvironment;
  targetIp: string;
  infrastructure: InfrastructureConfig;
}

export interface LiveMetrics {
  incomingRequests: number; // req/s
  blockedRequests: number; // req/s
  passedRequests: number; // req/s
  droppedRequests: number; // req/s
  serverCpu: number; // 0 - 100
  memoryUsage: number; // 0 - 100
  networkUsageGbps: number; // Gbps
  responseTimeMs: number; // ms
  errorRatePercent: number; // 0 - 100
  activeConnections: number;
  databaseLoadPercent: number; // 0 - 100
  cacheHitRatePercent: number; // 0 - 100
}

export type EventSeverity = 'info' | 'warning' | 'critical' | 'defense' | 'autoscale';

export interface SimulationEvent {
  id: string;
  second: number;
  timeString: string; // "00:14"
  message: string;
  severity: EventSeverity;
}

export interface TimePointMetrics extends LiveMetrics {
  second: number;
}

export type SimulationStatus = 'offline' | 'active' | 'paused' | 'completed';

export interface SimulationResultSummary {
  durationSeconds: number;
  peakTrafficReqSec: number;
  peakCpuPercent: number;
  requestsProcessedTotal: number;
  requestsBlockedTotal: number;
  requestsDroppedTotal: number;
  highestLatencyMs: number;
  serversLost: number;
  autoScaledServersCount: number;
  finalStatus: 'Infrastructure Survived' | 'Partial Outage' | 'Service Unavailable';
  explanationText: string;
}

export interface SimulationHistoryRecord {
  id: string;
  date: string;
  scenarioName: string;
  targetName: string;
  durationSeconds: number;
  peakTrafficReqSec: number;
  finalStatus: 'Infrastructure Survived' | 'Partial Outage' | 'Service Unavailable';
  defensesSummary: string[];
  summary: SimulationResultSummary;
  params: SimulationParams;
}
