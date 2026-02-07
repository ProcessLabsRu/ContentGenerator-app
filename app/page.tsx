"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { MedicalGenerationModal } from "@/components/MedicalGenerationModal";
import { GenerationsList } from "@/components/GenerationsList";
import { PostsList } from "@/components/PostsList";
import { HealthCalendarView } from "@/components/HealthCalendarView";
import { Button } from "@/components/ui/Button";
import { Generation, MedicalContentFormData } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-gray-50">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();

  const view = (searchParams.get('view') as 'generations' | 'calendar') || 'generations';

  const setView = (newView: 'generations' | 'calendar') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    router.push(`?${params.toString()}`);
  };

  const handleSelectGeneration = (generation: Generation) => {
    setSelectedGeneration(generation);
  };

  // Set default selection to "All Generations"
  useEffect(() => {
    if (!selectedGeneration && view === 'generations' && !isGenerating) {
      setSelectedGeneration({ id: 'all', title: t("generations.all") } as Generation);
    }
  }, [t, selectedGeneration, view, isGenerating]);

  const handleGenerationCreated = (newGeneration: Generation) => {
    setIsGenerating(false);
    setRefreshTrigger((prev) => prev + 1);
    setSelectedGeneration(newGeneration);
  };

  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleDeleteGeneration = (id: string) => {
    if (selectedGeneration?.id === id) {
      setSelectedGeneration(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-full flex flex-col relative">
        {/* Global Generation Progress Overlay */}
        {isGenerating && (
          <div className="absolute inset-x-0 top-0 z-[60] bg-blue-600/90 text-white py-2 px-4 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top duration-300">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-sm font-medium">✨ {t("medical.form.generating")}...</span>
          </div>
        )}

        {/* Dynamic content area */}
        {view === 'calendar' ? (
          <div className="flex-1 overflow-hidden">
            <HealthCalendarView onBack={() => setView('generations')} />
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Left column - Generations List */}
            <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {t("medical.app.generatedPlans")}
                  </h2>
                </div>

                <Button
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                  disabled={isGenerating}
                  className="w-full mb-6 flex items-center justify-center gap-2 py-3 shadow-md hover:shadow-lg transition-all"
                >
                  ✨ {t("medical.app.createPlan")}
                </Button>

                <GenerationsList
                  selectedId={selectedGeneration?.id || null}
                  onSelect={handleSelectGeneration}
                  onDelete={handleDeleteGeneration}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>

            {/* Right column - Posts List */}
            <div className="flex-1 bg-white overflow-hidden relative">
              {isGenerating ? (
                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t("medical.form.generating")}...</h3>
                  <p className="text-gray-600 max-w-sm">
                    {t("form.placeholder.context")}
                  </p>
                </div>
              ) : null}
              <PostsList generation={selectedGeneration} />
            </div>
          </div>
        )}

        {/* Modal */}
        <MedicalGenerationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStartGeneration={() => setIsGenerating(true)}
          onSuccess={handleGenerationCreated}
          onError={() => setIsGenerating(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
