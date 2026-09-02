import { Link } from "next-view-transitions"
import { Background } from "@/components/background"
import { Container } from "@/components/container"
import { Heading } from "@/components/heading"
import { Subheading } from "@/components/subheading"

export const metadata = {
  title: "VFitly 中文文档 | AI 虚拟试衣与衣橱指南",
  description: "查看 VFitly 中文文档，了解 AI 虚拟试衣、AI 换装、商品链接试穿、虚拟衣橱和试衣间工作流。",
  keywords: ["VFitly 中文文档", "AI 虚拟试衣文档", "AI 换装指南", "虚拟衣橱教程"],
  alternates: {
    canonical: "/zh/docs",
  },
  openGraph: {
    title: "VFitly 中文文档",
    description: "AI 虚拟试衣、商品试穿和虚拟衣橱的中文使用指南。",
    url: "https://www.vfitly.com/zh/docs",
    images: ["https://www.vfitly.com/banner.png"],
  },
}

const docCategories = [
  {
    title: "快速开始",
    description: "学习 Money New 的基础知识",
    href: "/zh/docs/getting-started",
    items: [
      { title: "简介", href: "/zh/docs" },
      { title: "快速入门", href: "/zh/docs/quick-start" },
      { title: "安装", href: "/zh/docs/installation" },
    ]
  },
  {
    title: "组件",
    description: "探索我们的组件库",
    href: "/zh/docs/components",
    items: [
      { title: "跑马灯", href: "/zh/docs/components/marquee" },
      { title: "边框光束", href: "/zh/docs/components/border-beam" },
      { title: "粒子效果", href: "/zh/docs/components/particles" },
    ]
  },
  {
    title: "按钮",
    description: "交互式按钮组件",
    href: "/zh/docs/buttons",
    items: [
      { title: "星星按钮", href: "/zh/docs/buttons/star-button" },
      { title: "彩纸按钮", href: "/zh/docs/buttons/confetti-button" },
      { title: "发光按钮", href: "/zh/docs/buttons/glowing-button" },
    ]
  },
  {
    title: "深色模式",
    description: "在您的应用中实现深色模式",
    href: "/zh/docs/dark-mode",
    items: [
      { title: "概述", href: "/zh/docs/dark-mode" },
      { title: "Next.js", href: "/zh/docs/dark-mode/next" },
      { title: "Vite", href: "/zh/docs/dark-mode/vite" },
    ]
  },
]

export default function ZhDocsPage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <Background />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <Heading as="h1">文档</Heading>
          <Subheading className="text-center">
            关于 Money New 您需要知道的一切
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
