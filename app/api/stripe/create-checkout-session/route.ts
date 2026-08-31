import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { getAppUrl, getPaidPlanOrThrow, getStripePriceId, requireStripeConfig, stripe } from "@/lib/payment/stripe-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json().catch(() => ({}));
    const planId = typeof body.planId === "string" ? body.planId : "";
    const plan = getPaidPlanOrThrow(planId);
    const priceId = getStripePriceId(planId);

    requireStripeConfig(planId);

    const appUrl = getAppUrl();
    let customerId = user.stripeCustomerId || undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customer.id } });
    }

    const price = await stripe.prices.retrieve(priceId!);
    const checkoutMode = price.recurring ? "subscription" : "payment";
    const metadata = {
      userId: user.id,
      planId: plan.id,
      membershipType: plan.membershipType,
      billingCycle: plan.billingCycle,
      monthlyCredits: String(plan.monthlyCredits),
    };

    const session = await stripe.checkout.sessions.create({
      mode: checkoutMode,
      customer: customerId,
      line_items: [{ price: priceId!, quantity: 1 }],
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/payment/cancelled`,
      allow_promotion_codes: true,
      client_reference_id: user.id,
      metadata,
      ...(checkoutMode === "subscription"
        ? {
            subscription_data: {
              metadata,
            },
          }
        : {
            payment_intent_data: {
              metadata,
            },
          }),
    });

    await prisma.payment.upsert({
      where: { providerOrderId: session.id },
      update: {
        stripeCheckoutSessionId: session.id,
        stripeCustomerId: customerId,
        billingCycle: plan.billingCycle,
        creditsGranted: plan.monthlyCredits,
        metadata: session.metadata || {},
      },
      create: {
        userId: user.id,
        provider: "STRIPE",
        providerOrderId: session.id,
        stripeCheckoutSessionId: session.id,
        stripeCustomerId: customerId,
        amount: plan.amount,
        currency: plan.currency,
        planId: plan.id,
        billingCycle: plan.billingCycle,
        creditsGranted: plan.monthlyCredits,
        status: "PENDING",
        metadata: session.metadata || {},
      },
    });

    return NextResponse.json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create Stripe checkout session." },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 400 },
    );
  }
}
