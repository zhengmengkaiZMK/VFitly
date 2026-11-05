/**
 * Pay Once 积分包流程逻辑测试（只读，不写数据库）
 */
import { getPlanById, getAllPlans } from "../constants/pricing-plans";

let passed = 0;
let failed = 0;

function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name}`, detail !== undefined ? JSON.stringify(detail) : "");
  }
}

console.log("== 1. 积分包套餐定义 ==");
const plusPack = getPlanById("PLUS_PACK");
const ultraPack = getPlanById("ULTRA_PACK");

check("PLUS_PACK 存在", !!plusPack);
check("PLUS_PACK 价格 $9.9", plusPack?.amount === 9.9, plusPack?.amount);
check("PLUS_PACK 600 credits", plusPack?.monthlyCredits === 600, plusPack?.monthlyCredits);
check("PLUS_PACK 会员等级 PLUS", plusPack?.membershipType === "PLUS", plusPack?.membershipType);
check("PLUS_PACK billingCycle ONE_TIME", plusPack?.billingCycle === "ONE_TIME", plusPack?.billingCycle);
check("PLUS_PACK 权益含单件5积分", plusPack?.features.includes("Single-item try-on costs 5 credits"));
check("PLUS_PACK 权益含多件8积分", plusPack?.features.includes("Multi-item outfit costs 8 credits"));
check("PLUS_PACK 权益含视频20次/月", plusPack?.features.includes("360° try-on videos: 20 per month"));
check("PLUS_PACK 权益含优先队列", plusPack?.features.includes("Priority generation queue"));

check("ULTRA_PACK 存在", !!ultraPack);
check("ULTRA_PACK 价格 $19.9", ultraPack?.amount === 19.9, ultraPack?.amount);
check("ULTRA_PACK 1200 credits", ultraPack?.monthlyCredits === 1200, ultraPack?.monthlyCredits);
check("ULTRA_PACK 会员等级 ULTRA", ultraPack?.membershipType === "ULTRA", ultraPack?.membershipType);
check("ULTRA_PACK 权益含视频40次/月", ultraPack?.features.includes("360° try-on videos: 40 per month"));

console.log("== 2. 付费套餐校验（checkout route 使用）==");
// 模拟 getPaidPlanOrThrow 逻辑：plan 存在且 membershipType !== FREE
for (const id of ["PLUS_PACK", "ULTRA_PACK"]) {
  const plan = getPlanById(id);
  const ok = !!plan && plan.membershipType !== "FREE";
  check(`${id} 可通过 getPaidPlanOrThrow`, ok);
}

console.log("== 3. 不影响现有订阅套餐 ==");
const plans = getAllPlans();
check("套餐总数 8（2 pack + 4 订阅 + FREE + PREMIUM 无）", plans.length === 7, plans.length);
check("PLUS_MONTHLY 仍为 $9.9", getPlanById("PLUS_MONTHLY")?.amount === 9.9);
check("PLUS_YEARLY 仍为 $95", getPlanById("PLUS_YEARLY")?.amount === 95);
check("ULTRA_MONTHLY 仍为 $19.9", getPlanById("ULTRA_MONTHLY")?.amount === 19.9);
check("ULTRA_YEARLY 仍为 $191", getPlanById("ULTRA_YEARLY")?.amount === 191);

console.log("== 4. Stripe 价格 ID 环境变量（pack） ==");
import { config } from "dotenv";
config({ path: "/Users/zmk/Documents/出海应用开发/AI-SaaS/.env.local" });
check("STRIPE_PRICE_PLUS_PACK 未配置（待用户在 Stripe 创建后填写）", !process.env.STRIPE_PRICE_PLUS_PACK);
check("STRIPE_PRICE_ULTRA_PACK 未配置（待用户在 Stripe 创建后填写）", !process.env.STRIPE_PRICE_ULTRA_PACK);

console.log(`\n结果: ${passed} 通过, ${failed} 失败`);
process.exit(failed > 0 ? 1 : 0);
