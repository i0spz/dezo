import React, { useState } from 'react';
import { BookOpen, Search, Shield, Zap, Layers, Server, Network } from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  category: 'Fundamentals' | 'Attack Layers' | 'Defensive Architecture';
  simpleExplanation: string;
  visualExample: string;
  whatHappensDuringAttack: string;
  typicalDefense: string;
}

const MODULES: LearningModule[] = [
  {
    id: 'what-is-ddos',
    title: 'What is a DDoS Attack?',
    category: 'Fundamentals',
    simpleExplanation: 'A Distributed Denial of Service (DDoS) attack uses multiple compromised computers (a botnet) to flood a target server or network with fake traffic, making it unavailable to legitimate users.',
    visualExample: 'Imagine thousands of fake customers crowding a bank doorway so genuine customers cannot enter.',
    whatHappensDuringAttack: 'CPU, RAM, network bandwidth, or connection tables are consumed until legitimate client packets are dropped or timed out.',
    typicalDefense: 'Anycast DDoS scrubbing centers, traffic rate limiting, and edge CDN filtering.',
  },
  {
    id: 'dos-vs-ddos',
    title: 'Difference between DoS and DDoS',
    category: 'Fundamentals',
    simpleExplanation: 'A DoS (Denial of Service) attack originates from a single machine/IP. A DDoS (Distributed) originates from thousands or millions of geographically scattered machines.',
    visualExample: 'DoS is a single loud person shouting into a phone; DDoS is thousands shouting simultaneously from all directions.',
    whatHappensDuringAttack: 'DoS can be stopped by blocking 1 IP address; DDoS cannot be stopped by simple IP blocking because traffic comes from millions of distinct sources.',
    typicalDefense: 'Behavioral analysis, IP reputation scoring, and distributed edge scrubbing.',
  },
  {
    id: 'layer-3',
    title: 'Layer 3 (Network Layer) Attacks',
    category: 'Attack Layers',
    simpleExplanation: 'Attacks that target the Internet Protocol (IP) routing infrastructure, aiming to saturate physical pipes and border routers.',
    visualExample: 'ICMP Echo Floods (Ping of Death) and IP fragmentation attacks.',
    whatHappensDuringAttack: 'Routers spend all computing power reassembling fragmented packets or responding to ICMP pings.',
    typicalDefense: 'BGP Flowspec, upstream ISP scrubbing, and dropping non-essential ICMP at transit edge.',
  },
  {
    id: 'layer-4',
    title: 'Layer 4 (Transport Layer) Attacks',
    category: 'Attack Layers',
    simpleExplanation: 'Attacks targeting TCP and UDP transport protocols, exhausting state connection tables and port buffers.',
    visualExample: 'SYN Floods sending thousands of TCP handshakes without completing the final ACK.',
    whatHappensDuringAttack: 'Server kernel backlog connection queue fills up; new legitimate TCP connections are rejected with "Connection Refused".',
    typicalDefense: 'SYN Cookies, aggressive TCP state timeouts, and Anycast UDP absorption.',
  },
  {
    id: 'layer-7',
    title: 'Layer 7 (Application Layer) Attacks',
    category: 'Attack Layers',
    simpleExplanation: 'Attacks targeting web servers, APIs, and databases using valid HTTP/HTTPS requests that look like real user traffic.',
    visualExample: 'HTTP floods requesting expensive database search queries or repeatedly posting login credential attempts.',
    whatHappensDuringAttack: 'Origin server worker threads and database pools lock up while network bandwidth appears normal.',
    typicalDefense: 'Web Application Firewalls (WAF), Token Bucket Rate Limiting, and Managed Challenge (CAPTCHA).',
  },
  {
    id: 'rate-limiting',
    title: 'Rate Limiting & Token Buckets',
    category: 'Defensive Architecture',
    simpleExplanation: 'A mechanism that restricts how many requests a client or IP address can submit within a given window of time.',
    visualExample: 'A turnstile at a train station letting through only 1 person per second.',
    whatHappensDuringAttack: 'When an attacker surges requests, the excess is rejected with HTTP 429 (Too Many Requests), saving origin CPU.',
    typicalDefense: 'Distributed Redis token bucket or Leaky Bucket algorithm at edge reverse proxies.',
  },
  {
    id: 'cdns',
    title: 'Content Delivery Networks (CDNs)',
    category: 'Defensive Architecture',
    simpleExplanation: 'A global network of edge servers (PoPs) that cache static files and terminate TLS close to users.',
    visualExample: 'Local neighborhood grocery stores stocking common goods instead of everyone driving to a single central warehouse.',
    whatHappensDuringAttack: 'Up to 90% of requests are absorbed by the CDN edge without ever reaching the origin server.',
    typicalDefense: 'Edge caching rules, static asset offloading, and cache-control headers.',
  },
  {
    id: 'waf',
    title: 'Web Application Firewalls (WAF)',
    category: 'Defensive Architecture',
    simpleExplanation: 'A deep-packet inspection layer that examines HTTP request headers, cookies, and payloads for malicious patterns.',
    visualExample: 'An airport security scanner inspecting baggage for prohibited items.',
    whatHappensDuringAttack: 'Known malicious bot signatures, SQL injections, and script scrapers are filtered out instantly.',
    typicalDefense: 'OWASP Core Rule Set (CRS) and behavioral anomaly scoring.',
  },
  {
    id: 'load-balancers',
    title: 'Load Balancers',
    category: 'Defensive Architecture',
    simpleExplanation: 'A reverse proxy distributing incoming traffic across a pool of redundant backend servers.',
    visualExample: 'A bank lobby manager directing customers to the next available teller.',
    whatHappensDuringAttack: 'Spreads load evenly and automatically routes traffic away from degraded or crashed servers.',
    typicalDefense: 'Least-connections algorithm, health check probes, and sticky sessions.',
  },
  {
    id: 'auto-scaling',
    title: 'Auto Scaling Architecture',
    category: 'Defensive Architecture',
    simpleExplanation: 'Cloud infrastructure dynamically provisioning additional compute instances as traffic load climbs.',
    visualExample: 'Opening extra highway lanes or checkout registers during rush hour.',
    whatHappensDuringAttack: 'Expands the cluster capacity to handle traffic spikes without manual administrator intervention.',
    typicalDefense: 'Horizontal Pod Autoscalers (HPA), EC2 Auto Scaling groups based on CPU/Queue metrics.',
  },
  {
    id: 'botnets',
    title: 'Botnets & IoT Zombies',
    category: 'Fundamentals',
    simpleExplanation: 'A network of malware-infected internet devices (smart cameras, routers, compromised servers) commanded by an attacker.',
    visualExample: 'Millions of puppet devices controlled by a single puppeteer command-and-control server.',
    whatHappensDuringAttack: 'Generates traffic from millions of residential IP addresses, bypassing simple subnet blocks.',
    typicalDefense: 'Client fingerprinting, TLS JA3/JA4 hashing, and behavioral bot challenges.',
  },
  {
    id: 'amplification',
    title: 'Traffic Amplification Attacks',
    category: 'Attack Layers',
    simpleExplanation: 'Technique where an attacker sends a tiny request with spoofed victim IP to an open server (DNS/NTP/Memcached), which replies with a gigantic response.',
    visualExample: 'Whispering a question and having a loudspeaker blast the answer at your neighbor\'s house.',
    whatHappensDuringAttack: 'A 1 Gbps attacker stream amplifies into 50+ Gbps striking the target\'s network border.',
    typicalDefense: 'Response Rate Limiting (RRL) on resolvers, BCP 38 ingress anti-spoofing filtering.',
  },
];

