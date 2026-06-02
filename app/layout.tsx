import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const editorial = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-editorial",
  weight: ["400", "500", "600"]
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"]
});

const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  title: "Saakshi Sunil | Fashion Portfolio",
  description:
    "A luxury editorial archive for Saakshi Sunil, fashion designer, visual storyteller, and art director.",
  openGraph: {
    title: "Saakshi Sunil | Fashion Portfolio",
    description:
      "An experimental fashion archive between editorial publication and digital art direction.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${editorial.variable} ${sans.variable} ${display.variable}`}>{children}</body>
    </html>
  );
}
