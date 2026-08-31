# AI 试衣商业化模块：任务 2-5 详细设计规划

> 当前文档用于方案讨论与确认。确认后再进入代码开发。
>
> 已根据新增需求更新：Railway MVP 图片存储方案、Supabase 数据库候选、Free / Plus / Ultra 三档套餐、注册后上传个人全身照、服装库多件搭配生成。

## 0. 背景与目标

当前项目已经具备 AI 试衣相关基础能力：

- `prisma/schema.prisma` 中已有 `User`、`Payment`、`WardrobeItem`、`TryOnJob`、`UsageRecord` 等模型雏形。
- `lib/auth.ts` 已接入 `next-auth` + Credentials 登录。
- 当前支付已有 PayPal 基础接口，但商业化主线建议优先补齐 Stripe。
- 衣橱上传接口 `app/api/wardrobe/route.ts` 已存在，但开发环境存在 `local-tryon-demo-user` 兜底，生产权限与数据隔离需要进一步收紧。
- 商品试穿生成接口 `app/api/product-try-on/generate/route.ts` 当前会把用户图、商品图、生成图保存到 `public/uploads`，适合本地验证，但生产部署到 Railway 后要考虑持久化存储。

本阶段目标是把 AI 试衣产品从“本地 Demo 能跑”推进到“可登录、可付费、可保存资产、可追踪生成记录、可上线 MVP 验证”的状态。MVP 阶段优先快速可实现，不强行上复杂对象存储。

---

## 1. 总体产品路径

用户完整链路建议如下：

1. 访客进入首页，查看 AI 试衣能力与三档价格方案。
2. 用户注册 / 登录。
3. 注册完成后进入 Onboarding 第二步，提醒上传一张个人全身照，作为默认换装模特图。
4. Free 用户每天获得 1 次免费生成合成图片机会。
5. 用户购买 Plus 或 Ultra 后获得每月积分和高级功能。
6. Plus 用户可使用商品链接解析、商品图生成合成图片、保存服装到个人服装库。
7. Ultra 用户拥有 Plus 全部能力，并可看到 360 度模特走秀视频效果功能，但 MVP 阶段先标记为 `Coming soon`，暂不接入真实生成。
8. 用户可以上传衣服、裤子、鞋子等到私有服装库。
9. 用户可以选择服装库中的多件单品进行组合搭配，生成整体穿搭效果。
10. 每次 AI 生成都落库为历史记录，可查看输入图、服装组合、结果图、状态、错误原因与消耗积分。
11. 图片资产 MVP 阶段优先使用 Railway 可快速落地的持久化方案，后续再迁移到 Supabase Storage / S3 / R2。

---

## 2. 推荐开发顺序与依赖关系

| 顺序 | 模块 | 为什么先做 | 依赖 |
|---|---|---|---|
| 1 | 用户体系 + Onboarding | 后续所有私有数据、支付、额度、默认模特图都依赖用户身份 | `next-auth`、`User`、`Session` |
| 2 | Stripe 支付 + 套餐权益 | 明确商业化入口，支付成功后开通 Plus / Ultra 和积分 | 用户体系、`Payment`、积分账户 |
| 3 | 用户私有服装库 | 让用户资产可沉淀，支持多品类服装和组合搭配 | 用户体系、图片存储 |
| 4 | 商品图一键加入服装库 | 把商品链接试穿和衣橱打通，提高转化和复用 | 商品图解析、衣橱、Plus 权益 |
| 5 | 生成记录、积分消耗、图片存储 | 支撑正式上线、用户历史、成本控制、Railway 部署 | 用户、衣橱、支付、AI 生成 |
| 6 | 多服装组合搭配生成 | 支持衣服 + 裤子 + 鞋子等组合，提高核心产品价值 | 衣橱、生成记录、AI 提示词 |
| 7 | Ultra 360 度走秀视频 | 高阶付费功能，适合放在 Ultra 套餐中拉高客单价 | Ultra 权益、视频生成模型 |

> MVP 建议：先完成 1-5，再做“多服装组合搭配生成”的基础版；360 度走秀视频可以先在价格页展示为 Ultra 权益，后续接视频生成能力。

---

# 任务 2：用户体系 + 注册后上传个人全身照

## 2.1 目标

让 AI 试衣功能从匿名 Demo 模式升级为以用户为中心的产品体系：

- 用户可注册、登录、退出。
- 所有衣橱、生成记录、支付记录、积分记录都绑定真实 `userId`。
- 生产环境禁止使用 `local-tryon-demo-user`。
- 登录状态能在前端导航栏、Dashboard、试衣页中稳定展示。
- 未登录用户访问私有页面时，引导登录。
- 用户注册完成后，引导上传一张个人全身照，作为默认模特图。

## 2.2 当前基础

已有基础：

- `lib/auth.ts` 使用 `next-auth` Credentials Provider。
- `User` 模型已有 `email`、`passwordHash`、`membershipType`、`membershipExpiresAt`、`provider`、`providerId`、`isActive` 等字段。
- `Session` 模型已存在。
- `app/api/auth/signup/route.ts` 已存在注册接口。

需要补齐：

- 登录 / 注册页面体验检查。
- 私有路由保护。
- API 权限统一工具函数。
- 注册后 Onboarding 页面。
- 默认个人全身照上传与保存。
- 用户积分账户初始化。
- 登录后跳转逻辑。
- 生产环境移除 Demo user fallback。

## 2.3 页面与交互设计

### 2.3.1 注册页

路径建议：`/signup`

字段：

- 邮箱
- 密码
- 确认密码，可选
- 用户名，可选

交互：

- 注册成功后自动登录。
- 注册成功后优先跳转 `/onboarding/profile-photo`。
- 邮箱重复时提示：`This email is already registered.`
- 密码长度至少 8 位。
- 可预留 Google 登录按钮，但第一期可以只做邮箱密码。

### 2.3.2 登录页

路径建议：`/login`

字段：

- 邮箱
- 密码

交互：

