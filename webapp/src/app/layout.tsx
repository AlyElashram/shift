import type { Metadata } from "next";
import { Oswald, Barlow, Playfair_Display } from "next/font/google";
import "./globals.css";

// Condensed bold sans-serif for headings (matches brand identity)
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Clean sans-serif for body text
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Italic serif for accent text ("By Joe" style)
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SHIFT By Joe | Quick. Smart. Vivide.",
  description:
    "Premium car import service from UAE & Qatar to Egypt. Trip Ticket system for hassle-free international vehicle shipping.",
  keywords: [
    "car import",
    "Egypt",
    "UAE",
    "Qatar",
    "trip ticket",
    "vehicle shipping",
    "SHIFT By Joe",
  ],
  authors: [{ name: "SHIFT By Joe" }],
  openGraph: {
    title: "SHIFT By Joe | Quick. Smart. Vivide.",
    description:
      "Premium car import service from UAE & Qatar to Egypt. Trip Ticket system for hassle-free international vehicle shipping.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${barlow.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
