# PayPal 查看收款记录指南

## 📊 如何查看PayPal沙箱收款

### 方法1：通过商家测试账户查看（推荐）

#### Step 1: 获取商家账户信息

1. **访问 PayPal Developer Dashboard**
   ```
   https://developer.paypal.com/dashboard/accounts
   ```

2. **找到商家（Business）测试账户**
   - 在 "Sandbox test accounts" 列表中
   - 类型是 **"BUSINESS"** 的账户
   - 邮箱格式：`sb-xxxxx@business.example.com`

3. **查看商家账户登录信息**
   - 点击账户右侧的 **"..."** 
   - 选择 **"View/Edit account"**
   - 记录：
     - Email: `sb-xxxxx@business.example.com`
     - Password: 点击 "Show" 查看（或重置密码）

---

#### Step 2: 登录商家账户查看收款

1. **打开 PayPal 沙箱登录页**
   ```
   https://www.sandbox.paypal.com
   ```

2. **使用商家测试账户登录**
   - Email: `sb-xxxxx@business.example.com`
   - Password: 你的商家账户密码

3. **查看收款记录**
   - 登录后会看到 PayPal 商家后台
   - 点击顶部的 **"Activity"** 或 **"活动"**
   - 你会看到所有交易记录：

   ```
   ┌─────────────────────────────────────────────────────────┐
   │  Activity                                    [Filter]   │
   ├─────────────────────────────────────────────────────────┤
   │  Dec 23, 2025                                           │
   │  ✅ Payment received from sb-buyer@personal.example.com │
   │     Starter Monthly - VFitly                          │
   │     +$0.01 USD                                          │
   │     Status: Completed                                   │
   │  ─────────────────────────────────────────────────────  │
   │  Dec 23, 2025                                           │
   │  ✅ Payment received from sb-buyer@personal.example.com │
   │     Professional Monthly - VFitly                     │
   │     +$12.00 USD                                         │
   │     Status: Completed                                   │
   └─────────────────────────────────────────────────────────┘
   ```

4. **查看详细信息**
   - 点击任意交易
   - 可以看到：
     - Transaction ID
     - 买家信息
     - 支付金额
     - 手续费
     - 净收入

---

### 方法2：通过 Developer Dashboard 查看（快速查看）

1. **访问 Transaction Search**
   ```
   https://developer.paypal.com/dashboard/
   ```

2. **左侧菜单**
   - 点击 **"Testing Tools"** → **"Sandbox"** → **"API calls"**
   - 或者在某些界面中选择 **"Transaction search"**

3. **查看最近的测试交易**
   - 会列出所有沙箱环境的交易
   - 包括状态、金额、时间等

---

### 方法3：通过 API 调用查看（开发者方式）

如果你想在代码中查询，可以使用PayPal API：