export const LearningCenterView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(MODULES[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = MODULES.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const current = MODULES.find((m) => m.id === selectedId) || MODULES[0];

  return (
    <div className="p-4 flex flex-col h-full space-y-3 select-none text-xs">
      {/* Search Header */}
      <div className="flex items-center justify-between pb-2 border-b border-soc-border">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-soc-accent" />
          <span className="font-bold text-soc-text tracking-wide uppercase text-xs">
            Cybersecurity Learning Center
          </span>
        </div>

        <div className="relative w-48">
          <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-soc-muted" />
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2.5 py-1 bg-soc-surface2 border border-soc-border rounded text-[11px] text-soc-text focus:outline-none focus:border-soc-accent"
          />
        </div>
      </div>

      {/* Main Split Content */}
      <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Left List */}
        <div className="w-1/3 overflow-y-auto space-y-1 pr-1 border-r border-soc-border/60">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left p-2 rounded text-[11px] transition-colors ${
                selectedId === item.id
                  ? 'bg-soc-accent/20 border border-soc-accent text-soc-accent font-semibold'
                  : 'hover:bg-soc-surface2 text-soc-muted hover:text-soc-text'
              }`}
            >
              <div className="truncate">{item.title}</div>
              <div className="text-[9px] font-mono text-soc-muted/70 uppercase">
                {item.category}
              </div>
            </button>
          ))}
        </div>

        {/* Right Details Panel */}
        <div className="w-2/3 overflow-y-auto space-y-3.5 pl-1 text-[11px]">
          <div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-soc-surface2 border border-soc-border text-soc-accent uppercase">
              {current.category}
            </span>
            <h3 className="text-sm font-bold text-soc-text mt-1.5">{current.title}</h3>
          </div>

          <div className="space-y-1">
            <div className="font-semibold text-soc-accent uppercase text-[10px] tracking-wider">
              Simple Explanation
            </div>
            <p className="text-soc-text leading-relaxed bg-soc-surface2/40 p-2.5 rounded border border-soc-border">
              {current.simpleExplanation}
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-semibold text-soc-warning uppercase text-[10px] tracking-wider">
              Visual Analogy
            </div>
            <p className="text-soc-muted leading-relaxed bg-soc-surface2/40 p-2.5 rounded border border-soc-border">
              {current.visualExample}
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-semibold text-soc-critical uppercase text-[10px] tracking-wider">
              What Happens During Attack
            </div>
            <p className="text-soc-muted leading-relaxed bg-soc-surface2/40 p-2.5 rounded border border-soc-border">
              {current.whatHappensDuringAttack}
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-semibold text-soc-success uppercase text-[10px] tracking-wider">
              Typical Defense
            </div>
            <p className="text-soc-success/90 leading-relaxed bg-soc-success/10 p-2.5 rounded border border-soc-success/30">
              {current.typicalDefense}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
