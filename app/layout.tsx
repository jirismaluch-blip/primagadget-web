import "./globals.css"
import type { Metadata } from "next"
import { siteConfig } from "@/config/siteConfig"
import ThemeToggle from "@/components/ThemeToggle"
import ChatWidget from "@/components/ChatWidget"

export const metadata: Metadata = {
  title: `${siteConfig.name} – ROZJETÍ DROPSHIPPING v${siteConfig.version}`,
  description: `${siteConfig.name} – moderní AI e-shop. Verze ${siteConfig.version}.`,
  icons: ["/favicon.ico"]
}

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (<html lang="cs" className="transition-colors"><body>
    <header className="container p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="badge">v{siteConfig.version}</span>
          <h1 className="text-xl font-semibold">PRIME GADGET</h1>
        </div>
        <nav className="text-sm text-gray-400 flex gap-6">
          <a href="#">Novinky</a><a href="#">Nejprodávanější</a><a href="#">Kontakt</a>
        </nav>
      </div>
    </header>
    <main className="container p-6">{children}</main>
    <footer className="text-center text-xs text-gray-500 mt-12 mb-6">© {new Date().getFullYear()} {siteConfig.name} · Runout {siteConfig.version}</footer>
    <ThemeToggle/><ChatWidget/>
  </body></html>)
}
