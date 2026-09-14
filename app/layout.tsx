import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import * as React from "react";

import "./globals.css";

// @types/react still exposes ViewTransition under its former experimental name.
const { ViewTransition } = React as typeof React & {
  ViewTransition: typeof React.unstable_ViewTransition;
};

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Santosh Kalidindi",
  description: "Personal website of Santosh Kalidindi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransition>
      <html lang="en">
        <body
          className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}
        >
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ViewTransition>
  );
}
