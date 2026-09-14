import * as React from "react"
import Image from "next/image"
import { Link } from "next-view-transitions"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"
import fs from "fs"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/mdx-components"

import { getPublishedBlogPosts } from "@/lib/blog-posts";
import { BlogMarkdown } from "@/components/blog-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BlogCard } from "@/components/blog-card"
import { JsonLd } from "@/components/seo/json-ld"
import { absoluteUrl } from "@/lib/seo"

export const revalidate = 60
export const dynamic = "force-dynamic"
export const dynamicParams = true


export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const posts = await getPublishedBlogPosts()
  const post = posts.find(p => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  return {
    title: post.title,
    description: `${post.description} Explore AI virtual try-on ideas, generate try-on images and try-on videos, and plan your wardrobe with VFitly.`,
    keywords: ["AI virtual try-on", "generate try-on image", "generate try-on video", post.category, ...(post.tags || [])],
    openGraph: {
      title: post.title,
      description: `${post.description} Explore AI virtual try-on ideas, generate try-on images and try-on videos, and plan your wardrobe with VFitly.`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: "VFitly，AI virtual try-on，generate try-on image and try-on video",
        },
      ],
    },
  }
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const posts = await getPublishedBlogPosts()
  const post = posts.find(p => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  const filePath = path.join(process.cwd(), "content", "blog", `${params.slug}.mdx`)
  const isDatabasePost = Boolean(post.content)
  let content: React.ReactNode

  if (isDatabasePost) {
    content = <BlogMarkdown content={post.content!} />
  } else {
    const fileContent = fs.readFileSync(filePath, "utf-8")
    const compiled = await compileMDX({
      source: fileContent,
      options: { parseFrontmatter: true },
      components: {
        ...mdxComponents,
        Steps: ({ ...props }) => <div className="[&>h3]:step steps mb-12 [counter-reset:step] *:[h3]:first:!mt-0" {...props} />,
        Step: ({ className, ...props }: React.ComponentProps<"h3">) => <h3 className={`mt-6 scroll-m-28 text-xl font-medium tracking-tight ${className || ''}`} {...props} />,
        Callout: ({ className, children, ...props }: React.ComponentProps<"div">) => <div className={`my-6 flex items-start rounded-md border border-l-4 p-4 ${className || ''}`} {...props}><div>{children}</div></div>,
      },
    })
    content = compiled.content
  }
  
  const relatedPosts = posts
    .filter(item => item.slug !== params.slug)
    .sort((a, b) => (a.category === post.category ? -1 : 1) - (b.category === post.category ? -1 : 1))
    .slice(0, 3)

  // 格式化日期
  const formattedDate = new Date(post.date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.image),
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "VFitly",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.png"),
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: [
    "AI virtual try-on",post.category, ...(post.tags || [])].join(", "),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: absoluteUrl(`/blog/${post.slug}`),
      },
    ],
  }

  return (
    <div className="container max-w-7xl mx-auto px-6">
      <JsonLd data={[articleJsonLd, breadcrumbJsonLd]} />
      <div className="mx-auto max-w-3xl py-8 lg:py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="-ml-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/blog">
              <ArrowLeft className="mr-2 size-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <h1 className="scroll-m-20 text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            {post.title}
          </h1>

          {/* Description */}
          {post.description && (
            <p className="text-muted-foreground text-lg leading-relaxed lg:text-xl">
              {post.description}
            </p>
          )}

          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={post.author.avatar}  alt="VFitly，AI virtual try-on，generate try-on image and try-on video" />
              <AvatarFallback>
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight">
                {post.author.name}
              </span>
              <div className="text-muted-foreground flex items-center gap-1.5 text-sm leading-tight">
                <span>{formattedDate}</span>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="my-12">
          <Image
            src={post.image}
            
            width={1200}
            height={630}
            className="rounded-xl"
            priority alt="VFitly，AI virtual try-on，generate try-on image and try-on video"
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-neutral dark:prose-invert prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-3xl prose-h3:mt-8 prose-h3:text-2xl prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-pre:bg-muted prose-pre:border prose-img:rounded-xl">
          {content}
        </article>

        {/* Author Card */}
        <Separator className="my-12" />
        <div className="bg-muted/50 flex items-start gap-4 rounded-xl border p-6">
          <Avatar className="size-16 flex-shrink-0">
            <AvatarImage src={post.author.avatar}  alt="VFitly，AI virtual try-on，generate try-on image and try-on video" />
            <AvatarFallback>
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Written by
              </span>
              <span className="font-semibold leading-tight">
                {post.author.name}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A passionate writer sharing insights about {post.category.toLowerCase()} and helping others grow in their
              journey.
            </p>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <>
            <Separator className="my-12" />
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full px-3 py-1 text-sm font-medium transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="border-t py-16 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 flex flex-col gap-3">
              <h2 className="text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
                Related articles
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Continue your reading journey with these hand-picked articles.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => {
                const blogWithSlug = {
                  ...relatedPost,
                  slug: relatedPost.slug,
                  author: {
                    name: relatedPost.author.name,
                    src: relatedPost.author.avatar,
                  }
                }
                return (
                  <BlogCard
                    key={relatedPost.slug}
                    blog={blogWithSlug}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
