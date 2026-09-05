import { UnauthorizedError } from "@/lib/auth/current-user";
import { NextRequest, NextResponse } from "next/server";
import { extractProductGarments } from "@/lib/product-try-on/extractor";
import { requireUserOrGuest } from "@/lib/auth/guest-session";
import { countGuestProductPreviewUsageToday } from "@/lib/auth/guest-resources";
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
    const { user, guest } = await requireUserOrGuest();
    const body = await request.json();
    const productUrl = typeof body?.productUrl === "string" ? body.productUrl : "";

    if (!productUrl) {
      return NextResponse.json({ error: "Please provide a product URL." }, { status: 400 });
    }

    const paidPlan = user ? isPaidPlan(user.membershipType) : false;
    if (user && !paidPlan) {
      const usedToday = await countUsageToday(user.id, "product-preview");
      if (usedToday >= FREE_DAILY_PRODUCT_PREVIEW_LIMIT) {
        return NextResponse.json(
          { error: "Free plan includes 2 product link previews per day. Please upgrade to continue." },
          { status: 403 },
        );
      }
    }

    if (!user && guest) {
      const usedToday = await countGuestProductPreviewUsageToday(guest.guestId);
      if (usedToday >= FREE_DAILY_PRODUCT_PREVIEW_LIMIT) {
        return NextResponse.json(
          {
            error: "Guest mode includes 2 free product link previews per day. Please sign in to continue.",
            requiresLogin: true,
          },
          { status: 403 },
        );
      }
    }

    const garments = await extractProductGarments(productUrl);

    if (user) {
      await prisma.usageRecord.create({
        data: {
          userId: user.id,
          type: "product-preview",
          cost: 0,
          metadata: { productUrl, garmentCount: garments.length, freeDailyUsage: !paidPlan },
        },
      });
    } else if (guest) {
      await prisma.guestUsageRecord.create({
        data: {
          guestId: guest.guestId,
          type: "product-preview",
          cost: 0,
          metadata: { productUrl, garmentCount: garments.length },
        },
      });
    }

    return NextResponse.json({ garments });
  } catch (error) {
    console.error("Product garment extraction failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to extract product garment images." },
      { status: error instanceof UnauthorizedError ? 401 : 400 },
    );
  }
}
