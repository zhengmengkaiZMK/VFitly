# VFitly

![Next.js](https://img.shields.io/badge/Next.js-15.5-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)

**English** · [中文](#中文说明)

VFitly is an AI virtual try-on web app. Upload a photo of yourself together with a garment image — or pull clothing straight from a shopping link — and generate AI outfit previews, try-on images and short try-on videos. A built-in virtual wardrobe lets you store garments once and reuse them across every later preview.

**Live site:** https://www.vfitly.com

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Virtual try on

Take a person photo and a garment image and generate a realistic preview of the garment on that person. Aspect-ratio presets and an optional styling-instruction field let you control the output.

### AI clothes changer

The same engine, framed for the most common request: swapping what someone is wearing in a photo. Useful when you already have one clean portrait and only want to change the outfit.

### Try on from a product link

Paste a public product URL and VFitly extracts the garment images published on that page, including the colourways a retailer shows. Review and prune the extracted images, then run a batch that generates one result per remaining garment. A failure on a single item does not interrupt the rest of the batch.

### Virtual wardrobe

Store garments with a category, colour and tags so they can be reused instead of re-uploaded. Build an outfit from two to four items across different categories, and keep finished results in a separate *Generated Looks* folder so source garments and generated results never get mixed up.

### Try-on video

Turn a still try-on result into a short generated video, subject to separate credit accounting from image generation.

### History

Every source image and generated result stays available in your account history, so you can revisit or compare earlier attempts.

### Accounts and guest mode

Email/password and Google sign-in via NextAuth. Anonymous visitors get a browser-scoped guest session with a smaller free allowance; resources created as a guest are migrated to the account on sign-in.

### Plans and credits

A free daily allowance for evaluation plus paid plans with a monthly credit balance. Billing is wired for both Stripe and PayPal, with usage recorded per generation.

### Blog, docs and admin CMS

A file-based MDX blog and documentation set, plus a database-backed article pipeline with a rich-text editor, draft/publish workflow and server-side validation for site administrators.

### SEO plumbing

Per-page metadata, self-referencing canonical URLs, Open Graph and Twitter cards, JSON-LD (`Organization`, `WebSite`, `WebApplication`, `FAQPage`), a generated sitemap and a generated `robots.txt`.

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 15.5 (App Router, React Server Components) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 3.4, Radix UI, Framer Motion, Tabler Icons, Lucide |
| Theming | next-themes (light/dark) |
| Database | PostgreSQL (Supabase) via Prisma 5 |
| Auth | NextAuth v4 (credentials + Google OAuth), bcrypt |
| Image generation | Any OpenAI-compatible Images API (configurable base URL, model, size) |
| Video generation | Wavespeed-compatible image-to-video API |
| Asset storage | Local filesystem (development) or Cloudflare R2 via the AWS S3 SDK |
| Content | MDX (`@next/mdx`, `next-mdx-remote`) and a TipTap-based editor for database articles |
| Payments | Stripe and PayPal |
| Image processing | `sharp` |
| Analytics | Vercel Analytics |

## Getting Started

### Prerequisites

- **Node.js 20 or later**
- **npm** (bundled with Node.js)
- A **PostgreSQL** database — [Supabase](https://supabase.com/) works out of the box

### 1. Clone and install

```bash
git clone https://github.com/zhengmengkaiZMK/VFitly.git
cd VFitly

# Some dependencies still declare React 18 peer ranges, so use the legacy flag
npm install --legacy-peer-deps
```

`npm install` also runs `prisma generate` through the `postinstall` hook.

### 2. Configure the environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in at least the database, NextAuth and image-generation values. See [Environment Variables](#environment-variables) for the full list.

Generate a NextAuth secret with:

```bash
openssl rand -base64 32
```

### 3. Prepare the database

```bash
npm run db:push      # push the Prisma schema to your database
npm run db:seed      # optional: create test users
```

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000.

> **Note:** the default `STORAGE_PROVIDER="local"` writes uploads to `./uploads`, which is what you want locally. Serverless hosts have an ephemeral filesystem, so switch to `r2` before deploying.

## Environment Variables

Grouped by purpose. Every value below is documented with sample placeholders in `.env.example`.

### Required

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `DIRECT_URL` | Direct (non-pooled) connection string for migrations |
| `NEXTAUTH_SECRET` | Session signing key (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Canonical app URL, e.g. `https://www.vfitly.com` |
| `OPENAI_API_KEY` | Credential for the image generation endpoint |
| `OPENAI_IMAGE_MODEL` | Image model name, e.g. `gpt-image-1` |
| `STORAGE_PROVIDER` | `local` or `r2` |

### Optional

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute site URL used for canonical links, sitemap and SEO output |
| `OPENAI_API_BASE_URL` | Override the image API base URL to use an OpenAI-compatible provider |
| `OPENAI_IMAGE_SIZE`, `OPENAI_IMAGE_QUALITY` | Defaults for generated image dimensions and quality |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Enable Google sign-in |
| `WALK_VIDEO_API_KEY`, `WALK_VIDEO_BASE_URL`, `WALK_VIDEO_MODEL` | Try-on video generation (tracked separately from image generation) |
| `LOCAL_UPLOAD_DIR`, `LOCAL_UPLOAD_PUBLIC_BASE_URL` | Local storage paths, used when `STORAGE_PROVIDER="local"` |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_BASE_URL` | Cloudflare R2 storage, used when `STORAGE_PROVIDER="r2"` |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_*` | Stripe subscriptions |
| `PAYPAL_MODE`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal checkout |
| `BREVO_API_KEY` / `RESEND_API_KEY` and `*_FROM_EMAIL` | Contact-form and notification email |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Only needed if you use the Supabase client directly |
| `REDIS_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Optional caching and rate limiting |

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:pull` | Introspect the database into the Prisma schema |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed test users |
| `npm run db:reset` | Reset database data |
| `npm run db:update` | Apply the schema update script |
| `npm run test:db` | Check database connectivity |
| `npm run test:auth` | Exercise the authentication flow |
| `npm run verify` | Run the setup verification script |
| `npm run paypal:check` | Validate the PayPal environment configuration |

## Project Structure

```
app/
├── (marketing)/          Landing page, pricing, blog, docs, contact, legal
├── (dashboard)/          Try-on studio, wardrobe, history, billing, settings, admin
├── (auth)/               Login and signup
├── api/                  Route handlers (try-on, wardrobe, billing, blog, auth)
├── sitemap.ts            Generated sitemap
└── robots.ts             Generated robots.txt
components/
├── try-on/               Try-on studio and product-link batch tool
├── wardrobe/             Wardrobe library UI
├── navbar/, footer/      Site chrome
└── ...                   Shared UI, SEO helpers, feedback dialogs
lib/
├── auth/                 NextAuth options, guest sessions, resource migration
├── billing/              Credit accounts, ledger and plan rules
├── wardrobe/             Garment storage and image generation provider
├── video/                Try-on video provider
├── product-try-on/       Product page parsing and batch generation
├── storage/              Local and R2 asset backends
└── seo.ts                Site URL, OG image and JSON-LD helpers
prisma/schema.prisma      Database schema
content/                  MDX blog posts and documentation pages
docs/                     Internal setup and integration notes
public/                   Static assets
```

## Deployment

The project deploys to Vercel out of the box; `vercel.json` sets the framework preset and install command.

1. Import the repository into Vercel.
2. Add the environment variables from [Environment Variables](#environment-variables). Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the production domain.
3. Set `STORAGE_PROVIDER="r2"` and provide the R2 credentials — the serverless filesystem is ephemeral, so local storage will not persist uploads.
4. Run `npm run db:push` (or ship migrations) against the production database.
5. Configure the OAuth callbacks in Google Cloud Console and the Stripe/PayPal webhooks for the production domain.

> **Tip:** when the database is a Supabase project reached from serverless functions, use the connection pooler host for `DATABASE_URL` rather than the direct `db.<project>.supabase.co` host, and keep the direct connection in `DIRECT_URL` for migrations. Serverless functions open many short-lived connections, which the direct connection is not designed for.

## Contributing

1. Fork the repository and create a branch for your change.
2. Keep changes focused and describe the reasoning in the commit message.
3. Run `npm run lint` and `npm run build` before opening a pull request.
4. Open the pull request with a short summary of what changed and why.

Bug reports and feature requests are welcome through GitHub Issues.

## License

No license has been published for this repository, so all rights are reserved by the author. If you intend to reuse the code, please open an issue to discuss terms first.

---

# 中文说明

[English](#vfitly) · **中文**

VFitly 是一款 AI 虚拟试衣 Web 应用。上传一张本人照片和服装图片，或直接粘贴商品链接提取服装图，即可生成 AI 换装预览、试穿图和短视频。内置的虚拟衣橱让你把一件衣服存一次，之后反复用于新的试穿。

**线上地址：** https://www.vfitly.com

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [环境变量](#环境变量)
- [可用脚本](#可用脚本)
- [项目结构](#项目结构)
- [部署](#部署)
- [参与贡献](#参与贡献)
- [许可协议](#许可协议)

## 功能特性

### 虚拟试穿（Virtual try on）

输入一张人物照片和一张服装图片，生成该人物穿着这件衣服的真实预览。支持多种画面比例预设，并可填写可选的造型要求来控制输出。

### AI 换装（AI clothes changer）

同一套引擎，面向最常见的场景：把照片里人物身上的衣服换掉。适合你已有一张干净人像、只想更换穿搭的情况。

### 从商品链接试穿

粘贴一个公开的商品页面地址，系统会提取该页面上的服装图片，包括商家展示的各个配色。你可以先审核和删除不需要的图片，再批量生成——每件剩下的服装各生成一张结果图。单件失败不会中断整批任务。

### 虚拟衣橱（Virtual wardrobe）

按分类、颜色和标签保存服装，之后直接复用而不必重复上传。可以从不同分类中选择 2 至 4 件单品组合成完整造型，生成结果则单独存放在「Generated Looks」目录，源服装图和生成结果不会混淆。

### 试穿视频

把一张静态试穿结果转成一段生成视频，额度与图片生成分开计算。

### 历史记录

所有源图和生成结果都保留在账号的历史记录中，方便回溯和对比。

### 账号与游客模式

通过 NextAuth 支持邮箱密码和 Google 登录。未登录访客会获得一个浏览器范围内的游客会话，额度较小；登录后游客期间创建的资源会自动迁移到账号下。

### 套餐与额度

提供免费每日额度供试用，付费套餐附带每月额度余额。支付同时接入 Stripe 与 PayPal，每次生成都会记录用量。

### 博客、文档与后台管理

包含基于文件的 MDX 博客与文档，以及一套数据库驱动的内容流程：富文本编辑器、草稿/发布状态和服务端校验，仅站点管理员可用。

### SEO 基础设施

逐页元信息、自引用 canonical、Open Graph 与 Twitter 卡片、JSON-LD（`Organization`、`WebSite`、`WebApplication`、`FAQPage`），以及自动生成的 sitemap 与 `robots.txt`。

## 技术栈

| 领域 | 选型 |
| --- | --- |
| 框架 | Next.js 15.5（App Router、React Server Components） |
| 语言 | TypeScript 5 |
| 界面 | React 19、Tailwind CSS 3.4、Radix UI、Framer Motion、Tabler Icons、Lucide |
| 主题 | next-themes（明暗模式） |
| 数据库 | PostgreSQL（Supabase），通过 Prisma 5 访问 |
| 认证 | NextAuth v4（账号密码 + Google OAuth）、bcrypt |
| 图像生成 | 任意兼容 OpenAI 的 Images 接口（base URL、模型、尺寸均可配置） |
| 视频生成 | 兼容 Wavespeed 的图生视频接口 |
| 资源存储 | 本地文件系统（开发）或 Cloudflare R2（通过 AWS S3 SDK） |
| 内容 | MDX（`@next/mdx`、`next-mdx-remote`），数据库文章使用 TipTap 编辑器 |
| 支付 | Stripe 与 PayPal |
| 图像处理 | `sharp` |
| 统计 | Vercel Analytics |

## 快速开始

### 环境要求

- **Node.js 20 或更高版本**
- **npm**（随 Node.js 安装）
- 一个 **PostgreSQL** 数据库，可直接使用 [Supabase](https://supabase.com/)

### 1. 克隆并安装

```bash
git clone https://github.com/zhengmengkaiZMK/VFitly.git
cd VFitly

# 部分依赖仍声明 React 18 的 peer 范围，因此需要 legacy 参数
npm install --legacy-peer-deps
```

`npm install` 会通过 `postinstall` 钩子自动执行 `prisma generate`。

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

打开 `.env.local`，至少填写数据库、NextAuth 和图像生成三项。完整清单见[环境变量](#环境变量)。

生成 NextAuth 密钥：

```bash
openssl rand -base64 32
```

### 3. 初始化数据库

```bash
npm run db:push      # 将 Prisma schema 推送到数据库
npm run db:seed      # 可选：创建测试用户
```

### 4. 启动开发服务

```bash
npm run dev
```

打开 http://localhost:3000。

> **注意：** 默认的 `STORAGE_PROVIDER="local"` 会把上传文件写到 `./uploads`，本地开发正合适。但 Serverless 平台的文件系统是临时的，部署前请改为 `r2`。

## 环境变量

按用途分组，每一项在 `.env.example` 中都带有示例占位值。

### 必填

| 变量 | 用途 |
| --- | --- |
| `DATABASE_URL` | Prisma 使用的 PostgreSQL 连接串 |
| `DIRECT_URL` | 用于迁移的直连（非连接池）连接串 |
| `NEXTAUTH_SECRET` | 会话签名密钥（`openssl rand -base64 32`） |
| `NEXTAUTH_URL` | 应用正式地址，例如 `https://www.vfitly.com` |
| `OPENAI_API_KEY` | 图像生成接口的凭据 |
| `OPENAI_IMAGE_MODEL` | 图像模型名称，例如 `gpt-image-1` |
| `STORAGE_PROVIDER` | `local` 或 `r2` |

### 可选

| 变量 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 用于 canonical、sitemap 和 SEO 输出的站点绝对地址 |
| `OPENAI_API_BASE_URL` | 覆盖图像接口 base URL，以接入兼容 OpenAI 的服务商 |
| `OPENAI_IMAGE_SIZE`、`OPENAI_IMAGE_QUALITY` | 生成图片的默认尺寸与质量 |
| `GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET` | 启用 Google 登录 |
| `WALK_VIDEO_API_KEY`、`WALK_VIDEO_BASE_URL`、`WALK_VIDEO_MODEL` | 试穿视频生成（与图像生成分开配置） |
| `LOCAL_UPLOAD_DIR`、`LOCAL_UPLOAD_PUBLIC_BASE_URL` | 本地存储路径，`STORAGE_PROVIDER="local"` 时使用 |
| `R2_ACCOUNT_ID`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`、`R2_BUCKET_NAME`、`R2_PUBLIC_BASE_URL` | Cloudflare R2 存储，`STORAGE_PROVIDER="r2"` 时使用 |
| `STRIPE_SECRET_KEY`、`STRIPE_WEBHOOK_SECRET`、`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`、`STRIPE_PRICE_*` | Stripe 订阅 |
| `PAYPAL_MODE`、`PAYPAL_CLIENT_ID`、`PAYPAL_CLIENT_SECRET`、`NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal 结算 |
| `BREVO_API_KEY` / `RESEND_API_KEY` 及 `*_FROM_EMAIL` | 联系表单与通知邮件 |
| `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY` | 仅在使用 Supabase 客户端时需要 |
| `REDIS_URL`、`UPSTASH_REDIS_REST_URL`、`UPSTASH_REDIS_REST_TOKEN` | 可选的缓存与限流 |

## 可用脚本

| 脚本 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务 |
| `npm run build` | 生成 Prisma 客户端并构建生产版本 |
| `npm run start` | 运行生产构建 |
| `npm run lint` | 运行 ESLint |
| `npm run db:generate` | 重新生成 Prisma 客户端 |
| `npm run db:push` | 将 Prisma schema 推送到数据库 |
| `npm run db:pull` | 从数据库反向生成 Prisma schema |
| `npm run db:studio` | 打开 Prisma Studio |
| `npm run db:seed` | 写入测试用户 |
| `npm run db:reset` | 重置数据库数据 |
| `npm run db:update` | 执行 schema 更新脚本 |
| `npm run test:db` | 检测数据库连通性 |
| `npm run test:auth` | 走一遍认证流程 |
| `npm run verify` | 运行环境校验脚本 |
| `npm run paypal:check` | 校验 PayPal 环境变量配置 |

## 项目结构

```
app/
├── (marketing)/          首页、定价、博客、文档、联系、法律条款
├── (dashboard)/          试衣工作台、衣橱、历史、账单、设置、后台
├── (auth)/               登录与注册
├── api/                  路由处理器（试衣、衣橱、账单、博客、认证）
├── sitemap.ts            自动生成的 sitemap
└── robots.ts             自动生成的 robots.txt
components/
├── try-on/               试衣工作台与商品链接批量工具
├── wardrobe/             衣橱库界面
├── navbar/, footer/      站点框架
└── ...                   共享 UI、SEO 辅助、反馈弹窗
lib/
├── auth/                 NextAuth 配置、游客会话、资源迁移
├── billing/              额度账户、流水与套餐规则
├── wardrobe/             服装存储与图像生成适配
├── video/                试穿视频适配
├── product-try-on/       商品页解析与批量生成
├── storage/              本地与 R2 资源后端
└── seo.ts                站点地址、OG 图与 JSON-LD 辅助
prisma/schema.prisma      数据库 schema
content/                  MDX 博客文章与文档页面
docs/                     内部搭建与集成说明
public/                   静态资源
```

## 部署

项目可直接部署到 Vercel，`vercel.json` 已设定框架预设与安装命令。

1. 在 Vercel 中导入本仓库。
2. 配置[环境变量](#环境变量)中的全部变量，并把 `NEXTAUTH_URL` 与 `NEXT_PUBLIC_SITE_URL` 设为正式域名。
3. 设置 `STORAGE_PROVIDER="r2"` 并填入 R2 凭据——Serverless 文件系统是临时的，本地存储无法持久化上传文件。
4. 对生产数据库执行 `npm run db:push`（或使用迁移）。
5. 在 Google Cloud Console 配置 OAuth 回调地址，并配置 Stripe / PayPal 的 Webhook 指向正式域名。

> **提示：** 如果数据库是 Supabase 且从 Serverless 函数访问，建议 `DATABASE_URL` 使用连接池主机，而不是直连的 `db.<项目>.supabase.co`，并把直连地址保留给 `DIRECT_URL` 供迁移使用。Serverless 函数会创建大量短连接，直连并不适合这种模式。

## 参与贡献

1. Fork 本仓库，并为你的改动创建一个分支。
2. 保持改动聚焦，并在提交信息中说明原因。
3. 提交 PR 前请先运行 `npm run lint` 与 `npm run build`。
4. 发起 Pull Request 时附上简短的改动说明与理由。

欢迎通过 GitHub Issues 提交问题反馈与功能建议。

## 许可协议

本仓库尚未发布任何许可证，因此版权归作者所有。如需复用代码，请先通过 Issue 联系讨论授权事宜。
