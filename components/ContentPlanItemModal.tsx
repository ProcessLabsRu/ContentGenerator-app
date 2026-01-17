"use client";

import { useEffect, useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { Select } from "./ui/Select";
import { Button } from "./ui/Button";
import { ContentPlanItem, ContentPlanStatus } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

interface ContentPlanItemModalProps {
  item: ContentPlanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ContentPlanItem) => Promise<void> | void;
}

export const ContentPlanItemModal: React.FC<ContentPlanItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const { t } = useI18n();
  const statusOptions: { value: ContentPlanStatus; label: string }[] = [
    { value: "draft", label: t("status.draft") },
    { value: "selected", label: t("status.selected") },
    { value: "generated", label: t("status.generated") },
  ];
  const [formState, setFormState] = useState({
    title: "",
    format: "",
    status: "draft" as ContentPlanStatus,
    publish_date: "",
    is_approved: false,
    pain_point: "",
    content_outline: "",
    cta: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!item) return;
    setFormState({
      title: item.title || "",
      format: item.format || "",
      status: item.status,
      publish_date: item.publish_date || "",
      is_approved: Boolean(item.is_approved),
      pain_point: item.pain_point || "",
      content_outline: item.content_outline || "",
      cta: item.cta || "",
    });
  }, [item]);

  const handleSave = async () => {
    if (!item) return;
    setIsSaving(true);
    try {
      await onSave({
        ...item,
        title: formState.title,
        format: formState.format,
        status: formState.status,
        publish_date: formState.publish_date || null,
        is_approved: formState.is_approved,
        pain_point: formState.pain_point,
        content_outline: formState.content_outline,
        cta: formState.cta,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("modal.title")}
    >
      <div className="space-y-4">
        <Input
          label={t("modal.labels.title")}
          value={formState.title}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <Input
          label={t("modal.labels.format")}
          value={formState.format}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, format: e.target.value }))
          }
        />
        <Select
          label={t("modal.labels.status")}
          options={statusOptions}
          value={formState.status}
          onValueChange={(value) =>
            setFormState((prev) => ({
              ...prev,
              status: value as ContentPlanStatus,
            }))
          }
        />
        <Input
          label={t("modal.labels.publishDate")}
          type="date"
          value={formState.publish_date}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              publish_date: e.target.value,
            }))
          }
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={formState.is_approved}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                is_approved: e.target.checked,
              }))
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          {t("modal.approved")}
        </label>
        <Textarea
          label={t("modal.labels.painPoint")}
          value={formState.pain_point}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              pain_point: e.target.value,
            }))
          }
        />
        <Textarea
          label={t("modal.labels.contentOutline")}
          value={formState.content_outline}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              content_outline: e.target.value,
            }))
          }
        />
        <Textarea
          label={t("modal.labels.cta")}
          value={formState.cta}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, cta: e.target.value }))
          }
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            {t("modal.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving || !formState.title || !formState.format}
          >
            {isSaving ? t("modal.saving") : t("modal.save")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
