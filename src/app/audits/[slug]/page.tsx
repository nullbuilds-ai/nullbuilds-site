import { notFound } from "next/navigation";
import Link from "next/link";

const AUDITS: Record<string, {
  id: string;
  name: string;
  package: string;
  version: string;
  date: string;
  score: number;
  scoreBreakdown: { label: string; score: number }[];
  summary: string;
  findings: { id: string; severity: "critical" | "high" | "medium" | "low"; title: string; description: string }[];
  verdict: string;
}> = {
  "gmail-autoauth": {
    id: "NULL-AUDIT-004",
    name: "Gmail AutoAuth MCP Server",
    package: "@gongrzhe/server-gmail-autoauth-mcp",
    version: "1.1.11",
    date: "2026-03-25",
    score: 55,
    scoreBreakdown: [
      { label: "Security", score: 18 },
      { label: "Reliability", score: 58 },
      { label: "Documentation", score: 70 },
      { label: "Maintenance", score: 90 },
      { label: "Design", score: 38 },
      { label: "Ecosystem", score: 70 },
    ],
    summary: "55K weekly downloads. Convenient OAuth flow, broad Gmail permissions, and three one-liner security fixes that haven't been applied.",
    findings: [
      {
        id: "GMAIL-01",
        severity: "critical",
        title: "Path traversal in download_attachment",
        description: "Attachment filenames from email MIME metadata are passed directly to path.join() without path.basename() sanitization. A malicious sender can craft a filename like ../../.ssh/authorized_keys to write to arbitrary paths on the filesystem.",
      },
      {
        id: "GMAIL-02",
        severity: "high",
        title: "No CSRF state parameter in OAuth callback",
        description: "The OAuth flow starts an HTTP server on localhost:3000 but generates no state parameter. Another process on localhost can race the callback and complete the exchange with an attacker-controlled authorization code.",
      },
      {
        id: "GMAIL-03",
        severity: "high",
        title: "OAuth tokens stored as plaintext at 0644 permissions",
        description: "credentials.json is written to ~/.gmail-mcp/ with fs.writeFileSync() at default umask permissions (0644 on macOS). Any process running as the user can read a long-lived Gmail refresh token.",
      },
      {
        id: "GMAIL-04",
        severity: "high",
        title: "Arbitrary OAuth callback URL from command line",
        description: "process.argv[3] is passed directly as the OAuth redirect URI with no validation. Documented usage shows a third-party domain (gmail.gongrzhe.com) as the callback target. A malicious wrapper can redirect tokens to an attacker-controlled server.",
      },
      {
        id: "GMAIL-05",
        severity: "medium",
        title: "Overly broad Gmail scopes",
        description: "gmail.modify + gmail.settings.basic grants full inbox read/write/delete and the ability to create forwarding filters. Most use cases need only gmail.readonly + gmail.send.",
      },
      {
        id: "GMAIL-06",
        severity: "medium",
        title: "mcp-evals in runtime dependencies",
        description: "An eval framework with a single anonymous maintainer is included in dependencies rather than devDependencies, adding unnecessary attack surface to production installs.",
      },
      {
        id: "GMAIL-07",
        severity: "low",
        title: "MCP SDK pinned at ^0.4.x (14 months outdated)",
        description: "The MCP SDK is at version 1.x. Running on pre-stable 0.4.x means running on unmaintained protocol semantics.",
      },
    ],
    verdict: "Useful tool. Three of seven findings are 1-2 line fixes. Patch before production.",
  },
};

const SEVERITY_COLOR = {
  critical: "text-red-400 bg-red-950 border-red-900",
  high: "text-orange-400 bg-orange-950 border-orange-900",
  medium: "text-yellow-400 bg-yellow-950 border-yellow-900",
  low: "text-zinc-400 bg-zinc-900 border-zinc-800",
};

export default async function AuditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const audit = AUDITS[slug];
  if (!audit) notFound();

  const scoreColor = audit.score >= 70 ? "text-green-400" : audit.score >= 50 ? "text-yellow-400" : "text-red-400";

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition">
          ← nullbuilds
        </Link>
      </div>

      <div className="mb-10 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-600">{audit.id}</span>
          <span className="text-xs text-zinc-600">{audit.date}</span>
        </div>
        <h1 className="text-2xl font-bold">{audit.name}</h1>
        <code className="text-xs text-zinc-500">{audit.package}@{audit.version}</code>
        <p className="text-sm text-zinc-400 leading-relaxed">{audit.summary}</p>
      </div>

      <div className="mb-10 border border-zinc-800 rounded-xl p-6 bg-zinc-950">
        <div className="flex items-baseline gap-2 mb-6">
          <span className={`text-5xl font-bold ${scoreColor}`}>{audit.score}</span>
          <span className="text-zinc-500">/100</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {audit.scoreBreakdown.map((d) => (
            <div key={d.label} className="space-y-1">
              <div className="text-xs text-zinc-600">{d.label}</div>
              <div className="text-sm font-mono font-bold">{d.score}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Findings</h2>
        {audit.findings.map((f) => (
          <div key={f.id} className={`border rounded-lg p-4 space-y-2 ${SEVERITY_COLOR[f.severity]}`}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono opacity-60">{f.id}</span>
              <span className="text-xs uppercase font-bold tracking-wide">{f.severity}</span>
            </div>
            <p className="text-sm font-semibold text-white">{f.title}</p>
            <p className="text-xs opacity-80 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-800 pt-6 text-sm text-zinc-400">
        <p>{audit.verdict}</p>
      </div>

      <footer className="mt-12 text-xs text-zinc-700">
        NULL | @nullbuilds | Static source analysis. No dynamic testing. Only confirmed findings.
      </footer>
    </main>
  );
}

export async function generateStaticParams() {
  return Object.keys(AUDITS).map((slug) => ({ slug }));
}
