# PayPal 沙箱测试账户登录指南

## ⚠️ 重要：必须使用沙箱测试账户

### 为什么无法登录？

**常见错误：**
- ❌ 使用了真实的PayPal账号（如：yourname@gmail.com）
- ❌ 使用了错误的密码
- ❌ 账号不是沙箱测试账号

**正确做法：**
- ✅ 必须使用PayPal Developer Dashboard中创建的沙箱测试账号
- ✅ 测试账号格式：`sb-xxxxx@personal.example.com`
- ✅ 使用测试账号专用密码

---

## 🔧 完整解决方案

### Step 1: 获取或创建沙箱测试账户

#### 方案A：查看现有测试账户

1. **访问 PayPal Developer Dashboard**
   ```
   https://developer.paypal.com/dashboard/accounts
   ```

2. **登录你的PayPal开发者账号**
   - 这是你真实的PayPal账号
   - 不是用来支付的，是用来管理测试账号的

3. **查看沙箱测试账户列表**
   - 左侧菜单：Testing Tools → Sandbox → Accounts
   - 你会看到类似这样的列表：

   ```
   Type        Email                              Country    Balance
   ────────────────────────────────────────────────────────────────
   PERSONAL    sb-47abc12@personal.example.com   US         $0.00
   BUSINESS    sb-xyz789@business.example.com    US         $5,000.00
   ```

4. **查看测试账户的登录信息**
   - 点击 PERSONAL 账户右侧的 **"..."** 或 **"⋮"**
   - 选择 **"View/Edit account"**
   - 在弹出页面中：
     - **Email**: 记录下来（例如：sb-47abc12@personal.example.com）
     - **System Generated Password**: 点击 **"Show"** 查看密码
     - 或者点击 **"Change password"** 设置一个你容易记住的密码

5. **设置余额（重要！）**
   - 在同一页面，切换到 **"Funding"** 标签
   - 找到 **"PayPal Balance"**
   - 输入：**100.00** USD
   - 点击 **"Save"**

---

#### 方案B：创建新的测试账户（推荐）

如果现有账户有问题，创建一个新的：

1. **在 Sandbox Accounts 页面**
   - 点击 **"Create account"** 按钮

2. **填写创建表单**
   ```
   Account type: Personal (Buyer Account)
   ──────────────────────────────────────
   Email address: [自动生成] sb-xxxxx@personal.example.com
   Password: [设置一个简单的，如: Test1234!]
   First name: Test
   Last name: Buyer
   
   PayPal balance: 100.00
   Bank account: [可选，不勾选]
   Credit card: [可选，不勾选]
   ```

3. **点击 "Create"**

4. **记录账户信息**
   ```
   📧 Email: sb-xxxxx@personal.example.com
   🔑 Password: Test1234!
   💰 Balance: $100.00
   ```

---

### Step 2: 使用测试账户进行支付

1. **回到你的网站**
   - http://localhost:3000/pricing

2. **选择 Starter 方案**
   - 点击 "Buy Now"

3. **在PayPal弹窗中登录**
   - **重要**：不要使用你的真实PayPal账号！
   - 输入刚才记录的测试账号：
     ```
     Email: sb-xxxxx@personal.example.com
     Password: Test1234!
     ```

4. **完成支付**
   - 登录成功后应该看到：
     - 订单金额：$0.01
     - PayPal余额：$100.00
     - "使用PayPal余额支付"选项
   - 点击 "完成支付"

---

## 🎯 关键点检查清单

### 登录前检查：

- [ ] 使用的是 `sb-xxxxx@personal.example.com` 格式的邮箱（不是真实邮箱）
- [ ] 密码是从 Developer Dashboard 获取的（或自己设置的测试密码）
- [ ] 账户已设置余额（至少 $0.50）
- [ ] 账户类型是 PERSONAL（个人/买家账户）

### 如果还是失败：

1. **检查环境**
   - 确认 `.env.local` 中的 `PAYPAL_MODE=sandbox`
   - 确认使用的是 Sandbox Client ID

2. **重置测试账户密码**
   - 在 Developer Dashboard 中重置
   - 设置为简单密码如：`Test1234!`

3. **清除浏览器缓存**
   - PayPal可能缓存了登录状态
   - 使用无痕/隐私模式测试

4. **检查账户状态**
   - 在 Developer Dashboard 确认账户状态是 "Active"

---

## 📸 视觉指南

### 正确的登录界面应该显示：

```
┌─────────────────────────────────────┐
│  PayPal                    [X]      │
├─────────────────────────────────────┤
│                                     │
│  登录您的账户                        │
│                                     │
│  [sb-xxxxx@personal.example.com]   │  ← 测试邮箱
│  [••••••••••]                       │  ← 测试密码
│                                     │
│  [登录]                             │
│                                     │
│  ─────────────────                  │
│                                     │
│  订单详情：                          │
│  VFitly - Starter Monthly         │
│  $0.01 USD                          │
│                                     │
│  PayPal余额: $100.00               │  ← 应该显示余额
│  [✓] 使用PayPal余额支付             │
│                                     │
│  [完成支付]                          │
└─────────────────────────────────────┘
```

---

## 🆘 仍然无法登录？

请提供以下信息，我来帮你排查：

1. 你使用的邮箱格式（脱敏版，如：sb-xxx@personal.example.com）
2. 是否在 Developer Dashboard 看到了这个账户
3. 账户的 Balance 是多少
4. 登录时显示的具体错误信息

---

## 快速测试命令

你可以先在浏览器中测试登录：

1. **打开新标签页**
2. **访问**：https://www.sandbox.paypal.com
3. **使用测试账户登录**
   - Email: sb-xxxxx@personal.example.com
   - Password: 你的测试密码
4. **如果能登录成功**，说明账户有效
5. **查看余额**，确保有钱

如果在 sandbox.paypal.com 都无法登录，说明账户有问题，需要重新创建。
