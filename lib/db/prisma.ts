/**
 * Prisma 客户端单例
 * 在开发环境中防止热重载导致的多个实例
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 扩展全局类型
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// pg 驱动适配器绕过 Prisma 的原生查询引擎，使同一客户端能在 Node.js 和 Workers 中运行。
// 延迟建立连接，避免构建期访问数据库。Cloudflare 环境中不能跨请求复用 TCP 连接；
// maxUses: 1 在每次使用后移除连接，保留原有 prisma 调用入口与 DATABASE_URL。
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  maxUses: 1,
  idleTimeoutMillis: 1000,
});

export const prisma = global.prisma || new PrismaClient({
  adapter: new PrismaPg(pool),
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
});

// 在开发环境中，将实例保存到全局变量
// 这样热重载时不会创建新的连接
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * 优雅关闭数据库连接
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

/**
 * 测试数据库连接
 */
export async function testDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
