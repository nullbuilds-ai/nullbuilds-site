import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { createHash } from "crypto";

const TRUST_API = process.env.TRUST_SCORE_API_URL ?? "http://100.82.157.95:3100";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 401 });

  const h = createHash("sha256").update(apiKey).digest("hex");
  const meta = await kv.get<{ active: boolean; dailyLimit: number }>(`apikey:${h}`);
  if (!meta?.active) return NextResponse.json({ error: "Invalid or inactive key" }, { status: 403 });

  const today = new Date().toISOString().split("T")[0];
  const rlKey = `rl:${h}:${today}`;
  const count = await kv.incr(rlKey);
  if (count === 1) await kv.expire(rlKey, 86400);
  if (count > meta.dailyLimit)
    return NextResponse.json({ error: "Daily rate limit exceeded (100/day)" }, { status: 429 });

  const path = req.nextUrl.pathname.replace("/api/trust", "");
  const upstream = await fetch(`${TRUST_API}${path}${req.nextUrl.search}`);
  return NextResponse.json(await upstream.json(), { status: upstream.status });
}
