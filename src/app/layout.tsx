import type { Metadata, Viewport } from "next";
import { AppShell } from "@/src/components/AppShell";
import { LockGate } from "@/src/components/LockGate";
import { EmotionRegistry } from "@/src/context/EmotionRegistry";
import { LedgerProvider } from "@/src/context/Ledger";
import { ServiceWorker } from "@/src/components/ServiceWorker";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hokka",
  applicationName: "Hokka",
  description: "HST and income-tax tracking for a single Ontario sole proprietor.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/logo/favicon.svg", type: "image/svg+xml" },
      { url: "/logo/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/logo/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  appleWebApp: { capable: true, title: "Hokka", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <EmotionRegistry>
          <LockGate>
            <LedgerProvider>
              <AppShell>{children}</AppShell>
            </LedgerProvider>
          </LockGate>
          <ServiceWorker />
        </EmotionRegistry>
      </body>
    </html>
  );
}
