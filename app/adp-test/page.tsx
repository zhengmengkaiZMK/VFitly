'use client';
import { FeedbackError } from "@/components/feedback-provider";

import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader2, Bot, User, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokenCount?: number;
  elapsed?: number;
}

interface TokenStat {
  elapsed: number;
  tokenCount: number;
}

export default function ADPTestPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenStat, setTokenStat] = useState<TokenStat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化sessionId
  useEffect(() => {
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');
    setSuccess('');
    setTokenStat(null);

    try {
      // 创建AI消息占位符
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);

      // 建立SSE连接
      const response = await fetch('/api/adp/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: userMessage.content,
          sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      // 读取SSE流
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is null');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.substring(5).trim();
            
            if (data === '[DONE]') {
              setLoading(false);
              setSuccess('✓ 对话完成');
              return;
            }

            try {
              const event = JSON.parse(data);

              if (event.type === 'reply' && event.payload) {
                // 更新AI消息内容
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: event.payload.content }
                      : msg
                  )
                );
              } else if (event.type === 'token_stat' && event.payload) {
                // 保存Token统计
                setTokenStat({
                  elapsed: event.payload.elapsed,
                  tokenCount: event.payload.token_count,
                });
              } else if (event.type === 'error') {
                throw new Error(event.error?.message || 'AI response error');
              }

            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }

    } catch (error) {
      console.error('Send message error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      // 移除空的AI消息
      setMessages((prev) => prev.filter(msg => msg.content !== ''));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (confirm('确定要清空对话吗？')) {
      setMessages([]);
      setError('');
      setSuccess('');
      setTokenStat(null);
      // 生成新的sessionId
      setSessionId(`session_${Date.now()}_${Math.random().toString(36).substring(7)}`);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <Bot size={32} />
                腾讯ADP AI助手测试
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                测试腾讯云智能体开发平台对话功能
              </p>
            </div>
            <button
              onClick={clearChat}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 
                hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} />
              清空对话
            </button>
          </div>

          {/* Session Info */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">会话ID:</span>
              <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs">
                {sessionId}
              </code>
            </div>
          </div>

          {/* Status Messages */}
          <FeedbackError message={error} />

          {success && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-400 font-medium">{success}</p>
            </div>
          )}

          {/* Token Statistics */}
          {tokenStat && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Token消耗:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {tokenStat.tokenCount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">耗时:</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {(tokenStat.elapsed / 1000).toFixed(2)}秒
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-4 overflow-hidden">
          <div className="h-[600px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <Bot size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">开始与AI助手对话</p>
                <p className="text-sm mt-2">输入消息并按Enter发送</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-4 shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.role === 'user' ? (
                      <User size={16} className="flex-shrink-0" />
                    ) : (
                      <Bot size={16} className="flex-shrink-0" />
                    )}
                    <span className="text-xs opacity-75">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap break-words">
                    {message.content || (
                      loading && message.role === 'assistant' && (
                        <div className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          <span className="text-sm opacity-75">思考中...</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息... (Enter发送, Shift+Enter换行)"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                  resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                  placeholder-gray-400 dark:placeholder-gray-500"
                rows={1}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                  rounded-xl hover:from-blue-600 hover:to-blue-700 
                  disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                  flex items-center gap-2 font-medium transition-all shadow-md 
                  hover:shadow-lg disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    发送中
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    发送
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
            🛠️ 调试信息
          </h3>
          <div className="space-y-2 text-sm font-mono text-gray-700 dark:text-gray-300">
            <div><strong>API端点:</strong> /api/adp/chat</div>
            <div><strong>协议:</strong> Server-Sent Events (SSE)</div>
            <div><strong>会话ID:</strong> {sessionId}</div>
            <div><strong>消息数量:</strong> {messages.length}</div>
            <div><strong>状态:</strong> {loading ? '🟡 处理中' : '🟢 就绪'}</div>
            {tokenStat && (
              <>
                <div><strong>最近Token消耗:</strong> {tokenStat.tokenCount}</div>
                <div><strong>最近响应时间:</strong> {(tokenStat.elapsed / 1000).toFixed(2)}秒</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
