import { Link } from "next-view-transitions"
import type { Metadata } from "next"
import { Background } from "@/components/background"
import { Container } from "@/components/container"
import { Heading } from "@/components/heading"
import { Subheading } from "@/components/subheading"

export const metadata: Metadata = {
  title: "VFitly Documentation for AI Try-On and Wardrobe Workflows",
  description: "Learn to use VFitly AI virtual try-on with step-by-step guides to photo uploads, garment selection, product links, image and video generation, and credits.",
  keywords: [
    "AI virtual try-on","VFitly documentation", "AI try-on docs", "clothes changer tutorial", "wardrobe guide", "virtual fitting room docs"],
  alternates: {
    canonical: "/docs",
  },
}

const docCategories = [
  {
    title: "Start Using VFitly",
    description: "Create your first AI virtual try-on result and understand the workspace.",
    href: "/docs/getting-started",
    items: [
      { title: "Documentation Home", href: "/docs" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Getting Started", href: "/docs/getting-started" },
    ]
  },
  {
    title: "Core Try-On Tools",
    description: "Use AI clothes changer and product-link try-on for shopping and content creation.",
    href: "/docs/ai-clothes-changer",
    items: [
      { title: "AI Clothes Changer", href: "/docs/ai-clothes-changer" },
      { title: "Product Try-On", href: "/docs/product-try-on" },
      { title: "360° Try-On Video", href: "/docs/360-try-on-video" },
    ]
  },
  {
    title: "Manage Assets and Results",
    description: "Organize reusable clothing assets and review generated try-on outputs.",
    href: "/docs/virtual-wardrobe",
    items: [
      { title: "Virtual Wardrobe", href: "/docs/virtual-wardrobe" },
      { title: "History and Results", href: "/docs/history-results" },
      { title: "Credits and Plans", href: "/docs/credits-and-plans" },
    ]
  },
]

export default function DocsPage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <Background />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <Heading as="h1">Documentation</Heading>
          <Subheading className="text-center">
            Everything you need to know about using VFitly for AI virtual try-on,
            product-link try-on, wardrobe management, and 360° try-on videos.
          </Subheading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative z-20">
          {docCategories.map((category) => {
            return (
              <div
                key={category.title}
                className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
                    {category.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {category.description}
                  </p>
                </div>
                
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-2 group/link"
                      >
                        <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 group-hover/link:bg-neutral-900 dark:group-hover/link:bg-neutral-100 transition-colors" />
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}
