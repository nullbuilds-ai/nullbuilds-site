import Link from "next/link";

function CopyBlock({ code }: { code: string }) {
  return (
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-sm text-[var(--accent)] overflow-x-auto">
      {code}
    </div>
  );
}

function Tool({
  name,
  description,
  params,
  badge = "read-only",
}: {
  name: string;
  description: string;
  params: { name: string; type: string; desc: string; required?: boolean }[];
  badge?: "read-only" | "requires CDP";
}) {
  return (
    <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--bg-card)]">
      <div className="flex items-start justify-between mb-2">
        <code className="text-sm font-bold text-[var(--accent)]">{name}</code>
        <span className={`text-xs border rounded px-2 py-0.5 ml-4 shrink-0 ${badge === "requires CDP" ? "text-[var(--accent)] border-[var(--accent)] opacity-70" : "text-[var(--text-muted)] border-[var(--border)]"}`}>
          {badge}
        </span>
      </div>
      <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">{description}</p>
      <div className="space-y-2">
        {params.map((p) => (
          <div key={p.name} className="flex items-start gap-2 text-xs">
            <code className="text-[var(--text)] shrink-0 w-40">{p.name}</code>
            <span className="text-[var(--text-muted)] font-mono shrink-0 w-16">{p.type}</span>
            <span className="text-[var(--text-muted)]">
              {p.desc}
              {!p.required && (
                <span className="ml-1 opacity-50">(optional)</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function X402McpPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <section className="mb-12">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">
            nullbuilds
          </Link>
          <span>/</span>
          <span>x402-mcp</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-3">
          <span className="text-[var(--accent)]">x402</span>-mcp
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
          MCP server for the x402 payment protocol. Discover 13,000+ live paid APIs, inspect costs,
          and pay them — all from Claude. No private key on your machine.
        </p>
        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
          <a
            href="https://www.npmjs.com/package/@nullbuilds/x402-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)] transition-colors"
          >
            npm
          </a>
          <a
            href="https://github.com/nullbuilds-ai/x402-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)] transition-colors"
          >
            github
          </a>
          <span className="font-mono">v0.2.0</span>
          <span className="text-[var(--accent)]">live</span>
        </div>
      </section>

      {/* Install */}
      <section className="mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
          Install
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-3">
          Add to your Claude Desktop config:
        </p>
        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-4 font-mono text-xs text-[var(--text-muted)] overflow-x-auto mb-4">
          <pre>{`{
  "mcpServers": {
    "x402": {
      "command": "npx",
      "args": ["@nullbuilds/x402-mcp"],
      "env": {
        "CDP_API_KEY_ID": "your-key-id",
        "CDP_API_KEY_SECRET": "your-key-secret",
        "CDP_WALLET_SECRET": "your-wallet-secret"
      }
    }
  }
}`}</pre>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          CDP credentials enable <code className="text-[var(--accent)]">make_x402_request</code>. All other tools work without them.
          Get credentials at <a href="https://portal.cdp.coinbase.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">portal.cdp.coinbase.com</a>.
        </p>
      </section>

      {/* What it does */}
      <section className="mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
          What it does
        </h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          x402 is Coinbase&apos;s HTTP payment protocol — services return{" "}
          <code className="text-[var(--accent)] text-xs">402 Payment Required</code> and agents
          pay in USDC to access them. Coinbase&apos;s Bazaar catalog lists every registered service.
          This MCP lets Claude discover those services, inspect costs, and execute payments via
          CDP Server Wallets — signing happens in Coinbase&apos;s TEE, never on your machine.
        </p>
      </section>

      {/* Tools */}
      <section className="mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
          Tools
        </h2>
        <div className="space-y-4">
          <Tool
            name="discover_paid_services"
            description="Browse the Bazaar catalog of x402-enabled APIs. Returns services with cost, network, and endpoint URL."
            params={[
              { name: "query", type: "string", desc: "Search by name or description" },
              { name: "network", type: "string", desc: "Filter by network: base, solana, ethereum" },
              { name: "limit", type: "number", desc: "Results to return (max 100, default 20)" },
              { name: "offset", type: "number", desc: "Pagination offset" },
            ]}
          />
          <Tool
            name="get_service_details"
            description="Get full payment requirements for a specific resource URL — all options, networks, and pricing."
            params={[
              { name: "resource_url", type: "string", desc: "Exact URL of the x402 resource", required: true },
            ]}
          />
          <Tool
            name="estimate_payment"
            description="Probe a URL live and return its x402 payment requirements. No payment is made."
            params={[
              { name: "resource_url", type: "string", desc: "URL to probe", required: true },
              { name: "method", type: "GET|POST", desc: "HTTP method (default GET)" },
            ]}
          />
          <Tool
            name="check_wallet_balance"
            description="Check the USDC balance of any wallet address on Base. Read-only — no private key required."
            params={[
              { name: "wallet_address", type: "string", desc: "0x address or ENS name", required: true },
            ]}
          />
          <Tool
            name="make_x402_request"
            description="Pay and call an x402-enabled API using your CDP wallet. Handles payment automatically. Returns the actual API response."
            badge="requires CDP"
            params={[
              { name: "resource_url", type: "string", desc: "URL of the x402 API to call", required: true },
              { name: "method", type: "GET|POST", desc: "HTTP method (default GET)" },
              { name: "body", type: "string", desc: "JSON body for POST requests" },
              { name: "max_cost_usdc", type: "number", desc: "Max USDC to spend (default 1.0). Aborts if over limit." },
            ]}
          />
        </div>
      </section>

      {/* Example */}
      <section className="mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
          Example
        </h2>
        <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--bg-card)] space-y-6">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">Find Twitter intelligence services:</p>
            <CopyBlock code='discover_paid_services({ query: "twitter", network: "base" })' />
            <div className="mt-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-xs text-[var(--text-muted)] overflow-x-auto">
              <pre>{`Found 3 service(s):

- mesh.heurist.xyz (Base, 0.01 USDC)
  URL: https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/search_mentions
  Search for mentions of specific tokens or topics on Twitter.

- mesh.heurist.xyz (Base, 0.05 USDC)
  URL: https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/get_smart_mentions
  Get smart mentions with engagement metrics and sentiment analysis.`}</pre>
            </div>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">Check what it costs before paying:</p>
            <CopyBlock code='estimate_payment({ resource_url: "https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/search_mentions" })' />
            <div className="mt-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-xs text-[var(--text-muted)] overflow-x-auto">
              <pre>{`Payment estimate for: https://mesh.heurist.xyz/...
Payment options (1):

### Option 1
- Cost: 0.01 USDC on Base
- Recipient: 0x3b5...
- Timeout: 30s

No payment was made. This is an estimate only.`}</pre>
            </div>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">Pay and call:</p>
            <CopyBlock code='make_x402_request({ resource_url: "https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/search_mentions", max_cost_usdc: 0.05 })' />
            <div className="mt-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-xs text-[var(--text-muted)] overflow-x-auto">
              <pre>{`Success. Paid 0.010000 USDC from 0x7f3a...

{
  "mentions": [
    { "text": "...", "author": "...", "engagement": 1240 },
    ...
  ]
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
          Roadmap
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-[var(--accent)] font-mono text-xs">v0.1 ✓</span>
            <span className="text-[var(--text-muted)]">Discovery, estimation, balance check</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[var(--accent)] font-mono text-xs">v0.2 ✓</span>
            <span className="text-[var(--text-muted)]">
              <code className="text-xs text-[var(--text)]">make_x402_request</code> — pay and call via CDP Server Wallets
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[var(--text-muted)] font-mono text-xs">v0.3</span>
            <span className="text-[var(--text-muted)]">Payment history, spending limits, multi-chain</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex gap-6 text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-8">
        <Link href="/" className="hover:text-[var(--accent)] transition-colors">
          nullbuilds
        </Link>
        <a
          href="https://www.npmjs.com/package/@nullbuilds/x402-mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--accent)] transition-colors"
        >
          npm
        </a>
        <a
          href="https://x402.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--accent)] transition-colors"
        >
          x402.org
        </a>
      </footer>
    </main>
  );
}
