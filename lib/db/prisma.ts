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

/**
 * Cloudflare Workers / workerd 的连接池配置说明：
 *
 * - 不能使用 max: 1：某个请求被 runtime 取消后，pg-pool 内部等待队列可能永久卡住，
 *   后续 /api/auth/session 会 500，客户端因此一直显示未登录。
 * - maxUses: 1：每条连接只服务一个查询，避免跨请求复用被冻结的 TCP 连接。
 * - idleTimeoutMillis: 0：连接不会进入跨请求 idle 池；maxUses: 1 仍会在使用后移除连接。
 * - max: 10：允许页面初始化时多个 DB 请求并行建立独立连接，不在应用层排队 Promise。
 *
 * PrismaPg 要求传入真实的 pg.Pool 实例，因此这里不使用自定义 Pool 包装器；
 * 自定义跨请求 Promise 队列会触发 workerd 的
 * `no_handle_cross_request_promise_resolution` 限制。
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  maxUses: 1,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 8000,
});

export const prisma = global.prisma || new PrismaClient({
  adapter: new PrismaPg(pool),
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
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
