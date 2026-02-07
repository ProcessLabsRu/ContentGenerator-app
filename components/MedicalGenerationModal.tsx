"use client";

import { Modal } from "./ui/Modal";
import { MedicalContentForm } from "./MedicalContentForm";
import { MedicalContentFormData } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

interface MedicalGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartGeneration?: () => void;
    onSuccess?: (generation: any) => void;
    onError?: () => void;
}

export const MedicalGenerationModal: React.FC<MedicalGenerationModalProps> = ({
    isOpen,
    onClose,
    onStartGeneration,
    onSuccess,
    onError,
}) => {
    const { t } = useI18n();

    const handleGenerate = async (formData: MedicalContentFormData) => {
        // Start process and close immediately
        if (onStartGeneration) onStartGeneration();
        onClose();

        try {
            const response = await fetch("/api/generations/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Erro ao gerar plano");
            }

            const result = await response.json();
            const createdGeneration = result.data;

            if (onSuccess) {
                onSuccess(createdGeneration);
            }

        } catch (error: any) {
            console.error("Erro ao gerar plano:", error);
            alert(`Erro ao gerar plano: ${error.message || "Tente novamente"}`);

            if (onError) {
                onError();
            }
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t("medical.modal.title")}
            size="large"
        >
            <MedicalContentForm onSubmit={handleGenerate} />
        </Modal>
    );
};