- 登录成功后回到 `callbackUrl`，默认 `/dashboard`。
- 如果用户没有上传默认全身照，可在 Dashboard 顶部提示补充上传。
- 登录失败展示明确错误。
- 已登录用户访问 `/login` 自动跳转 `/dashboard`。

### 2.3.3 注册后上传个人全身照

路径建议：`/onboarding/profile-photo`

目的：

- 让用户上传一张清晰的个人全身照片，后续换装时作为默认人物图。
- 降低每次生成都要重新上传人物图的摩擦。

页面内容：

- 标题：`Upload your full-body photo`
- 说明：`Use a clear front-facing full-body photo for better try-on results.`
- 上传区域：拖拽上传 / 点击上传。
- 示例图提示：正面、全身、光线清晰、背景简单。
- 按钮：`Save and continue`。
- 次要按钮：`Skip for now`。

交互规则：

- 支持 JPG / PNG / WebP。
- 单图最大建议 12MB。
- 上传成功后保存到用户资料。
- 跳转 `/dashboard`。
- 如果跳过，Dashboard 顶部保留提醒卡片。
- 如果用户在使用合成穿衣效果时还没有默认个人全身照，则必须在生成前提示上传；上传成功后保存为默认个人全身照，并继续当前生成流程。

### 2.3.4 用户菜单和 Dashboard

导航栏登录态：

- 未登录：显示 `Sign in`、`Get started`。
- 已登录：显示头像 / 邮箱 / 当前套餐 / 退出。

Dashboard 用户信息：

- 邮箱
- 当前套餐：Free / Plus / Ultra
- 订阅状态：Active / Past due / Canceled
- 当前周期剩余积分
- 默认个人全身照状态
- 最近生成记录

## 2.4 后端设计

### 2.4.1 统一获取当前用户

建议新增：`lib/auth/current-user.ts`

职责：

- `getCurrentUser()`：服务端获取完整用户信息。
- `requireUser()`：未登录直接抛出业务错误或返回统一 `401`。
- `getCurrentUserId()`：只获取用户 ID。

建议所有私有 API 都改为调用该工具，避免每个接口重复写 `getServerSession(authOptions)`。

### 2.4.2 API 保护范围

必须登录：

- `GET /api/me`
- `POST /api/me/profile-photo`
- `GET /api/wardrobe`
- `POST /api/wardrobe`
- `PATCH /api/wardrobe/:id`
- `DELETE /api/wardrobe/:id`
- `POST /api/product-try-on/generate`
- `POST /api/product-try-on/add-to-wardrobe`
- `POST /api/try-on/combine-outfit`
- `GET /api/try-on/jobs`
- `GET /api/usage/quota`
- 所有支付创建接口

可以匿名：

- 首页
- 价格页
- 商品链接解析接口：MVP 建议允许匿名解析，但真正生成和保存必须登录且需 Plus 及以上。

## 2.5 数据库设计

当前 `User` 可继续复用。

建议新增或调整字段：

```prisma
model User {
  // 已有字段保留
  planType              PlanType @default(FREE) @map("plan_type")
  stripeCustomerId      String?  @unique @map("stripe_customer_id") @db.VarChar(255)
  defaultModelImageUrl  String?  @map("default_model_image_url") @db.Text
  defaultModelAssetKey  String?  @map("default_model_asset_key") @db.Text
  onboardingCompleted   Boolean  @default(false) @map("onboarding_completed")
  imageStorageUsedBytes BigInt   @default(0) @map("image_storage_used_bytes")
}

enum PlanType {
  FREE
  PLUS
  ULTRA
}
```

说明：

- 如果现有 `membershipType` 已够用，可以先不新增 `planType`，直接把值扩展为 `FREE / PLUS / ULTRA`。
- `defaultModelImageUrl` 用于保存用户默认全身照。
- `defaultModelAssetKey` 用于未来删除或迁移图片。

## 2.6 积分与免费额度策略

本产品建议从“次数额度”升级为“积分体系”，更适合后续加入视频生成等高成本功能。

### 套餐积分

| 套餐 | 月付价格 | 年付价格 | 积分 | 说明 |
|---|---:|---:|---:|---|
| Free | $0 | $0 | 每天 1 次免费图片生成 | 注册后默认获得 |
| Plus | $29 / 月 | $278.40 / 年 | 500 积分 / 月 | 年付 8 折 |
| Ultra | $49 / 月 | $470.40 / 年 | 1000 积分 / 月 | 年付 8 折 |

### 积分消耗建议

| 功能 | Free | Plus | Ultra | 建议消耗 |
|---|---|---|---|---:|
| 上传人物全身照 | 支持 | 支持 | 支持 | 0 |
| 单件服装图片合成 | 每天 1 次 | 支持 | 支持 | 1 积分 |
| 商品链接解析预览 | 每天 1 次 | 支持 | 支持 | 0 |
| 商品链接解析生成 | 不支持 | 支持 | 支持 | 1 积分 |
| 商品图保存到服装库 | 不支持 | 支持 | 支持 | 0 |
| 多件服装组合搭配合成 | 不支持 | 支持 | 支持 | 2 积分 |
| 360 度模特走秀视频 | 不支持 | 不支持 | Coming soon | 暂不开放 |

MVP 确认规则：

- Free：每天 1 次图片生成，不使用积分账户也可以；但为了代码统一，建议仍写入 `CreditLedger` 或 `UsageRecord`。
- Free 衣橱容量：最多 3 件。
- Plus：每月发放 500 积分，积分每月重置，未使用积分不累计到下个周期。
- Ultra：每月发放 1000 积分，积分每月重置，未使用积分不累计到下个周期。
- 年付用户仍按月发放积分：Plus 每月 500，Ultra 每月 1000，不一次性发放全年积分。
- 图片生成基础消耗 1 积分。
- 多件搭配消耗 2 积分。
- 360 度模特走秀视频：MVP 阶段在价格页展示为 `Coming soon`，暂不开放真实生成。

## 2.7 验收标准

