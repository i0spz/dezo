import {
  SimulationParams,
  LiveMetrics,
  ServerNode,
  ServerStatus,
  SimulationEvent,
  SimulationResultSummary,
  TrafficPattern,
  TrafficIntensity,
} from '../types/simulation';
import { ATTACK_PROFILES } from './attackProfiles';

export const INTENSITY_BASE_MAP: Record<TrafficIntensity, number> = {
  'Very Low': 5000,
  'Low': 25000,
  'Medium': 100000,
  'High': 500000,
  'Extreme': 1000000,
  'Overwhelming': 5000000,
};

export const CAPACITY_LEVEL_BASE: Record<string, number> = {
  Low: 25000,
  Standard: 75000,
  High: 200000,
  Enterprise: 500000,
};

export function getPatternMultiplier(pattern: TrafficPattern, second: number, duration: number): number {
  const t = duration > 0 ? (second / duration) : ((second % 60) / 60);
  const jitter = (Math.sin(second * 1.7) * 0.05);

  switch (pattern) {
    case 'Constant':
      return 1.0 + jitter;

    case 'Gradual Increase':
      return 0.3 + 1.2 * Math.min(1.0, t * 1.3) + jitter;

    case 'Sudden Spike':
      // Calm, then explosive spike between 25% and 65% of time
      if (t >= 0.25 && t <= 0.65) {
        return 2.5 + Math.sin(second * 2.0) * 0.2;
      }
      return 0.5 + jitter;

    case 'Wave':
      // Oscillating swell
      return 0.7 + 0.6 * Math.sin(second * 0.35) + jitter;

    case 'Burst':
      // Sharp pulses every 6-8 seconds
      return (second % 8 < 4 ? 2.2 : 0.4) + jitter;

    case 'Random':
      return Math.max(0.2, 1.0 + Math.sin(second * 3.14) * 0.6 + Math.cos(second * 1.41) * 0.3);

    case 'Adaptive':
      // Multiplies attack when defenses are overwhelmed
      return 0.8 + 0.8 * Math.sin(second * 0.2) + (second > 15 ? 0.6 : 0.1);

    case 'Multi-stage':
      // Phase 1 (recon), Phase 2 (surge), Phase 3 (exhaustion)
      if (t < 0.2) return 0.4;
      if (t < 0.7) return 1.8 + jitter;
      return 2.4 + jitter;

    default:
      return 1.0;
  }
}

export function initializeServers(serverCount: number): ServerNode[] {
  return Array.from({ length: serverCount }, (_, i) => ({
    id: `srv-${i + 1}`,
    name: `Server ${String(i + 1).padStart(2, '0')}`,
    cpu: 15 + Math.floor(Math.random() * 5),
    ram: 20 + Math.floor(Math.random() * 5),
    latency: 35 + Math.floor(Math.random() * 10),
    activeConnections: 120 + Math.floor(Math.random() * 80),
    requestsHandled: 0,
    status: 'Healthy',
  }));
}

export interface EngineTickResult {
  metrics: LiveMetrics;
  servers: ServerNode[];
  events: SimulationEvent[];
  newServersAdded: number;
}

