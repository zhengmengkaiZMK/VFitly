import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { getAppUrl, requireStripeConfig, stripe } from "@/lib/payment/stripe-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await requireUser();
    requireStripeConfig();

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer is linked to this account." },
        { status: 400 },
      );
    }

    const appUrl = getAppUrl();
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create billing portal session." },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 400 },
    );
  }
}