- 用户可以注册、登录、退出。
- 注册后进入上传全身照页面。
- 用户可保存默认个人全身照。
- 未登录调用私有 API 返回 `401`。
- 登录用户只能访问自己的衣橱和生成记录。
- 生产环境不存在 `local-tryon-demo-user` 兜底写入。
- Session 中能拿到 `user.id`、`planType` 和订阅状态。

---

# 任务 3：Stripe 支付 + 三档 SaaS 套餐体系

## 3.1 目标

接入 Stripe Checkout / Subscription，让用户可以购买 Plus 或 Ultra 套餐，支付成功后自动开通权益并发放订阅周期积分。

## 3.2 套餐设计

### 3.2.1 Free

价格：

- $0

权益：

- 每天 1 次免费 AI 图片合成。
- 每天 1 次商品链接解析预览。
- 可上传默认个人全身照。
- 可上传少量衣橱图片，上限 3 件，用于体验。
- 可查看最近生成记录，建议保留 7 天或最近 10 条。

限制：

- 不支持商品链接解析生成。
- 不支持商品图保存到服装库。
- 不支持多件服装组合搭配，或只允许体验 1 次。
- 不支持 360 度视频。

### 3.2.2 Plus

价格：

- $29 / 月
- $278.40 / 年，年付 8 折

权益：

- 500 积分 / 月。
- 包含 Free 全部能力。
- 支持商品链接解析。
- 支持商品图生成合成图片。
- 支持把图片添加到自己的服装库。
- 支持多件服装组合搭配合成图片。
- 衣橱容量建议 500 件。
- 历史记录长期保存或至少 1 年。

### 3.2.3 Ultra

价格：

- $49 / 月
- $470.40 / 年，年付 8 折

权益：

- 1000 积分 / 月。
- 包含 Plus 全部能力。
- 360 度模特走秀视频效果：MVP 阶段标记为 `Coming soon`，暂不开放真实生成。
- 更高并发或优先队列，可作为后续增强。
- 衣橱容量建议 1000 件。
- 历史记录长期保存。

## 3.3 价格页设计

路径建议：`/pricing`

页面结构：

1. 标题：`Choose your AI try-on plan`
2. 月付 / 年付切换器。
3. 三列价格卡片：Free、Plus、Ultra。
4. 年付时显示 `Save 20%`。
5. Plus 标记为 `Most Popular`。
6. Ultra 标记为 `Best for creators`。
7. 每张卡片显示：价格、积分、核心权益、CTA。

CTA：

- Free：`Get started free`
- Plus：`Upgrade to Plus`
- Ultra：`Upgrade to Ultra`

价格展示：

| 套餐 | 月付展示 | 年付展示 |
|---|---|---|
| Free | `$0` | `$0` |
| Plus | `$29/mo` | `$278.40/year`，折合 `$23.20/mo` |
| Ultra | `$49/mo` | `$470.40/year`，折合 `$39.20/mo` |

## 3.4 Stripe 产品与 Price ID

Stripe 后台建议创建 4 个 Price：

- Plus Monthly：$29 / month
- Plus Yearly：$278.40 / year
- Ultra Monthly：$49 / month
- Ultra Yearly：$470.40 / year

环境变量：

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_PRICE_PLUS_MONTHLY=
STRIPE_PRICE_PLUS_YEARLY=
STRIPE_PRICE_ULTRA_MONTHLY=
STRIPE_PRICE_ULTRA_YEARLY=
```

说明：

- 价格金额以 Stripe Price ID 为准，不信任前端传入金额。
- `constants/pricing-plans.ts` 用于价格页展示。
- 后端维护 `planId -> Stripe Price ID -> 权益` 映射。

## 3.5 后端 API 设计

### 创建 Checkout Session

路径建议：`POST /api/stripe/create-checkout-session`

请求：

```json
{
  "planId": "PLUS_MONTHLY"
}
```

允许值：

- `PLUS_MONTHLY`
- `PLUS_YEARLY`
- `ULTRA_MONTHLY`
- `ULTRA_YEARLY`

流程：

1. 校验用户已登录。
2. 校验 `planId` 是否在允许列表。
3. 查询或创建 `stripeCustomerId`。
4. 创建 Stripe Checkout Session，模式使用 `subscription`。
5. 创建本地 `Payment` 记录，状态为 `PENDING`。
6. 返回 `checkoutUrl`。

响应：

```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

### Stripe Webhook

路径建议：`POST /api/stripe/webhook`

必须处理事件：

- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

第一期重点：

- `checkout.session.completed`：绑定 `stripeCustomerId` 和 `stripeSubscriptionId`。
- `invoice.paid`：确认订阅付款成功，更新用户套餐，发放当期积分。
- `customer.subscription.deleted`：订阅取消后，到期降级为 Free。

## 3.6 订阅和积分生效规则

建议做法：

- Stripe 负责订阅周期和扣款。
- 本地数据库保存用户当前 `planType`、`subscriptionStatus`、`currentPeriodStart`、`currentPeriodEnd`。
- 每次 `invoice.paid` 按 Price ID 发放当期积分。
- 积分不过期或随订阅周期过期需要产品决策。MVP 建议“当期积分周期内有效”，逻辑更符合月度订阅。

发放规则：

| Price ID | planType | billingCycle | credits |
|---|---|---|---:|
| `STRIPE_PRICE_PLUS_MONTHLY` | PLUS | monthly | 500 |
| `STRIPE_PRICE_PLUS_YEARLY` | PLUS | yearly | 每月 500 |
| `STRIPE_PRICE_ULTRA_MONTHLY` | ULTRA | monthly | 1000 |
| `STRIPE_PRICE_ULTRA_YEARLY` | ULTRA | yearly | 每月 1000 |

MVP 确认积分策略：

- Plus / Ultra 积分按月发放，不区分月付或年付。
- Plus 每月发放 500 积分。
- Ultra 每月发放 1000 积分。
- 积分每月重置，未使用积分不累计到下个周期。
- 年付用户享受价格 8 折，但不一次性发放全年积分。

