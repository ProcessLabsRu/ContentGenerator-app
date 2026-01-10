"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              ContentPlan
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Generate Plan
            </Link>
            <Link
              href="/plan"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/plan")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              My Plans
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

