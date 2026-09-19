import type { Metadata, Viewport } from "next";
import { AppShell } from "@/src/components/AppShell";
import { EmotionRegistry } from "@/src/context/EmotionRegistry";
import { LedgerProvider } from "@/src/context/Ledger";
import { ServiceWorker } from "@/src/components/ServiceWorker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hokka",
  description: "HST and income-tax tracking for a single Ontario sole proprietor.",
  manifest: "/manifest.webmanifest",
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
          <LedgerProvider>
            <AppShell>{children}</AppShell>
            <ServiceWorker />
          </LedgerProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