## 3.7 SaaS 通用补充能力

建议预留：

- 当前套餐页：`/dashboard/billing`
- 取消订阅入口：后续接 Stripe Customer Portal。
- 支付失败状态：`past_due`。
- 订阅取消但未到期：`cancel_at_period_end`。
- 套餐升级 / 降级：第一期可跳转 Stripe Portal，或暂时只支持新购覆盖。
- 发票记录：从 Stripe 查询或本地 `Payment` 展示。

## 3.8 验收标准

- 价格页展示 Free / Plus / Ultra 三档套餐。
- 月付 / 年付价格切换正确。
- 登录用户能购买 Plus / Ultra。
- 支付成功后，本地 `Payment` 变为 `COMPLETED`。
- 用户套餐变为 Plus / Ultra。
- 用户获得对应积分。
- 重复 Webhook 不会重复发放积分。

---

# 任务 4：用户私有服装库 + 多品类管理

## 4.1 目标

让用户可以保存自己的衣服、裤子、鞋子等单品，形成私有服装资产库，并在 AI 试衣中复用和组合搭配。

## 4.2 当前基础

已有：

- `WardrobeItem` 模型。
- `GET /api/wardrobe`。
- `POST /api/wardrobe`。
- `components/wardrobe/wardrobe-content.tsx`。
- 本地上传保存工具 `lib/wardrobe/storage.ts`。

需要补齐：

- 生产环境严格登录。
- 编辑服装信息。
- 删除服装。
- 多品类：上衣、裤子、裙子、外套、鞋子、配饰等。
- 批量选择服装用于组合搭配。
- 分类 / 标签 / 搜索 / 筛选。
- 衣橱容量限制。
- 套餐权限限制：Free 限制容量，Plus / Ultra 解锁完整衣橱。

## 4.3 页面设计

路径建议：`/dashboard/wardrobe`

页面结构：

1. 顶部统计卡片：总服装数、本月新增、容量使用、生成使用次数。
2. 上传区域：拖拽上传、点击上传、支持 JPG / PNG / WebP、单图最大 12MB。
3. 分类筛选：All / Tops / Bottoms / Dresses / Outerwear / Shoes / Accessories / Other。
4. 标签与搜索：颜色、风格、关键词。
5. 衣服卡片网格：图片、名称、分类、标签、`Try on`、`Add to outfit`、`Edit`、`Delete`。
6. 搭配篮子：用户选择多件单品后，右侧或底部显示当前搭配组合。
7. 空状态：引导用户上传第一件衣服。

## 4.4 服装分类设计

建议枚举：

```prisma
enum WardrobeCategory {
  TOP
  BOTTOM
  DRESS
  OUTERWEAR
  SHOES
  ACCESSORY
  BAG
  OTHER
}
```

前端展示：

- `TOP`：上衣
- `BOTTOM`：裤子 / 半裙
- `DRESS`：连衣裙
- `OUTERWEAR`：外套
- `SHOES`：鞋子
- `ACCESSORY`：配饰
- `BAG`：包
- `OTHER`：其他

## 4.5 数据模型设计

当前 `WardrobeItem` 可用，建议增强：

```prisma
model WardrobeItem {
  sourceType       String? @default("upload") @map("source_type")
  sourceProductUrl String? @map("source_product_url") @db.Text
  storageKey       String? @map("storage_key") @db.Text
  fileSize         Int?    @map("file_size")
  mimeType         String? @map("mime_type") @db.VarChar(100)
  imageHash        String? @map("image_hash") @db.VarChar(128)
  isDeleted        Boolean @default(false) @map("is_deleted")
}
```

建议将现有 `category String` 后续升级为枚举；MVP 为减少迁移风险，也可以先继续使用字符串。

