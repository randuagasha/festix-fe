import type { Metadata } from "next"
import { Inter, Sora } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Tixora",
  description: "Ticketing platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}