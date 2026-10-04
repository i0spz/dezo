import React from 'react';
import {
  Shield,
  ShieldCheck,
  Zap,
  Globe,
  Filter,
  Layers,
  Cpu,
  UserCheck,
  CloudLightning,
  Network,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { DefensesConfig } from '../../types/simulation';

interface DefenseItem {
  key: keyof DefensesConfig;
  name: string;
  category: 'Edge & Network' | 'Application Layer' | 'Origin Fleet';
  icon: React.ReactNode;
  description: string;
  impactTag: string;
}

const DEFENSE_ITEMS: DefenseItem[] = [
  {
    key: 'rateLimiting',
    name: 'Rate Limiting',
    category: 'Application Layer',
    icon: <Filter className="w-4 h-4 text-soc-accent" />,
    description: 'Throttles burst request volumes exceeding capacity (HTTP 429).',
    impactTag: 'Blocked ↑ | CPU ↓ | Latency ↓',
  },
  {
    key: 'ipReputationFilter',
    name: 'IP Reputation Filter',
    category: 'Edge & Network',
    icon: <Globe className="w-4 h-4 text-soc-warning" />,
    description: 'Drops packets from known malicious botnets and anonymized proxies.',
    impactTag: 'Origin Ingress -35%',
  },
  {
    key: 'cdn',
    name: 'CDN Edge Caching',
    category: 'Edge & Network',
    icon: <CloudLightning className="w-4 h-4 text-soc-success" />,
    description: 'Absorbs static assets and cachable HTTP queries across edge PoPs.',
    impactTag: 'Origin Traffic ↓ | Cache Hit ↑',
  },
  {
    key: 'webApplicationFirewall',
    name: 'Web Application Firewall (WAF)',
    category: 'Application Layer',
    icon: <ShieldCheck className="w-4 h-4 text-soc-accent" />,
    description: 'Inspects HTTP payload signatures for SQLi, XSS, and bot scraping.',
    impactTag: 'L7 Malicious Blocked',
  },
  {
    key: 'loadBalancer',
    name: 'Load Balancer (Active)',
    category: 'Origin Fleet',
    icon: <Network className="w-4 h-4 text-soc-accent" />,
    description: 'Evenly balances incoming queries across all healthy backend nodes.',
    impactTag: 'Prevents Hotspots',
  },
  {
    key: 'caching',
    name: 'In-Memory Cache (Redis)',
    category: 'Origin Fleet',
    icon: <Layers className="w-4 h-4 text-soc-success" />,
    description: 'Caches query results to protect database from read-exhaustion.',
    impactTag: 'DB Load -75%',
  },
  {
    key: 'autoScaling',
    name: 'Auto Scaling Pool',
    category: 'Origin Fleet',
    icon: <Cpu className="w-4 h-4 text-soc-accent" />,
    description: 'Dynamically provisions new server instances when CPU > 75%.',
    impactTag: 'Server Fleet ↑ | Avg CPU ↓',
  },
  {
    key: 'trafficFiltering',
    name: 'Traffic Filtering (L3/L4)',
    category: 'Edge & Network',
    icon: <Filter className="w-4 h-4 text-soc-warning" />,
    description: 'Filters malformed TCP/UDP headers and volumetric ICMP floods.',
    impactTag: 'Pipes Cleared',
  },
  {
    key: 'challengePage',
    name: 'Managed Challenge (CAPTCHA)',
    category: 'Application Layer',
    icon: <UserCheck className="w-4 h-4 text-soc-accent" />,
    description: 'Presents JavaScript/interactive proof-of-work to suspicious clients.',
    impactTag: 'Automated Bots Blocked',
  },
  {
    key: 'ddosProtectionService',
    name: 'DDoS Scrubbing Cloud',
    category: 'Edge & Network',
    icon: <Shield className="w-4 h-4 text-soc-success" />,
    description: 'Anycast scrubbing center absorbing massive volumetric flood attacks.',
    impactTag: 'Absorbs up to 80% Flood',
  },
];

export const DefensePanel: React.FC = () => {
  const { params, toggleDefense, triggerChaos } = useSimulation();
  const defenses = params.infrastructure.defenses;

  const activeCount = Object.values(defenses).filter(Boolean).length;

  return (
    <div className="p-4 space-y-4 select-none text-xs">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-soc-border">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-soc-accent" />
          <span className="font-bold text-soc-text tracking-wide uppercase text-xs">
            Defensive Countermeasures
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-soc-surface2 border border-soc-border text-soc-text font-semibold">
            {activeCount}/{DEFENSE_ITEMS.length} ACTIVE
          </span>
          <button
            onClick={() => triggerChaos('emergencyShield')}
            className="px-2 py-0.5 rounded bg-soc-success/20 border border-soc-success/40 hover:bg-soc-success/30 text-soc-success font-semibold text-[10px] transition-colors"
          >
            Enable All
          </button>
        </div>
      </div>

      {/* List of Defensive Toggles */}
      <div className="space-y-2">
        {DEFENSE_ITEMS.map((item) => {
          const isEnabled = defenses[item.key];

          return (
            <div
              key={item.key}
              onClick={() => toggleDefense(item.key)}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                isEnabled
                  ? 'bg-soc-surface2 border-soc-accent/50 shadow-sm'
                  : 'bg-soc-surface2/30 border-soc-border/60 hover:border-soc-border opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center border mt-0.5 ${
                    isEnabled
                      ? 'bg-soc-accent/15 border-soc-accent/40 text-soc-accent'
                      : 'bg-soc-surface border-soc-border text-soc-muted'
                  }`}
                >
                  {item.icon}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold text-xs ${
                        isEnabled ? 'text-soc-text' : 'text-soc-muted'
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-soc-surface border border-soc-border text-soc-muted">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-soc-muted leading-tight">
                    {item.description}
                  </p>

                  <div className="text-[10px] font-mono text-soc-success pt-0.5">
                    {item.impactTag}
                  </div>
                </div>
              </div>

              {/* iOS-style toggle switch */}
              <div
                className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 ml-3 ${
                  isEnabled ? 'bg-soc-accent' : 'bg-soc-border'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    isEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