## 4.6 API 设计

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/wardrobe?category=TOP&q=shirt&page=1&pageSize=24` | 分页获取衣橱 |
| `POST` | `/api/wardrobe` | 新增衣物 |
| `PATCH` | `/api/wardrobe/[id]` | 编辑衣物 |
| `DELETE` | `/api/wardrobe/[id]` | 软删除衣物 |

必须校验：

- 用户已登录。
- `id` 属于当前用户。
- 未软删除记录才展示。
- 达到容量上限后提示升级。

## 4.7 多服装组合搭配生成设计

### 4.7.1 用户场景

用户在服装库中选择：

- 1 件上衣
- 1 条裤子或裙子
- 1 双鞋
- 可选外套 / 包 / 配饰

点击 `Generate outfit try-on`，系统基于用户默认全身照或本次上传的人物图，生成完整穿搭效果。

### 4.7.2 组合规则

建议规则：

- 每次至少选择 1 件服装。
- 同一大类可限制最多 1-2 件，例如裤子和裙子通常只能选 1 件。
- 鞋子、包、配饰可选。
- 如果选择 `DRESS`，可提示不需要再选 `TOP + BOTTOM`。

MVP 简化规则：

- 允许选择最多 4 件单品。
- 前端仅提示冲突，不做过度限制。
- 服务端接收 `wardrobeItemIds: string[]`。

### 4.7.3 API 设计

路径建议：`POST /api/try-on/outfit-generate`

请求：

```json
{
  "personImageUrl": "optional，如果为空则使用用户默认全身照",
  "wardrobeItemIds": ["top-id", "pants-id", "shoes-id"],
  "stylePrompt": "casual street style"
}
```

流程：

1. 校验登录。
2. 校验套餐权限：Plus / Ultra 支持，Free 可限制不可用。
3. 校验积分余额，MVP 建议消耗 2 积分。
4. 查询 `wardrobeItemIds`，确认都属于当前用户。
5. 如果没有 `personImageUrl`，使用 `User.defaultModelImageUrl`。
6. 创建 `TryOnJob`，类型为 `OUTFIT_IMAGE`。
7. 组织多图输入和提示词。
8. 调用 AI 生成。
9. 保存结果图。
10. 扣减积分。
11. 返回结果。

### 4.7.4 AI 生成实现建议

MVP 可行方案：

- 若当前图片生成模型支持多张输入图：直接传人物图 + 多件服装图。
- 若模型不稳定支持多件服装：先把多件服装图合成为一张“搭配参考图”，再与人物图一起生成。
- 提示词明确要求：保留人物脸部、姿态、体型，按服装分类分别替换上衣、下装、鞋子等。

提示词方向：

```text
Generate a realistic virtual try-on image. Keep the person's face, body shape, pose, and background as consistent as possible. Apply the selected outfit items according to their categories: top, bottom, shoes, outerwear, and accessories. Ensure the final look is coherent, natural, and photorealistic.
```

### 4.7.5 数据记录

建议在 `TryOnJob` 增加：

```prisma
jobType String @default("SINGLE_GARMENT") @map("job_type")
wardrobeItemIds Json @default("[]") @map("wardrobe_item_ids")
```

或者更规范地新增关联表：

```prisma
model TryOnJobWardrobeItem {
  id             String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tryOnJobId     String @map("try_on_job_id") @db.Uuid
  wardrobeItemId String @map("wardrobe_item_id") @db.Uuid
  category       String?

  @@map("try_on_job_wardrobe_items")
}
```

MVP 推荐：先用 `wardrobeItemIds Json`，开发更快；后续需要复杂查询时再加关联表。

## 4.8 验收标准

- 登录用户可上传衣服到自己的衣橱。
- 用户 A 看不到用户 B 的衣橱。
- 用户可编辑、删除自己的衣服。
- 服装可按品类筛选。
- Plus / Ultra 用户可选择多件服装组合生成穿搭图。
- Free 用户达到限制时引导升级。

---

# 任务 5：商品图一键加入服装库

## 5.1 目标

把“商品链接解析 / 商品图试穿”和“用户衣橱”打通。用户从商品链接中解析出服装图后，可以一键保存到自己的私有衣橱，之后不用重复解析商品链接。

## 5.2 权限设计

建议：

- Free：可看到商品链接解析入口，但点击生成或保存时提示升级 Plus。
- Plus：可解析商品链接、基于商品图生成图片、保存商品图到衣橱。
- Ultra：拥有 Plus 全部能力。

## 5.3 使用场景

1. 用户粘贴商品链接。
2. 系统解析出若干商品图。
3. 用户勾选其中 1 张或多张。
4. 用户点击 `Save to wardrobe`。
5. 系统下载图片、保存资产、创建 `WardrobeItem`。
6. 保存成功后，按钮状态变为 `Saved`，并可跳转衣橱查看。

## 5.4 前端设计

在商品图候选卡片上增加：

- 复选框
- `Try on` 按钮
- `Save to wardrobe` 按钮
- 已保存状态

批量操作栏：

- `Save selected to wardrobe`
- `Try on selected`

保存弹窗：

- 名称：默认使用 `Product image 1`
- 分类：默认 `OTHER`，用户可选。
- 标签：默认包含平台名，例如 `taobao`、`aliexpress`。
- 来源商品链接：自动记录。

## 5.5 API 设计

路径建议：`POST /api/product-try-on/add-to-wardrobe`

请求：

```json
{
  "productUrl": "https://...",
  "items": [
    {
      "imageUrl": "https://...",
      "label": "Product image 1",
      "category": "TOP",
      "tags": ["taobao", "product"]
    }
  ]
}
```

流程：

1. 校验登录。
2. 校验套餐权限：Plus / Ultra。
3. 校验衣橱容量。
4. 校验图片 URL 合法性。
5. 服务端下载远程图片。
6. 保存到当前 storage service。
7. 创建 `WardrobeItem`：`sourceType = product_url`、`sourceProductUrl = productUrl`、`sourceImageUrl = imageUrl`、`imageUrl = saved.url`。
8. 返回新增衣物列表。

## 5.6 去重策略

第一期简单策略：

- 同一用户下，如果 `sourceImageUrl` 相同且 `isDeleted = false`，提示已存在。

更稳妥策略：

- 下载图片后计算 `sha256`。
- `WardrobeItem` 增加 `imageHash`。
- 同一用户下 `imageHash` 重复则不重复保存。

MVP 建议：先做 `sourceImageUrl` 去重，后续再做 hash。

## 5.7 验收标准

- Plus / Ultra 用户可把解析出的商品图保存到衣橱。
- 保存后刷新衣橱能看到该衣物。
- 未登录用户点击保存会引导登录。
- Free 用户点击保存时引导升级。
- 重复保存同一图片时有明确提示。
- 批量保存允许部分成功，不因单张失败导致全部失败。

---

# 任务 6：用户生成记录、积分消耗、图片资产和 Railway 存储方案

## 6.1 目标

让每一次 AI 试衣生成都可追踪、可查看、可复用，同时选择适合 Railway MVP 快速上线的图片存储方案。

## 6.2 图片存储方案对比

你当前倾向：MVP 尽快跑起来，部署在 Railway，数据库可考虑 Supabase。因此图片存储建议分阶段。

### 方案 A：继续存 `public/uploads`

优点：

- 当前代码改动最小。
- 本地开发最方便。
- 不需要配置第三方存储。

缺点：

- Railway 普通文件系统不适合作为长期持久化存储。
- 每次重新部署、重建容器后，上传文件可能丢失。
- 多实例时文件不同步。
- 不适合真实用户数据。

结论：

- 只适合本地开发和临时 Demo。
- 不建议作为 Railway 线上 MVP 的真实存储。

### 方案 B：Railway Volume 持久化上传目录

做法：

- 在 Railway 给服务挂载 Volume。
- 将上传目录从 `public/uploads` 改为环境变量指定目录，例如 `/data/uploads`。
- 通过 Next.js API 路由提供图片访问，例如 `/api/assets/[...key]`，而不是依赖 `public/uploads`。

优点：

- 配置相对快。
- 不需要单独接对象存储 SDK。
- 比 `public/uploads` 更适合 Railway。
- MVP 可快速上线验证。

缺点：

- 仍然绑定单个 Railway 服务实例。
- 后续迁移对象存储时需要迁移文件。
- CDN、访问控制、图片处理能力弱。

结论：

- 这是当前最适合“Railway MVP 快速上线”的方案。
- 推荐作为第一阶段线上方案。

### 方案 C：Supabase Storage

优点：

- 如果数据库也用 Supabase，图片和数据库在一个平台管理。
- SDK 简单。
- 支持 public bucket / signed URL。
- 适合 MVP 到中期阶段。

缺点：

- 需要配置 Supabase 项目、Bucket、权限策略。
- 需要引入 SDK 和环境变量。
- 比 Railway Volume 多一点集成成本。

结论：

- 如果你已经决定数据库放 Supabase，可以把 Supabase Storage 作为第二阶段方案。
- 也可以直接上 Supabase Storage，但会比 Railway Volume 多一些配置。

### 方案 D：Cloudflare R2 / AWS S3

优点：

- 更标准、更可扩展。
- 适合正式商业化长期使用。
- 可接 CDN。

缺点：

- 配置和权限稍复杂。
- MVP 初期会增加上线时间。

结论：

- 不建议现在优先做。
- 等产品验证后再迁移。

## 6.3 推荐存储路线

推荐路线：

1. 本地开发：继续使用 `public/uploads`。
2. Railway MVP：使用 Railway Volume，例如 `/data/uploads`。
3. 如果数据库确定使用 Supabase：第二阶段迁移到 Supabase Storage。
4. 用户量增长后：再评估 Cloudflare R2 / S3 + CDN。

## 6.4 MVP 存储实现设计

建议新增统一 Storage Service，不直接把业务写死到 `public/uploads`：

`lib/storage/index.ts`

```ts
export type StoredAsset = {
  url: string;
  key: string;
  size: number;
  mimeType: string;
};