```bash
# 获取访问令牌
curl -v https://api-m.sandbox.paypal.com/v1/oauth2/token \
  -H "Accept: application/json" \
  -H "Accept-Language: en_US" \
  -u "CLIENT_ID:SECRET" \
  -d "grant_type=client_credentials"

# 查询交易
curl -v -X GET https://api-m.sandbox.paypal.com/v1/reporting/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

---

## 💰 查看账户余额

### 商家账户余额

1. **登录商家账户**（https://www.sandbox.paypal.com）
2. **查看余额**
   - 在页面顶部会显示当前余额
   - 例如：`$5,012.01 USD`

### 买家账户余额

1. **登录买家账户**（https://www.sandbox.paypal.com）
2. **查看余额**
   - 支付后余额应该减少
   - 例如：从 $100.00 变成 $99.99

---

## 🔍 验证支付是否成功的完整流程

### 检查清单：

#### 1. 买家端（Personal Account）
- [ ] 登录买家测试账户
- [ ] 查看 "Activity"
- [ ] 应该看到 "Payment sent" 记录
- [ ] 金额前面是 **"-"**（支出）
- [ ] 状态是 "Completed"

#### 2. 商家端（Business Account）
- [ ] 登录商家测试账户
- [ ] 查看 "Activity"
- [ ] 应该看到 "Payment received" 记录
- [ ] 金额前面是 **"+"**（收入）
- [ ] 状态是 "Completed"

#### 3. 你的应用数据库
- [ ] 查看 `Payment` 表
- [ ] 应该有新的支付记录
- [ ] 状态是 "COMPLETED"
- [ ] 用户会员等级已升级

#### 4. 用户会员状态
- [ ] 登录你的网站
- [ ] 访问 Dashboard
- [ ] 会员等级已更新为 PREMIUM
- [ ] 配额限制已提升

---

## 📸 示例截图指南

### 商家后台应该看到的：

```
┌──────────────────────────────────────────┐
│  💼 Business Account                     │
│  sb-merchant@business.example.com        │
├──────────────────────────────────────────┤
│  Available Balance: $5,012.01 USD        │
│                                          │
│  Recent Activity:                        │
│  ────────────────────────────────────    │
│  ✅ Dec 23, 2025                         │
│     Payment from sb-buyer@personal...    │
│     VFitly - Starter Monthly           │
│     +$0.01 USD                           │
│     Fee: -$0.00 USD (测试环境无手续费)    │
│     Net: +$0.01 USD                      │
│     Status: ✓ Completed                  │
│                                          │
│  Click for details →                     │
└──────────────────────────────────────────┘
```

---

## 🆘 常见问题

### Q1: 找不到商家账户？
**A**: 在 Developer Dashboard → Sandbox Accounts 中查找 Type 为 "BUSINESS" 的账户

### Q2: 商家账户登录不了？
**A**: 
1. 在 Developer Dashboard 中 "View/Edit account"
2. 点击 "Change password" 重置密码
3. 设置简单密码如 `Merchant1234!`

### Q3: 看不到交易记录？
**A**: 
- 确认支付是否真的成功（查看浏览器控制台日志）
- 确认登录的是正确的商家账户
- 交易可能有几秒延迟，刷新页面

### Q4: 交易状态是 Pending？
**A**: 
- 可能是支付捕获失败
- 检查服务器日志（`/api/payment/capture-order`）
- 查看数据库 Payment 表的状态

### Q5: 手续费是多少？
**A**: 
- **沙箱环境**：通常没有手续费（$0.00）
- **生产环境**：PayPal收取约 2.9% + $0.30 USD

---

## 🎯 快速验证命令

### 验证买家账户支付

```bash
# 1. 登录沙箱
https://www.sandbox.paypal.com

# 2. 使用买家账户登录
Email: sb-buyer@personal.example.com

# 3. 查看 Activity → 应该看到 "Payment sent"
```

### 验证商家账户收款

```bash
# 1. 登录沙箱
https://www.sandbox.paypal.com

# 2. 使用商家账户登录
Email: sb-merchant@business.example.com

# 3. 查看 Activity → 应该看到 "Payment received"
```

---

## 📊 数据库验证

你也可以直接查看数据库：

```sql
-- 查看最近的支付记录
SELECT 
  id,
  userId,
  provider,
  amount,
  currency,
  status,
  completedAt,
  createdAt
FROM Payment
ORDER BY createdAt DESC
LIMIT 10;

-- 查看用户会员状态
SELECT 
  email,
  membershipType,
  membershipExpiresAt
FROM User
WHERE id = 'your-user-id';
```

---

## 🎉 成功的标志

如果一切正常，你应该看到：

- ✅ 买家账户：有支出记录（-$0.01）
- ✅ 商家账户：有收入记录（+$0.01）
- ✅ 数据库：有完成的支付记录
- ✅ 用户：会员等级已升级
- ✅ Dashboard：显示新的会员状态

完成支付后，整个流程就打通了！🚀
