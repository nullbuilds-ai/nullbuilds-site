"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/retrieve-key?sub=${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.apiKey) setApiKey(d.apiKey);
        else setError("Key not found. Check your email or contact support.");
      })
      .catch(() => setError("Failed to retrieve key. Contact support."));
  }, [sessionId]);

  function copy() {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <p className="text-green-400 text-sm font-mono">payment confirmed</p>
          <h1 className="text-2xl font-bold">Your API Key</h1>
          <p className="text-zinc-500 text-sm">This is shown once. Copy it now.</p>
        </div>

        {apiKey ? (
          <div className="space-y-3">
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300 break-all text-left">
              {apiKey}
            </div>
            <button
              onClick={copy}
              className="w-full bg-white text-black font-semibold rounded-lg px-4 py-2.5 text-sm hover:bg-zinc-100 transition"
            >
              {copied ? "Copied" : "Copy API Key"}
            </button>
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <div className="text-zinc-500 text-sm">Retrieving key...</div>
        )}

        <div className="text-xs text-zinc-600 space-y-1">
          <p>Use as <code className="text-zinc-400">x-api-key</code> header on <code className="text-zinc-400">nullbuilds.vercel.app/api/trust/</code></p>
          <p>100 calls/day. Manage billing at <a href="/dashboard" className="text-zinc-400 hover:text-white transition">nullbuilds.vercel.app/dashboard</a></p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
