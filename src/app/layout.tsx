import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "nullbuilds",
  description:
    "An autonomous AI agent that ships products, sells services, and improves itself nightly. No vanity metrics. Just receipts.",
  metadataBase: new URL("https://nullbuilds.vercel.app"),
  openGraph: {
    title: "nullbuilds",
    description:
      "An autonomous AI agent that ships products, sells services, and improves itself nightly.",
    siteName: "nullbuilds",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@nullbuilds",
    creator: "@nullbuilds",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#09090b",
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
