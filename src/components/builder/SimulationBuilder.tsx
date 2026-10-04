import React from 'react';
import {
  Shield,
  Server,
  Zap,
  Sliders,
  Users,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  ScenarioType,
  AttackProfileType,
  DistributionMode,
  TrafficIntensity,
  TrafficPattern,
  TargetEnvironment,
  ServerCapacityLevel,
} from '../../types/simulation';
import { useSimulation } from '../../context/SimulationContext';
import { ATTACK_PROFILES } from '../../engine/attackProfiles';

const SCENARIOS: ScenarioType[] = [
  'Normal Traffic',
  'Traffic Spike',
  'Flash Crowd',
  'DDoS Simulation',
  'Protected Infrastructure',
  'Overloaded API',
  'Gaming Server Attack Simulation',
  'E-commerce Peak Traffic',
  'Login Endpoint Pressure',
  'CDN Stress Scenario',
];

const ATTACK_METHODS: AttackProfileType[] = [
  'HTTP Flood Simulation',
  'HTTPS Request Flood',
  'SYN Flood Simulation',
  'UDP Flood Simulation',
  'DNS Amplification Concept',
  'Slow Request Simulation',
  'API Endpoint Flood',
  'Login Flood',
  'Layer 7 Traffic Surge',
  'Mixed Traffic Simulation',
];

const BOT_STEPS = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

const INTENSITY_LEVELS: { label: TrafficIntensity; reqSec: string }[] = [
  { label: 'Very Low', reqSec: '5K req/s' },
  { label: 'Low', reqSec: '25K req/s' },
  { label: 'Medium', reqSec: '100K req/s' },
  { label: 'High', reqSec: '500K req/s' },
  { label: 'Extreme', reqSec: '1M req/s' },
  { label: 'Overwhelming', reqSec: '5M req/s' },
];

const PATTERNS: { id: TrafficPattern; sparkline: string }[] = [
  { id: 'Constant', sparkline: 'M0,15 L60,15' },
  { id: 'Gradual Increase', sparkline: 'M0,26 L60,4' },
  { id: 'Sudden Spike', sparkline: 'M0,24 L25,24 L30,4 L45,4 L50,24 L60,24' },
  { id: 'Wave', sparkline: 'M0,15 Q15,4 30,15 T60,15' },
  { id: 'Burst', sparkline: 'M0,24 L10,24 L12,6 L22,6 L24,24 L36,24 L38,6 L48,6 L50,24 L60,24' },
  { id: 'Random', sparkline: 'M0,18 L10,8 L20,24 L30,6 L40,20 L50,12 L60,16' },
  { id: 'Adaptive', sparkline: 'M0,20 L20,18 L35,8 L45,14 L60,4' },
  { id: 'Multi-stage', sparkline: 'M0,24 L20,20 L35,12 L50,6 L60,4' },
];

const TARGETS: { name: TargetEnvironment; ip: string }[] = [
  { name: 'Demo Web Server', ip: '10.0.0.15' },
  { name: 'Online Store', ip: '10.0.1.42' },
  { name: 'Game Server', ip: '10.0.3.77' },
  { name: 'Public API', ip: '10.0.5.100' },
  { name: 'Authentication Service', ip: '10.0.2.11' },
  { name: 'Streaming Platform', ip: '10.0.8.20' },
  { name: 'University Portal', ip: '10.0.12.5' },
  { name: 'Banking Demo Platform', ip: '10.0.99.1' },
];

const DURATIONS: { label: string; seconds: number }[] = [
  { label: '15s', seconds: 15 },
  { label: '30s', seconds: 30 },
  { label: '1 min', seconds: 60 },
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: 'Manual Stop', seconds: 0 },
];