export async function saveFile(input: {
  buffer: Buffer;
  folder: string;
  fileName?: string;
  mimeType: string;
}): Promise<StoredAsset>;

export async function readFileByKey(key: string): Promise<{ buffer: Buffer; mimeType: string }>;

export async function deleteFile(key: string): Promise<void>;
```

环境变量：

```env
STORAGE_DRIVER=local
LOCAL_UPLOAD_DIR=public/uploads
LOCAL_UPLOAD_PUBLIC_BASE_URL=http://localhost:3000/uploads
```

Railway 环境：

```env
STORAGE_DRIVER=local
LOCAL_UPLOAD_DIR=/data/uploads
LOCAL_UPLOAD_PUBLIC_BASE_URL=https://your-domain.com/api/assets
```

图片访问 API：

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/assets/[...key]` | 从 `LOCAL_UPLOAD_DIR` 读取并返回图片 |

这样做的好处：

- 本地仍然可以用 `public/uploads`。
- Railway 上可用 `/data/uploads`。
- 未来迁移 Supabase Storage 时，只替换 `storage service`，业务 API 不用大改。

## 6.5 生成记录设计

当前 `TryOnJob` 已有基础字段，建议增强：

```prisma
model TryOnJob {
  provider        String?   @default("openai")
  model           String?
  jobType         String    @default("SINGLE_GARMENT") @map("job_type")
  personAssetKey  String?   @map("person_asset_key") @db.Text
  garmentAssetKey String?   @map("garment_asset_key") @db.Text
  resultAssetKey  String?   @map("result_asset_key") @db.Text
  wardrobeItemIds Json      @default("[]") @map("wardrobe_item_ids")
  costCredits     Int       @default(1) @map("cost_credits")
  completedAt     DateTime? @map("completed_at") @db.Timestamptz
  metadata        Json      @default("{}")
}
```

`jobType` 建议值：

- `SINGLE_GARMENT_IMAGE`
- `PRODUCT_URL_IMAGE`
- `OUTFIT_IMAGE`
- `RUNWAY_VIDEO_360`

## 6.6 积分账户和流水

建议新增积分账户和流水，而不是只在 `UserQuota` 里记次数。

```prisma
model CreditAccount {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId    String   @unique @map("user_id") @db.Uuid
  balance   Int      @default(0)
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("credit_accounts")
}

model CreditLedger {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId      String   @map("user_id") @db.Uuid
  amount      Int
  type        String
  reason      String?
  paymentId   String?  @map("payment_id") @db.Uuid
  tryOnJobId  String?  @map("try_on_job_id") @db.Uuid
  metadata    Json     @default("{}")
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz

  @@index([userId, createdAt(sort: Desc)])
  @@map("credit_ledgers")
}
```

流水类型：

- `SUBSCRIPTION_GRANT`
- `TRY_ON_CONSUME`
- `VIDEO_CONSUME`
- `ADMIN_ADJUST`
- `REFUND_REVERSAL`
- `FREE_DAILY_USE`

Free 的每日 1 次可以通过 `UsageRecord` 限制，也可以通过 `CreditLedger` 记录 `FREE_DAILY_USE`，但不增加余额。

## 6.7 生成流程改造

当前生成接口建议改为：

1. 校验登录。
2. 判断功能权限：Free / Plus / Ultra。
3. 检查免费次数或积分余额。
4. 创建 `TryOnJob`，状态 `PENDING`。
5. 保存人物图为资产；如果没有上传，则使用用户默认全身照。
6. 保存 / 获取服装图资产。
7. 更新 `TryOnJob` 为 `PROCESSING`。
8. 调用 AI 图片或视频生成。
9. 保存结果资产。
10. 更新 `TryOnJob` 为 `COMPLETED`。
11. 写入 `UsageRecord` 和 `CreditLedger`。
12. 扣减积分或记录免费使用。
13. 返回结果。

失败时：

- 更新 `TryOnJob.status = FAILED`。
- 写入 `error`。
- 不扣积分，或只在 AI 已实际消耗时扣。MVP 建议失败不扣。

## 6.8 历史记录页面

路径建议：`/dashboard/try-on/history`

展示：

