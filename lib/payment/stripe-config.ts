import Stripe from "stripe";
import { getPlanById } from "@/constants/pricing-plans";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not configured.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function getStripePriceId(planId: string) {
  const envMap: Record<string, string | undefined> = {
    PLUS_MONTHLY: process.env.STRIPE_PRICE_PLUS_MONTHLY,
    PLUS_YEARLY: process.env.STRIPE_PRICE_PLUS_YEARLY,
    ULTRA_MONTHLY: process.env.STRIPE_PRICE_ULTRA_MONTHLY,
    ULTRA_YEARLY: process.env.STRIPE_PRICE_ULTRA_YEARLY,
  };

  return envMap[planId];
}

export function requireStripeConfig(planId?: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not configured.");
  }

  if (planId && !getStripePriceId(planId)) {
    throw new Error(`Stripe price ID is not configured for ${planId}.`);
  }
}

export function getPaidPlanOrThrow(planId: string) {
  const plan = getPlanById(planId);
  if (!plan || plan.membershipType === "FREE") {
    throw new Error("Invalid paid plan.");
  }
  return plan;
}