export const SimulationBuilder: React.FC = () => {
  const {
    params,
    status,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    updateParams,
    applyScenario,
  } = useSimulation();

  const currentProfile = ATTACK_PROFILES[params.attackProfile];

  return (
    <div className="p-4 space-y-6 text-xs text-soc-text select-none">
      {/* 1. Scenario Picker */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-xs tracking-wide text-soc-text uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-soc-accent" />
            <span>1. Scenario</span>
          </label>
          <span className="text-[11px] text-soc-muted">Select baseline threat scenario</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {SCENARIOS.map((sc) => (
            <button
              key={sc}
              onClick={() => applyScenario(sc)}
              className={`px-2.5 py-1.5 rounded text-left border transition-all truncate ${
                params.scenario === sc
                  ? 'bg-soc-accent/20 border-soc-accent text-soc-accent font-semibold shadow-soc-glow'
                  : 'bg-soc-surface2 border-soc-border hover:border-soc-muted text-soc-muted hover:text-soc-text'
              }`}
            >
              <div className="truncate font-medium">{sc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Simulated Attack Profile */}
      <section className="space-y-2 bg-soc-surface2/50 p-3 rounded-lg border border-soc-border">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-xs tracking-wide text-soc-text uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-soc-warning" />
            <span>2. Simulated Attack Profile</span>
          </label>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-soc-surface border border-soc-border text-soc-accent">
            {currentProfile.layer}
          </span>
        </div>

        <select
          value={params.attackProfile}
          onChange={(e) =>
            updateParams((prev) => ({
              ...prev,
              attackProfile: e.target.value as AttackProfileType,
            }))
          }
          className="w-full bg-soc-surface border border-soc-border rounded px-2.5 py-2 text-xs text-soc-text focus:outline-none focus:border-soc-accent"
        >
          {ATTACK_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>

        {/* Educational Explanation Box */}
        <div className="p-2.5 rounded bg-soc-surface border border-soc-border/80 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-soc-text text-[11px]">
            <Info className="w-3 h-3 text-soc-accent" />
            <span>{params.attackProfile}</span>
          </div>
          <p className="text-[11px] text-soc-muted leading-relaxed">
            "{currentProfile.explanation}"
          </p>
          <div className="text-[10px] text-soc-success flex items-center gap-1 mt-1 font-mono">
            <span>TIP:</span>
            <span>{currentProfile.mitigationTip}</span>
          </div>
        </div>
      </section>

      {/* 3. Simulated Bot Count & Distribution Mode */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-xs tracking-wide text-soc-text uppercase flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-soc-accent" />
            <span>3. Simulated Bot Count</span>
          </label>
          <span className="font-mono text-xs font-bold text-soc-accent bg-soc-accent/10 px-2 py-0.5 rounded border border-soc-accent/30">
            {params.botCount.toLocaleString()} sources
          </span>
        </div>

        {/* Bot Count Slider */}
        <input
          type="range"
          min={0}
          max={BOT_STEPS.length - 1}
          step={1}
          value={BOT_STEPS.indexOf(params.botCount) !== -1 ? BOT_STEPS.indexOf(params.botCount) : 3}
          onChange={(e) => {
            const index = Number(e.target.value);
            updateParams((prev) => ({ ...prev, botCount: BOT_STEPS[index] }));
          }}
          className="w-full h-1.5 bg-soc-surface2 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-mono text-soc-muted">
          <span>100</span>
          <span>10K</span>
          <span>100K</span>
          <span>500K</span>
          <span>1M</span>
        </div>

        {/* Distribution Mode */}
        <div className="pt-1 flex items-center justify-between">
          <span className="text-soc-muted font-medium text-[11px]">Distribution Mode:</span>
          <div className="flex bg-soc-surface2 border border-soc-border rounded p-0.5 gap-1">
            {(['Centralized', 'Distributed', 'Highly Distributed'] as DistributionMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => updateParams((prev) => ({ ...prev, distributionMode: mode }))}
                className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                  params.distributionMode === mode
                    ? 'bg-soc-accent text-white font-medium shadow-sm'
                    : 'text-soc-muted hover:text-soc-text'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Traffic Intensity */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-xs tracking-wide text-soc-text uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-soc-critical" />
            <span>4. Traffic Intensity</span>
          </label>
          <span className="font-mono text-xs text-soc-critical font-bold">
            {INTENSITY_LEVELS.find((i) => i.label === params.trafficIntensity)?.reqSec}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {INTENSITY_LEVELS.map((item) => (
            <button
              key={item.label}
              onClick={() => updateParams((prev) => ({ ...prev, trafficIntensity: item.label }))}
              className={`p-2 rounded border text-left transition-all ${
                params.trafficIntensity === item.label
                  ? 'bg-soc-critical/15 border-soc-critical/80 text-soc-critical font-semibold'
                  : 'bg-soc-surface2 border-soc-border hover:border-soc-muted text-soc-muted hover:text-soc-text'
              }`}
            >
              <div className="font-medium text-xs truncate">{item.label}</div>
              <div className="font-mono text-[10px] opacity-75">{item.reqSec}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Traffic Pattern */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-xs tracking-wide text-soc-text uppercase flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-soc-accent" />
            <span>5. Traffic Pattern</span>
          </label>
          <span className="text-[11px] text-soc-muted">Waveform characteristics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {PATTERNS.map((pat) => (
            <button
              key={pat.id}
              onClick={() => updateParams((prev) => ({ ...prev, trafficPattern: pat.id }))}
              className={`p-2 rounded border text-left transition-all flex flex-col justify-between ${
                params.trafficPattern === pat.id
                  ? 'bg-soc-accent/20 border-soc-accent text-soc-accent font-semibold'
                  : 'bg-soc-surface2 border-soc-border hover:border-soc-muted text-soc-muted hover:text-soc-text'
              }`}
            >
              <span className="text-[11px] truncate mb-1">{pat.id}</span>
              {/* Sparkline Visual */}
              <svg className="w-full h-7 overflow-visible">
                <path
                  d={pat.sparkline}
                  fill="none"
                  stroke={params.trafficPattern === pat.id ? '#6C7CFF' : '#929CAB'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      </section>

      {/* 6. Simulation Duration */}
      <section className="space-y-2">
        <label className="font-semibold text-xs tracking-wide text-soc-text uppercase flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-soc-accent" />
          <span>6. Simulation Duration</span>
        </label>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {DURATIONS.map((dur) => (
            <button
              key={dur.label}
              onClick={() => updateParams((prev) => ({ ...prev, durationSeconds: dur.seconds }))}
              className={`px-2 py-1.5 rounded border text-center font-mono text-[11px] transition-all ${
                params.durationSeconds === dur.seconds
                  ? 'bg-soc-accent/20 border-soc-accent text-soc-accent font-bold'
                  : 'bg-soc-surface2 border-soc-border text-soc-muted hover:text-soc-text'
              }`}
            >
              {dur.label}
            </button>
          ))}
        </div>
      </section>

      {/* 7. Simulated Target */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-xs tracking-wide text-soc-text uppercase flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-soc-success" />
            <span>7. Simulated Target</span>
          </label>
          <span className="text-[10px] font-mono text-soc-warning px-1.5 py-0.5 rounded bg-soc-warning/10 border border-soc-warning/30">
            SIMULATED ENVIRONMENT
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {TARGETS.map((tgt) => (
            <button
              key={tgt.name}
              onClick={() => updateParams((prev) => ({ ...prev, target: tgt.name, targetIp: tgt.ip }))}
              className={`p-2 rounded border text-left transition-all ${
                params.target === tgt.name
                  ? 'bg-soc-success/15 border-soc-success text-soc-success font-semibold'
                  : 'bg-soc-surface2 border-soc-border hover:border-soc-muted text-soc-muted hover:text-soc-text'
              }`}
            >
              <div className="font-medium text-xs truncate">{tgt.name}</div>
              <div className="font-mono text-[10px] opacity-75">{tgt.ip}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 8. Infrastructure Configuration */}
      <section className="space-y-3 bg-soc-surface2/40 p-3 rounded-lg border border-soc-border">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-xs tracking-wide text-soc-text uppercase flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-soc-accent" />
            <span>Infrastructure Fleet Config</span>
          </label>
          <span className="text-[11px] font-mono text-soc-muted">
            {params.infrastructure.serverCount}x Nodes ({params.infrastructure.serverCapacity})
          </span>
        </div>

        {/* Server Count */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-soc-muted">
            <span>Server Count:</span>
            <span className="font-mono font-bold text-soc-text">{params.infrastructure.serverCount} servers</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 4, 8, 16].map((count) => (
              <button
                key={count}
                onClick={() =>
                  updateParams((prev) => ({
                    ...prev,
                    infrastructure: { ...prev.infrastructure, serverCount: count },
                  }))
                }
                className={`flex-1 py-1 rounded text-xs font-mono border transition-all ${
                  params.infrastructure.serverCount === count
                    ? 'bg-soc-accent text-white font-bold border-soc-accent'
                    : 'bg-soc-surface border-soc-border text-soc-muted hover:text-soc-text'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Server Capacity */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-soc-muted">
            <span>Server Capacity:</span>
            <span className="font-mono font-bold text-soc-text">{params.infrastructure.serverCapacity}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {(['Low', 'Standard', 'High', 'Enterprise'] as ServerCapacityLevel[]).map((cap) => (
              <button
                key={cap}
                onClick={() =>
                  updateParams((prev) => ({
                    ...prev,
                    infrastructure: { ...prev.infrastructure, serverCapacity: cap },
                  }))
                }
                className={`py-1 rounded text-[11px] font-medium border transition-all ${
                  params.infrastructure.serverCapacity === cap
                    ? 'bg-soc-accent/20 border-soc-accent text-soc-accent font-semibold'
                    : 'bg-soc-surface border-soc-border text-soc-muted hover:text-soc-text'
                }`}
              >
                {cap}
              </button>
            ))}
          </div>
        </div>

        {/* Capacity Sliders */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* CPU Capacity */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-soc-muted">
              <span>CPU CAPACITY</span>
              <span className="text-soc-text">{params.infrastructure.cpuCapacity}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={params.infrastructure.cpuCapacity}
              onChange={(e) =>
                updateParams((prev) => ({
                  ...prev,
                  infrastructure: { ...prev.infrastructure, cpuCapacity: Number(e.target.value) },
                }))
              }
              className="w-full h-1 bg-soc-surface rounded cursor-pointer"
            />
          </div>

          {/* RAM Capacity */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-soc-muted">
              <span>RAM CAPACITY</span>
              <span className="text-soc-text">{params.infrastructure.ramCapacity}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={params.infrastructure.ramCapacity}
              onChange={(e) =>
                updateParams((prev) => ({
                  ...prev,
                  infrastructure: { ...prev.infrastructure, ramCapacity: Number(e.target.value) },
                }))
              }
              className="w-full h-1 bg-soc-surface rounded cursor-pointer"
            />
          </div>

          {/* Network Capacity */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-soc-muted">
              <span>NETWORK PIPE</span>
              <span className="text-soc-text">{params.infrastructure.networkCapacity}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={params.infrastructure.networkCapacity}
              onChange={(e) =>
                updateParams((prev) => ({
                  ...prev,
                  infrastructure: { ...prev.infrastructure, networkCapacity: Number(e.target.value) },
                }))
              }
              className="w-full h-1 bg-soc-surface rounded cursor-pointer"
            />
          </div>

          {/* Database Capacity */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-soc-muted">
              <span>DATABASE IOPS</span>
              <span className="text-soc-text">{params.infrastructure.databaseCapacity}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={params.infrastructure.databaseCapacity}
              onChange={(e) =>
                updateParams((prev) => ({
                  ...prev,
                  infrastructure: { ...prev.infrastructure, databaseCapacity: Number(e.target.value) },
                }))
              }
              className="w-full h-1 bg-soc-surface rounded cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Primary Action Button */}
      <div className="pt-2 sticky bottom-0 bg-soc-bg/90 backdrop-blur pb-2">
        {status === 'offline' || status === 'completed' ? (
          <button
            onClick={startSimulation}
            className="w-full py-3 rounded-lg bg-soc-accent hover:bg-soc-accentHover text-white font-bold text-sm shadow-soc-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Simulation</span>
          </button>
        ) : status === 'active' ? (
          <button
            onClick={pauseSimulation}
            className="w-full py-3 rounded-lg bg-soc-warning/20 border border-soc-warning/40 hover:bg-soc-warning/30 text-soc-warning font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Pause className="w-4 h-4" />
            <span>Pause Simulation</span>
          </button>
        ) : (
          <button
            onClick={resumeSimulation}
            className="w-full py-3 rounded-lg bg-soc-success/20 border border-soc-success/40 hover:bg-soc-success/30 text-soc-success font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume Simulation</span>
          </button>
        )}
      </div>
    </div>
  );
};
