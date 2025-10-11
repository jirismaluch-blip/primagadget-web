import "./globals.css";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Dropshipping 2.6.1 – Dark",
  description: "ROZJETÍ DROPSHIPPING – verze 2.6.1 dark + blue accent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className="transition-colors">
      <body>
        <div className="container p-6">{children}</div>
        <ThemeToggle />
      </body>
    </html>
  );
}
