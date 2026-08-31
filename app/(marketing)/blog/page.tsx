import { type Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog-utils";
import { Background } from "@/components/background";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { BlogCard } from "@/components/blog-card";

export const metadata: Metadata = {
  title: "Blogs - VFitly",
  description:
    "VFitly, short for Virtual Fitly, is an AI virtual try-on platform that helps users preview outfits, manage wardrobe items, and create realistic fashion visuals before buying or sharing a look.",
  openGraph: {
    images: ["https://www.vfitly.com/banner.png"],
  },
};

export default async function ArticlesIndex() {
  const blogPosts = getAllBlogPosts();
  
  // Convert to old blog format with correct author structure
  const blogs = blogPosts.map(post => ({
    title: post.title,
    description: post.description,
    date: post.date,
    image: post.image,
    slug: post.slug,
    author: {
      name: post.author.name,
      src: post.author.avatar,
    },
  }));

  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <Background />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <Heading as="h1">Blog</Heading>
          <Subheading className="text-center">
            Discover insightful resources and expert advice from our seasoned
            team to elevate your knowledge.
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
