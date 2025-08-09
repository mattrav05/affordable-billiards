import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Affordable Billiards - Family Pool Table Business Michigan | 20+ Years Experience",
  description: "Family-owned Michigan pool table company with 20+ years experience. Professional moving, installation, repair & quality used table sales. Serving Detroit, Grand Rapids, Ann Arbor & all Michigan communities.",
  keywords: "family pool table business Michigan, pool table services Michigan, used pool tables Michigan, pool table moving Michigan, billiards installation Michigan, Detroit pool tables, Grand Rapids pool table company, Michigan billiards family business, 20 years pool table experience",
  openGraph: {
    title: "Affordable Billiards - Michigan's Trusted Family Pool Table Business",
    description: "Family-owned pool table company serving Michigan for 20+ years. Professional services, quality used tables, and customer satisfaction guaranteed.",
    url: "https://affordablebilliards.com",
    siteName: "Affordable Billiards",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Affordable Billiards - Michigan Pool Table Services"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Affordable Billiards - Michigan's Family Pool Table Business",
    description: "20+ years serving Michigan families with professional pool table services.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code-here",
  },
  alternates: {
    canonical: "https://affordablebilliards.com",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
