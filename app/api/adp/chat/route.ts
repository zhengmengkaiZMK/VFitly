/**
 * 腾讯ADP聊天API端点
 * POST /api/adp/chat
 * 支持流式SSE响应
 */

import { NextRequest } from 'next/server';
import { ADPService } from '@/lib/services/adp.service';

// OpenNext Cloudflare bundles this route with the default Worker runtime.
// The stream uses Web Streams APIs and does not require the Next edge runtime.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // 获取请求参数
    const body = await req.json();
    const { content, sessionId, visitorBizId } = body;

    // 验证必填参数
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // 使用或生成会话ID
    const chatSessionId = sessionId || ADPService.generateSessionId();
    const chatVisitorId = visitorBizId || `visitor_${Date.now()}`;

    console.log('[API] ADP chat request:', {
      sessionId: chatSessionId,
      visitorBizId: chatVisitorId,
      contentLength: content.length,
    });

    // 创建SSE流
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 发送流式响应
          for await (const event of ADPService.streamChat({
            sessionId: chatSessionId,
            visitorBizId: chatVisitorId,
            content,
          })) {
            // 格式化为SSE格式
            const sseData = `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(encoder.encode(sseData));

            // 遇到错误停止
            if (event.type === 'error') {
              break;
            }

            // 如果是最终回复，可以在这里保存对话历史
            if (event.type === 'reply' && event.payload && 'is_final' in event.payload && event.payload.is_final) {
              console.log('[API] Final reply received, conversation complete');
            }
          }

          // 发送结束标记
          controller.enqueue(encoder.encode('event: done\ndata: [DONE]\n\n'));
          controller.close();

        } catch (error) {
          console.error('[API] Stream error:', error);
          const errorEvent = {
            type: 'error',
            error: {
              code: -1,
              message: error instanceof Error ? error.message : 'Stream error',
            },
          };
          controller.enqueue(
            encoder.encode(`event: error\ndata: ${JSON.stringify(errorEvent)}\n\n`)
          );
          controller.close();
        }
      },
    });

    // 返回SSE响应
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // 禁用Nginx缓冲
      },
    });

  } catch (error) {
    console.error('[API] ADP chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
