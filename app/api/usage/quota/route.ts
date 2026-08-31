import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import {
  FREE_DAILY_PRODUCT_PREVIEW_LIMIT,
  FREE_DAILY_TRY_ON_LIMIT,
  FREE_WARDROBE_LIMIT,
  countUsageToday,
  countUsageThisMonth,
  ensureMonthlyCredits,
  isPaidPlan,
  monthlyWalkVideoLimitForPlan,
} from "@/lib/billing/credits";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const paidPlan = isPaidPlan(user.membershipType);
    const [tryOnUsedToday, productPreviewUsedToday, wardrobeCount, account, walkVideoUsedThisMonth] = await Promise.all([
      countUsageToday(user.id, "try-on"),
      countUsageToday(user.id, "product-preview"),
      prisma.wardrobeItem.count({ where: { userId: user.id, isDeleted: false } }),
      ensureMonthlyCredits(user.id, user.membershipType),
      countUsageThisMonth(user.id, "walk-video"),
    ]);

    return NextResponse.json({
      plan: user.membershipType,
      paidPlan,
      tryOn: {
        usedToday: tryOnUsedToday,
        dailyLimit: paidPlan ? null : FREE_DAILY_TRY_ON_LIMIT,
        remainingToday: paidPlan ? null : Math.max(FREE_DAILY_TRY_ON_LIMIT - tryOnUsedToday, 0),
      },
      productPreview: {
        usedToday: productPreviewUsedToday,
        dailyLimit: paidPlan ? null : FREE_DAILY_PRODUCT_PREVIEW_LIMIT,
        remainingToday: paidPlan ? null : Math.max(FREE_DAILY_PRODUCT_PREVIEW_LIMIT - productPreviewUsedToday, 0),
      },
      wardrobe: {
        used: wardrobeCount,
        limit: paidPlan ? null : FREE_WARDROBE_LIMIT,
        remaining: paidPlan ? null : Math.max(FREE_WARDROBE_LIMIT - wardrobeCount, 0),
      },
      walkVideo: {
        usedThisMonth: walkVideoUsedThisMonth,
        monthlyLimit: monthlyWalkVideoLimitForPlan(user.membershipType),
        remainingThisMonth: Math.max(monthlyWalkVideoLimitForPlan(user.membershipType) - walkVideoUsedThisMonth, 0),
      },
      credits: {
        balance: account.balance,
        monthlyAllowance: account.monthlyAllowance,
        currentCycle: account.currentCycle,
        resetAt: account.resetAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load usage quota." },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 500 },
    );
  }
}
