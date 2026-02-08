"use client";

import { useEffect, useState } from "react";
import { Generation, ContentPlanItem, ContentPlanStatus } from "@/lib/types";
import { ContentPlanTable } from "./ContentPlanTable";
import { ContentPlanCalendar } from "./ContentPlanCalendar";
import { ContentPlanItemModal } from "./ContentPlanItemModal";
import {
  fetchGenerationItems,
  fetchAllContentItems,
  updateItemStatus,
  updateItem,
  deleteItem,
  isApiError,
} from "@/lib/api-client";
import { useI18n } from "@/lib/i18n";
import { CalendarDays, Table as TableIcon, Search, X } from "lucide-react";

interface PostsListProps {
  generation: Generation | null;
}

export const PostsList: React.FC<PostsListProps> = ({ generation }) => {
  const [items, setItems] = useState<ContentPlanItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<
    "all" | "Aprovado" | "Rascunho"
  >("all");
  const [showSettings, setShowSettings] = useState(false);
  const [activeItem, setActiveItem] = useState<ContentPlanItem | null>(null);
  const { t } = useI18n();
  const [tableColumns, setTableColumns] = useState({
    format: true,
    status: true,
    publishDate: true,
    painPoint: false,
    cta: false,
    contentOutline: false,
  });
  const [calendarFields, setCalendarFields] = useState({
    format: true,
    status: false,
    undatedSection: true,
    painPoint: false,
    cta: false,
    contentOutline: false,
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedTableCols = localStorage.getItem('posts-table-columns');
    const savedCalFields = localStorage.getItem('posts-calendar-fields');
    const savedViewMode = localStorage.getItem('posts-view-mode');
    const savedFilter = localStorage.getItem('posts-approval-filter');

    if (savedTableCols) {
      try {
        setTableColumns(JSON.parse(savedTableCols));
      } catch (e) {
        console.error("Error parsing saved table columns", e);
      }
    }

    if (savedCalFields) {
      try {
        setCalendarFields(JSON.parse(savedCalFields));
      } catch (e) {
        console.error("Error parsing saved calendar fields", e);
      }
    }

    if (savedViewMode === 'table' || savedViewMode === 'calendar') {
      setViewMode(savedViewMode);
    }

    if (savedFilter === 'all' || savedFilter === 'Aprovado' || savedFilter === 'Rascunho') {
      setApprovalFilter(savedFilter);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('posts-table-columns', JSON.stringify(tableColumns));
  }, [tableColumns]);

  useEffect(() => {
    localStorage.setItem('posts-calendar-fields', JSON.stringify(calendarFields));
  }, [calendarFields]);

  useEffect(() => {
    localStorage.setItem('posts-view-mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('posts-approval-filter', approvalFilter);
  }, [approvalFilter]);

  useEffect(() => {
    if (!generation) {
      setItems([]);
      return;
    }

    const loadItems = async () => {
      setLoading(true);
      setError(null);

      try {
        let itemsData: ContentPlanItem[] = [];

        if (generation.id === "all") {
          const result = await fetchAllContentItems();
          if (isApiError(result)) {
            setError(result.error.message);
            setItems([]);
            return;
          }
          itemsData = result.data.items;
        } else {
          const result = await fetchGenerationItems(generation.id);
          if (isApiError(result)) {
            setError(result.error.message);
            setItems([]);
            return;
          }
          itemsData = result.data;
        }

        setItems(itemsData);
      } catch (err: any) {
        setError(err.message || t("posts.loadError"));
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [generation, t]);

  const handleStatusChange = async (itemId: string, newStatus: ContentPlanStatus) => {
    if (!generation) return;

    const previousItems = items;

    // Update items optimistically
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );

    // Update status via API
    try {
      const result = await updateItemStatus(generation.id, itemId, newStatus);

      if (isApiError(result)) {
        console.error("API error updating item status:", result.error);
        // Revert on API error
        setItems(previousItems);
        alert(t("posts.updateStatusError") + ": " + result.error.message);
      }
    } catch (err: any) {
      console.error("Network error updating item status:", err);
      // Revert on network error
      setItems(previousItems);
      alert(t("posts.updateStatusError"));
    }
  };

  const handleItemClick = (item: ContentPlanItem) => {
    setActiveItem(item);
  };

  const handleItemSave = async (updatedItem: ContentPlanItem) => {
    if (!generation) return;
    const result = await updateItem(generation.id, {
      id: updatedItem.id,
      title: updatedItem.title,
      format: updatedItem.format,
      status: updatedItem.status,
      publish_date: updatedItem.publish_date ?? null,
      pain_point: updatedItem.pain_point,
      content_outline: updatedItem.content_outline,
      cta: updatedItem.cta,
    });

    if (isApiError(result)) {
      alert(t("posts.updateItemError", { error: result.error.message }));
      return;
    }

    const savedItem = result.data;
    setItems((prev) =>
      prev.map((item) => (item.id === savedItem.id ? savedItem : item))
    );
    setActiveItem(null);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!generation) return;
    const result = await deleteItem(generation.id, itemId);

    if (isApiError(result)) {
      alert(result.error.message);
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setActiveItem(null);
  };

  if (!generation) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>{t("posts.selectGeneration")}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        {t("posts.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 mb-2">
          {t("posts.error", { error: error || "" })}
        </div>
      </div>
    );
  }

  const getPostsLabel = (count: number) =>
    t(count === 1 ? "posts.count.one" : "posts.count.other", { count });

  const finalFilteredItems = items.filter((item) => {
    // Apply status filter
    const itemStatus = item.status?.toLowerCase() || "";
    const matchesStatus =
      approvalFilter === "all" ||
      (approvalFilter === "Aprovado"
        ? itemStatus === "aprovado"
        : (itemStatus === "rascunho" || itemStatus === "gerado"));

    // Apply search filter
    const matchesSearch =
      searchQuery === "" ||
      [
        item.title,
        item.format,
        item.pain_point,
        item.content_outline,
        item.cta,
        item.publish_date,
      ].some((field) =>
        field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 sm:px-6 border-b border-gray-100 bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-0.5 truncate leading-tight">
              {generation.id === 'all'
                ? generation.title
                : `${generation.specialization} • ${generation.purpose}`}
            </h2>
            <p className="text-sm text-gray-500">
              {getPostsLabel(finalFilteredItems.length)}
              {searchQuery && (
                <span className="ml-1 text-xs text-gray-400">
                  ({t("table.filter.all")}: {items.length})
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64 lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-8 py-1.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red sm:text-sm transition-all text-brand-dark"
                placeholder={t("posts.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center hover:text-gray-600 transition-colors"
                  title={t("ui.delete")}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition-all ${viewMode === "table"
                    ? "bg-white shadow-sm text-brand-red"
                    : "text-gray-500 hover:text-brand-dark"
                    }`}
                  title={t("posts.view.table")}
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("calendar")}
                  className={`p-1.5 rounded-md transition-all ${viewMode === "calendar"
                    ? "bg-white shadow-sm text-brand-red"
                    : "text-gray-700 hover:text-brand-dark"
                    }`}
                  title={t("posts.view.calendar")}
                >
                  <CalendarDays className="w-4 h-4" />
                </button>
              </div>
              {viewMode === "table" && (
                <select
                  aria-label={t("table.filter.approval")}
                  value={approvalFilter}
                  onChange={(e) => setApprovalFilter(e.target.value as "all" | "Aprovado" | "Rascunho")}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs text-brand-dark shadow-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                >
                  <option value="all">{t("table.filter.all")}</option>
                  <option value="Aprovado">{t("status.aprovado")}</option>
                  <option value="Rascunho">{t("status.rascunho")}</option>
                </select>
              )}
              <button
                type="button"
                onClick={() => setShowSettings((prev) => !prev)}
                className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${showSettings ? 'bg-gray-100 border-gray-300 text-gray-900' : 'border-gray-200 bg-white text-gray-700 hover:text-gray-900'
                  }`}
              >
                {t("posts.settings")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        <div className="p-4 sm:p-6">
          {showSettings && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    {t("settings.tableView")}
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={tableColumns.format}
                        onChange={(e) =>
                          setTableColumns((prev) => ({
                            ...prev,
                            format: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {t("settings.format")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={tableColumns.status}
                        onChange={(e) =>
                          setTableColumns((prev) => ({
                            ...prev,
                            status: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {t("settings.status")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={tableColumns.publishDate}
                        onChange={(e) =>
                          setTableColumns((prev) => ({
                            ...prev,
                            publishDate: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {t("settings.publishDate")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={tableColumns.painPoint}
                        onChange={(e) =>
                          setTableColumns((prev) => ({
                            ...prev,
                            painPoint: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {t("table.columns.painPoint")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={tableColumns.cta}
                        onChange={(e) =>
                          setTableColumns((prev) => ({
                            ...prev,
                            cta: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {t("table.columns.cta")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={tableColumns.contentOutline}
                        onChange={(e) =>
                          setTableColumns((prev) => ({
                            ...prev,
                            contentOutline: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {t("table.columns.contentOutline")}
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    {t("settings.calendarView")}
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={calendarFields.format}
                        onChange={(e) =>
                          setCalendarFields((prev) => ({
                            ...prev,
                            format: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {t("settings.format")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={calendarFields.status}
                        onChange={(e) =>
                          setCalendarFields((prev) => ({
                            ...prev,
                            status: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {t("settings.status")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={calendarFields.undatedSection}
                        onChange={(e) =>
                          setCalendarFields((prev) => ({
                            ...prev,
                            undatedSection: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {t("settings.undatedSection")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={calendarFields.painPoint}
                        onChange={(e) =>
                          setCalendarFields((prev) => ({
                            ...prev,
                            painPoint: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {t("table.columns.painPoint")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={calendarFields.cta}
                        onChange={(e) =>
                          setCalendarFields((prev) => ({
                            ...prev,
                            cta: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {t("table.columns.cta")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={calendarFields.contentOutline}
                        onChange={(e) =>
                          setCalendarFields((prev) => ({
                            ...prev,
                            contentOutline: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {t("table.columns.contentOutline")}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          {viewMode === "table" ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <ContentPlanTable
                items={finalFilteredItems}
                onStatusChange={handleStatusChange}
                visibleColumns={tableColumns}
                onItemClick={handleItemClick}
              />
            </div>
          ) : (
            <ContentPlanCalendar
              items={finalFilteredItems}
              visibleFields={calendarFields}
              onItemClick={handleItemClick}
            />
          )}
        </div>
      </div>

      <ContentPlanItemModal
        item={activeItem}
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        onSave={handleItemSave}
        onDelete={handleDeleteItem}
      />
    </div>
  );
};
