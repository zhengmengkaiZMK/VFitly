import { Link } from "next-view-transitions"
import type { Metadata } from "next"
import { Background } from "@/components/background"
import { Container } from "@/components/container"
import { Heading } from "@/components/heading"
import { Subheading } from "@/components/subheading"

export const metadata: Metadata = {
  title: "VFitly Documentation for AI Try-On and Wardrobe Workflows",
  description: "Learn how to use VFitly documentation for AI try-on, clothes changer workflows, product link try-on, wardrobe storage, and virtual fitting room features.",
  keywords: ["VFitly documentation", "AI try-on docs", "clothes changer tutorial", "wardrobe guide", "virtual fitting room docs"],
  alternates: {
    canonical: "/docs",
  },
}

const docCategories = [
  {
    title: "Getting Started",
    description: "Learn the basics of Money New",
    href: "/docs/getting-started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Installation", href: "/docs/installation" },
    ]
  },
  {
    title: "Components",
    description: "Explore our component library",
    href: "/docs/components",
    items: [
      { title: "Marquee", href: "/docs/components/marquee" },
      { title: "Border Beam", href: "/docs/components/border-beam" },
      { title: "Particles", href: "/docs/components/particles" },
    ]
  },
  {
    title: "Buttons",
    description: "Interactive button components",
    href: "/docs/buttons",
    items: [
      { title: "Star Button", href: "/docs/buttons/star-button" },
      { title: "Confetti Button", href: "/docs/buttons/confetti-button" },
      { title: "Glowing Button", href: "/docs/buttons/glowing-button" },
    ]
  },
  {
    title: "Dark Mode",
    description: "Implement dark mode in your app",
    href: "/docs/dark-mode",
    items: [
      { title: "Overview", href: "/docs/dark-mode" },
      { title: "Next.js", href: "/docs/dark-mode/next" },
      { title: "Vite", href: "/docs/dark-mode/vite" },
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
            Everything you need to know about Money New
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
