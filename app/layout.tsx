import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dropshipping 2.6",
  description: "Verze 2.6 – upload a optimalizace obrázků, admin a výpis produktů",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <div className="container p-6">{children}</div>
      </body>
    </html>
  );
}
