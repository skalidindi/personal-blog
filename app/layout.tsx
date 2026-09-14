import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { type ReactNode, ViewTransition } from "react";

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
      >
        <body
          className={`${robotoSans.variable} ${robotoMono.variable} bg-background text-foreground min-w-80 font-sans antialiased`}
        >
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ViewTransition>
  );
}
