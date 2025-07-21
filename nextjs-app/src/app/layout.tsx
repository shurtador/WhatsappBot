import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ChakraProvider } from "@/components/ChakraProvider";
import { AuthProviderWrapper } from "@/components/AuthProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhatsApp Bridge & Business Intelligence",
  description: "Comprehensive WhatsApp integration system with business intelligence capabilities",
  keywords: ["WhatsApp", "Business Intelligence", "Analytics", "Message Summarization"],
  authors: [{ name: "WhatsApp Bridge Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "WhatsApp Bridge & Business Intelligence",
    description: "Comprehensive WhatsApp integration system with business intelligence capabilities",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ChakraProvider>
          <AuthProviderWrapper>
            {children}
          </AuthProviderWrapper>
        </ChakraProvider>
      </body>
    </html>
  );
}
