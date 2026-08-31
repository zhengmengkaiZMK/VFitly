import { Container } from "@/components/container";
import { Background } from "@/components/background";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { BlogCard } from "@/components/blog-card";
import { Metadata } from "next";
import { getAllZhBlogPosts } from "@/lib/blog-utils-zh";

export const metadata: Metadata = {
  title: "博客 - VFitly",
  description:
    "VFitly 寓意 Virtual Fitly，是一个 AI 虚拟试衣平台，帮助用户预览穿搭效果、管理衣橱单品，并在购买或分享前生成真实自然的时尚视觉内容。",
  openGraph: {
    images: ["https://www.vfitly.com/banner.png"],
  },
};

export default async function ZhBlogPage() {
  const blogPosts = getAllZhBlogPosts();
  
  // Convert to old blog format with correct author structure
  const blogs = blogPosts.map(post => ({
    title: post.title,
    description: post.description,
    date: post.date,
    image: post.image,
    slug: `zh/${post.slug}`,
    author: {
      name: post.author.name,
      src: post.author.avatar,
    },
  }));

  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <Background />
      <Container className="flex flex-col items-center justify-between  pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <Heading as="h1">博客</Heading>
          <Subheading className="text-center">
            阅读我们的最新文章，了解 AI 领域的最新动态和见解。
          </Subheading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-20 w-full mb-10">
          {blogs.slice(0, 2).map((blog, index) => (
            <BlogCard blog={blog} key={blog.title + index} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full relative z-20">
          {blogs.slice(2).map((blog, index) => (
            <BlogCard blog={blog} key={blog.title + index} />
          ))}
        </div>
      </Container>
    </div>
  );
}
