import trustData from "../../data/trust-scores.json";
import Link from "next/link";

interface Finding {
  id: string;
  severity: string;
  title: string;
  file?: string;
  verified: boolean | string;
}

interface Review {
  id: string;
  summary: string;
  findings: Finding[];
  recommendation: string;
}

interface Server {
  id: string;
  name: string;
  description: string | null;
  author: string | null;
  stars: number;
  weekly_downloads: number;
  composite_score: number;
  security: number;
  reliability: number;
  documentation: number;
  maintenance: number;
  design: number;
  ecosystem: number;
  grade: string;
  scoring_version: string;
  review: Review | null;
}

const servers = trustData as Server[];

function GradeBadge({ grade }: { grade: string }) {
  const colors: Record<string, string> = {
    A: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    B: "bg-green-500/20 text-green-400 border-green-500/30",
    C: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    D: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    F: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-bold border ${colors[grade] || colors.C}`}>
      {grade}
    </span>
  );
}

function DimensionBar({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  const width = Math.max(2, value);
  const color = muted
    ? "bg-zinc-600"
    : value >= 70
      ? "bg-emerald-500"
      : value >= 50
        ? "bg-yellow-500"
        : "bg-red-500";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 text-[var(--text-muted)] shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
      <span className={`w-6 text-right font-mono ${muted ? "text-zinc-600" : "text-[var(--text-muted)]"}`}>{value}</span>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    CRITICAL: "text-red-400",
    HIGH: "text-orange-400",
    MEDIUM: "text-yellow-400",
    LOW: "text-zinc-400",
  };
  return (
    <span className={`text-xs font-mono ${colors[severity] || "text-zinc-400"}`}>
      {severity}
    </span>
  );
}

function ServerCard({ server }: { server: Server }) {
  const isAutoScored = server.scoring_version?.startsWith("auto");
  const reviewed = server.review !== null;

  return (
    <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--bg-card)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold truncate">{server.name}</h3>
            {reviewed && (
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shrink-0">
                reviewed
              </span>
            )}
            {isAutoScored && (
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700 shrink-0">
                auto
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono truncate">{server.id}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-lg font-bold font-mono">{server.composite_score}</span>
          <GradeBadge grade={server.grade} />
        </div>
      </div>

      {server.description && (
        <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2">{server.description}</p>
      )}

      {/* Dimension bars */}
      <div className="grid gap-1.5 mb-3">
        <DimensionBar label="security" value={server.security} muted={isAutoScored} />
        <DimensionBar label="reliability" value={server.reliability} muted={isAutoScored} />
        <DimensionBar label="docs" value={server.documentation} muted={isAutoScored} />
        <DimensionBar label="maint." value={server.maintenance} />
        <DimensionBar label="design" value={server.design} muted={isAutoScored} />
        <DimensionBar label="ecosystem" value={server.ecosystem} />
      </div>

      {/* Stats row */}
      <div className="flex gap-4 text-xs text-[var(--text-muted)] mb-3">
        {server.weekly_downloads > 0 && (
          <span>{server.weekly_downloads.toLocaleString()}/wk</span>
        )}
        {server.stars > 0 && <span>{server.stars.toLocaleString()} stars</span>}
      </div>

      {/* Review findings */}
      {reviewed && server.review && (
        <div className="border-t border-[var(--border)] pt-3 mt-3">
          <p className="text-xs text-[var(--text-muted)] mb-2">{server.review.summary}</p>
          <div className="grid gap-1">
            {server.review.findings.map((f) => (
              <div key={f.id} className="flex items-center gap-2 text-xs">
                <SeverityBadge severity={f.severity} />
                <span className="text-[var(--text-muted)] truncate">{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const metadata = {
  title: "MCP Trust Scores | nullbuilds",
  description: "Trust scores for 53 MCP servers. 6-dimension scoring across security, reliability, documentation, maintenance, design, and ecosystem. 3 fully audited with verified findings.",
  openGraph: {
    title: "MCP Trust Scores | nullbuilds",
    description: "Trust scores for 53 MCP servers. Query before you connect.",
  },
};

export default function TrustPage() {
  const reviewed = servers.filter((s) => s.review !== null);
  const autoScored = servers.filter((s) => s.review === null);

  const stats = {
    total: servers.length,
    reviewed: reviewed.length,
    avgScore: Math.round(servers.reduce((sum, s) => sum + s.composite_score, 0) / servers.length),
    gradeA: servers.filter((s) => s.grade === "A").length,
    gradeB: servers.filter((s) => s.grade === "B").length,
    gradeC: servers.filter((s) => s.grade === "C").length,
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <Link href="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-4 block">
          &larr; nullbuilds
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          MCP <span className="text-[var(--accent)]">Trust Scores</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {stats.total} MCP servers scored across 6 dimensions. {stats.reviewed} fully audited with verified security findings. Query before you connect.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <div className="border border-[var(--border)] rounded-lg p-3 bg-[var(--bg-card)] text-center">
          <div className="text-xl font-bold font-mono">{stats.total}</div>
          <div className="text-xs text-[var(--text-muted)]">servers scored</div>
        </div>
        <div className="border border-[var(--border)] rounded-lg p-3 bg-[var(--bg-card)] text-center">
          <div className="text-xl font-bold font-mono">{stats.reviewed}</div>
          <div className="text-xs text-[var(--text-muted)]">fully audited</div>
        </div>
        <div className="border border-[var(--border)] rounded-lg p-3 bg-[var(--bg-card)] text-center">
          <div className="text-xl font-bold font-mono">{stats.avgScore}</div>
          <div className="text-xs text-[var(--text-muted)]">avg score</div>
        </div>
        <div className="border border-[var(--border)] rounded-lg p-3 bg-[var(--bg-card)] text-center">
          <div className="text-xl font-bold font-mono text-[var(--accent)]">{stats.gradeB}</div>
          <div className="text-xs text-[var(--text-muted)]">grade B+</div>
        </div>
      </div>

      {/* Methodology */}
      <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--bg-card)] mb-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--accent)] mb-3">Scoring Methodology</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs">
          <div><span className="text-[var(--text-muted)]">Security</span> <span className="font-mono text-[var(--accent)]">25%</span></div>
          <div><span className="text-[var(--text-muted)]">Maintenance</span> <span className="font-mono text-[var(--accent)]">20%</span></div>
          <div><span className="text-[var(--text-muted)]">Reliability</span> <span className="font-mono text-[var(--accent)]">20%</span></div>
          <div><span className="text-[var(--text-muted)]">Documentation</span> <span className="font-mono text-[var(--accent)]">15%</span></div>
          <div><span className="text-[var(--text-muted)]">Design</span> <span className="font-mono text-[var(--accent)]">10%</span></div>
          <div><span className="text-[var(--text-muted)]">Ecosystem</span> <span className="font-mono text-[var(--accent)]">10%</span></div>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-3">
          Grades: A (80+) B (60-79) C (40-59) D (20-39) F (0-19). Auto-scored servers use public signals only (downloads, stars, commit recency). Reviewed servers have full source code audits with verified findings.
        </p>
      </div>

      {/* Reviewed servers */}
      <section className="mb-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
          Audited Servers ({reviewed.length})
        </h2>
        <div className="grid gap-4">
          {reviewed.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      </section>

      {/* Auto-scored servers */}
      <section className="mb-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
          Auto-Scored Servers ({autoScored.length})
        </h2>
        <div className="grid gap-3">
          {autoScored.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="border border-[var(--accent)]/30 rounded-lg p-5 bg-[var(--accent)]/5 text-center">
        <p className="text-sm font-bold mb-1">Want your MCP server reviewed?</p>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          NULL reviews MCP servers for free. Full source code audit, verified findings, published results.
        </p>
        <a
          href="https://x.com/nullbuilds"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs font-mono px-4 py-2 rounded border border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
        >
          DM @nullbuilds on X
        </a>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-[var(--border)] flex justify-between text-xs text-[var(--text-muted)]">
        <span>Scores updated 2026-03-23</span>
        <a
          href="https://github.com/nullbuilds-ai/null-trust-score"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--accent)] transition-colors"
        >
          MCP server &rarr;
        </a>
      </footer>
    </main>
  );
}
