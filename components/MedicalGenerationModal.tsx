"use client";

import { Modal } from "./ui/Modal";
import { MedicalContentForm } from "./MedicalContentForm";
import { MedicalContentFormData } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

interface MedicalGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (generation: any) => void;
}

export const MedicalGenerationModal: React.FC<MedicalGenerationModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const { t } = useI18n();

    const handleGenerate = async (formData: MedicalContentFormData) => {
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

            onClose();

        } catch (error: any) {
            console.error("Erro ao gerar plano:", error);
            alert(`Erro ao gerar plano: ${error.message || "Tente novamente"}`);
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
