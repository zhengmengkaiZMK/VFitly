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
    "VFitly is an AI try on platform for clothes changer AI, free clothes changer previews, try on glasses, virtual outfits, and wardrobe management.",
  keywords: [
    "VFitly",
    "try on",
    "clothes changer",
    "clothes changer ai",
    "clothes changer ai free",
    "try on glasses",
    "wardrobe",
    "virtual try on",
    "AI outfit generator",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "VFitly | AI Clothes Changer and Virtual Try-On Wardrobe",
    description:
      "Try on clothes, glasses, and outfits with VFitly's AI clothes changer and organize your virtual wardrobe assets online.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VFitly | AI Clothes Changer and Virtual Try-On Wardrobe",
    description:
      "Use VFitly for AI try on, clothes changer AI previews, try on glasses, and wardrobe management.",
    images: [DEFAULT_OG_IMAGE],
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
          <script
            dangerouslySetInnerHTML={{
              __html: `
                var _hmt = window._hmt = window._hmt || [];
                (function() {
                  var hm = document.createElement("script");
                  hm.src = "https://hm.baidu.com/hm.js?f7e5b116350f432cc30a4d0daf35d4ca";
                  var s = document.getElementsByTagName("script")[0];
                  s.parentNode.insertBefore(hm, s);
                })();
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
