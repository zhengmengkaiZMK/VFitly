import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";
import { ThemeProvider } from "@/context/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "VFitly",
  description:
    "VFitly, short for Virtual Fitly, is an AI virtual try-on platform that helps users preview outfits, manage wardrobe items, and create realistic fashion visuals before buying or sharing a look.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    images: ["https://www.vfitly.com/banner.png"],
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
