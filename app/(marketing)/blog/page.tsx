import { type Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog-utils";
import { Background } from "@/components/background";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { BlogCard } from "@/components/blog-card";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Try-On Blog for Clothes Changer and Virtual Wardrobe Tips",
  description:
    "Read VFitly guides about AI try-on, clothes changer workflows, virtual wardrobe organization, product try-on, and fashion image generation.",
  keywords: ["AI try-on blog", "clothes changer guide", "virtual wardrobe tips", "product try-on guide", "fashion AI blog"],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "AI Try-On Blog for Clothes Changer and Virtual Wardrobe Tips | VFitly",
    description:
      "Explore VFitly articles about virtual try-on, clothes changer AI, wardrobe assets, and fashion generation workflows.",
    images: [DEFAULT_OG_IMAGE],
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
            Practical guides for AI clothes changing, product-link try-on,
            virtual wardrobes, and 360° try-on videos with VFitly.
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
