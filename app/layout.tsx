import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "ContentPlan Generator",
  description: "Generate content plans for your marketing needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <LanguageProvider>
            <Navigation />
            <main className="min-h-screen bg-gray-50">{children}</main>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
