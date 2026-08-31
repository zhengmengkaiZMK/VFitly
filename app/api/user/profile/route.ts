import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/current-user";
import { saveUpload } from "@/lib/wardrobe/storage";

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        membershipType: user.membershipType,
        defaultModelImageUrl: user.defaultModelImageUrl,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser();
    const formData = await request.formData();
    const modelImage = formData.get("modelImage");
    const skip = String(formData.get("skip") || "") === "true";

    if (modelImage instanceof File) {
      const saved = await saveUpload(modelImage, `users/${user.id}/model`);
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          defaultModelImageUrl: saved.url,
          defaultModelAssetKey: saved.key,
          onboardingCompleted: true,
        },
      });
      return NextResponse.json({ user: updated });
    }

    if (skip) {
      const updated = await prisma.user.update({ where: { id: user.id }, data: { onboardingCompleted: true } });
      return NextResponse.json({ user: updated });
    }

    return NextResponse.json({ error: "Please upload a full-body photo or skip onboarding." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update profile." },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 400 },
    );
  }
}
