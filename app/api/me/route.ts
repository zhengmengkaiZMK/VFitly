import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { ensureMonthlyCredits, countUsageThisMonth, monthlyWalkVideoLimitForPlan } from "@/lib/billing/credits";
import { getPlanById } from "@/constants/pricing-plans";

export async function GET() {
  try {
    const user = await requireUser();
    const [creditAccount, walkVideoUsedThisMonth] = await Promise.all([
      ensureMonthlyCredits(user.id, user.membershipType),
      countUsageThisMonth(user.id, "walk-video"),
    ]);
    const walkVideoMonthlyLimit = monthlyWalkVideoLimitForPlan(user.membershipType);
    const latestSubscriptionPayment = await prisma.payment.findFirst({
      where: {
        userId: user.id,
        provider: "STRIPE",
        status: "COMPLETED",
        stripeSubscriptionId: user.stripeSubscriptionId || undefined,
      },
      orderBy: { completedAt: "desc" },
      select: { planId: true, billingCycle: true },
    });
    const plan = getPlanById(
      user.membershipType === "FREE"
        ? "FREE"
        : latestSubscriptionPayment?.planId || `${user.membershipType}_${latestSubscriptionPayment?.billingCycle || "MONTHLY"}`,
    ) || getPlanById("FREE");

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        membershipType: user.membershipType,
        createdAt: user.createdAt.toISOString(),
        subscriptionStatus: user.subscriptionStatus,
        currentPeriodStart: user.currentPeriodStart?.toISOString() || null,
        currentPeriodEnd: user.currentPeriodEnd?.toISOString() || null,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        defaultModelImageUrl: user.defaultModelImageUrl,
        onboardingCompleted: user.onboardingCompleted,
        imageStorageUsedBytes: user.imageStorageUsedBytes.toString(),
      },
      credits: {
        balance: creditAccount.balance,
        monthlyAllowance: creditAccount.monthlyAllowance,
        currentCycle: creditAccount.currentCycle,
        resetAt: creditAccount.resetAt.toISOString(),
      },
      walkVideoQuota: {
        total: walkVideoMonthlyLimit,
        used: walkVideoUsedThisMonth,
        remaining: Math.max(walkVideoMonthlyLimit - walkVideoUsedThisMonth, 0),
      },
      plan: plan
        ? {
            id: plan.id,
            name: plan.name,
            nameZh: plan.nameZh,
            tier: plan.tier,
            billingCycle: plan.billingCycle,
            amount: plan.amount,
            currency: plan.currency,
            monthlyCredits: plan.monthlyCredits,
            features: plan.features,
            featuresZh: plan.featuresZh,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 500 },
    );
  }
}
