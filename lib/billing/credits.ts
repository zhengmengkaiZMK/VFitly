import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

type PlanType = "FREE" | "PREMIUM" | "PLUS" | "ULTRA";

export const TRY_ON_SINGLE_COST = 5;
export const TRY_ON_MULTI_COST = 8;
export const FREE_DAILY_TRY_ON_LIMIT = 2;
export const FREE_DAILY_PRODUCT_PREVIEW_LIMIT = 2;
export const FREE_WARDROBE_LIMIT = 3;
export const FREE_WALK_VIDEO_LIMIT = 1;
export const PLUS_MONTHLY_WALK_VIDEO_LIMIT = 20;
export const ULTRA_MONTHLY_WALK_VIDEO_LIMIT = 40;

export function monthlyWalkVideoLimitForPlan(plan: string | null | undefined) {
  const normalized = normalizePlanType(plan);
  if (normalized === "ULTRA") return ULTRA_MONTHLY_WALK_VIDEO_LIMIT;
  if (normalized === "PLUS" || normalized === "PREMIUM") return PLUS_MONTHLY_WALK_VIDEO_LIMIT;
  return FREE_WALK_VIDEO_LIMIT;
}

export function normalizePlanType(plan: string | null | undefined): PlanType {
  if (plan === "PLUS" || plan === "ULTRA" || plan === "PREMIUM") return plan;
  return "FREE";
}

export function isPaidPlan(plan: string | null | undefined) {
  const normalized = normalizePlanType(plan);
  return normalized === "PLUS" || normalized === "ULTRA" || normalized === "PREMIUM";
}

export function monthlyCreditsForPlan(plan: string | null | undefined) {
  const normalized = normalizePlanType(plan);
  if (normalized === "ULTRA") return 1200;
  if (normalized === "PLUS" || normalized === "PREMIUM") return 600;
  return 0;
}

export function currentMonthlyCycle() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function startOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function ensureMonthlyCredits(userId: string, plan: string | null | undefined) {
  const credits = monthlyCreditsForPlan(plan);
  const cycle = currentMonthlyCycle();

  let account = await prisma.creditAccount.findUnique({ where: { userId } });

  if (!account) {
    account = await prisma.creditAccount.create({
      data: {
        userId,
        balance: credits,
        monthlyAllowance: credits,
        currentCycle: cycle,
      },
    });

    if (credits > 0) {
      await prisma.creditLedger.create({
        data: {
          userId,
          accountId: account.id,
          type: "MONTHLY_GRANT",
          amount: credits,
          balanceAfter: credits,
          reason: "Initial monthly credits",
        },
      });
    }

    return account;
  }

  if (account.currentCycle !== cycle || account.monthlyAllowance !== credits) {
    account = await prisma.creditAccount.update({
      where: { userId },
      data: {
        balance: credits,
        monthlyAllowance: credits,
        currentCycle: cycle,
        resetAt: new Date(),
      },
    });

    await prisma.creditLedger.create({
      data: {
        userId,
        accountId: account.id,
        type: "MONTHLY_RESET",
        amount: credits,
        balanceAfter: credits,
        reason: "Monthly credits reset",
      },
    });
  }

  return account;
}

export async function grantMonthlyCredits({
  userId,
  amount,
  planId,
}: {
  userId: string;
  amount: number;
  planId: string;
}) {
  const cycle = currentMonthlyCycle();
  const account = await prisma.creditAccount.upsert({
    where: { userId },
    update: {
      balance: amount,
      monthlyAllowance: amount,
      currentCycle: cycle,
      resetAt: new Date(),
    },
    create: {
      userId,
      balance: amount,
      monthlyAllowance: amount,
      currentCycle: cycle,
    },
  });

  await prisma.creditLedger.create({
    data: {
      userId,
      accountId: account.id,
      type: "MONTHLY_GRANT",
      amount,
      balanceAfter: account.balance,
      reason: "Subscription monthly credits granted",
      metadata: { planId, cycle },
    },
  });

  return account;
}

export async function ensureSufficientCredits(
  userId: string,
  plan: string | null | undefined,
  amount: number,
) {
  if (!isPaidPlan(plan)) return null;

  const account = await ensureMonthlyCredits(userId, plan);
  if (account.balance < amount) {
    throw new Error("Insufficient credits. Please upgrade your plan or wait for next monthly reset.");
  }

  return account;
}

export async function spendCredits(
  userId: string,
  plan: string | null | undefined,
  amount: number,
  reason: string,
  metadata: Prisma.InputJsonValue = {}
) {
  if (!isPaidPlan(plan)) return null;

  const account = await ensureMonthlyCredits(userId, plan);

  if (account.balance < amount) {
    throw new Error("Insufficient credits. Please upgrade your plan or wait for next monthly reset.");
  }

  const updated = await prisma.creditAccount.update({
    where: { userId },
    data: { balance: { decrement: amount } },
  });

  await prisma.creditLedger.create({
    data: {
      userId,
      accountId: account.id,
      type: "SPEND",
      amount: -amount,
      balanceAfter: updated.balance,
      reason,
      metadata,
    },
  });

  return updated;
}

export async function countUsageToday(userId: string, type: string) {
  return prisma.usageRecord.count({
    where: {
      userId,
      type,
      createdAt: { gte: startOfToday() },
    },
  });
}

export async function countUsageTotal(userId: string, type: string) {
  return prisma.usageRecord.count({
    where: {
      userId,
      type,
    },
  });
}

export async function countUsageThisMonth(userId: string, type: string) {
  return prisma.usageRecord.count({
    where: {
      userId,
      type,
      createdAt: { gte: startOfCurrentMonth() },
    },
  });
}
