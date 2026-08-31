import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { MembershipType, PaymentStatus } from "@prisma/client";
import { getPlanById } from "@/constants/pricing-plans";
import { grantMonthlyCredits } from "@/lib/billing/credits";
import { prisma } from "@/lib/db/prisma";
import { getStripeClient } from "@/lib/payment/stripe-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook secret is not configured." }, { status: 500 });
  }

  let event: Stripe.Event;
  const stripe = getStripeClient();

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid Stripe webhook payload." },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChanged(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process Stripe webhook." },
      { status: 500 },
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const userId = metadata.userId || session.client_reference_id;
  const plan = metadata.planId ? getPlanById(metadata.planId) : null;
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;

  if (!userId || !plan || plan.membershipType === "FREE") return;

  const subscription = subscriptionId ? await getStripeClient().subscriptions.retrieve(subscriptionId) : null;
  const period = subscription ? getSubscriptionPeriod(subscription) : getOneTimePaymentPeriod(plan.durationDays);
  const existing = await prisma.payment.findUnique({ where: { providerOrderId: session.id } });

  await prisma.user.update({
    where: { id: userId },
    data: {
      membershipType: plan.membershipType as MembershipType,
      membershipExpiresAt: period.end,
      stripeCustomerId: customerId || undefined,
      stripeSubscriptionId: subscriptionId || undefined,
      subscriptionStatus: subscription?.status || "active",
      currentPeriodStart: period.start,
      currentPeriodEnd: period.end,
    },
  });

  await prisma.payment.upsert({
    where: { providerOrderId: session.id },
    update: {
      status: "COMPLETED",
      completedAt: new Date(),
      providerPaymentId: subscriptionId || session.payment_intent?.toString() || null,
      stripeCheckoutSessionId: session.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      creditsGranted: plan.monthlyCredits,
      metadata,
    },
    create: {
      userId,
      provider: "STRIPE",
      providerOrderId: session.id,
      providerPaymentId: subscriptionId || session.payment_intent?.toString() || null,
      stripeCheckoutSessionId: session.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      amount: plan.amount,
      currency: plan.currency,
      planId: plan.id,
      billingCycle: plan.billingCycle,
      creditsGranted: plan.monthlyCredits,
      status: "COMPLETED",
      completedAt: new Date(),
      metadata,
    },
  });

  if (!existing || existing.status !== "COMPLETED") {
    await grantMonthlyCredits({ userId, amount: plan.monthlyCredits, planId: plan.id });
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);
  const customerId = getInvoiceCustomerId(invoice);
  const subscription = subscriptionId ? await getStripeClient().subscriptions.retrieve(subscriptionId) : null;
  const metadata = subscription?.metadata || invoice.metadata || {};
  const userId = metadata.userId || (customerId ? await findUserIdByCustomer(customerId) : null);
  const plan = metadata.planId ? getPlanById(metadata.planId) : null;

  if (!userId || !plan || plan.membershipType === "FREE") return;

  const period = getSubscriptionPeriod(subscription);
  const existing = await prisma.payment.findUnique({ where: { providerOrderId: invoice.id } });

  await prisma.user.update({
    where: { id: userId },
    data: {
      membershipType: plan.membershipType as MembershipType,
      membershipExpiresAt: period.end,
      stripeCustomerId: customerId || undefined,
      stripeSubscriptionId: subscriptionId || undefined,
      subscriptionStatus: subscription?.status || "active",
      currentPeriodStart: period.start,
      currentPeriodEnd: period.end,
    },
  });

  await prisma.payment.upsert({
    where: { providerOrderId: invoice.id },
    update: {
      status: "COMPLETED" as PaymentStatus,
      completedAt: new Date(),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      creditsGranted: plan.monthlyCredits,
      metadata: { ...metadata, invoiceId: invoice.id },
    },
    create: {
      userId,
      provider: "STRIPE",
      providerOrderId: invoice.id,
      providerPaymentId: getInvoicePaymentId(invoice),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency.toUpperCase(),
      planId: plan.id,
      billingCycle: plan.billingCycle,
      creditsGranted: plan.monthlyCredits,
      status: "COMPLETED",
      completedAt: new Date(),
      metadata: { ...metadata, invoiceId: invoice.id },
    },
  });

  if (!existing) {
    await grantMonthlyCredits({ userId, amount: plan.monthlyCredits, planId: plan.id });
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = getInvoiceCustomerId(invoice);
  const userId = customerId ? await findUserIdByCustomer(customerId) : null;

  if (userId) {
    await prisma.user.update({ where: { id: userId }, data: { subscriptionStatus: "past_due" } });
  }
}

async function handleSubscriptionChanged(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId || await findUserIdByCustomer(getSubscriptionCustomerId(subscription));
  if (!userId) return;

  const plan = subscription.metadata?.planId ? getPlanById(subscription.metadata.planId) : null;
  const active = ["active", "trialing"].includes(subscription.status);
  const period = getSubscriptionPeriod(subscription);

  await prisma.user.update({
    where: { id: userId },
    data: {
      membershipType: active && plan ? plan.membershipType as MembershipType : "FREE",
      membershipExpiresAt: active ? period.end : null,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      currentPeriodStart: active ? period.start : null,
      currentPeriodEnd: active ? period.end : null,
    },
  });
}

async function findUserIdByCustomer(customerId: string | null | undefined) {
  if (!customerId) return null;
  const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId }, select: { id: true } });
  return user?.id || null;
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice) {
  const invoiceWithSubscription = invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null };
  const subscription = invoiceWithSubscription.subscription;
  return typeof subscription === "string" ? subscription : subscription?.id || null;
}

function getInvoiceCustomerId(invoice: Stripe.Invoice) {
  return typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id || null;
}

function getInvoicePaymentId(invoice: Stripe.Invoice) {
  const record = invoice as Stripe.Invoice & { payment_intent?: string | Stripe.PaymentIntent | null; charge?: string | Stripe.Charge | null };
  const paymentIntent = record.payment_intent;
  const charge = record.charge;
  if (typeof paymentIntent === "string") return paymentIntent;
  if (paymentIntent?.id) return paymentIntent.id;
  if (typeof charge === "string") return charge;
  if (charge?.id) return charge.id;
  return null;
}

function getSubscriptionCustomerId(subscription: Stripe.Subscription) {
  return typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id || null;
}

function getOneTimePaymentPeriod(durationDays: number) {
  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays);
  return { start, end };
}

function getSubscriptionPeriod(subscription: Stripe.Subscription | null) {
  const sub = subscription as (Stripe.Subscription & { current_period_start?: number; current_period_end?: number }) | null;
  return {
    start: sub?.current_period_start ? new Date(sub.current_period_start * 1000) : new Date(),
    end: sub?.current_period_end ? new Date(sub.current_period_end * 1000) : null,
  };
}