- 生成时间
- 任务类型：单件试衣 / 商品试衣 / 多件搭配 / 360 视频
- 人物图缩略图
- 服装图缩略图或搭配组合
- 结果图 / 视频
- 状态
- 消耗积分
- 失败原因

操作：

- 查看详情
- 下载结果
- 再生成一次
- 删除记录

## 6.9 验收标准

- 每次生成都会创建 `TryOnJob`。
- 成功生成后能在历史记录看到。
- 失败生成也能记录错误，便于排查。
- Railway MVP 可通过 Volume 持久化图片。
- 本地开发仍可继续使用 `public/uploads`。
- 用户只能看到自己的生成历史。
- Plus / Ultra 积分消耗正确。
- Free 用户每天只能免费生成 1 次。

---

# 7. 建议的数据库迁移清单

建议一次性评审后，再统一做 Prisma migration。

## 7.1 User

```prisma
planType              PlanType @default(FREE) @map("plan_type")
stripeCustomerId      String?  @unique @map("stripe_customer_id") @db.VarChar(255)
stripeSubscriptionId  String?  @unique @map("stripe_subscription_id") @db.VarChar(255)
subscriptionStatus    String?  @map("subscription_status") @db.VarChar(50)
currentPeriodStart    DateTime? @map("current_period_start") @db.Timestamptz
currentPeriodEnd      DateTime? @map("current_period_end") @db.Timestamptz
defaultModelImageUrl  String?  @map("default_model_image_url") @db.Text
defaultModelAssetKey  String?  @map("default_model_asset_key") @db.Text
onboardingCompleted   Boolean  @default(false) @map("onboarding_completed")
imageStorageUsedBytes BigInt   @default(0) @map("image_storage_used_bytes")
```

## 7.2 PlanType

```prisma
enum PlanType {
  FREE
  PLUS
  ULTRA
}
```

## 7.3 Payment

```prisma
stripeCheckoutSessionId String? @unique @map("stripe_checkout_session_id") @db.VarChar(255)
stripeCustomerId        String? @map("stripe_customer_id") @db.VarChar(255)
stripeSubscriptionId    String? @map("stripe_subscription_id") @db.VarChar(255)
billingCycle            String? @map("billing_cycle") @db.VarChar(50)
creditsGranted          Int?    @map("credits_granted")
```

## 7.4 WardrobeItem

```prisma
sourceType       String? @default("upload") @map("source_type")
sourceProductUrl String? @map("source_product_url") @db.Text
storageKey       String? @map("storage_key") @db.Text
fileSize         Int?    @map("file_size")
mimeType         String? @map("mime_type") @db.VarChar(100)
imageHash        String? @map("image_hash") @db.VarChar(128)
isDeleted        Boolean @default(false) @map("is_deleted")
```

## 7.5 TryOnJob

```prisma
provider        String?   @default("openai")
model           String?
jobType         String    @default("SINGLE_GARMENT_IMAGE") @map("job_type")
personAssetKey  String?   @map("person_asset_key") @db.Text
garmentAssetKey String?   @map("garment_asset_key") @db.Text
resultAssetKey  String?   @map("result_asset_key") @db.Text
wardrobeItemIds Json      @default("[]") @map("wardrobe_item_ids")
costCredits     Int       @default(1) @map("cost_credits")
completedAt     DateTime? @map("completed_at") @db.Timestamptz
metadata        Json      @default("{}")
```

## 7.6 CreditAccount / CreditLedger

建议新增积分账户和积分流水，支撑 Plus / Ultra 订阅积分。

---

# 8. 建议的接口清单

| 模块 | 方法 | 路径 | 说明 |
|---|---|---|---|
| 用户 | `POST` | `/api/auth/signup` | 注册 |
| 用户 | `GET` | `/api/me` | 当前用户信息 |
| 用户 | `POST` | `/api/me/profile-photo` | 上传默认个人全身照 |
| 支付 | `POST` | `/api/stripe/create-checkout-session` | 创建 Stripe Checkout |
| 支付 | `POST` | `/api/stripe/webhook` | Stripe Webhook |
| 衣橱 | `GET` | `/api/wardrobe` | 获取衣橱列表 |
| 衣橱 | `POST` | `/api/wardrobe` | 上传衣物 |
| 衣橱 | `PATCH` | `/api/wardrobe/[id]` | 编辑衣物 |
| 衣橱 | `DELETE` | `/api/wardrobe/[id]` | 删除衣物 |
| 商品图 | `POST` | `/api/product-try-on/extract` | 解析商品图 |
| 商品图 | `POST` | `/api/product-try-on/add-to-wardrobe` | 商品图保存到衣橱 |
| 生成 | `POST` | `/api/product-try-on/generate` | 单件 / 商品图生成试衣图 |
| 搭配 | `POST` | `/api/try-on/outfit-generate` | 多服装组合搭配生成 |
| 生成历史 | `GET` | `/api/try-on/jobs` | 获取生成历史 |
| 生成历史 | `GET` | `/api/try-on/jobs/[id]` | 获取单次详情 |
| 生成历史 | `DELETE` | `/api/try-on/jobs/[id]` | 删除记录 |
| 积分 | `GET` | `/api/credits` | 获取当前积分 |
| 图片 | `GET` | `/api/assets/[...key]` | Railway Volume 本地持久化图片访问 |

---

# 9. 建议的前端页面清单

| 页面 | 路径 | 说明 |
|---|---|---|
| 登录 | `/login` | 用户登录 |
| 注册 | `/signup` | 用户注册 |
| 上传个人全身照 | `/onboarding/profile-photo` | 注册后第二步 |
| Dashboard | `/dashboard` | 套餐、积分、默认照片、最近生成概览 |
| 衣橱 | `/dashboard/wardrobe` | 私有服装库、多品类筛选、搭配篮子 |
| 商品试衣 | `/dashboard/product-try-on` | 商品链接试衣 |
| 普通试衣 | `/dashboard/try-on` | 上传人物 + 衣橱服装试衣 |
| 多件搭配 | `/dashboard/outfit` | 选择多件服装生成整体穿搭 |
| 生成历史 | `/dashboard/try-on/history` | 历史记录 |
| 支付管理 | `/dashboard/billing` | 当前套餐、积分、订阅状态 |
| 价格页 | `/pricing` | Free / Plus / Ultra 套餐展示与购买入口 |

