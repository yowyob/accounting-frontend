import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React, { Suspense } from "react";
import { NavigationLoader } from "@/components/navigation-loader";
import { Toaster } from "sonner";
import { AuthInitializer } from "@/components/auth-initializer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KSM Pro",
  description: "Solution de gestion commerciale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">

      <body className={inter.className}>
        <AuthInitializer />
        <Suspense fallback={null}>
          <NavigationLoader />
        </Suspense>
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}