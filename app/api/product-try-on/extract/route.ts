import { NextRequest, NextResponse } from "next/server";
import { extractProductGarments } from "@/lib/product-try-on/extractor";
import { requireUser } from "@/lib/auth/current-user";
import {
  FREE_DAILY_PRODUCT_PREVIEW_LIMIT,
  countUsageToday,
  isPaidPlan,
} from "@/lib/billing/credits";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const productUrl = typeof body?.productUrl === "string" ? body.productUrl : "";

    if (!productUrl) {
      return NextResponse.json({ error: "Please provide a product URL." }, { status: 400 });
    }

    const paidPlan = isPaidPlan(user.membershipType);
    if (!paidPlan) {
      const usedToday = await countUsageToday(user.id, "product-preview");
      if (usedToday >= FREE_DAILY_PRODUCT_PREVIEW_LIMIT) {
        return NextResponse.json(
          { error: "Free plan includes 2 product link previews per day. Please upgrade to continue." },
          { status: 403 },
        );
      }
    }

    const garments = await extractProductGarments(productUrl);

    await prisma.usageRecord.create({
      data: {
        userId: user.id,
        type: "product-preview",
        cost: 0,
        metadata: { productUrl, garmentCount: garments.length, freeDailyUsage: !paidPlan },
      },
    });

    return NextResponse.json({ garments });
  } catch (error) {
    console.error("Product garment extraction failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to extract product garment images." },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 400 },
    );
  }
}
