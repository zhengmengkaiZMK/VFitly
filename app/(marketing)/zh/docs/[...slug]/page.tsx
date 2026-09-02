import { compileMDX } from 'next-mdx-remote/rsc'
import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { Background } from "@/components/background"
import { Container } from "@/components/container"
import { mdxComponents } from '@/mdx-components'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { JsonLd } from '@/components/seo/json-ld'
import { absoluteUrl } from '@/lib/seo'

interface DocPageProps {
  params: Promise<{
    slug: string[]
  }>
}

// 允许动态参数
export const dynamicParams = true

// 生成静态参数
export async function generateStaticParams() {
  const docsDirectory = path.join(process.cwd(), 'content/docs/zh')
  
  if (!fs.existsSync(docsDirectory)) {
    return []
  }
  
  function getAllDocs(dir: string, basePath: string = ''): string[][] {
    const items = fs.readdirSync(dir)
    let docs: string[][] = []

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        docs = docs.concat(getAllDocs(fullPath, path.join(basePath, item)))
      } else if (item.endsWith('.mdx') && !item.startsWith('meta')) {
        const slug = path.join(basePath, item.replace('.mdx', ''))
        docs.push(slug.split(path.sep))
      }
    }

    return docs
  }

  return getAllDocs(docsDirectory)
}

export async function generateMetadata(props: DocPageProps) {
  const params = await props.params
  const slug = params.slug.join('/')
  const filePath = path.join(process.cwd(), 'content/docs/zh', `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    return {
      title: '未找到'
    }
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { frontmatter } = await compileMDX({
    source: fileContent,
    options: {
      parseFrontmatter: true,
    },
  })

  return {
    title: (frontmatter as any).title || '文档',
    description: (frontmatter as any).description || '',
  }
}

export default async function ZhDocPage(props: DocPageProps) {
  const params = await props.params
  const slug = params.slug.join('/')
  
  // 尝试多个可能的文件路径
  const possiblePaths = [
    path.join(process.cwd(), 'content/docs/zh', `${slug}.mdx`),
    path.join(process.cwd(), 'content/docs/zh', slug, 'index.mdx'),
    path.join(process.cwd(), 'content/docs/zh', '(root)', `${slug}.mdx`),
  ]

  let filePath = ''
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p
      break
    }
  }

  if (!filePath) {
    notFound()
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  
  const { content, frontmatter } = await compileMDX({
    source: fileContent,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: 'github-dark',
              keepBackground: false,
            },
          ],
        ],
      },
    },
    components: {
      ...mdxComponents,
      Steps: ({ ...props }) => (
        <div className="[&>h3]:step steps mb-12 ml-4 border-l pl-6 [counter-reset:step]" {...props} />
      ),
      Step: ({ className, ...props }: any) => (
        <h3
          className={`
            before:bg-border before:text-foreground mb-8 mt-0 scroll-m-20 text-base font-semibold tracking-tight
            before:absolute before:-ml-[1.625rem] before:flex before:size-[1.25rem] before:items-center
            before:justify-center before:rounded-full before:text-center before:text-[0.625rem] before:font-mono
            before:font-medium before:[content:counter(step)] [counter-increment:step]
            ${className || ''}
          `}
          {...props}
        />
      ),
      Callout: ({ children, type = 'info', ...props }: any) => (
        <div
          className={`my-6 flex items-start gap-3 rounded-lg border p-4 ${
            type === 'warning'
              ? 'border-yellow-500/50 bg-yellow-500/10'
              : type === 'error'
              ? 'border-red-500/50 bg-red-500/10'
              : 'border-blue-500/50 bg-blue-500/10'
          }`}
          {...props}
        >
          <div className="flex-1">{children}</div>
        </div>
      ),
    },
  })

  const meta = frontmatter as any

  const docJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: meta.title,
    description: meta.description || 'VFitly 中文文档，涵盖 AI 虚拟试衣和虚拟衣橱工作流。',
    url: absoluteUrl(`/zh/docs/${slug}`),
    inLanguage: 'zh-CN',
    publisher: {
      "@type": "Organization",
      name: "VFitly",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl('/icon.png'),
      },
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首页",
        item: absoluteUrl('/'),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "中文文档",
        item: absoluteUrl('/zh/docs'),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.title,
        item: absoluteUrl(`/zh/docs/${slug}`),
      },
    ],
  }

  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <JsonLd data={[docJsonLd, breadcrumbJsonLd]} />
      <Background />
      <Container className="pb-20">
        <article className="relative z-20 mx-auto max-w-4xl py-10 md:pt-40">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
              {meta.title}
            </h1>
            {meta.description && (
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                {meta.description}
              </p>
            )}
          </div>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {content}
          </div>
        </article>
      </Container>
    </div>
  )
}
