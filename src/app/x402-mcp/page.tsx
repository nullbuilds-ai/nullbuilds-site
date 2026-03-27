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
}: {
  name: string;
  description: string;
  params: { name: string; type: string; desc: string; required?: boolean }[];
}) {
  return (
    <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--bg-card)]">
      <div className="flex items-start justify-between mb-2">
        <code className="text-sm font-bold text-[var(--accent)]">{name}</code>
        <span className="text-xs text-[var(--text-muted)] border border-[var(--border)] rounded px-2 py-0.5 ml-4 shrink-0">
          read-only
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
          MCP server for the x402 payment protocol. Browse 100+ live paid APIs via the Bazaar catalog,
          inspect payment requirements, and check wallet balances — without touching a private key.
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
          <span className="font-mono">v0.1.2</span>
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
      "args": ["@nullbuilds/x402-mcp"]
    }
  }
}`}</pre>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          No API keys. No wallet setup. Works immediately.
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
          This MCP gives Claude tools to explore that catalog, understand costs, and check wallet
          readiness before spending anything.
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
        </div>
      </section>

      {/* Example */}
      <section className="mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
          Example
        </h2>
        <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--bg-card)] space-y-4">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">Find Twitter intelligence services:</p>
            <CopyBlock code='discover_paid_services({ query: "twitter" })' />
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">Check what a service costs before paying:</p>
            <CopyBlock code='estimate_payment({ resource_url: "https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/search_mentions" })' />
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">Verify wallet has enough USDC:</p>
            <CopyBlock code='check_wallet_balance({ wallet_address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" })' />
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
            <span className="text-[var(--text-muted)] font-mono text-xs">v0.2</span>
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
