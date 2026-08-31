import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page") || "1"), 1);
    const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") || "20"), 1), 100);
    const status = searchParams.get("status") || undefined;
    const jobType = searchParams.get("jobType") || undefined;
    const skip = (page - 1) * pageSize;

    const where = {
      userId: user.id,
      ...(status ? { status: status as never } : {}),
      ...(jobType ? { jobType } : {}),
    };

    const [jobs, total] = await Promise.all([
      prisma.tryOnJob.findMany({
        where,
        include: { wardrobeItem: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.tryOnJob.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load try-on jobs." },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 500 },
    );
  }
}
