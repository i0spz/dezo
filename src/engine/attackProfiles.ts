import { AttackProfileType } from '../types/simulation';

export interface AttackProfileMetadata {
  type: AttackProfileType;
  layer: 'Layer 3/4 (Transport/Network)' | 'Layer 7 (Application)';
  explanation: string;
  mitigationTip: string;
  defaultIntensityMultiplier: number;
}

export const ATTACK_PROFILES: Record<AttackProfileType, AttackProfileMetadata> = {
  'HTTP Flood Simulation': {
    type: 'HTTP Flood Simulation',
    layer: 'Layer 7 (Application)',
    explanation: 'Simulates a large number of application-layer web requests competing for server resources, thread pools, and memory.',
    mitigationTip: 'Deploy Rate Limiting, Web Application Firewall (WAF), and Edge CDN caching.',
    defaultIntensityMultiplier: 1.0,
  },
  'HTTPS Request Flood': {
    type: 'HTTPS Request Flood',
    layer: 'Layer 7 (Application)',
    explanation: 'Simulates SSL/TLS handshake saturation and compute-intensive cryptographic decryption overhead exhausting CPU cycles.',
    mitigationTip: 'Offload SSL termination to Edge CDN / Anycast Load Balancers with hardware crypto acceleration.',
    defaultIntensityMultiplier: 1.3,
  },
  'SYN Flood Simulation': {
    type: 'SYN Flood Simulation',
    layer: 'Layer 3/4 (Transport/Network)',
    explanation: 'Simulates TCP half-open connections consuming kernel state tables, connection slots, and socket backlog queues.',
    mitigationTip: 'Enable SYN Cookies, TCP connection rate limits, and Upstream DDoS scrubbing centers.',
    defaultIntensityMultiplier: 1.4,
  },
  'UDP Flood Simulation': {
    type: 'UDP Flood Simulation',
    layer: 'Layer 3/4 (Transport/Network)',
    explanation: 'Simulates high-volume stateless datagrams saturating upstream transit pipe bandwidth and router packet-processing ASICs.',
    mitigationTip: 'Use Anycast network scrubbing, UDP traffic policing, and Geo-IP filtering at the edge.',
    defaultIntensityMultiplier: 1.6,
  },
  'DNS Amplification Concept': {
    type: 'DNS Amplification Concept',
    layer: 'Layer 3/4 (Transport/Network)',
    explanation: 'Demonstrates how small recursive queries trigger massive reflected response payloads (up to 50x amplification ratio).',
    mitigationTip: 'Disable open DNS resolvers, implement Response Rate Limiting (RRL), and use BGP Anycast scrubbing.',
    defaultIntensityMultiplier: 1.8,
  },
  'Slow Request Simulation': {
    type: 'Slow Request Simulation',
    layer: 'Layer 7 (Application)',
    explanation: 'Simulates Slowloris-style slow HTTP headers/bodies holding web server worker threads captive with minimal bandwidth.',
    mitigationTip: 'Configure aggressive connection read/write timeouts and deploy an asynchronous reverse proxy (e.g., Nginx, Envoy).',
    defaultIntensityMultiplier: 0.8,
  },
  'API Endpoint Flood': {
    type: 'API Endpoint Flood',
    layer: 'Layer 7 (Application)',
    explanation: 'Simulates heavy JSON/REST queries targeting complex SQL joins, aggregations, and compute-heavy endpoints.',
    mitigationTip: 'Enforce Token Bucket rate limiting per API key/IP, add Redis query caching, and GraphQL query depth limiting.',
    defaultIntensityMultiplier: 1.2,
  },
  'Login Flood': {
    type: 'Login Flood',
    layer: 'Layer 7 (Application)',
    explanation: 'Simulates credential validation bursts targeting CPU-heavy password hashing algorithms (bcrypt/Argon2) to lock up workers.',
    mitigationTip: 'Implement progressive delays, CAPTCHA/Managed Challenges, and account lockout rate limiters.',
    defaultIntensityMultiplier: 1.1,
  },
  'Layer 7 Traffic Surge': {
    type: 'Layer 7 Traffic Surge',
    layer: 'Layer 7 (Application)',
    explanation: 'Simulates sophisticated bot traffic mimicking legitimate browsers executing full dynamic scripts and assets.',
    mitigationTip: 'Deploy Cloud WAF behavioral profiling, JS challenges, and bot reputation intelligence.',
    defaultIntensityMultiplier: 1.5,
  },
  'Mixed Traffic Simulation': {
    type: 'Mixed Traffic Simulation',
    layer: 'Layer 3/4 (Transport/Network)',
    explanation: 'Simulates a coordinated multi-vector attack combining volumetric network saturation with targeted application layer floods.',
    mitigationTip: 'Requires unified Defense-in-Depth: edge scrubbing + Anycast CDN + Auto Scaling origin fleet.',
    defaultIntensityMultiplier: 2.0,
  },
};