---

# 10. 分阶段开发计划

## Phase 1：用户体系和注册后上传全身照

- 新增统一 `requireUser()`。
- 移除生产 API 的 Demo user fallback。
- 补齐 `/api/me`。
- 新增 `/api/me/profile-photo`。
- 新增 `/onboarding/profile-photo`。
- 检查登录 / 注册 / 导航栏状态。
- 私有页面未登录跳转登录。

## Phase 2：套餐配置、价格页和 Stripe Subscription

- 定义 Free / Plus / Ultra 套餐配置。
- 更新价格页三档套餐和月付 / 年付切换。
- 安装 / 配置 Stripe。
- 新增 Stripe checkout API。
- 新增 Stripe webhook。
- 支付成功更新 `Payment`、`User`、`CreditAccount`。

## Phase 3：Railway MVP 图片存储

- 抽象统一 storage service。
- 本地支持 `public/uploads`。
- Railway 支持 `LOCAL_UPLOAD_DIR=/data/uploads`。
- 新增 `/api/assets/[...key]` 访问 Volume 图片。
- 更新 `.env.example`。

## Phase 4：衣橱完整 CRUD 和多品类管理

- 衣橱列表分页 / 筛选。
- 上传衣物。
- 编辑衣物。
- 删除衣物。
- 衣橱容量限制。
- 服装分类和标签。

## Phase 5：商品图保存到衣橱

- 商品图候选卡片加保存按钮。
- 新增保存 API。
- 校验 Plus / Ultra 权限。
- 支持批量保存与部分失败。
- 保存后同步衣橱状态。

## Phase 6：生成历史、积分消耗和多件搭配

- 改造生成接口落库 `TryOnJob`。
- 新增积分校验和扣减。
- 新增历史页面。
- 新增多件搭配选择和生成 API。
- Free 每日 1 次限制。

## Phase 7：Ultra 360 度走秀视频

- 价格页先展示 Ultra 权益，并标记为 `Coming soon`。
- MVP 阶段暂不接入真实视频生成模型。
- 后续接入视频生成模型后，再开放 `RUNWAY_VIDEO_360` 类型生成记录。
- 按视频成本设置积分消耗。

---

# 11. 关键产品决策点

这些点已确认或待后续确认：

1. Railway 线上 MVP 图片存储已确定采用 Railway Volume。
   - 结论：是。MVP 阶段线上图片统一保存到 Railway Volume，例如 `/data/uploads`，后续再迁移 Supabase Storage。
2. 数据库选型。
   - 已确认：优先使用 Railway 内置数据库；如果 Railway 数据库在连接、稳定性、备份或成本上不满足需求，再使用 Supabase Postgres。
3. 年付积分是否一次性发放全年积分？
   - 已确认：否。年付用户仍按月发放积分，Plus 每月 500，Ultra 每月 1000。
4. Plus / Ultra 的月度积分是否每月重置？
   - 已确认：是。未使用积分不累计到下个周期。
5. Free 是否允许使用商品链接解析？
   - 已确认：允许每天 1 次商品链接解析预览；真正生成和保存仍需要 Plus 及以上。
6. Free 衣橱容量是多少？
   - 已确认：3 件。
7. Plus / Ultra 多件搭配是否消耗 2 积分？
   - 已确认：是。多件搭配按 2 积分 / 次消耗。
8. Ultra 360 视频是否先作为待上线权益展示？
   - 已确认：是。MVP 阶段价格页标记为 `Coming soon`，暂不接真实生成。
9. 用户默认全身照是否强制上传？
   - 已确认：注册后允许跳过；但用户使用合成穿衣效果时，如果还没有上传个人全身照，则必须先上传，上传成功后保存为默认个人全身照。

---

# 12. 我建议最终优先确认的 MVP 范围

为了尽快跑起来，建议 MVP 包含：

1. 登录注册可用。
2. 注册后引导上传个人全身照。
3. 价格页展示 Free / Plus / Ultra，支持月付 / 年付。
4. Stripe 支付成功后开通 Plus / Ultra 并发放积分。
5. Free 每天 1 次免费图片生成。
6. Plus 每月 500 积分，$29/月，年付 8 折。
7. Ultra 每月 1000 积分，$49/月，年付 8 折。
8. 登录用户可上传、查看、删除衣橱。
9. 服装库支持衣服、裤子、鞋子等分类。
10. Plus / Ultra 可商品图一键保存到衣橱。
11. Plus / Ultra 可选择多件服装组合生成穿搭图。
12. 试衣生成记录可保存并展示。
13. 本地开发继续用 `public/uploads`。
14. Railway MVP 使用 Railway Volume 的 `/data/uploads`。
15. 后续再迁移 Supabase Storage / R2 / S3。

暂缓：

- Google OAuth。
- Stripe Customer Portal。
- 自动退款降级。
- 图片 hash 去重。
- 复杂图库资产表。
- Supabase Storage 正式接入。
- Cloudflare R2 / S3 正式接入。
- 淘宝链接解析深度优化。
- 360 度走秀视频真实生成能力。

---

# 13. 当前最终建议

如果以“最快可上线验证”为目标，我建议采用：

- 应用部署：Railway。
- 数据库：优先使用 Railway 内置数据库；如果 Railway 数据库不满足需求，再使用 Supabase Postgres。
- 图片存储：MVP 用 Railway Volume `/data/uploads`。
- 支付：Stripe Subscription。
- 套餐：Free / Plus / Ultra。
- 额度：Free 每天 1 次；Plus 500 积分/月；Ultra 1000 积分/月。
- 衣橱：支持多品类和多件搭配。
- 视频：Ultra 权益中预留，先不作为 MVP 必须完成项。
