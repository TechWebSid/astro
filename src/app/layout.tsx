import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Astro Aashutosh Divyadarshi - Vedic Astrology, Free Kundli & Panchang",
  description: "Consult India's top verified astrologers online at Astro Aashutosh Divyadarshi. Get free Vedic Janam Kundli, Kundli matching, horoscope, daily panchang, and dosha analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fcfaff] flex flex-col text-gray-900 antialiased selection:bg-violet-200 selection:text-violet-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
