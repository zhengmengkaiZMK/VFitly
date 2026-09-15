/**
 * Serper.dev API客户端
 * 用于搜索Reddit和X(Twitter)内容
 */

const SERPER_API_URL = process.env.SERPER_API_URL || 'https://google.serper.dev/search';
// 不要在这里写兜底明文密钥：源码会进入版本历史，一旦提交即可被任何人读取。
// 未配置时由 requestSerper 抛出明确错误，而不是静默使用一个公开的密钥。
const SERPER_API_KEY = process.env.SERPER_API_KEY || '';
const SERPER_TIMEOUT = parseInt(process.env.SERPER_TIMEOUT || '10000');

export interface SerperSearchParams {
  query: string;
  num?: number;
  page?: number;
  gl?: string; // 国家代码
  hl?: string; // 语言代码
  tbs?: string; // 时间范围过滤
}

export interface SocialPost {
  title: string;
  link: string;
  snippet: string;
  date?: string;
  subreddit?: string; // Reddit专用
  position: number;
  domain: string;
  platform: 'reddit' | 'x'; // 新增：标识来源平台
}

// 保持向后兼容
export type RedditPost = SocialPost;

export interface SerperSearchResult {
  posts: SocialPost[];
  total: number;
  searchTime: number;
  query: string;
  platform?: 'reddit' | 'x' | 'combined'; // 新增：标识数据来源
}

export interface CombinedSearchResult {
  redditPosts: SocialPost[];
  xPosts: SocialPost[];
  total: number;
  searchTime: number;
  query: string;
}

export class SerperService {
  
  /**
   * 搜索Reddit帖子
   */
  static async searchReddit(params: SerperSearchParams): Promise<SerperSearchResult> {
    const { query, num = 25, page = 1, gl = 'us', hl = 'en', tbs } = params;
    
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }
    
    if (!SERPER_API_KEY) {
      throw new Error('SERPER_API_KEY is not configured');
    }
    
