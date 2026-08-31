/**
 * PayPal创建订单API
 * POST /api/payment/create-order
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPayPalOrder } from "@/lib/payment/paypal-config";
import { getPlanById } from "@/constants/pricing-plans";
import { CreateOrderRequest } from "@/types/payment";

export async function POST(request: NextRequest) {
  try {
    // 验证用户登录
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    // 解析请求
    const body: CreateOrderRequest = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "Missing planId parameter" },
        { status: 400 }
      );
    }

    // 获取价格方案
    const plan = getPlanById(planId);
    if (!plan || plan.membershipType === "FREE") {
      return NextResponse.json(
        { error: `Invalid paid plan ID: ${planId}` },
        { status: 400 }
      );
    }

    // 创建PayPal订单
    const order = await createPayPalOrder(plan.amount, plan.currency, plan.id);

    console.log("[PayPal] 订单创建成功:", {
      orderID: order.id,
      status: order.status,
      planId,
      userId: session.user.id,
    });

    // 返回订单ID给前端
    return NextResponse.json({
      orderID: order.id,
      planId: plan.id,
      amount: plan.amount,
      currency: plan.currency,
    });
  } catch (error: any) {
    console.error("[PayPal] 创建订单失败:", error);
    
    return NextResponse.json(
      {
        error: "Failed to create PayPal order",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
