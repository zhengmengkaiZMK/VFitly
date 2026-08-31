import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/current-user";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.wardrobeItem.findFirst({
      where: { id, userId: user.id, isDeleted: false },
    });

    if (!existing) {
      return NextResponse.json({ error: "Garment not found." }, { status: 404 });
    }

    const item = await prisma.wardrobeItem.update({
      where: { id },
      data: {
        name: typeof body.name === "string" ? body.name : existing.name,
        category: typeof body.category === "string" ? body.category : existing.category,
        color: body.color || null,
        secondaryColor: body.secondaryColor || null,
        tags: Array.isArray(body.tags) ? body.tags : existing.tags,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update garment." },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 400 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const item = await prisma.wardrobeItem.findFirst({ where: { id, userId: user.id, isDeleted: false } });
    if (!item) {
      return NextResponse.json({ error: "Garment not found." }, { status: 404 });
    }

    await prisma.wardrobeItem.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete garment." },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 400 },
    );
  }
}
