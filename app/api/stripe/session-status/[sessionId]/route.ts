import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { requireStripeConfig, stripe } from "@/lib/payment/stripe-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const user = await requireUser();
    const { sessionId } = await params;

    const payment = await prisma.payment.findFirst({
      where: {
        stripeCheckoutSessionId: sessionId,
        userId: user.id,
      },
      select: {
        id: true,
        status: true,
        amount: true,
        currency: true,
        planId: true,
        provider: true,
        stripeCheckoutSessionId: true,
        stripeSubscriptionId: true,
        billingCycle: true,
        creditsGranted: true,
        createdAt: true,
        completedAt: true,
      },
    });

    let stripeStatus: string | null = null;
    let paymentStatus: string | null = null;

    if (process.env.STRIPE_SECRET_KEY) {
      requireStripeConfig();
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      stripeStatus = checkoutSession.status || null;
      paymentStatus = checkoutSession.payment_status || null;
    }

    if (!payment) {
      return NextResponse.json({
        id: sessionId,
        status: paymentStatus === "paid" ? "PROCESSING" : "PENDING",
        provider: "STRIPE",
        stripeCheckoutSessionId: sessionId,
        stripeStatus,
        paymentStatus,
        message: "Stripe checkout completed. Subscription activation may still be processing via webhook.",
      });
    }

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount.toNumber(),
      currency: payment.currency,
      planId: payment.planId,
      provider: payment.provider,
      stripeCheckoutSessionId: payment.stripeCheckoutSessionId,
      stripeSubscriptionId: payment.stripeSubscriptionId,
      billingCycle: payment.billingCycle,
      creditsGranted: payment.creditsGranted,
      stripeStatus,
      paymentStatus,
      createdAt: payment.createdAt.toISOString(),
      completedAt: payment.completedAt?.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch Stripe checkout session status." },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 500 },
    );
  }
}
