import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";
import { ThemeProvider } from "@/context/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { FeedbackProvider } from "@/components/feedback-provider";
import { Analytics } from "@vercel/analytics/next";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, jsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VFitly | AI Clothes Changer and Virtual Try-On Wardrobe",
    template: "%s | VFitly",
  },
  description:
    "Use VFitly AI virtual try-on to preview clothes from your photos, generate outfit images and try-on videos, and organize garments in a virtual wardrobe.",
  keywords: [
    "VFitly",
    "AI virtual try-on",
    "generate try-on image",
    "generate try-on video",
    "try on",
    "clothes changer",
    "clothes changer ai",
    "clothes changer ai free",
    "wardrobe",
    "virtual try on",
    "AI outfit generator",
  ],
  // 不在此处声明 canonical：根布局的 metadata 会被所有未自行声明的子路由继承，
  // 曾导致博客正文等页面误把首页当作规范页，被 Google 归入「备用网页」而不收录。
  // 各页面需在自身 metadata 中声明 alternates.canonical。
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "VFitly | AI Clothes Changer and Virtual Try-On Wardrobe",
    description:
      "Use VFitly AI virtual try-on to preview clothes from your photos, generate outfit images and try-on videos, and organize garments in a virtual wardrobe.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 3272,
        height: 1898,
        alt: "VFitly AI virtual try-on: preview clothes from your own photo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VFitly | AI Clothes Changer and Virtual Try-On Wardrobe",
    description:
      "Use VFitly AI virtual try-on to preview clothes from your photos, generate outfit images and try-on videos, and organize garments in a virtual wardrobe.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: "VFitly AI virtual try-on: preview clothes from your own photo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-SXB8ZF6TPC" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-SXB8ZF6TPC');
              `,
            }}
          />
          <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd([organizationJsonLd, websiteJsonLd])} />
          <meta name="theme-color" content="#ffffff" />
        </head>
        <body
          className={cn(
            GeistSans.className,
            "bg-white dark:bg-black antialiased h-full w-full"
          )}
        >
          <ThemeProvider
            attribute="class"
            enableSystem
            disableTransitionOnChange
            defaultTheme="light"
          >
            <SessionProvider><FeedbackProvider>{children}</FeedbackProvider></SessionProvider>
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
