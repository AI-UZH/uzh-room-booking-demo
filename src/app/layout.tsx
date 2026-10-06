import type { Metadata } from "next";
import { Source_Sans_3, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { DemoOverlays } from "@/components/demo-overlays";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/data/profile";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UZH Rooms | Room Booking Showcase",
  description:
    "A modern, unified room booking experience for the University of Zurich — combining event room discovery, 3D visuals, accessibility information, and one-click booking.",
};

async function isSuperAdminViewer(): Promise<boolean> {
  try {
    const profile = await getCurrentProfile(await createClient());
    return profile?.role === "super_admin";
  } catch {
    return false;
  }
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const isSuperAdmin = await isSuperAdminViewer();
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <DemoOverlays isSuperAdmin={isSuperAdmin} />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
