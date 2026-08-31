/**
 * 支付相关类型定义
 */

export type BillingCycle = "MONTHLY" | "YEARLY";
export type PlanTier = "FREE" | "PLUS" | "ULTRA";
export type PaidMembershipType = "PLUS" | "ULTRA";
export type MembershipType = "FREE" | "PREMIUM" | PaidMembershipType;

// 价格方案配置
export interface PricingPlan {
  id: string;
  tier: PlanTier;
  name: string;
  nameZh: string;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  membershipType: MembershipType;
  durationDays: number;
  monthlyCredits: number;
  features: string[];
  featuresZh: string[];
}

// 创建订单请求
export interface CreateOrderRequest {
  planId: string;
}

// 创建订单响应
export interface CreateOrderResponse {
  orderID: string;
  planId: string;
  amount: number;
  currency: string;
}

// 捕获支付请求
export interface CaptureOrderRequest {
  orderID: string;
}

// 捕获支付响应
export interface CaptureOrderResponse {
  success: boolean;
  paymentId: string;
  membershipType: string;
  expiresAt: string;
  message?: string;
}

// 支付状态查询响应
export interface PaymentStatusResponse {
  id: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED";
  amount: number;
  currency: string;
  planId: string;
  createdAt: string;
  completedAt?: string;
}

// PayPal订单详情
export interface PayPalOrderDetails {
  id: string;
  status: string;
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
    custom_id?: string;
    payments?: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
}
