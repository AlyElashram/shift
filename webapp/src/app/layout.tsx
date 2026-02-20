import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Obviously font - Brand identity font
const obviously = localFont({
  src: [
    {
      path: "../fonts/ObviouslyDemo-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ObviouslyDemo-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/ObviouslyDemo-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/ObviouslyDemo-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/ObviouslyDemo-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/ObviouslyDemo-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/ObviouslyDemo-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-obviously",
  display: "swap",
});

// Obviously Wide - For hero/display headings with more impact
const obviouslyWide = localFont({
  src: [
    {
      path: "../fonts/ObviouslyDemo-WideBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/ObviouslyDemo-WideBlack.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-obviously-wide",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SHIFT By Joe",
  description:
    "Premium car import service from UAE to Egypt. Trip Ticket system for hassle-free international vehicle shipping.",
  keywords: [
    "car import",
    "Egypt",
    "UAE",
    "trip ticket",
    "vehicle shipping",
    "SHIFT By Joe",
  ],
  authors: [{ name: "SHIFT By Joe" }],
  openGraph: {
    title: "SHIFT By Joe",
    description:
      "Premium car import service from UAE to Egypt. Trip Ticket system for hassle-free international vehicle shipping.",
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
        className={`${obviously.variable} ${obviouslyWide.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
