"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale, useI18n } from "@/lib/i18n";
import { ConnectionIndicator } from "./ConnectionIndicator";
import { LLMConnectionIndicator } from "./LLMConnectionIndicator";
import { UserMenu } from "./auth/UserMenu";
import { CalendarDays, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export const Navigation: React.FC = () => {
  return (
    <Suspense fallback={<div className="h-16 border-b border-gray-200 bg-white" />}>
      <NavigationContent />
    </Suspense>
  );
};

const NavigationContent: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale, setLocale, t } = useI18n();

  const view = searchParams.get('view') || 'generations';

  const setView = (newView: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    router.push(`?${params.toString()}`);
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 relative">
          <div className="flex flex-col justify-center">
            <Link
              href="/"
              className="text-xl font-bold text-brand-dark hover:text-brand-red transition-colors leading-none tracking-tight"
            >
              {t("medical.app.title")}
            </Link>
            <span className="text-[10px] text-gray-500 font-medium mt-0.5 leading-none">
              {t("medical.app.subtitle")}
            </span>
          </div>

          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center bg-gray-100 p-1 rounded-lg gap-1">
            <button
              onClick={() => setView('generations')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'generations'
                ? "bg-white text-brand-red shadow-sm"
                : "text-gray-600 hover:text-brand-dark hover:bg-gray-200"
                }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t("sidebar.generations")}</span>
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'calendar'
                ? "bg-white text-brand-red shadow-sm"
                : "text-gray-600 hover:text-brand-dark hover:bg-gray-200"
                }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>{t("health.calendar.title")}</span>
            </button>
          </div>

          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <ConnectionIndicator />
              <LLMConnectionIndicator />
              <div className="flex items-center gap-2">
                <label
                  htmlFor="language-select"
                  className="text-sm text-gray-600"
                >
                  {t("nav.language")}
                </label>
                <select
                  id="language-select"
                  value={locale}
                  onChange={(event) => setLocale(event.target.value as Locale)}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                >
                  <option value="en">{t("nav.language.en")}</option>
                  <option value="pt-BR">{t("nav.language.ptBr")}</option>
                </select>
              </div>
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
