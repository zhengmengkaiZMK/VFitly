import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const message = String(body.message || "").trim();

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email address and feedback are required." },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Please enter at least 10 characters." },
        { status: 400 }
      );
    }

    if (message.length > 3000) {
      return NextResponse.json(
        { error: "Feedback must be 3000 characters or less." },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    await prisma.feedback.create({
      data: {
        email,
        message,
        userId: session?.user?.id || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Thanks for your feedback. We'll review it and reply by email if needed.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again later." },
      { status: 500 }
    );
  }
}
