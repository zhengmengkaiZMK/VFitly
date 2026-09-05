"use client";
import { FeedbackError, useFeedback } from "@/components/feedback-provider";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconClock, IconSearch, IconFlame, IconChevronRight, IconTrash } from "@tabler/icons-react";
import { Button } from "../button";

interface Insight {
  title: string;
  severity: string;
  category: string;
  description: string;
  opportunity: string;
  quote: string | null;
}

interface HistoryRecord {
  id: string;
  query: string;
  keywords: string | null;
  summary: string;
  frustrationScore: number;
  totalPosts: number;
  insights: Insight[];
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function HistoryList() {
  const { showError } = useFeedback();
  const pathname = usePathname();
  const router = useRouter();
  const isZh = pathname.startsWith("/zh");
  
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string>("");

  const content = {
    title: isZh ? "检索历史记录" : "Analysis History",
    subtitle: isZh ? "查看您的所有痛点分析记录" : "View all your pain point analyses",
    empty: isZh ? "暂无历史记录" : "No history records yet",
    emptyDesc: isZh ? "开始您的第一次痛点分析" : "Start your first pain point analysis",
    loadMore: isZh ? "加载更多" : "Load More",
    loading: isZh ? "加载中..." : "Loading...",
    viewDetail: isZh ? "查看详情" : "View Details",
    delete: isZh ? "删除" : "Delete",
    deleting: isZh ? "删除中..." : "Deleting...",
    deleteConfirm: isZh ? "确定要删除这条记录吗？" : "Are you sure you want to delete this record?",
    posts: isZh ? "个帖子" : " posts",
    by: isZh ? "检索人：" : "By: ",
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/pain-points/history?page=${page}&limit=10`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch history");
      }

      setRecords(data.records);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Fetch history error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(content.deleteConfirm)) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(`/api/pain-points/history/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete record");
      }

      // 刷新列表
      await fetchHistory(pagination.page);
    } catch (err) {
      console.error("Delete error:", err);
      showError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId("");
    }
  };

  const handleViewDetail = (id: string) => {
    const detailPath = isZh ? `/zh/dashboard/history/${id}` : `/dashboard/history/${id}`;
    router.push(detailPath);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isZh
      ? date.toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const getSeverityCount = (insights: Insight[], severity: string) => {
    return insights.filter(
      (i) => i.severity.toLowerCase().includes(severity.toLowerCase())
    ).length;
  };

  if (loading && records.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">{content.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <FeedbackError message={error} />
        <Button onClick={() => fetchHistory(pagination.page)}>{isZh ? "重试" : "Try again"}</Button>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-16">
        <IconSearch className="h-16 w-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
          {content.empty}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">{content.emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
          {content.title}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">{content.subtitle}</p>
      </div>

      {/* 记录列表 */}
      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-4">
              {/* 左侧内容 */}
              <div className="flex-1 min-w-0">
                {/* 查询和时间 */}
                <div className="flex items-start gap-3 mb-3">
                  <IconSearch className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-1 truncate">
                      {record.query}
                    </h3>
                    {record.keywords && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                        <span className="font-medium">{isZh ? "关键词：" : "Keywords: "}</span>
                        {record.keywords}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <IconClock className="h-3.5 w-3.5" />
                        {formatDate(record.createdAt)}
                      </span>
                      <span>
                        {content.by}{record.user.name || record.user.email}
                      </span>
                      <span>
                        {record.totalPosts}{content.posts}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 摘要 */}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3 pl-8">
                  {record.summary}
                </p>

                {/* 统计信息 */}
                <div className="flex items-center gap-4 pl-8">
                  <div className="flex items-center gap-2">
                    <IconFlame className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {record.frustrationScore}/100
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                      {getSeverityCount(record.insights, "high")} {isZh ? "高" : "High"}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                      {getSeverityCount(record.insights, "medium")} {isZh ? "中" : "Med"}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {record.insights.length} {isZh ? "个痛点" : " pain points"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 右侧操作按钮 */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleViewDetail(record.id)}
                  className="whitespace-nowrap"
                  size="sm"
                >
                  {content.viewDetail}
                  <IconChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(record.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  disabled={deletingId === record.id}
                >
                  {deletingId === record.id ? (
                    <>{content.deleting}</>
                  ) : (
                    <>
                      <IconTrash className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchHistory(page)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === pagination.page
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
