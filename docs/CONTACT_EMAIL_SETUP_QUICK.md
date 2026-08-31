# 📧 联系表单邮件配置 - 5分钟快速设置

## 🚀 最快方式：使用 Brevo（推荐）

### 第1步：注册 Brevo（1分钟）
1. 访问 [Brevo 官网](https://www.brevo.com/)
2. 点击 "Sign up free" 注册
3. 验证邮箱

### 第2步：获取 API Key（1分钟）
1. 登录后，点击右上角账户名 → **SMTP & API**
2. 点击 **API Keys** 标签
3. 点击 **Generate a new API key**
4. 输入名称（如：`VFitly-Contact-Form`）
5. 点击 **Generate** 
6. **立即复制** API Key（只显示一次！）

### 第3步：配置到项目（1分钟）
在项目根目录创建/编辑 `.env.local` 文件：

```bash
# 邮件服务配置
BREVO_API_KEY="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
BREVO_FROM_EMAIL="noreply@yourdomain.com"
```

### 第4步：重启开发服务器
```bash
# 停止当前服务器 (Ctrl+C)
npm run dev
```

### 第5步：测试
1. 访问 http://localhost:3000
2. 滚动到联系表单
3. 填写并提交
4. 查看控制台应该看到：`✅ Email sent successfully: <message-id>`
5. 检查你的 QQ 邮箱 (372509446@qq.com) 应该收到邮件

---

## 🎯 验证配置成功

提交表单后，控制台应该显示：
```
================================================================================
📧 新的联系表单提交
================================================================================
收件人: 372509446@qq.com
发件人: test@example.com
姓名: Test User
公司: Test Company
邮件发送状态: ✅ 成功
================================================================================
✅ Email sent successfully: <message-id>
```

---

## ⚠️ 注意事项

### 1. API Key 安全
- `.env.local` 已在 `.gitignore` 中，不会被提交
- 不要把 API Key 提交到代码仓库

### 2. 发件地址
- `BREVO_FROM_EMAIL` 可以是任意邮箱
- 不需要验证域名就能使用

### 3. Brevo 免费额度
- 每天 300 封邮件
- 适合个人和小型项目
- 超出后需要升级套餐

---

## 🔄 备用方案：使用 Resend

如果 Brevo 不可用，可以使用 Resend：

1. 访问 [Resend](https://resend.com/)
2. 注册账号
3. 获取 API Key
4. 配置环境变量：
```bash
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="onboarding@resend.dev"
```

---

## 🆘 常见问题

### Q: 控制台显示 "⚠️ No email service configured"
**A:** 说明环境变量没有配置或没有生效
- 检查 `.env.local` 文件是否存在
- 检查变量名是否正确（`BREVO_API_KEY`）
- 重启开发服务器

### Q: 控制台显示 "❌ Email send failed"
**A:** API Key 可能无效
- 检查 API Key 是否正确复制
- 确认 Brevo 账户是否激活
- 查看控制台完整错误信息

### Q: 显示成功但没收到邮件
**A:** 检查垃圾邮件文件夹
- QQ 邮箱可能把邮件归类为垃圾邮件
- 在 Brevo Dashboard 查看发送日志

### Q: 需要修改收件人邮箱
**A:** 修改 `app/api/contact/send/route.ts` 第 10 行：
```typescript
const RECIPIENT_EMAIL = "your-email@example.com";
```

---

## 📝 更多配置

如需配置多个收件人、自定义邮件模板等高级功能，请查看：
- `docs/EMAIL_SETUP.md` - 详细配置文档
- `docs/CONTACT_EMAIL_QUICKSTART.md` - 功能说明文档
