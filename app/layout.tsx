import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";
import { ThemeProvider } from "@/context/theme-provider";
import { SessionProvider } from "@/components/session-provider";
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
            <SessionProvider>{children}</SessionProvider>
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
