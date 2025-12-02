import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AudioProvider } from "./contexts/audio-context";
import { AuthProvider } from "./contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatia NanoBanana - Zombie Survival Game",
  description: "Interactive zombie survival game with AI-generated narrative and pixel art",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        <AuthProvider>
          <AudioProvider>
            {children}
            <Toaster />
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