export function computeTick(
  second: number,
  params: SimulationParams,
  currentServers: ServerNode[],
  autoScaledCount: number
): EngineTickResult {
  const events: SimulationEvent[] = [];
  const duration = params.durationSeconds || 60;
  const timeString = `${String(Math.floor(second / 60)).padStart(2, '0')}:${String(second % 60).padStart(2, '0')}`;

  const baseReq = INTENSITY_BASE_MAP[params.trafficIntensity] || 100000;
  const botMultiplier = Math.max(0.2, Math.min(2.5, params.botCount / 50000));
  const patternMult = getPatternMultiplier(params.trafficPattern, second, duration);
  const profile = ATTACK_PROFILES[params.attackProfile];
  const profileMult = profile ? profile.defaultIntensityMultiplier : 1.0;

  // 1. Raw Incoming Requests (Simulated)
  const incomingRaw = Math.round(baseReq * botMultiplier * patternMult * profileMult);
  const incoming = Math.max(100, incomingRaw);

  // 2. Defensive Filtration Pipeline
  const { defenses } = params.infrastructure;
  let remainingTraffic = incoming;
  let blockedTotal = 0;

  // DDoS Protection Service (Edge Anycast Scrubbing)
  if (defenses.ddosProtectionService) {
    const scrubRatio = profile.layer.includes('Transport') ? 0.75 : 0.45;
    const scrubbed = Math.round(remainingTraffic * scrubRatio);
    blockedTotal += scrubbed;
    remainingTraffic -= scrubbed;
  }

  // Traffic Filtering (Layer 3/4 Stateless Filters)
  if (defenses.trafficFiltering) {
    const filterRatio = profile.layer.includes('Transport') ? 0.40 : 0.15;
    const filtered = Math.round(remainingTraffic * filterRatio);
    blockedTotal += filtered;
    remainingTraffic -= filtered;
  }

  // IP Reputation Filter (Known Botnet IP Intelligence)
  if (defenses.ipReputationFilter) {
    const distFactor = params.distributionMode === 'Highly Distributed' ? 0.30 : 0.60;
    const repBlocked = Math.round(remainingTraffic * distFactor);
    blockedTotal += repBlocked;
    remainingTraffic -= repBlocked;
  }

  // CDN & Edge Caching (Layer 7 Static/Edge Absorption)
  let cdnAbsorbed = 0;
  if (defenses.cdn) {
    const cdnRatio = (profile.type === 'HTTPS Request Flood' || profile.type === 'Layer 7 Traffic Surge') ? 0.70 : 0.45;
    cdnAbsorbed = Math.round(remainingTraffic * cdnRatio);
    blockedTotal += cdnAbsorbed; // Absorbed at edge, never hits origin
    remainingTraffic -= cdnAbsorbed;
  }

  // Web Application Firewall (WAF - L7 Pattern Inspection)
  if (defenses.webApplicationFirewall) {
    const wafRatio = profile.layer.includes('Application') ? 0.45 : 0.10;
    const wafBlocked = Math.round(remainingTraffic * wafRatio);
    blockedTotal += wafBlocked;
    remainingTraffic -= wafBlocked;
  }

  // Challenge Page / Bot Mitigation (JS/Managed Challenge)
  if (defenses.challengePage) {
    const chalRatio = profile.layer.includes('Application') ? 0.40 : 0.05;
    const chalBlocked = Math.round(remainingTraffic * chalRatio);
    blockedTotal += chalBlocked;
    remainingTraffic -= chalBlocked;
  }

  // Rate Limiting (Origin Protection Ingress Throttling)
  if (defenses.rateLimiting) {
    // Dynamic rate ceiling based on healthy cluster capacity
    const capacityPerServer = (CAPACITY_LEVEL_BASE[params.infrastructure.serverCapacity] || 75000) * (params.infrastructure.cpuCapacity / 60);
    const activeServers = currentServers.filter(s => s.status !== 'Offline');
    const healthyCount = Math.max(1, activeServers.length);
    const originCapCeiling = healthyCount * capacityPerServer * 1.15;

    if (remainingTraffic > originCapCeiling) {
      const throttled = Math.round(remainingTraffic - originCapCeiling);
      blockedTotal += throttled;
      remainingTraffic = Math.round(originCapCeiling);
    }
  }

  const passedTraffic = remainingTraffic;

  // 3. Server Allocation & Load Balancing
  let newServersAdded = 0;
  const updatedServers: ServerNode[] = [...currentServers];
  const activeServers = updatedServers.filter(s => s.status !== 'Offline');
  const healthyCount = Math.max(1, activeServers.length);

  // Auto-Scaling Trigger Check
  const currentAvgCpu = activeServers.reduce((acc, s) => acc + s.cpu, 0) / healthyCount;
  if (defenses.autoScaling && currentAvgCpu > 75 && updatedServers.length < 16 && second > 5) {
    newServersAdded = 1;
    const newId = updatedServers.length + 1;
    updatedServers.push({
      id: `srv-${newId}`,
      name: `Server ${String(newId).padStart(2, '0')}`,
      cpu: 25,
      ram: 30,
      latency: 40,
      activeConnections: 150,
      requestsHandled: 0,
      status: 'Healthy',
    });
    events.push({
      id: `ev-autoscale-${second}-${newId}`,
      second,
      timeString,
      message: `Auto scaling active: Provisioned new instance Server ${String(newId).padStart(2, '0')}`,
      severity: 'autoscale',
    });
  }

  // Load Distribution
  const capPerSrv = (CAPACITY_LEVEL_BASE[params.infrastructure.serverCapacity] || 75000) * (params.infrastructure.cpuCapacity / 60);
  let totalDropped = 0;
  let totalActiveConn = 0;

  updatedServers.forEach((server, index) => {
    if (server.status === 'Offline') {
      return;
    }

    // If Load Balancer is enabled, distribute evenly; otherwise server 0 takes 70%
    let srvTraffic = 0;
    if (defenses.loadBalancer) {
      const noise = 1 + (Math.sin(second + index * 1.7) * 0.08);
      srvTraffic = Math.round((passedTraffic / Math.max(1, activeServers.length)) * noise);
    } else {
      if (index === 0) {
        srvTraffic = Math.round(passedTraffic * 0.7);
      } else {
        srvTraffic = Math.round((passedTraffic * 0.3) / Math.max(1, activeServers.length - 1));
      }
    }

    // Calculate Load Ratio
    const loadRatio = srvTraffic / capPerSrv;

    // CPU calculation
    const targetCpu = Math.min(100, Math.round(15 + loadRatio * 80 + (Math.sin(second + index) * 3)));
    server.cpu = Math.max(10, Math.round(server.cpu * 0.3 + targetCpu * 0.7));

    // RAM calculation
    const targetRam = Math.min(99, Math.round(20 + loadRatio * 60 + (params.infrastructure.ramCapacity > 70 ? -10 : 10)));
    server.ram = Math.max(15, Math.round(server.ram * 0.4 + targetRam * 0.6));

    // Connections
    server.activeConnections = Math.round(Math.max(50, srvTraffic * 0.08));
    totalActiveConn += server.activeConnections;
    server.requestsHandled += srvTraffic;

    // Latency curve
    if (server.cpu < 65) {
      server.latency = Math.round(35 + (server.cpu / 65) * 50);
    } else if (server.cpu < 85) {
      server.latency = Math.round(85 + Math.pow((server.cpu - 65) / 20, 2) * 350);
    } else {
      server.latency = Math.round(450 + Math.pow((server.cpu - 85) / 15, 3) * 3200);
    }

    // Status Evaluation
    if (server.cpu >= 98 && server.ram >= 92) {
      server.status = 'Critical';
      // If critical for too long, drop requests heavily
      totalDropped += Math.round(srvTraffic * 0.65);
    } else if (server.cpu >= 88) {
      server.status = 'Overloaded';
      totalDropped += Math.round(srvTraffic * 0.25);
    } else if (server.cpu >= 70) {
      server.status = 'Busy';
      totalDropped += Math.round(srvTraffic * 0.05);
    } else {
      server.status = 'Healthy';
    }
  });

  // Aggregate Metrics
  const avgCpu = Math.round(updatedServers.reduce((acc, s) => acc + s.cpu, 0) / updatedServers.length);
  const avgRam = Math.round(updatedServers.reduce((acc, s) => acc + s.ram, 0) / updatedServers.length);
  const avgLatency = Math.round(updatedServers.reduce((acc, s) => acc + s.latency, 0) / updatedServers.length);

  const dropped = Math.min(passedTraffic, totalDropped);
  const passed = Math.max(0, passedTraffic - dropped);

  // Error rate calculation (HTTP 502/503 from dropped, plus 429 when throttled)
  const errorRate = incoming > 0 ? Math.min(100, Math.round(((dropped + (blockedTotal * 0.15)) / incoming) * 100)) : 0;

  // Network Gbps
  const simulatedPacketSizeBits = 1200 * 8; // ~9.6 kbit
  const netUsageGbps = Number(((incoming * simulatedPacketSizeBits) / 1_000_000_000).toFixed(2));

  // DB Load & Cache Hit
  const cacheHitRate = defenses.caching ? (defenses.cdn ? 88 : 74) : 12;
  const dbLoad = defenses.caching ? Math.min(95, Math.round((passed * 0.2) / (capPerSrv * 0.5) * 60)) : Math.min(100, Math.round((passed) / (capPerSrv * 0.5) * 90));

  // Generate SOC Events
  if (second === 2) {
    events.push({
      id: `ev-start-${second}`,
      second,
      timeString,
      message: `Simulation active: Ingress profile [${params.attackProfile}] against ${params.target}`,
      severity: 'info',
    });
  }

  if (incoming > 200000 && second % 15 === 0) {
    events.push({
      id: `ev-traffic-${second}`,
      second,
      timeString,
      message: `High ingress detected: ${(incoming / 1000).toFixed(0)}K req/s from ${params.botCount.toLocaleString()} simulated sources`,
      severity: 'warning',
    });
  }

  if (avgCpu >= 85 && second % 10 === 0) {
    events.push({
      id: `ev-cpu-${second}`,
      second,
      timeString,
      message: `Cluster alert: Average CPU reached ${avgCpu}% under load`,
      severity: 'critical',
    });
  }

  if (blockedTotal > 0 && second % 12 === 0) {
    events.push({
      id: `ev-def-${second}`,
      second,
      timeString,
      message: `Defenses engaged: ${(blockedTotal / 1000).toFixed(0)}K req/s mitigated`,
      severity: 'defense',
    });
  }

  const metrics: LiveMetrics = {
    incomingRequests: incoming,
    blockedRequests: blockedTotal,
    passedRequests: passed,
    droppedRequests: dropped,
    serverCpu: avgCpu,
    memoryUsage: avgRam,
    networkUsageGbps: netUsageGbps,
    responseTimeMs: avgLatency,
    errorRatePercent: errorRate,
    activeConnections: totalActiveConn,
    databaseLoadPercent: dbLoad,
    cacheHitRatePercent: cacheHitRate,
  };

  return {
    metrics,
    servers: updatedServers,
    events,
    newServersAdded,
  };
}

