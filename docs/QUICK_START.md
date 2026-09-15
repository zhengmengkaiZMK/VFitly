# 🚀 Supabase 集成快速开始

## ⏱️ 总耗时：约 15-20 分钟

---

## 📝 操作清单

### ✅ 步骤 1：创建 Supabase 项目（5分钟）

1. 访问 https://supabase.com 并登录
2. 点击 "New Project"
3. 填写信息：
   - Name: `ai-saas-db`
   - Password: **生成并保存强密码**
   - Region: `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`
4. 等待项目初始化完成

---

### ✅ 步骤 2：获取数据库连接信息（2分钟）

1. 进入项目 Dashboard
2. 左侧菜单：**Settings** → **Database**
3. 找到 **Connection string** → **URI**
4. 复制连接字符串，格式：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxx.supabase.co:5432/postgres
   ```
5. 保存这个字符串，稍后会用到

---

### ✅ 步骤 3：执行 SQL 脚本（3分钟）

1. 左侧菜单：**SQL Editor**
2. 点击 **"New query"**
3. 打开项目中的 `docs/supabase-schema.sql` 文件
4. 复制**全部内容**并粘贴到编辑器
5. 点击 **"Run"** 按钮（或 Cmd/Ctrl + Enter）
6. 等待执行完成，看到成功提示

**验证**：左侧菜单 **Table Editor** 应该能看到 6 个表

---

### ✅ 步骤 4：配置项目环境变量（3分钟）

在项目根目录创建 `.env.local` 文件：

```bash
# 终端执行
cd /Users/kevinnzheng/Documents/出海应用开发/AI-SaaS
cp .env.example .env.local
```

编辑 `.env.local`，填写以下内容：

```env
# 1. 数据库连接（必填）
DATABASE_URL="你在步骤2复制的连接字符串"

# 2. 生成 NEXTAUTH_SECRET（必填）
# 在终端运行: openssl rand -base64 32
# 将输出粘贴到这里
NEXTAUTH_SECRET="生成的随机字符串"

# 3. NextAuth URL（开发环境）
NEXTAUTH_URL="http://localhost:3000"

# 4. 其他配置（暂时使用默认值即可）
SERPER_API_KEY="your-serper-api-key"
```

**生成 NEXTAUTH_SECRET**：
```bash
openssl rand -base64 32
```

---

### ✅ 步骤 5：安装依赖（2分钟）

```bash
npm install @prisma/client prisma tsx
```

---

### ✅ 步骤 6：生成 Prisma 客户端（1分钟）

```bash
npm run db:generate
```

成功后会看到：
```
✔ Generated Prisma Client to ./node_modules/@prisma/client
```

---

### ✅ 步骤 7：测试数据库连接（1分钟）

```bash
npm run test:db
```

**预期输出**：

```
🔍 Testing database connection...

✅ Database connection successful

📊 Database Statistics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Users:          2
   User Quotas:    2
   Payments:       0
   Search History: 0
   Chat History:   0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Test Users:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   📧 test@example.com
      Name: Test User
      Membership: FREE
      Active: ✅
      Created: 2025-12-23T...
      Quotas: 1
      Payments: 0
      Searches: 0
      Messages: 0
      Today's Quota:
        - Searches: 0/3
        - Messages: 0/10
...

✅ Database test completed successfully!
```

---

## 🎉 完成！

如果看到上面的输出，说明 Supabase 已经成功集成到项目中！

---

## 📚 可选操作

### 查看数据库（图形界面）

```bash
npm run db:studio
```

会自动打开浏览器访问 Prisma Studio（类似 phpMyAdmin）

### 查看 Supabase Dashboard

访问 https://supabase.com/dashboard/project/your-project-id

可以：
- 查看表结构
- 执行 SQL 查询
- 查看 API 文档
- 监控数据库性能

---

## ❓ 遇到问题？

### ❌ 连接失败

**检查清单**：
- [ ] `.env.local` 文件是否在项目根目录
- [ ] `DATABASE_URL` 是否正确（包括密码）
- [ ] Supabase 项目是否正常运行
- [ ] 网络连接是否正常

**解决方案**：
```bash
# 1. 验证环境变量
cat .env.local | grep DATABASE_URL

# 2. 测试连接
npm run test:db
```

### ❌ Prisma 生成失败

```bash
# 重新生成
rm -rf node_modules/.prisma
npm run db:generate
```

### ❌ 表已存在错误

SQL 脚本已包含 `DROP TABLE IF EXISTS`，可以重新执行。

---

## 🔗 相关文档

- [完整集成指南](./SUPABASE_SETUP_GUIDE.md)
- [系统架构文档](./系统架构设计文档.mdc)
- [Supabase 官方文档](https://supabase.com/docs)
- [Prisma 官方文档](https://www.prisma.io/docs)

---

## 📞 下一步

1. ✅ 实现用户注册/登录 API
2. ✅ 集成 NextAuth.js
3. ✅ 实现配额管理功能
4. ✅ 集成支付系统

准备好了吗？继续查看 [后台管理功能实现方案](../README.md#后台管理功能)！
