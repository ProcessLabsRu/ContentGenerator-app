import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/components/auth/AuthProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Wellmaker | ContentPlan Generator",
  description: "Planejamento inteligente para profissionais de saúde no Instagram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans h-screen flex flex-col overflow-hidden antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            <Navigation />
            <main className="flex-1 min-h-0 bg-gray-50 shadow-inner overflow-hidden">
              {children}
            </main>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
