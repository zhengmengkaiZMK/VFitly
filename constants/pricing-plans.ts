/**
 * 价格方案配置
 * 统一管理所有支付方案
 */

import { PricingPlan } from "@/types/payment";

export const PRICING_PLANS: Record<string, PricingPlan> = {
  FREE: {
    id: "FREE",
    tier: "FREE",
    name: "Free",
    nameZh: "免费版",
    billingCycle: "MONTHLY",
    amount: 0,
    currency: "USD",
    membershipType: "FREE",
    durationDays: 9999,
    monthlyCredits: 0,
    features: [
      "2 try-on generations per day",
      "2 product link previews per day",
      "Wardrobe capacity: 3 items",
      "Railway Volume image storage",
    ],
    featuresZh: [
      "每日 2 次 AI 试衣生成",
      "每日 2 次商品链接解析预览",
      "衣橱容量 3 件",
      "Railway Volume 图片资产存储",
    ],
  },
  PLUS_MONTHLY: {
    id: "PLUS_MONTHLY",
    tier: "PLUS",
    name: "Plus Monthly",
    nameZh: "Plus 月付",
    billingCycle: "MONTHLY",
    amount: 29,
    currency: "USD",
    membershipType: "PLUS",
    durationDays: 30,
    monthlyCredits: 500,
    features: [
      "500 credits per month",
      "Credits reset monthly",
      "Single-item try-on costs 5 credits",
      "Multi-item outfit costs 8 credits",
      "Unlimited wardrobe capacity",
      "360° try-on videos: 10 per month",
      "Priority generation queue",
    ],
    featuresZh: [
      "每月 500 积分",
      "积分每月重置",
      "单件试衣 5 积分 / 次",
      "多件搭配 8 积分 / 次",
      "衣橱容量不限",
      "生成360度试衣视频：10次",
      "优先生成队列",
    ],
  },
  PLUS_YEARLY: {
    id: "PLUS_YEARLY",
    tier: "PLUS",
    name: "Plus Yearly",
    nameZh: "Plus 年付",
    billingCycle: "YEARLY",
    amount: 278.4,
    currency: "USD",
    membershipType: "PLUS",
    durationDays: 365,
    monthlyCredits: 500,
    features: [
      "500 credits granted monthly",
      "20% yearly discount",
      "Credits reset monthly",
      "Single-item try-on costs 5 credits",
      "Multi-item outfit costs 8 credits",
      "Unlimited wardrobe capacity",
      "360° try-on videos: 10 per month",
    ],
    featuresZh: [
      "每月发放 500 积分",
      "年付 8 折优惠",
      "积分每月重置",
      "单件试衣 5 积分 / 次",
      "多件搭配 8 积分 / 次",
      "衣橱容量不限",
      "生成360度试衣视频：10次",
    ],
  },
  ULTRA_MONTHLY: {
    id: "ULTRA_MONTHLY",
    tier: "ULTRA",
    name: "Ultra Monthly",
    nameZh: "Ultra 月付",
    billingCycle: "MONTHLY",
    amount: 49,
    currency: "USD",
    membershipType: "ULTRA",
    durationDays: 30,
    monthlyCredits: 1000,
    features: [
      "1000 credits per month",
      "Credits reset monthly",
      "Single-item try-on costs 5 credits",
      "Multi-item outfit costs 8 credits",
      "Unlimited wardrobe capacity",
      "360° try-on videos: 20 per month",
      "Priority generation queue",
    ],
    featuresZh: [
      "每月 1000 积分",
      "积分每月重置",
      "单件试衣 5 积分 / 次",
      "多件搭配 8 积分 / 次",
      "衣橱容量不限",
      "生成360度试衣视频：20次",
      "优先生成队列",
    ],
  },
  ULTRA_YEARLY: {
    id: "ULTRA_YEARLY",
    tier: "ULTRA",
    name: "Ultra Yearly",
    nameZh: "Ultra 年付",
    billingCycle: "YEARLY",
    amount: 470.4,
    currency: "USD",
    membershipType: "ULTRA",
    durationDays: 365,
    monthlyCredits: 1000,
    features: [
      "1000 credits granted monthly",
      "20% yearly discount",
      "Credits reset monthly",
      "Single-item try-on costs 5 credits",
      "Multi-item outfit costs 8 credits",
      "Unlimited wardrobe capacity",
      "360° try-on videos: 20 per month",
      "Priority generation queue",
    ],
    featuresZh: [
      "每月发放 1000 积分",
      "年付 8 折优惠",
      "积分每月重置",
      "单件试衣 5 积分 / 次",
      "多件搭配 8 积分 / 次",
      "衣橱容量不限",
      "生成360度试衣视频：20次",
      "优先生成队列",
    ],
  },
};

export function getPricingPlan(
  tier: string,
  billingCycle: "MONTHLY" | "YEARLY"
): PricingPlan | undefined {
  if (tier.toUpperCase() === "FREE") return PRICING_PLANS.FREE;
  return PRICING_PLANS[`${tier.toUpperCase()}_${billingCycle}`];
}

export function getAllPlans(): PricingPlan[] {
  return Object.values(PRICING_PLANS);
}

export function getPlanById(planId: string): PricingPlan | undefined {
  return PRICING_PLANS[planId];
}
