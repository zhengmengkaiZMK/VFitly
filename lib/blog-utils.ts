import fs from "fs"
import path from "path"

/**
 * 需要临时移出索引的博客 slug，例如 slug 写错、正在等改名的文章。
 * 当前为空：原先的 `none` 已在数据库改名为 ai-virtual-try-on-products-compared。
 *
 * 用法：把 slug 加进这个数组，该文章会保留可访问但输出 noindex，
 * 站点地图也会跳过它。改好 slug 后记得从这里移除。
 */
export const quarantinedBlogSlugs: string[] = [];

export interface BlogPost {
  slug: string
  title: string
  description: string
  category: string
  date: string
  author: {
    name: string
    avatar: string
  }
  image: string
  readTime: string
  tags?: string[]
  isFeatured?: boolean
  url: string
}

/**
 * 计算阅读时间（基于字数，平均 200 字/分钟）
 */
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  if (!content || typeof content !== 'string') {
    return "5 min read"
  }
  const wordCount = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  return `${minutes} min read`
}

/**
 * 从 MDX 文件中解析 frontmatter
 */
function parseFrontmatter(content: string): any {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)
  
  if (!match) return {}
  
  const frontmatterText = match[1]
  const lines = frontmatterText.split('\n')
  const frontmatter: any = {}
  
  let currentKey = ''
  let inObject = false
  
  for (const line of lines) {
    if (line.includes(':') && !inObject) {
      const [key, ...valueParts] = line.split(':')
      const value = valueParts.join(':').trim()
      currentKey = key.trim()
      
      if (value.startsWith('{')) {
        inObject = true
        frontmatter[currentKey] = {}
      } else if (value.startsWith('[')) {
        frontmatter[currentKey] = []
      } else {
        frontmatter[currentKey] = value.replace(/['"]/g, '')
      }
    } else if (inObject && line.includes(':')) {
      const [subKey, ...subValueParts] = line.split(':')
      const subValue = subValueParts.join(':').trim().replace(/['"]/g, '').replace(/,/g, '')
      frontmatter[currentKey][subKey.trim()] = subValue
    } else if (line.includes('}')) {
      inObject = false
    }
  }
  
  return frontmatter
}

/**
 * 获取所有博客文章（仅英文）
 */
export function getAllBlogPosts(): BlogPost[] {
  const blogDir = path.join(process.cwd(), "content", "blog")
  
  if (!fs.existsSync(blogDir)) {
    return []
  }
  
  const visibleSlugs = new Set([
    "how-to-try-on-wedding-dresses-at-home",
    "ai-clothes-changer-online-shopping",
    "product-try-on-shopping-links",
    "virtual-wardrobe-ai-try-on",
    "360-ai-try-on-video-guide",
  ])
  const files = fs.readdirSync(blogDir).filter(file => {
    const slug = file.replace('.mdx', '')
    return file.endsWith('.mdx') && !file.startsWith('_') && visibleSlugs.has(slug)
  })
  
  return files.map(file => {
    const slug = file.replace('.mdx', '')
    const filePath = path.join(blogDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    
    const frontmatter = parseFrontmatter(content)
    const readTime = calculateReadTime(content)
    const stats = fs.statSync(filePath)
    
    return {
      slug,
      title: frontmatter.title || slug,
      description: frontmatter.description || '',
      category: frontmatter.category || 'Uncategorized',
      date: frontmatter.date || stats.mtime.toISOString().split('T')[0],
      author: frontmatter.author || { name: 'Anonymous', avatar: '/avatar.jpeg' },
      image: frontmatter.image || '/placeholder.jpg',
      readTime,
      tags: frontmatter.tags || [],
      isFeatured: frontmatter.isFeatured || false,
      url: `/blog/${slug}`,
    }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * 根据分类筛选文章
 */
export function getBlogPostsByCategory(category: string): BlogPost[] {
  const posts = getAllBlogPosts()
  if (category === "all") return posts
  return posts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  )
}

/**
 * 获取推荐文章（排除当前文章）
 */
export function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): BlogPost[] {
  const allPosts = getAllBlogPosts()
  const currentPost = allPosts.find((post) => post.slug === currentSlug)

  if (!currentPost) return allPosts.slice(0, limit)

  const sameCategoryPosts = allPosts.filter(
    (post) =>
      post.slug !== currentSlug && post.category === currentPost.category
  )

  const otherPosts = allPosts.filter(
    (post) =>
      post.slug !== currentSlug && post.category !== currentPost.category
  )

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit)
}
