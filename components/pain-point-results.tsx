"use client";
import { useFeedback } from "@/components/feedback-provider";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { IconCopy, IconFileTypePdf, IconExternalLink, IconFlame, IconDeviceMobile, IconCheck } from "@tabler/icons-react";
import { Button } from "./button";
import { copyReportToClipboard, exportReportToPDF } from "@/lib/report-export";

// 类型定义
interface Insight {
  title: string;
  severity: string;
  category: string;
  description: string;
  opportunity: string;
  quote: string | null;
  quoteAuthor?: string;
  quoteLink?: string;
  quotePlatform?: 'reddit' | 'x'; // 添加平台标识
}

interface AnalysisData {
  summary: string;
  frustrationScore: number;
  insights: Insight[];
}

interface RedditPost {
  title: string;
  link: string;
  snippet: string;
  date?: string;
  subreddit?: string;
  platform?: 'reddit' | 'x'; // 新增：平台标识
}

interface PainPointResultsProps {
  data: AnalysisData;
  redditPosts?: RedditPost[]; // 保持向后兼容
  xPosts?: RedditPost[]; // 新增：X平台帖子
  onClose?: () => void;
  query?: string; // 添加搜索关键词
}

export const PainPointResults = ({ data, redditPosts = [], xPosts = [], onClose, query }: PainPointResultsProps) => {
  const { showError } = useFeedback();
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // 合并所有帖子用于匹配引用
  const allPosts = [...redditPosts, ...(xPosts || [])];
  
  const content = {
    summaryTitle: isZh ? "执行摘要" : "Executive Summary",
    frustrationIndex: isZh ? "愤怒指数" : "Frustration Index",
    insightsTitle: isZh ? "痛点详情" : "Pain Point Insights",
    opportunityLabel: isZh ? "💡 商机建议" : "💡 Opportunity",
    userQuoteLabel: isZh ? "用户原声" : "User Quote",
    viewOnReddit: isZh ? "在 Reddit 查看" : "View on Reddit",
    viewOnX: isZh ? "在 X 查看" : "View on X",
    copyReport: isZh ? "复制报告" : "Copy Report",
    copySuccess: isZh ? "已复制！" : "Copied!",
    copyError: isZh ? "复制失败，请重试" : "Copy failed, please retry",
    exportPdf: isZh ? "导出 PDF" : "Export to PDF",
    exporting: isZh ? "导出中..." : "Exporting...",
    exportTip: isZh 
      ? "点击后将直接弹出文件保存对话框,选择保存位置即可" 
      : "Click to save the PDF file directly to your chosen location",
    severityHigh: isZh ? "高严重性" : "High Severity",
    severityMedium: isZh ? "中等严重性" : "Medium Severity",
  };

  const getSeverityColor = (severity: string) => {
    if (severity.includes("High") || severity.includes("高")) {
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    }
    if (severity.includes("Medium") || severity.includes("中")) {
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
    }
    return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
  };

  const handleCopyReport = async () => {
    try {
      const success = await copyReportToClipboard({
        data,
        query,
        timestamp: new Date().toLocaleString(),
      }, 'readable'); // 使用可读文本格式

      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        showError(content.copyError);
      }
    } catch (error) {
      console.error('[PainPointResults] Copy failed:', error);
      showError(content.copyError);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      
      await exportReportToPDF({
        data,
        query,
        timestamp: new Date().toLocaleString(),
      });
      
      // 延迟重置状态，给用户反馈
      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error('[PainPointResults] Export PDF failed:', error);
      showError(isZh ? '导出失败，请重试' : 'Export failed, please retry');
      setIsExporting(false);
    }
  };

  // 尝试从所有帖子中匹配quote和链接
  const enrichInsights = () => {
    return data.insights.map(insight => {
      // 如果insight已经有链接，直接返回
      if (insight.quoteLink) return insight;

      // 尝试在所有帖子中找到匹配的quote
      if (insight.quote && allPosts.length > 0) {
        const matchingPost = allPosts.find(post => 
          post.snippet.toLowerCase().includes(insight.quote!.toLowerCase().substring(0, 30))
        );
        
        if (matchingPost) {
          // 根据平台确定作者显示
          let author = 'User';
          let platform: 'reddit' | 'x' = 'reddit';
          
          if (matchingPost.platform === 'reddit' && matchingPost.subreddit) {
            author = `r/${matchingPost.subreddit}`;
            platform = 'reddit';
          } else if (matchingPost.platform === 'x') {
            author = 'X User';
            platform = 'x';
          } else if (matchingPost.subreddit) {
            author = `r/${matchingPost.subreddit}`;
            platform = 'reddit';
          }
          
          return {
            ...insight,
            quoteLink: matchingPost.link,
            quoteAuthor: author,
            quotePlatform: platform, // 添加平台信息
          };
        }
      }

      return insight;
    });
  };

  const enrichedInsights = enrichInsights();

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 px-4 pb-20 relative z-10">
      {/* A. 总结卡片 */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
              {content.summaryTitle}
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {data.summary}
            </p>
          </div>
          
          {/* 愤怒指数仪表盘 */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 min-w-[160px]">
            <div className="relative w-24 h-24">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-neutral-200 dark:text-neutral-700"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - data.frustrationScore / 100)}`}
                  className="text-red-500 dark:text-red-400 transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {data.frustrationScore}
                </span>
              </div>
            </div>
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-2 text-center">
              {content.frustrationIndex}
            </p>
          </div>
        </div>
      </div>

      {/* B. 痛点详情卡 - 3列网格 */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          {content.insightsTitle}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrichedInsights.map((insight, index) => (
            <div
              key={index}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* 标题 */}
              <h4 className="text-lg font-bold text-black dark:text-white mb-3">
                {insight.title}
              </h4>
              
              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(insight.severity)}`}>
                  <IconFlame className="h-3 w-3" />
                  {insight.severity}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  <IconDeviceMobile className="h-3 w-3" />
                  {insight.category}
                </span>
              </div>
              
              {/* 问题描述 */}
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                {insight.description}
              </p>
              
              {/* 商机建议 */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4 mb-4">
                <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-1">
                  {content.opportunityLabel}
                </p>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {insight.opportunity}
                </p>
              </div>
              
              {/* 用户原声 */}
              {insight.quote && (
                <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
                    {content.userQuoteLabel}
                  </p>
                  <blockquote className="text-sm italic text-neutral-600 dark:text-neutral-400 mb-2 pl-3 border-l-2 border-neutral-300 dark:border-neutral-600">
                    &ldquo;{insight.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 dark:text-neutral-500">
                      {insight.quoteAuthor ? `— ${insight.quoteAuthor}` : '— User'}
                    </span>
                    {insight.quoteLink && (
                      <a
                        href={insight.quoteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                      >
                        {insight.quotePlatform === 'x' ? content.viewOnX : content.viewOnReddit}
                        <IconExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* C. 导出/行动按钮 */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleCopyReport} 
            variant="outline" 
            className="px-6"
            disabled={copySuccess}
          >
            {copySuccess ? (
              <>
                <IconCheck className="h-5 w-5" />
                <span>{content.copySuccess}</span>
              </>
            ) : (
              <>
                <IconCopy className="h-5 w-5" />
                <span>{content.copyReport}</span>
              </>
            )}
          </Button>
          <Button 
            onClick={handleExportPdf} 
            className="px-6"
            disabled={isExporting}
          >
            <IconFileTypePdf className="h-5 w-5" />
            <span>{isExporting ? content.exporting : content.exportPdf}</span>
          </Button>
        </div>
        
        {/* 导出提示 */}
        <div className="flex items-start gap-2 max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {content.exportTip}
          </p>
        </div>
      </div>
    </div>
  );
};
