import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import Script from "next/script";
import { type ReactNode, ViewTransition } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { siteConfig } from "@/util/site";

import "./globals.css";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const themeInitializer = `
  try {
    const savedTheme = localStorage.getItem("theme");
    const dark = savedTheme === "dark" ||
      (savedTheme === null && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch {}
`;

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [siteConfig.author],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ViewTransition>
      <html
        className="scroll-smooth motion-reduce:scroll-auto"
        data-scroll-behavior="smooth"
        lang="en"
        suppressHydrationWarning
      >
        <body
          className={`${robotoSans.variable} ${robotoMono.variable} bg-background text-foreground min-w-80 font-sans antialiased`}
        >
          <Script id="theme-initializer" strategy="beforeInteractive">
            {themeInitializer}
          </Script>
          <ThemeToggle />
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ViewTransition>
  );
}
