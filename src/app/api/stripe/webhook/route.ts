import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { kv } from "@vercel/kv";
import { randomBytes, createHash } from "crypto";

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!); }
function generateApiKey() { return "nts_" + randomBytes(32).toString("hex"); }
function hashKey(key: string) { return createHash("sha256").update(key).digest("hex"); }

async function provisionKey(email: string, subscriptionId: string, customerId: string) {
  const apiKey = generateApiKey();
  const h = hashKey(apiKey);
  await kv.set(`apikey:${h}`, { email, subscriptionId, customerId, dailyLimit: 100, active: true });
  await kv.set(`sub:${subscriptionId}`, h);
  await kv.set(`pending:${subscriptionId}`, apiKey, { ex: 600 });
}

async function revokeKey(subscriptionId: string) {
  const h = await kv.get<string>(`sub:${subscriptionId}`);
  if (h) await kv.hset(`apikey:${h}`, { active: false });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (await kv.get(`evt:${event.id}`)) return NextResponse.json({ received: true });
  await kv.set(`evt:${event.id}`, 1, { ex: 86400 * 7 });

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.mode === "subscription")
        await provisionKey(s.customer_email!, s.subscription as string, s.customer as string);
      break;
    }
    case "customer.subscription.deleted": {
      await revokeKey((event.data.object as Stripe.Subscription).id);
      break;
    }
    case "charge.dispute.created": {
      const d = event.data.object as Stripe.Dispute;
      if (d.amount <= 5000)
        await stripe.refunds.create({ charge: d.charge as string });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
