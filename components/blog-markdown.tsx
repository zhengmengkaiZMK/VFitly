import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { IMAGE_ALT_TEXT } from "@/lib/seo";

export function BlogMarkdown({ content }: { content: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{
    // eslint-disable-next-line @next/next/no-img-element
    img: ({ node, ...props }) => <img {...props} alt={IMAGE_ALT_TEXT} />,
    a: ({ href, children }) => href?.startsWith("/") && !href.startsWith("//")
      ? <Link href={href}>{children}</Link>
      : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
  }}>{content}</ReactMarkdown>;
}
