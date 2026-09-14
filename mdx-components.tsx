import * as React from "react"
import Image from "next/image"
import { Link } from "next-view-transitions"
import { type MDXComponents } from "mdx/types"

import { cn } from "@/lib/utils"
import { IMAGE_ALT_TEXT } from "@/lib/seo"

export const mdxComponents: MDXComponents = {
  h1: ({ className, ...props }: React.ComponentProps<"h1">) => (
    <h1
      className={cn(
        "mt-2 scroll-m-28 text-3xl font-bold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.ComponentProps<"h2">) => {
    return (
      <h2
        id={props.children
          ?.toString()
          .replace(/ /g, "-")
          .replace(/'/g, "")
          .replace(/\?/g, "")
          .toLowerCase()}
        className={cn(
          "border-border mt-12 scroll-m-28 border-b pb-2.5 text-2xl font-medium tracking-tight first:mt-0 lg:mt-20 [&+p]:!mt-4",
          className
        )}
        {...props}
      />
    )
  },
  h3: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-8 scroll-m-28 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.ComponentProps<"h4">) => (
    <h4
      className={cn(
        "mt-8 scroll-m-28 text-lg font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.ComponentProps<"h5">) => (
    <h5
      className={cn(
        "mt-8 scroll-m-28 text-lg font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.ComponentProps<"h6">) => (
    <h6
      className={cn(
        "mt-8 scroll-m-28 text-base font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.ComponentProps<"a">) => (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p
      className={cn(
        "text-muted-foreground leading-relaxed [&:not(:first-child)]:mt-4",
        className
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-medium", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.ComponentProps<"li">) => (
    <li className={cn("text-muted-foreground mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md", className)}  {...props} alt={IMAGE_ALT_TEXT} />
  ),
  hr: ({ ...props }: React.ComponentProps<"hr">) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.ComponentProps<"table">) => (
    <div className="my-6 w-full overflow-y-auto">
      <table
        className={cn(
          "relative w-full overflow-hidden border-none text-sm",
          className
        )}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn(
        "last:border-b-none even:bg-sidebar m-0 border-b",
        className
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.ComponentProps<"pre">) => (
    <pre
      className={cn(
        "mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4 px-4",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.ComponentProps<"code">) => {
    // Inline code
    if (typeof props.children === "string") {
      return (
        <code
          className={cn(
            "relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm",
            className
          )}
          {...props}
        />
      )
    }

    // Code block
    return (
      <code
        className={cn("font-mono text-sm", className)}
        {...props}
      />
    )
  },
  Image: ({
    src,
    className,
    width,
    height,
    alt,
    ...props
  }: React.ComponentProps<"img">) => (
    <Image
      className={cn("mt-6 rounded-md border", className)}
      src={src as string}
      width={Number(width)}
      height={Number(height)}
      
      {...props} alt={IMAGE_ALT_TEXT}
    />
  ),
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  Callout: ({ className, children, ...props }: React.ComponentProps<"div">) => (
    <div
      className={cn(
        "my-6 flex items-start rounded-md border border-l-4 p-4",
        className
      )}
      {...props}
    >
      <div>{children}</div>
    </div>
  ),
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-6 scroll-m-28 text-xl font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  Steps: ({ ...props }) => (
    <div
      className="[&>h3]:step steps mb-12 [counter-reset:step] *:[h3]:first:!mt-0"
      {...props}
    />
  ),
  ComponentPreview: ({ name, description, className, children, ...props }: any) => (
    <div className={cn("my-6 rounded-lg border p-6", className)} {...props}>
      {description && (
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
      )}
      <div className="preview">{children}</div>
    </div>
  ),
  CodeTabs: ({ children, ...props }: any) => (
    <div className="my-6" {...props}>
      {children}
    </div>
  ),
  TabsList: ({ children, ...props }: any) => (
    <div className="flex gap-2 border-b mb-4" {...props}>
      {children}
    </div>
  ),
  TabsTrigger: ({ value, children, ...props }: any) => (
    <button
      className="px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-neutral-400 dark:hover:border-neutral-600"
      {...props}
    >
      {children}
    </button>
  ),
  TabsContent: ({ value, children, ...props }: any) => (
    <div {...props}>
      {children}
    </div>
  ),
  ComponentSource: ({ name, ...props }: any) => (
    <div className="my-4 text-sm text-neutral-600 dark:text-neutral-400" {...props}>
      Component: {name}
    </div>
  ),
  File: ({ name, children, ...props }: any) => (
    <div className="my-2" {...props}>
      <div className="text-sm font-medium mb-2">{name}</div>
      <div>{children}</div>
    </div>
  ),
  Folder: ({ name, defaultOpen, children, ...props }: any) => (
    <details open={defaultOpen} className="my-2" {...props}>
      <summary className="cursor-pointer text-sm font-medium">{name}</summary>
      <div className="ml-4 mt-2">{children}</div>
    </details>
  ),
  Files: ({ children, ...props }: any) => (
    <div className="my-4 border rounded-lg p-4" {...props}>
      {children}
    </div>
  ),
  TypeTable: ({ type, ...props }: any) => {
    // 如果type不是数组，显示简单的表格
    if (!Array.isArray(type)) {
      return (
        <div className="my-6 overflow-x-auto" {...props}>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Type information not available</p>
        </div>
      )
    }
    
    return (
      <div className="my-6 overflow-x-auto" {...props}>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-800">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Default</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {type.map((item: any, index: number) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2 font-mono text-sm">{item.name}</td>
                <td className="px-4 py-2 font-mono text-sm text-neutral-600 dark:text-neutral-400">
                  {item.type}
                </td>
                <td className="px-4 py-2 font-mono text-sm">{item.default || '-'}</td>
                <td className="px-4 py-2 text-sm">{item.description}</td>
              </tr>
            ))}
          </tbody>
      </table>
    </div>
  )
  },
  LinkedCard: ({ href, children, ...props }: any) => (
    <Link
      href={href}
      className="flex flex-col items-start p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors no-underline"
      {...props}
    >
      {children}
    </Link>
  ),
}

export function useMDXComponents(components: MDXComponents) {
  return {
    ...mdxComponents,
    ...components,
  }
}
