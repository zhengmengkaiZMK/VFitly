import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { ensureMonthlyCredits } from "@/lib/billing/credits";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page") || "1"), 1);
    const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") || "20"), 1), 100);
    const skip = (page - 1) * pageSize;

    const [account, ledgers, total] = await Promise.all([
      ensureMonthlyCredits(user.id, user.membershipType),
      prisma.creditLedger.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.creditLedger.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      account: {
        balance: account.balance,
        monthlyAllowance: account.monthlyAllowance,
        currentCycle: account.currentCycle,
        resetAt: account.resetAt,
      },
      ledgers,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load credits." },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 500 },
    );
  }
}
