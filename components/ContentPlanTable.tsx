"use client";

import { useState } from "react";
import { ContentPlanItem } from "@/lib/types";

interface ContentPlanTableProps {
  items: ContentPlanItem[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

const statusColors: Record<
  ContentPlanItem["status"],
  { bg: string; text: string }
> = {
  draft: { bg: "bg-gray-100", text: "text-gray-800" },
  selected: { bg: "bg-blue-100", text: "text-blue-800" },
  generated: { bg: "bg-green-100", text: "text-green-800" },
};

const formatBadgeColors: Record<string, { bg: string; text: string }> = {
  "Blog Post": { bg: "bg-purple-100", text: "text-purple-800" },
  Video: { bg: "bg-red-100", text: "text-red-800" },
  Infographic: { bg: "bg-yellow-100", text: "text-yellow-800" },
  "Case Study": { bg: "bg-indigo-100", text: "text-indigo-800" },
  "Social Media Post": { bg: "bg-pink-100", text: "text-pink-800" },
  Podcast: { bg: "bg-orange-100", text: "text-orange-800" },
  Webinar: { bg: "bg-teal-100", text: "text-teal-800" },
  "Email Newsletter": { bg: "bg-cyan-100", text: "text-cyan-800" },
  Whitepaper: { bg: "bg-slate-100", text: "text-slate-800" },
  "E-book": { bg: "bg-emerald-100", text: "text-emerald-800" },
};

const getFormatColors = (format: string) => {
  return (
    formatBadgeColors[format] || { bg: "bg-gray-100", text: "text-gray-800" }
  );
};

export const ContentPlanTable: React.FC<ContentPlanTableProps> = ({
  items,
  onSelectionChange,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelected));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(items.map((item) => item.id));
      setSelectedIds(allIds);
      if (onSelectionChange) {
        onSelectionChange(Array.from(allIds));
      }
    } else {
      setSelectedIds(new Set());
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No content plan items yet.</p>
        <p className="mt-2 text-sm">
          Generate a content plan to see items here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:-mx-8 md:mx-0">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="w-12 px-4 sm:px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedIds.size === items.length && items.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                aria-label="Select all items"
              />
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Format
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => {
            const statusColor = statusColors[item.status];
            const formatColor = getFormatColors(item.format);
            return (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={(e) =>
                      handleCheckboxChange(item.id, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    aria-label={`Select ${item.title}`}
                  />
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 max-w-xs sm:max-w-none truncate sm:truncate-none">
                    {item.title}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${formatColor.bg} ${formatColor.text}`}
                  >
                    {item.format}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor.bg} ${statusColor.text}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-blue-600 hover:text-blue-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                    title="Actions coming soon"
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

