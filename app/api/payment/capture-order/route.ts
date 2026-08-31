import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { capturePayPalOrder } from "@/lib/payment/paypal-config";
import { getPlanById } from "@/constants/pricing-plans";
import { grantMonthlyCredits } from "@/lib/billing/credits";
import type { CaptureOrderRequest, PayPalOrderDetails } from "@/types/payment";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
    }

    const body: CaptureOrderRequest = await request.json();
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json({ error: "Missing orderID parameter" }, { status: 400 });
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { providerOrderId: orderID },
    });

    if (existingPayment?.status === "COMPLETED") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { membershipType: true, membershipExpiresAt: true },
      });

      return NextResponse.json({
        success: true,
        paymentId: existingPayment.id,
        membershipType: user?.membershipType,
        expiresAt: user?.membershipExpiresAt?.toISOString(),
        message: "Payment already processed",
      });
    }

    const details = (await capturePayPalOrder(orderID)) as PayPalOrderDetails;

    if (details.status !== "COMPLETED") {
      return NextResponse.json(
        { error: `Payment not completed. Status: ${details.status}` },
        { status: 400 },
      );
    }

    const purchaseUnit = details.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];
    const planId = purchaseUnit?.custom_id;
    const plan = planId ? getPlanById(planId) : undefined;

    if (!purchaseUnit || !capture || !plan || plan.membershipType === "FREE") {
      return NextResponse.json({ error: "Invalid paid plan or PayPal capture details" }, { status: 400 });
    }

    const amount = Number(capture.amount.value);
    const currency = capture.amount.currency_code;

    if (amount !== plan.amount || currency !== plan.currency) {
      return NextResponse.json({ error: "Payment amount does not match selected plan" }, { status: 400 });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          userId: session.user.id,
          provider: "PAYPAL",
          providerOrderId: orderID,
          providerPaymentId: capture.id,
          amount: plan.amount,
          currency: plan.currency,
          planId: plan.id,
          status: "COMPLETED",
          completedAt: now,
          metadata: {
            paypalOrderId: details.id,
            paypalCaptureId: capture.id,
            planName: plan.name,
            billingCycle: plan.billingCycle,
            monthlyCredits: plan.monthlyCredits,
          },
        },
      });

      const user = await tx.user.update({
        where: { id: session.user.id },
        data: {
          membershipType: plan.membershipType,
          membershipExpiresAt: expiresAt,
        },
        select: {
          id: true,
          membershipType: true,
          membershipExpiresAt: true,
        },
      });

      return { payment, user };
    });

    await grantMonthlyCredits({
      userId: session.user.id,
      amount: plan.monthlyCredits,
      planId: plan.id,
    });

    return NextResponse.json({
      success: true,
      paymentId: result.payment.id,
      membershipType: result.user.membershipType,
      expiresAt: result.user.membershipExpiresAt?.toISOString(),
      message: "Payment captured successfully",
    });
  } catch (error) {
    console.error("[PayPal] 捕获支付失败:", error);

    return NextResponse.json(
      {
        error: "Failed to capture PayPal payment",
        details: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
