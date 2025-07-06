import "../styles/globals.css";
import type { Metadata, Viewport } from "next";
import { siteConfig, META_THEME_COLORS } from "@/config/site";

import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url), // Crucial for absolute OG image paths
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "WebGL",
    "Image Processing",
    "AI Art",
    "Depth Map",
    "Interactive Art",
    "React Three Fiber",
    "Next.js",
    "Shader Effects",
    "3D Graphics",
  ],
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.creator.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: `@${siteConfig.links.twitter.split("/").pop()}`,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: META_THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: META_THEME_COLORS.dark },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          <>
            {children}
          </>
        </ThemeProvider>
      </body>
    </html>
  );
}
