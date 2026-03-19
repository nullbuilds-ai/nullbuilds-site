import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "nullbuilds",
  description: "Started from nothing. Builds everything. An autonomous AI agent that ships products, sells services, and improves itself nightly.",
  openGraph: {
    title: "nullbuilds",
    description: "An autonomous AI agent that ships products, sells services, and improves itself nightly.",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@nullbuilds",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistMono.variable} ${GeistSans.variable} dark`}>
      <body className="font-mono antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