    try {
      // 构建搜索查询，限定在Reddit站点
      const searchQuery = `site:reddit.com ${query.trim()}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SERPER_TIMEOUT);
      
      const requestBody: any = {
        q: searchQuery,
        num: Math.min(num, 100), // 限制最多100条
        page,
        gl,
        hl,
        autocorrect: true,
      };

      // 如果有时间范围过滤，添加tbs参数
      if (tbs) {
        requestBody.tbs = tbs;
      }
      
      console.log('[Serper] Sending Reddit request:', {
        url: SERPER_API_URL,
        query: searchQuery,
        num,
        page,
        tbs,
      });

      const response = await fetch(SERPER_API_URL, {
        method: 'POST',
        headers: {
          'X-API-KEY': SERPER_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Serper] API error:', response.status, errorText);
        throw new Error(`Serper API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('[Serper] Reddit response received:', {
        organicCount: data.organic?.length || 0,
        totalResults: data.searchInformation?.totalResults,
      });
      
      // 解析结果
      const posts = this.parseSearchResults(data, 'reddit');
      
      return {
        posts,
        total: this.parseTotalResults(data.searchInformation?.totalResults),
        searchTime: data.searchInformation?.timeTaken || 0,
        query: query,
        platform: 'reddit',
      };

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('[Serper] Reddit request timeout');
        throw new Error('Reddit search request timeout');
      }
      console.error('[Serper] Reddit search error:', error);
      throw new Error(error instanceof Error ? error.message : 'Reddit search failed');
    }
  }

  /**
   * 搜索X(Twitter)帖子
   */
  static async searchX(params: SerperSearchParams): Promise<SerperSearchResult> {
    const { query, num = 25, page = 1, gl = 'us', hl = 'en', tbs } = params;
    
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }
    
    if (!SERPER_API_KEY) {
      throw new Error('SERPER_API_KEY is not configured');
    }
    
    try {
      // 构建搜索查询，限定在X(Twitter)站点
      // 同时搜索 twitter.com 和 x.com
      const searchQuery = `(site:twitter.com OR site:x.com) ${query.trim()}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SERPER_TIMEOUT);
      
      const requestBody: any = {
        q: searchQuery,
        num: Math.min(num, 100), // 限制最多100条
        page,
        gl,
        hl,
        autocorrect: true,
      };

      // 如果有时间范围过滤，添加tbs参数
      if (tbs) {
        requestBody.tbs = tbs;
      }
      
      console.log('[Serper] Sending X request:', {
        url: SERPER_API_URL,
        query: searchQuery,
        num,
        page,
        tbs,
      });

      const response = await fetch(SERPER_API_URL, {
        method: 'POST',
        headers: {
          'X-API-KEY': SERPER_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Serper] API error:', response.status, errorText);
        throw new Error(`Serper API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('[Serper] X response received:', {
        organicCount: data.organic?.length || 0,
        totalResults: data.searchInformation?.totalResults,
      });
      
      // 解析结果
      const posts = this.parseSearchResults(data, 'x');
      
      return {
        posts,
        total: this.parseTotalResults(data.searchInformation?.totalResults),
        searchTime: data.searchInformation?.timeTaken || 0,
        query: query,
        platform: 'x',
      };

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('[Serper] X request timeout');
        throw new Error('X search request timeout');
      }
      console.error('[Serper] X search error:', error);
      throw new Error(error instanceof Error ? error.message : 'X search failed');
    }
  }

  /**
   * 同时搜索Reddit和X平台
   * @param params 搜索参数
   * @returns 组合的搜索结果
   */
  static async searchBoth(params: SerperSearchParams): Promise<CombinedSearchResult> {
    const { query, num = 20 } = params;
    
    console.log('[Serper] Starting combined search:', { query, numPerPlatform: num });
    
    try {
      // 并行搜索两个平台
      const [redditResult, xResult] = await Promise.allSettled([
        this.searchReddit({ ...params, num }),
        this.searchX({ ...params, num }),
      ]);
      
      // 处理Reddit结果
      const redditPosts: SocialPost[] = redditResult.status === 'fulfilled' 
        ? redditResult.value.posts 
        : [];
      
      // 处理X结果
      const xPosts: SocialPost[] = xResult.status === 'fulfilled' 
        ? xResult.value.posts 
        : [];
      
      // 记录失败的请求
      if (redditResult.status === 'rejected') {
        console.error('[Serper] Reddit search failed:', redditResult.reason);
      }
      if (xResult.status === 'rejected') {
        console.error('[Serper] X search failed:', xResult.reason);
      }
      
      const totalPosts = redditPosts.length + xPosts.length;
      const avgSearchTime = redditResult.status === 'fulfilled' && xResult.status === 'fulfilled'
        ? (redditResult.value.searchTime + xResult.value.searchTime) / 2
        : redditResult.status === 'fulfilled' 
          ? redditResult.value.searchTime 
          : xResult.status === 'fulfilled' 
            ? xResult.value.searchTime 
            : 0;
      
      console.log('[Serper] Combined search completed:', {
        redditPosts: redditPosts.length,
        xPosts: xPosts.length,
        total: totalPosts,
      });
      
      return {
        redditPosts,
        xPosts,
        total: totalPosts,
        searchTime: avgSearchTime,
        query,
      };
      
    } catch (error) {
      console.error('[Serper] Combined search error:', error);
      throw new Error(error instanceof Error ? error.message : 'Combined search failed');
    }
  }

  /**
   * 搜索指定子版块的帖子
   */
  static async searchSubreddit(
    subreddit: string,
    query?: string,
    num: number = 25,
    tbs?: string
  ): Promise<SerperSearchResult> {
    if (!subreddit || subreddit.trim().length === 0) {
      throw new Error('Subreddit name is required');
    }
    
    // 移除r/前缀（如果有）
    const cleanSubreddit = subreddit.replace(/^r\//, '').trim();
    
    // 构建子版块搜索
    const searchQuery = query && query.trim()
      ? `site:reddit.com/r/${cleanSubreddit} ${query.trim()}`
      : `site:reddit.com/r/${cleanSubreddit}`;
    
    return this.searchReddit({ query: searchQuery, num, tbs });
  }

  /**
   * 解析Serper返回的搜索结果
   */
  private static parseSearchResults(data: any, platform: 'reddit' | 'x'): SocialPost[] {
    const organic = data.organic || [];
    
    return organic.map((result: any, index: number) => {
      // 从URL中提取信息
      let subreddit: string | undefined = undefined;
      
      if (platform === 'reddit') {
        // 从Reddit URL中提取子版块名称
        const subredditMatch = result.link?.match(/reddit\.com\/r\/([^\/]+)/);
        subreddit = subredditMatch ? subredditMatch[1] : undefined;
      }
      
      return {
        title: result.title || 'Untitled',
        link: result.link || '',
        snippet: result.snippet || '',
        date: result.date || null,
        subreddit, // 只有Reddit才有
        position: result.position || index + 1,
        domain: result.domain || (platform === 'reddit' ? 'reddit.com' : 'x.com'),
        platform,
      };
    }).filter((post: SocialPost) => post.link); // 过滤掉没有链接的结果
  }

  /**
   * 解析总结果数量
   */
  private static parseTotalResults(totalStr?: string): number {
    if (!totalStr) return 0;
    // 移除逗号，转换为数字
    const num = parseInt(totalStr.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  }

  /**
   * 获取单个Reddit帖子详情（通过URL）
   */
  static async getPostByUrl(postUrl: string): Promise<SocialPost | null> {
    if (!postUrl) {
      throw new Error('Post URL is required');
    }
    
    // 判断是Reddit还是X
    const platform: 'reddit' | 'x' = postUrl.includes('reddit.com') 
      ? 'reddit' 
      : 'x';
    
    try {
      const response = await fetch(SERPER_API_URL, {
        method: 'POST',
        headers: {
          'X-API-KEY': SERPER_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: `site:${postUrl}`,
          num: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch post details');
      }

      const data = await response.json();
      const posts = this.parseSearchResults(data, platform);
      
      return posts[0] || null;

    } catch (error) {
      console.error('[Serper] Get post error:', error);
      return null;
    }
  }
}
