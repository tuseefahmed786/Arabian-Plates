import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Arabian Plates | UAE Premium Number Plate Marketplace",
    template: "%s | Arabian Plates",
  },
  description:
    "Discover, buy, and list premium UAE car number plates with trusted sellers, verified listings, and elegant marketplace tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${manrope.variable} ${playfair.variable} antialiased`}>
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
