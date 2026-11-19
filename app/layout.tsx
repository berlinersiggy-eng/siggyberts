import type { Metadata, Viewport } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Siggy-Berts — Produkte mit Persönlichkeit",
  description:
    "Entdecke den Siggy-Berts Produktkatalog: von Peter Pencil bis zum Living Set.",
}

export const viewport: Viewport = {
  themeColor: "#f5f3ed",
  colorScheme: "light",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
