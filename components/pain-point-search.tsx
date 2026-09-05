"use client";
import { FeedbackError } from "@/components/feedback-provider";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "./button";
import { PainPointResults } from "./pain-point-results";
import {
  getGuestUsageCount,
  incrementGuestUsage,
  hasGuestQuota,
  getRemainingGuestQuota,
  clearGuestUsage,
} from "@/lib/usage-tracker";

// 分析结果类型定义
interface AnalysisResult {
  summary: string;
  frustrationScore: number;
  insights: Array<{
    title: string;
    severity: string;
    category: string;
    description: string;
    opportunity: string;
    quote: string | null;
  }>;
}

interface RedditPost {
  title: string;
  link: string;
  snippet: string;
  date?: string;
  subreddit?: string;
}

// 镐头图标组件
const PickaxeIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14.531 12.469l6.238-6.238a2 2 0 0 0 0-2.828l-1.172-1.172a2 2 0 0 0-2.828 0l-6.238 6.238" />
    <path d="M14.531 12.469l-9.9 9.9a2 2 0 0 1-2.828 0l-1.172-1.172a2 2 0 0 1 0-2.828l9.9-9.9" />
    <path d="M7.5 15.5l2 2" />
  </svg>
);

export const PainPointSearch = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isZh = pathname.startsWith("/zh");
  const { data: session, status: sessionStatus } = useSession();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["reddit"]);
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [xPosts, setXPosts] = useState<RedditPost[]>([]); // 新增：X平台帖子
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [guestUsageCount, setGuestUsageCount] = useState(0);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  // 管理游客使用次数：登录时清除，退出时重置
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      // 用户登录后，清除游客使用记录
      clearGuestUsage();
      setGuestUsageCount(0);
      console.log('[PainPointSearch] User logged in, cleared guest usage');
    } else if (sessionStatus === "unauthenticated") {
      // 用户未登录，加载游客使用次数
      const count = getGuestUsageCount();
      setGuestUsageCount(count);
      console.log('[PainPointSearch] Guest mode, usage count:', count);
    }
  }, [sessionStatus]);

  const content = {
    placeholder: isZh 
      ? "输入关键词或想了解的问题，如：'Notion 使用痛点'、'邮件营销难题'..." 
      : "Enter keywords or questions, e.g., 'Notion pain points', 'Email marketing issues'...",
    buttonText: isZh ? "查找痛点" : "Find Pain Points",
    searchingText: isZh ? "正在搜索..." : "Searching...",
    quickChips: isZh 
      ? ["SaaS", "健身", "远程工作", "生产力"]
      : ["SaaS", "Fitness", "Remote Work", "Productivity"],
    platforms: [
      { id: "reddit", label: "Reddit" },
      { id: "x", label: "X" },
    ],
  };

  // 当结果显示时，自动滚动到结果区域 - 模拟自然滚动
  useEffect(() => {
    if (showResults && resultsRef.current) {
      // 延迟一小段时间让结果完全渲染
      setTimeout(() => {
        const element = resultsRef.current;
        if (!element) return;

        // 获取元素位置
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        
        // 计算目标位置 - 留出一些顶部空间（80px），让布局更舒适
        const offset = 80;
        const targetPosition = absoluteElementTop - offset;
        
        // 当前位置
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        
        // 滚动持续时间（毫秒）
        const duration = 1200;
        let startTime: number | null = null;
        
        // 缓动函数 - easeInOutCubic，模拟自然滚动
        const easeInOutCubic = (t: number): number => {
          return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };
        
        // 动画函数
        const animation = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          
          // 应用缓动函数
          const ease = easeInOutCubic(progress);
          
          // 计算当前位置
          const currentPosition = startPosition + distance * ease;
          
          // 滚动到当前位置
          window.scrollTo(0, currentPosition);
          
          // 如果动画未完成，继续
          if (progress < 1) {
            requestAnimationFrame(animation);
          }
        };
        
        // 启动动画
        requestAnimationFrame(animation);
      }, 150);
    }
  }, [showResults]);

  // 保存历史记录到数据库（仅登录用户）
  const saveToHistory = async (
    query: string,
    analysisData: AnalysisResult,
    redditPosts: RedditPost[],
    xPosts: RedditPost[],
    totalPosts: number,
    searchTime?: number
  ) => {
    try {
      console.log('[PainPointSearch] Saving to history...');
      
      const response = await fetch('/api/pain-points/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          keywords: query, // 可以改为提取的关键词
          redditPosts,
          xPosts,
          totalPosts,
          summary: analysisData.summary,
          frustrationScore: analysisData.frustrationScore,
          insights: analysisData.insights,
          searchTime,
          analysisTime: null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[PainPointSearch] History saved successfully:', data.id);
      } else {
        const error = await response.json();
        console.warn('[PainPointSearch] Failed to save history:', error);
      }
    } catch (error) {
      console.error('[PainPointSearch] Save history error:', error);
      // 静默失败，不影响用户体验
    }
  };

  const handleChipClick = (chip: string) => {
    setSearchQuery(chip);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSearch = async () => {
    if (isSearching || !searchQuery.trim()) return;
    
    console.log("Search:", searchQuery, "Platforms:", selectedPlatforms);
    
    // ===== 配额检查（前端预检查） =====
    const isGuest = !session || !session.user;
    
    if (isGuest) {
      // 游客模式：检查是否超过3次
      if (!hasGuestQuota()) {
        const confirmSignup = window.confirm(
          isZh 
            ? "您已达到免费使用限制（3次）。立即注册登录后每天可使用5次！" 
            : "You've reached the free usage limit (3 searches). Sign up now for 5 searches per day!"
        );
        if (confirmSignup) {
          router.push(isZh ? "/zh/signup" : "/signup");
        }
        return;
      }
    }
    
    // 重置状态
    setIsSearching(true);
    setProgress(0);
    setShowResults(false);
    setAnalysisResult(null);
    setRedditPosts([]);
    setXPosts([]); // 清空X帖子
    setError("");
    setStatusMessage(isZh ? "正在搜索..." : "Searching...");
    
    try {
      // 调用痛点分析API
      const response = await fetch('/api/pain-points/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery.trim(),
          platforms: selectedPlatforms,
          isGuest,
          guestUsageCount: isGuest ? guestUsageCount : 0,
        }),
      });

      // 处理配额超限错误
      if (response.status === 403) {
        const errorData = await response.json();
        
        if (errorData.error === 'GUEST_QUOTA_EXCEEDED') {
          // 游客配额超限 -> 跳转注册页
          const confirmSignup = window.confirm(
            isZh 
              ? errorData.message || "您已达到免费使用限制（3次）。立即注册登录后每天可使用5次！"
              : errorData.message || "You've reached the free usage limit (3 searches). Sign up now for 5 searches per day!"
          );
          if (confirmSignup) {
            router.push(isZh ? "/zh/signup" : "/signup");
          }
          setIsSearching(false);
          return;
        } else if (errorData.error === 'QUOTA_EXCEEDED') {
          // 已登录用户配额超限 -> 跳转定价页
          const confirmUpgrade = window.confirm(
            isZh 
              ? errorData.message || "您已达到今日搜索限制（5次）。立即升级会员以解锁无限搜索？"
              : errorData.message || "You've reached your daily search limit (5 searches). Upgrade now for unlimited searches?"
          );
          if (confirmUpgrade) {
            router.push(isZh ? "/zh/pricing" : "/pricing");
          }
          setIsSearching(false);
          return;
        }
      }

      if (!response.ok) {
        throw new Error('Failed to start analysis');
      }

      // 如果是游客，增加使用次数
      if (isGuest) {
        const newCount = incrementGuestUsage();
        setGuestUsageCount(newCount);
        console.log('[PainPointSearch] Guest usage incremented to:', newCount);
      }

      // 处理SSE流
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
          if (line.startsWith('event:')) {
            continue; // 跳过事件类型行
          }

          if (line.startsWith('data:')) {
            const data = line.substring(5).trim();
            
            if (data === '[DONE]') {
              console.log('Analysis stream completed');
              continue;
            }

            try {
              const event = JSON.parse(data);
              console.log('Received event:', event);

              // 处理不同类型的事件
              if (event.status === 'searching') {
                setProgress(event.progress || 10);
                setStatusMessage(event.message || (isZh ? "正在搜索..." : "Searching..."));
              } else if (event.status === 'analyzing') {
                setProgress(event.progress || 40);
                setStatusMessage(event.message || (isZh ? "AI 分析中..." : "Analyzing with AI..."));
              } else if (event.status === 'completed') {
                // 只在收到completed事件时才处理结果
                setProgress(100);
                setStatusMessage(isZh ? "分析完成！" : "Analysis complete!");

                // 解析ADP返回的结果
                try {
                  // 尝试从result中提取JSON
                  const jsonMatch = event.result.match(/```json\s*([\s\S]*?)\s*```/) || 
                                   event.result.match(/\{[\s\S]*\}/);
                  
                  if (jsonMatch) {
                    const jsonStr = jsonMatch[1] || jsonMatch[0];
                    const analysisData = JSON.parse(jsonStr);
                    
                    console.log('Parsed analysis:', analysisData);
                    setAnalysisResult(analysisData);
                    
                    // 保存Reddit和X帖子数据
                    let redditPostsData = [];
                    let xPostsData = [];
                    if (event.searchData?.redditPosts) {
                      redditPostsData = event.searchData.redditPosts;
                      setRedditPosts(event.searchData.redditPosts);
                    }
                    if (event.searchData?.xPosts) {
                      xPostsData = event.searchData.xPosts;
                      setXPosts(event.searchData.xPosts);
                    }
                    // 向后兼容：如果使用旧格式
                    if (event.searchData?.posts && !event.searchData?.redditPosts) {
                      redditPostsData = event.searchData.posts;
                      setRedditPosts(event.searchData.posts);
                    }

                    // 如果用户已登录，自动保存到历史记录
                    if (!isGuest && session?.user?.id) {
                      saveToHistory(
                        searchQuery.trim(),
                        analysisData,
                        redditPostsData,
                        xPostsData,
                        event.searchData?.total || 0,
                        event.searchData?.searchTime
                      );
                    }
                  } else {
                    // 如果无法解析JSON，使用原始文本
                    console.warn('Could not parse JSON from ADP response, using raw text');
                    setAnalysisResult({
                      summary: event.result,
                      frustrationScore: 50,
                      insights: [],
                    });
                  }
                } catch (parseError) {
                  console.error('Failed to parse ADP result:', parseError);
                  setAnalysisResult({
                    summary: event.result || (isZh ? "分析完成，但结果格式有误" : "Analysis completed but format is invalid"),
                    frustrationScore: 50,
                    insights: [],
                  });
                }

                // 延迟后显示结果
                setTimeout(() => {
                  setIsSearching(false);
                  setShowResults(true);
                }, 500);
              } else if (event.error) {
                throw new Error(event.error.message || 'Analysis failed');
              }

            } catch (parseError) {
              console.error('Failed to parse event:', parseError, data);
            }
          }
        }
      }

    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : (isZh ? "搜索失败" : "Search failed"));
      setIsSearching(false);
      setProgress(0);
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto mt-12 px-4 relative z-10">
        {/* 配额提示 */}
        {sessionStatus === "unauthenticated" && (
          <div className="mb-4 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {isZh 
                ? `免费试用剩余 ${getRemainingGuestQuota()} 次搜索`
                : `${getRemainingGuestQuota()} free searches remaining`}
              {guestUsageCount >= 2 && (
                <span className="ml-2 text-cyan-600 dark:text-cyan-400 font-medium">
                  {isZh ? "（注册后每日5次）" : "(5/day after signup)"}
                </span>
              )}
            </p>
          </div>
        )}

        {/* 搜索输入框 */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={content.placeholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            data-form-type="other"
            className="w-full h-14 px-6 text-base rounded-2xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>

        {/* 执行按钮 */}
        <div className="flex justify-center mt-4">
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="px-8 h-12 text-base"
          >
            <PickaxeIcon className="h-5 w-5" />
            <span>{isSearching ? content.searchingText : content.buttonText}</span>
          </Button>
        </div>

        {/* 推荐搜索 Quick Chips */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {content.quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* 平台选择 - 已隐藏 */}
        {/* <div className="flex gap-4 justify-center mt-6">
          {content.platforms.map((platform) => (
            <label
              key={platform.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(platform.id)}
                  onChange={() => togglePlatform(platform.id)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? "bg-cyan-400 border-cyan-400"
                      : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                  }`}
                >
                  {selectedPlatforms.includes(platform.id) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                {platform.label}
              </span>
            </label>
          ))}
        </div> */}

        {/* 进度条 */}
        {isSearching && (
          <div className="mt-6 w-full max-w-md mx-auto">
            <div className="h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-200 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center mt-2 text-neutral-500 dark:text-neutral-400">
              {statusMessage} ({Math.round(progress)}%)
            </p>
          </div>
        )}

        {/* 错误提示 */}
        <FeedbackError message={error} />
      </div>

      {/* 结果展示区 */}
      {showResults && analysisResult && (
        <div ref={resultsRef}>
          <PainPointResults 
            data={analysisResult} 
            redditPosts={redditPosts}
            xPosts={xPosts}
            query={searchQuery}
          />
        </div>
      )}
    </>
  );
};
