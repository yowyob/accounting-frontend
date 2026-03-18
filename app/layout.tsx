import type { Metadata } from "next";
import React, { Suspense } from "react";
import { NavigationLoader } from "@/components/navigation-loader";
import { Toaster } from "sonner";
import { AuthInitializer } from "@/components/auth-initializer";
import "./globals.css";

// Removed next/font/google due to build-time fetch issues in restricted environments.
// We fallback to a high-quality system font stack.

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
      <body className="antialiased">
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