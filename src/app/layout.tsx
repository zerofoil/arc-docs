import { Inter } from "next/font/google";
import "./global.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import {
  appDescription,
  appIcon,
  appName,
  appUri,
  appBanner,
} from "@/lib/shared";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(appUri),
  title: {
    template: `%s | ${appName}`,
    default: `${appName} Documentation`,
  },
  description: appDescription,
  icons: {
    icon: appIcon,
  },
  openGraph: {
    description: appDescription,
    images: appBanner,
  },
  twitter: {
    card: "summary_large_image",
    description: appDescription,
    images: appBanner,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#192d46",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  );
}
