"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentPlanTable } from "@/components/ContentPlanTable";
import { ContentPlanItem } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export default function PlanPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContentPlanItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Retrieve items from sessionStorage
    const stored = sessionStorage.getItem("contentPlanItems");
    if (stored) {
      try {
        const parsedItems = JSON.parse(stored);
        setItems(parsedItems);
      } catch (error) {
        console.error("Failed to parse stored items:", error);
      }
    }
  }, []);

  const handleSelectionChange = (selectedIds: string[]) => {
    // Update status of selected items
    setItems((currentItems) => {
      const updated = currentItems.map((item) =>
        selectedIds.includes(item.id)
          ? { ...item, status: "selected" as const }
          : item.status === "selected"
          ? { ...item, status: "draft" as const }
          : item
      );
      // Persist updated items to sessionStorage
      sessionStorage.setItem("contentPlanItems", JSON.stringify(updated));
      return updated;
    });
  };

  if (!isClient) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12 text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Content Plans
            </h1>
            <p className="text-gray-600">
              Manage and view your generated content plan items.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push("/")}
          >
            Generate New Plan
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No content plan items found.
            </p>
            <Button variant="primary" onClick={() => router.push("/")}>
              Generate Your First Plan
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {items.length} item{items.length !== 1 ? "s" : ""} in your plan
            </div>
            <ContentPlanTable
              items={items}
              onSelectionChange={handleSelectionChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

