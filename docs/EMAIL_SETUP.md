# 📧 Contact Form 邮件配置指南

本文档说明如何配置 Contact Form 的邮件发送功能。

## 📋 功能说明

当用户在 Contact 页面提交表单后，系统会自动将以下信息发送到指定邮箱：
- 用户姓名
- 用户邮箱
- 公司名称
- 咨询内容
- 提交时间

**收件邮箱**: `372509446@qq.com`

---

## 🚀 快速配置（推荐 Brevo）

### 方案一：Brevo (Sendinblue) - 免费且易用

#### 1. 注册账号
访问 [Brevo官网](https://www.brevo.com/) 并注册账号（免费计划：每天300封邮件）

#### 2. 获取 API Key
1. 登录后，点击右上角头像 → **SMTP & API**
2. 点击 **API Keys** 标签
3. 点击 **Generate a new API key**
4. 给密钥命名（如：`VFitly Contact Form`）
5. 复制生成的 API Key

#### 3. 配置环境变量
在项目根目录的 `.env.local` 文件中添加：

```bash
# Brevo 邮件服务
BREVO_API_KEY="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
BREVO_FROM_EMAIL="noreply@yourdomain.com"
```

#### 4. 验证发件人邮箱（可选但推荐）
1. 在 Brevo 后台 → **Senders & IP**
2. 添加并验证你的发件人邮箱
3. 将验证后的邮箱填入 `BREVO_FROM_EMAIL`

#### 5. 测试
访问网站的 Contact 页面，提交测试表单，检查邮箱是否收到邮件。

---

### 方案二：Resend - 现代化方案

#### 1. 注册账号
访问 [Resend官网](https://resend.com/) 并注册（免费计划：每天100封邮件）

#### 2. 获取 API Key
1. 登录后台
2. 进入 **API Keys** 页面
3. 点击 **Create API Key**
4. 复制 API Key

#### 3. 配置域名（可选）
如果你有自己的域名：
1. 在 Resend 后台添加域名
2. 配置 DNS 记录
3. 等待验证通过

#### 4. 配置环境变量
```bash
# Resend 邮件服务
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="contact@yourdomain.com"
```

---

## 📝 邮件模板说明

### 邮件标题格式
```
[VFitly Contact] 来自 {用户姓名} 的咨询
```

### 邮件内容包含
- ✅ 精美的 HTML 格式
- ✅ 用户完整信息（姓名、邮箱、公司）
- ✅ 咨询内容
- ✅ 提交时间（中国时区）
- ✅ 快捷回复按钮（点击直接打开邮件客户端）
- ✅ 纯文本备用格式

---

## 🔧 本地开发测试

### 无需配置（开发模式）
如果没有配置任何邮件服务，系统会：
1. 在控制台打印邮件内容
2. 仍然返回成功状态给用户
3. 不会影响表单功能

### 查看测试日志
提交表单后，在终端查看输出：
```
================================================================================
📧 新的联系表单提交
================================================================================
收件人: 372509446@qq.com
发件人: user@example.com
姓名: 张三
公司: ABC公司
邮件发送状态: ✅ 成功
================================================================================
```

---

## 🚨 故障排查

### 1. 邮件未收到
**检查项**:
- [ ] API Key 是否正确配置
- [ ] `.env.local` 文件是否在项目根目录
- [ ] 环境变量名称是否正确（大小写敏感）
- [ ] 服务器是否重启（修改 `.env.local` 后需要重启）
- [ ] 查看垃圾邮件文件夹
- [ ] 检查 Brevo/Resend 后台的发送日志

### 2. API Key 无效
**解决方案**:
- 重新生成 API Key
- 确保 API Key 有发送邮件权限
- 检查账号是否已验证邮箱

### 3. 发件人邮箱问题
**注意**:
- Brevo 需要验证发件人邮箱
- 使用未验证的邮箱可能被拒绝
- 建议使用 `noreply@yourdomain.com` 格式

---

## 📊 邮件服务对比

| 服务 | 免费额度 | 易用性 | 推荐度 |
|------|---------|--------|--------|
| **Brevo** | 300封/天 | ⭐⭐⭐⭐⭐ | 🏆 强烈推荐 |
| **Resend** | 100封/天 | ⭐⭐⭐⭐⭐ | ⭐ 推荐 |
| **SendGrid** | 100封/天 | ⭐⭐⭐ | 备选 |
| **Mailgun** | 5000封/月 (前3月) | ⭐⭐⭐ | 备选 |

---

## 🔐 安全建议

1. **不要提交 API Key 到 Git**
   - `.env.local` 已在 `.gitignore` 中
   - 使用 `.env.example` 作为模板

2. **生产环境配置**
   - 在 Vercel 中配置环境变量
   - Dashboard → Settings → Environment Variables

3. **API Key 轮换**
   - 定期更换 API Key
   - 如果泄露，立即重新生成

---

## 📖 相关文档

- [Brevo API 文档](https://developers.brevo.com/docs)
- [Resend API 文档](https://resend.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## ✅ 配置检查清单

完成配置后，请检查：

- [ ] 已注册 Brevo 或 Resend 账号
- [ ] 已获取并配置 API Key
- [ ] 已重启开发服务器
- [ ] 已提交测试表单
- [ ] 已收到测试邮件
- [ ] 邮件内容格式正确
- [ ] 可以通过邮件回复客户

---

## 💡 额外功能建议

### 1. 自动回复客户
可以在 API 中添加代码，向客户发送确认邮件：
```typescript
// 发送确认邮件给客户
await sendEmail({
  to: email,
  subject: "感谢您的咨询 - VFitly",
  html: "我们已收到您的消息...",
});
```

### 2. 保存到数据库
在 `route.ts` 中添加：
```typescript
// 保存联系记录到数据库
await prisma.contact.create({
  data: { name, email, company, message },
});
```

### 3. Slack/Discord 通知
集成 Webhook，实时通知团队：
```typescript
await fetch(process.env.SLACK_WEBHOOK_URL, {
  method: 'POST',
  body: JSON.stringify({ text: `新咨询: ${name}` }),
});
```

---

**配置完成后，你的 Contact Form 就可以正常工作了！** 🎉
