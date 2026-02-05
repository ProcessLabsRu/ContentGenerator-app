"use client";

import { Modal } from "./ui/Modal";
import { MedicalContentForm } from "./MedicalContentForm";
import { MedicalContentFormData } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

interface MedicalGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (planData: MedicalContentFormData) => void;
}

export const MedicalGenerationModal: React.FC<MedicalGenerationModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const { t } = useI18n();

    const handleGenerate = async (formData: MedicalContentFormData) => {
        try {
            // TODO: Aqui será a integração com Gemini 3 Pro
            console.log("Gerando plano com os seguintes dados:", formData);

            // Simular geração (remover quando integrar com Gemini)
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (onSuccess) {
                onSuccess(formData);
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
