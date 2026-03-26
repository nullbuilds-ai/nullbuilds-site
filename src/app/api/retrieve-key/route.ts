import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(req: NextRequest) {
  const subscriptionId = req.nextUrl.searchParams.get("sub");
  if (!subscriptionId) return NextResponse.json({ error: "Missing sub" }, { status: 400 });

  const apiKey = await kv.get<string>(`pending:${subscriptionId}`);
  if (!apiKey) return NextResponse.json({ error: "Key not found or already retrieved" }, { status: 404 });

  await kv.del(`pending:${subscriptionId}`);
  return NextResponse.json({ apiKey });
}
