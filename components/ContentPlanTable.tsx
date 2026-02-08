"use client";

import { useState } from "react";
import { ContentPlanItem } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

interface ContentPlanTableProps {
  items: ContentPlanItem[];
  onStatusChange?: (itemId: string, newStatus: ContentPlanItem["status"]) => void;
  onItemClick?: (item: ContentPlanItem) => void;
  visibleColumns?: {
    format?: boolean;
    status?: boolean;
    publishDate?: boolean;
    painPoint?: boolean;
    cta?: boolean;
    contentOutline?: boolean;
  };
}

const statusColors: Record<
  ContentPlanItem["status"],
  { bg: string; text: string }
> = {
  Rascunho: { bg: "bg-gray-100", text: "text-gray-600" },
  Aprovado: { bg: "bg-brand-red/10", text: "text-brand-red" },
  Gerado: { bg: "bg-brand-blue/10", text: "text-brand-blue" },
};

const formatBadgeColors: Record<string, { bg: string; text: string }> = {
  "Reels": { bg: "bg-purple-100", text: "text-purple-800" },
  "Carrossel": { bg: "bg-red-100", text: "text-red-800" },
  "Post Estático": { bg: "bg-yellow-100", text: "text-yellow-800" },
  "Stories": { bg: "bg-indigo-100", text: "text-indigo-800" },
  "Live/Collab": { bg: "bg-pink-100", text: "text-pink-800" },
};

const getFormatColors = (format: string) => {
  return (
    formatBadgeColors[format] || { bg: "bg-gray-100", text: "text-gray-800" }
  );
};

export const ContentPlanTable: React.FC<ContentPlanTableProps> = ({
  items,
  onStatusChange,
  onItemClick,
  visibleColumns,
}) => {
  const { t, intlLocale } = useI18n();
  const statusLabelKey = {
    Rascunho: "status.rascunho",
    Aprovado: "status.aprovado",
    Gerado: "status.gerado",
  } as const;
  const formatPublishDate = (value?: string | null) => {
    if (!value) return "—";
    const core = value.slice(0, 10);
    let date: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(core)) {
      const [year, month, day] = core.split("-").map(Number);
      date = new Date(year, month - 1, day);
    } else {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return "—";
      date = parsed;
    }
    return new Intl.DateTimeFormat(intlLocale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };
  const showFormat = visibleColumns?.format ?? true;
  const showStatus = visibleColumns?.status ?? true;
  const showPublishDate = visibleColumns?.publishDate ?? true;
  const showPainPoint = visibleColumns?.painPoint ?? false;
  const showCta = visibleColumns?.cta ?? false;
  const showContentOutline = visibleColumns?.contentOutline ?? false;

  const handleStatusToggle = (e: React.MouseEvent, item: ContentPlanItem) => {
    e.stopPropagation();
    if (!onStatusChange) return;

    // Normalize for comparison
    const currentStatus = item.status.toLowerCase();

    // Toggle: if it's rascunho or gerado, approve it. Otherwise, set back to rascunho.
    const newStatus: ContentPlanItem["status"] = (currentStatus === 'rascunho' || currentStatus === 'gerado') ? 'Aprovado' : 'Rascunho';
    onStatusChange(item.id, newStatus);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{t("table.empty.title")}</p>
        <p className="mt-2 text-sm">
          {t("table.empty.subtitle")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
          <tr>
            <th
              scope="col"
              className="sticky top-0 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10"
            >
              {t("table.columns.title")}
            </th>
            {showFormat && (
              <th
                scope="col"
                className="sticky top-0 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10"
              >
                {t("table.columns.format")}
              </th>
            )}
            {showStatus && (
              <th
                scope="col"
                className="sticky top-0 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10"
              >
                {t("table.columns.status")}
              </th>
            )}
            {showPublishDate && (
              <th
                scope="col"
                className="sticky top-0 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10"
              >
                {t("table.columns.publishDate")}
              </th>
            )}
            {showPainPoint && (
              <th
                scope="col"
                className="sticky top-0 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10"
              >
                {t("table.columns.painPoint")}
              </th>
            )}
            {showCta && (
              <th
                scope="col"
                className="sticky top-0 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10"
              >
                {t("table.columns.cta")}
              </th>
            )}
            {showContentOutline && (
              <th
                scope="col"
                className="sticky top-0 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10"
              >
                {t("table.columns.contentOutline")}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => {
            const status = (item.status === "Aprovado" || item.status === "Gerado") ? item.status : "Rascunho";
            const statusColor = statusColors[status];
            const formatColor = getFormatColors(item.format);
            return (
              <tr
                key={item.id}
                className={`hover:bg-gray-50 transition-colors group ${onItemClick ? "cursor-pointer" : ""
                  }`}
                onClick={() => onItemClick?.(item)}
              >
                <td className="px-4 sm:px-6 py-4">
                  <div className="text-sm font-semibold text-brand-dark max-w-xs sm:max-w-none truncate sm:truncate-none group-hover:text-brand-red transition-colors">
                    {item.title}
                  </div>
                </td>
                {showFormat && (
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${formatColor.bg} ${formatColor.text}`}
                    >
                      {item.format}
                    </span>
                  </td>
                )}
                {showStatus && (
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor.bg} ${statusColor.text}`}
                    >
                      {t(statusLabelKey[status])}
                    </span>
                  </td>
                )}
                {showPublishDate && (
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatPublishDate(item.publish_date)}
                  </td>
                )}
                {showPainPoint && (
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 max-w-xs">
                    <div className="truncate" title={item.pain_point}>
                      {item.pain_point || "—"}
                    </div>
                  </td>
                )}
                {showCta && (
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 max-w-xs">
                    <div className="truncate" title={item.cta}>
                      {item.cta || "—"}
                    </div>
                  </td>
                )}
                {showContentOutline && (
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 max-w-xs">
                    <div className="truncate" title={item.content_outline}>
                      {item.content_outline || "—"}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
