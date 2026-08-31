import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db/prisma";
import { saveUpload } from "@/lib/wardrobe/storage";

function toUserResponse(user: {
  id: string;
  name: string | null;
  email: string;
  membershipType: string;
  defaultModelImageUrl: string | null;
  defaultModelAssetKey: string | null;
  onboardingCompleted: boolean;
  imageStorageUsedBytes: bigint;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    membershipType: user.membershipType,
    defaultModelImageUrl: user.defaultModelImageUrl,
    defaultModelAssetKey: user.defaultModelAssetKey,
    onboardingCompleted: user.onboardingCompleted,
    imageStorageUsedBytes: user.imageStorageUsedBytes.toString(),
  };
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser();
    const formData = await request.formData();
    const modelImage = formData.get("modelImage") || formData.get("profilePhoto") || formData.get("image");
    const skip = String(formData.get("skip") || "") === "true";

    if (modelImage instanceof File) {
      const saved = await saveUpload(modelImage, `users/${user.id}/model`);
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          defaultModelImageUrl: saved.url,
          defaultModelAssetKey: saved.key,
          onboardingCompleted: true,
          imageStorageUsedBytes: { increment: BigInt(saved.size) },
        },
      });

      return NextResponse.json({ user: toUserResponse(updated) });
    }

    if (skip) {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { onboardingCompleted: true },
      });
      return NextResponse.json({ user: toUserResponse(updated) });
    }

    return NextResponse.json({ error: "Please upload a full-body photo or skip onboarding." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update profile photo." },
      { status: error instanceof Error && error.name === "UnauthorizedError" ? 401 : 400 },
    );
  }
}

export const POST = PATCH;
