"use client";
import { useState } from "react";

const FEATURES = [
  "100 API calls/day",
  "5 MCP tools: score, search, review, flagged, batch",
  "6-dimension scoring breakdown per server",
  "53 servers scored, growing weekly",
  "REST endpoint + MCP transport",
];

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!email) return;
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-24">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs tracking-widest uppercase text-zinc-500">NULL Trust Score</p>
          <h1 className="text-3xl font-bold tracking-tight">MCP Server Trust API</h1>
          <p className="text-zinc-400 text-sm">
            Before your agent connects to an MCP server, know if it&apos;s safe.
          </p>
        </div>
        <div className="border border-zinc-800 rounded-xl p-8 space-y-6 bg-zinc-950">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold">$29</span>
            <span className="text-zinc-500">/month</span>
          </div>
          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="text-green-400">+</span>{f}
              </li>
            ))}
          </ul>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
            />
            <button
              onClick={handleCheckout}
              disabled={loading || !email}
              className="w-full bg-white text-black font-semibold rounded-lg px-4 py-2.5 text-sm hover:bg-zinc-100 disabled:opacity-40 transition"
            >
              {loading ? "Redirecting..." : "Get API Access"}
            </button>
          </div>
          <p className="text-xs text-zinc-600 text-center">Cancel anytime via Stripe. No questions asked.</p>
        </div>
        <p className="text-center text-xs text-zinc-600">
          3 free lookups/day on the public endpoint. No key needed.
        </p>
      </div>
    </main>
  );
}
