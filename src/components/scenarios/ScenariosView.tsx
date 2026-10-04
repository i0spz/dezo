import React from 'react';
import { FolderArchive, Shuffle, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { ScenarioType, AttackProfileType, TrafficIntensity, TrafficPattern } from '../../types/simulation';
import { SCENARIO_PRESETS } from '../../engine/scenarioPresets';

interface ScenarioCard {
  name: ScenarioType;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Advanced' | 'Critical';
  description: string;
  clients: string;
  keyFeature: string;
}

const CARDS: ScenarioCard[] = [
  {
    name: 'Normal Traffic',
    difficulty: 'Easy',
    description: 'Calm baseline traffic on a standard 2-node cluster with caching.',
    clients: '2.5K clients',
    keyFeature: 'Baseline Operations',
  },
  {
    name: 'Traffic Spike',
    difficulty: 'Easy',
    description: 'Sudden burst on an online store with Rate Limiting enabled.',
    clients: '25K clients',
    keyFeature: 'Rate Limiting Active',
  },
  {
    name: 'Flash Crowd',
    difficulty: 'Medium',
    description: 'High legitimate surge absorbed by Edge CDN and Auto Scaling.',
    clients: '50K clients',
    keyFeature: 'CDN + Auto Scaling',
  },
  {
    name: 'DDoS Simulation',
    difficulty: 'Hard',
    description: 'Volumetric L7 botnet flood targeting unprotected origin API.',
    clients: '250K clients',
    keyFeature: 'Unprotected Target',
  },
  {
    name: 'Protected Infrastructure',
    difficulty: 'Advanced',
    description: '1M botnet flood against Enterprise 8-node fleet with full defense suite.',
    clients: '1M clients',
    keyFeature: 'All 10 Defenses ON',
  },
  {
    name: 'Overloaded API',
    difficulty: 'Medium',
    description: 'Gradual increase targeting database-heavy query endpoints.',
    clients: '100K clients',
    keyFeature: 'Database Pressure',
  },
  {
    name: 'Gaming Server Attack Simulation',
    difficulty: 'Hard',
    description: 'UDP datagram flood attempting to saturate packet processing pipeline.',
    clients: '250K clients',
    keyFeature: 'L3/L4 Transport Flood',
  },
  {
    name: 'E-commerce Peak Traffic',
    difficulty: 'Medium',
    description: 'Multi-stage shopping rush mitigated with WAF, CDN, and Auto Scaling.',
    clients: '100K clients',
    keyFeature: 'WAF + Auto Scaling',
  },
  {
    name: 'Login Endpoint Pressure',
    difficulty: 'Hard',
    description: 'Credential verification burst targeting password hashing compute.',
    clients: '50K clients',
    keyFeature: 'Auth CPU Depletion',
  },
  {
    name: 'CDN Stress Scenario',
    difficulty: 'Advanced',
    description: '500K client HTTPS flood testing edge caching and Anycast limits.',
    clients: '500K clients',
    keyFeature: 'Edge Cache Stress',
  },
];

export const ScenariosView: React.FC = () => {
  const { applyScenario, params, startSimulation, updateParams } = useSimulation();

  const handleRandomScenario = () => {
    const scenarios = Object.keys(SCENARIO_PRESETS) as ScenarioType[];
    const randomSc = scenarios[Math.floor(Math.random() * scenarios.length)];
    applyScenario(randomSc);
  };

  const getDifficultyColor = (diff: ScenarioCard['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return 'text-soc-success border-soc-success/30 bg-soc-success/10';
      case 'Medium':
        return 'text-soc-accent border-soc-accent/30 bg-soc-accent/10';
      case 'Hard':
        return 'text-soc-warning border-soc-warning/30 bg-soc-warning/10';
      case 'Advanced':
      case 'Critical':
        return 'text-soc-critical border-soc-critical/30 bg-soc-critical/10';
    }
  };

  return (
    <div className="p-4 space-y-4 select-none text-xs">
      {/* Top Banner with Random Generator */}
      <div className="flex items-center justify-between pb-2 border-b border-soc-border">
        <div className="flex items-center gap-2">
          <FolderArchive className="w-4 h-4 text-soc-accent" />
          <span className="font-bold text-soc-text tracking-wide uppercase text-xs">
            Preset Attack Scenarios
          </span>
        </div>

        <button
          onClick={handleRandomScenario}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-soc-accent/15 border border-soc-accent/40 text-soc-accent hover:bg-soc-accent/25 font-medium text-xs transition-colors"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Generate Random Scenario</span>
        </button>
      </div>

      <p className="text-[11px] text-soc-muted">
        Select a pre-configured scenario to instantly configure traffic volumes, attack profiles, and infrastructure defenses.
      </p>

      {/* Grid of Scenarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CARDS.map((card) => {
          const isCurrent = params.scenario === card.name;

          return (
            <div
              key={card.name}
              className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-soc-surface2 border-soc-accent ring-1 ring-soc-accent/30 shadow-soc-glow'
                  : 'bg-soc-surface2/40 border-soc-border hover:border-soc-border/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-bold text-xs text-soc-text">{card.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getDifficultyColor(
                      card.difficulty
                    )}`}
                  >
                    {card.difficulty}
                  </span>
                </div>

                <p className="text-[11px] text-soc-muted leading-relaxed mb-2">
                  {card.description}
                </p>
              </div>

              <div className="pt-2 border-t border-soc-border/50 flex items-center justify-between">
                <div className="text-[10px] font-mono text-soc-muted">
                  <span className="text-soc-text font-bold">{card.clients}</span> • {card.keyFeature}
                </div>

                <button
                  onClick={() => applyScenario(card.name)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isCurrent
                      ? 'bg-soc-accent text-white shadow-sm'
                      : 'bg-soc-surface border border-soc-border hover:border-soc-accent/60 text-soc-text'
                  }`}
                >
                  <span>{isCurrent ? 'Loaded' : 'Load'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