export function generatePostMortem(
  params: SimulationParams,
  peakTraffic: number,
  peakCpu: number,
  totalProcessed: number,
  totalBlocked: number,
  totalDropped: number,
  highestLatency: number,
  serversLost: number,
  autoScaledCount: number
): SimulationResultSummary {
  const duration = params.durationSeconds || 60;
  let finalStatus: 'Infrastructure Survived' | 'Partial Outage' | 'Service Unavailable' = 'Infrastructure Survived';

  if (peakCpu > 95 && (totalDropped > totalProcessed * 0.4 || serversLost > 0)) {
    finalStatus = 'Service Unavailable';
  } else if (peakCpu > 80 || totalDropped > 0 || highestLatency > 1500) {
    finalStatus = 'Partial Outage';
  } else {
    finalStatus = 'Infrastructure Survived';
  }

  // Build natural language educational breakdown
  const paragraphs: string[] = [];

  paragraphs.push(
    `The simulation evaluated a ${params.attackProfile} against the ${params.target} (${params.targetIp}) with ${params.botCount.toLocaleString()} simulated client sources and ${params.trafficPattern.toLowerCase()} traffic pattern.`
  );

  if (totalBlocked > 0) {
    const activeDefenses = Object.entries(params.infrastructure.defenses)
      .filter(([_, v]) => v)
      .map(([k]) => k.replace(/([A-Z])/g, ' $1').toLowerCase())
      .join(', ');

    paragraphs.push(
      `Defensive layers (${activeDefenses}) successfully intercepted ${totalBlocked.toLocaleString()} requests before reaching origin computation, preventing early hardware exhaustion.`
    );
  } else {
    paragraphs.push(
      `No upstream defensive filtering was active; 100% of raw ingress traffic struck origin servers directly.`
    );
  }

  if (autoScaledCount > 0) {
    paragraphs.push(
      `Auto-scaling dynamically provisioned ${autoScaledCount} additional server node(s) during peak load, expanding cluster capacity to absorb the surge.`
    );
  }

  if (finalStatus === 'Infrastructure Survived') {
    paragraphs.push(
      `Result: The infrastructure successfully absorbed the attack. Peak latency was contained to ${highestLatency}ms and cluster CPU peaked at ${peakCpu}%.`
    );
  } else if (finalStatus === 'Partial Outage') {
    paragraphs.push(
      `Result: The system experienced degraded performance and partial request dropping (${totalDropped.toLocaleString()} dropped). Latency spiked to ${highestLatency}ms. Increasing server capacity or enabling Rate Limiting and CDN would prevent degradation.`
    );
  } else {
    paragraphs.push(
      `Result: Origin resources were completely overwhelmed. Server CPU pinned at ${peakCpu}% and ${totalDropped.toLocaleString()} requests failed with gateway timeouts (HTTP 504). Deploying Anycast DDoS scrubbing and aggressive WAF challenge policies is strongly recommended.`
    );
  }

  return {
    durationSeconds: duration,
    peakTrafficReqSec: peakTraffic,
    peakCpuPercent: peakCpu,
    requestsProcessedTotal: totalProcessed,
    requestsBlockedTotal: totalBlocked,
    requestsDroppedTotal: totalDropped,
    highestLatencyMs: highestLatency,
    serversLost,
    autoScaledServersCount: autoScaledCount,
    finalStatus,
    explanationText: paragraphs.join('\n\n'),
  };
}
