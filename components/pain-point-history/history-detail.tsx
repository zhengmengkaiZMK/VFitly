"use client";
import { FeedbackError, useFeedback } from "@/components/feedback-provider";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconArrowLeft, IconCopy, IconFileTypePdf, IconClock, IconUser, IconCheck } from "@tabler/icons-react";
import { Button } from "../button";
import { PainPointResults } from "../pain-point-results";
import { copyReportToClipboard, exportReportToPDF } from "@/lib/report-export";

interface Insight {
  title: string;
  severity: string;
  category: string;
  description: string;
  opportunity: string;
  quote: string | null;
  quoteAuthor?: string;
  quoteLink?: string;
  quotePlatform?: 'reddit' | 'x';
}

interface RedditPost {
  title: string;
  link: string;
  snippet: string;
  date?: string;
  subreddit?: string;
  platform?: 'reddit' | 'x';
}

interface HistoryDetailData {
  id: string;
  query: string;
  keywords: string | null;
  summary: string;
  frustrationScore: number;
  totalPosts: number;
  insights: Insight[];
  redditPosts: RedditPost[];
  xPosts: RedditPost[];
  searchTime: number | null;
  analysisTime: number | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface HistoryDetailProps {
  id: string;
}

export function HistoryDetail({ id }: HistoryDetailProps) {
  const { showError } = useFeedback();
  const pathname = usePathname();
  const router = useRouter();
  const isZh = pathname.startsWith("/zh");
  
  const [data, setData] = useState<HistoryDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const content = {
    back: isZh ? "返回列表" : "Back to List",
    loading: isZh ? "加载中..." : "Loading...",
    searchInfo: isZh ? "检索信息" : "Search Info",
    query: isZh ? "用户问题" : "Query",
    keywords: isZh ? "关键词" : "Keywords",
    time: isZh ? "检索时间" : "Search Time",
    searcher: isZh ? "检索人" : "Searcher",
    posts: isZh ? "帖子数量" : "Posts Found",
    copyReport: isZh ? "复制报告" : "Copy Report",
    copySuccess: isZh ? "已复制！" : "Copied!",
    copyError: isZh ? "复制失败，请重试" : "Copy failed, please retry",
    exportPdf: isZh ? "导出 PDF" : "Export to PDF",
    exporting: isZh ? "导出中..." : "Exporting...",
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/pain-points/history/${id}`);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to fetch detail");
      }

      setData(responseData.record);
    } catch (err) {
      console.error("Fetch detail error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const listPath = isZh ? "/zh/dashboard" : "/dashboard";
    router.push(listPath);
  };

  const handleCopyReport = async () => {
    if (!data) return;

    try {
      const success = await copyReportToClipboard({
        data: {
          summary: data.summary,
          frustrationScore: data.frustrationScore,
          insights: data.insights,
        },
        query: data.query,
        timestamp: new Date(data.createdAt).toLocaleString(),
      }, 'readable');

      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        showError(content.copyError);
      }
    } catch (error) {
      console.error('[HistoryDetail] Copy failed:', error);
      showError(content.copyError);
    }
  };

  const handleExportPdf = async () => {
    if (!data) return;

    try {
      setIsExporting(true);
      
      await exportReportToPDF({
        data: {
          summary: data.summary,
          frustrationScore: data.frustrationScore,
          insights: data.insights,
        },
        query: data.query,
        timestamp: new Date(data.createdAt).toLocaleString(),
      });
      
      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error('[HistoryDetail] Export PDF failed:', error);
      showError(isZh ? '导出失败，请重试' : 'Export failed, please retry');
      setIsExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isZh
      ? date.toLocaleString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">{content.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button onClick={handleBack} variant="outline" className="mb-6">
          <IconArrowLeft className="h-4 w-4" />
          {content.back}
        </Button>
        <FeedbackError message={error || "Record not found"} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 返回按钮和操作栏 */}
      <div className="mb-8 flex items-center justify-between">
        <Button onClick={handleBack} variant="outline">
          <IconArrowLeft className="h-4 w-4" />
          {content.back}
        </Button>

        <div className="flex gap-3">
          <Button 
            onClick={handleCopyReport} 
            variant="outline"
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
            disabled={isExporting}
          >
            <IconFileTypePdf className="h-5 w-5" />
            <span>{isExporting ? content.exporting : content.exportPdf}</span>
          </Button>
        </div>
      </div>

      {/* 检索信息卡片 */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-bold text-black dark:text-white mb-4">
          {content.searchInfo}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              {content.query}
            </p>
            <p className="text-base text-black dark:text-white">{data.query}</p>
          </div>
          {data.keywords && (
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                {content.keywords}
              </p>
              <p className="text-base text-black dark:text-white">{data.keywords}</p>
            </div>
          )}
          <div className="flex items-start gap-2">
            <IconClock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                {content.time}
              </p>
              <p className="text-base text-black dark:text-white">{formatDate(data.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <IconUser className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                {content.searcher}
              </p>
              <p className="text-base text-black dark:text-white">
                {data.user.name || data.user.email}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              {content.posts}
            </p>
            <p className="text-base text-black dark:text-white">
              {data.totalPosts} {isZh ? "个" : " posts"}
            </p>
          </div>
        </div>
      </div>

      {/* 分析结果 - 复用PainPointResults组件 */}
      <PainPointResults
        data={{
          summary: data.summary,
          frustrationScore: data.frustrationScore,
          insights: data.insights,
        }}
        redditPosts={data.redditPosts || []}
        xPosts={data.xPosts || []}
        query={data.query}
      />
    </div>
  );
}
