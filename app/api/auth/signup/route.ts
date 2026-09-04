import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import {
  clearGuestSessionCookie,
  getExistingGuestIdFromCookie,
  promoteGuestResourcesToUser,
} from "@/lib/auth/guest-resources";

const signupSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export async function POST(request: NextRequest) {
  try {
    console.log("📝 收到注册请求");
    const body = await request.json();
    console.log("📦 请求数据:", { name: body.name, email: body.email });

    // 验证输入
    const validatedData = signupSchema.parse(body);
    console.log("✅ 数据验证通过");

    // 检查邮箱是否已存在
    console.log("🔍 检查邮箱是否已存在...");
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    });

    if (existingUser) {
      console.log("⚠️ 邮箱已存在");
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 400 }
      );
    }

    // 加密密码
    console.log("🔐 加密密码中...");
    const passwordHash = await bcrypt.hash(validatedData.password, 10);
    console.log("✅ 密码加密完成");

    // 创建用户
    console.log("👤 创建用户记录...");
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        membershipType: "FREE",
        isActive: true,
      },
    });
    console.log("✅ 用户创建成功:", user.id);

    // 创建用户的配额记录
    console.log("📊 创建配额记录...");
    await prisma.userQuota.create({
      data: {
        userId: user.id,
        searchesUsed: 0,
        messagesUsed: 0,
        searchesLimit: 3,
        messagesLimit: 10,
      },
    });
    console.log("✅ 配额记录创建成功");

    const guestId = await getExistingGuestIdFromCookie();
    if (guestId) {
      await promoteGuestResourcesToUser(guestId, user.id);
      await clearGuestSessionCookie();
    }

    console.log("🎉 注册流程完成");
    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          membershipType: user.membershipType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ 验证错误:", error.errors);
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("❌ 注册错误:", error);
    console.error("错误详情:", error instanceof Error ? error.message : String(error));
    console.error("错误堆栈:", error instanceof Error ? error.stack : "无堆栈信息");
    
    return NextResponse.json(
      { 
        error: "Registration failed, please try again later",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}
