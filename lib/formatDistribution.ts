import { ContentGoal, FormatCounts } from "./types";

/**
 * Логика автоматического распределения форматов Instagram по целям контента
 * Основана на приоритете первой выбранной цели
 */

interface FormatDistributionRule {
    reels: number;
    carrossel: number;
    postEstatico: number;
    stories: number;
    liveCollab: number;
}

// Правила распределения для каждой цели (на основе 30 публикаций в месяц)
const distributionRules: Record<ContentGoal, FormatDistributionRule> = {
    "Conversão": {
        reels: 6,           // Высокий охват для привлечения
        carrossel: 4,       // Образовательный контент для доверия
        postEstatico: 3,    // Брендинг
        stories: 15,        // Максимум для конверсии и прямого контакта
        liveCollab: 2       // Живое взаимодействие
    },
    "Autoridade": {
        reels: 5,           // Демонстрация экспертизы
        carrossel: 10,      // Максимум образовательного контента
        postEstatico: 5,    // Профессиональный имидж
        stories: 8,         // Регулярное присутствие
        liveCollab: 2       // Экспертные обсуждения
    },
    "Crescimento": {
        reels: 12,          // Максимум для охвата и виральности
        carrossel: 5,       // Образовательный контент
        postEstatico: 3,    // Брендинг
        stories: 8,         // Поддержание связи
        liveCollab: 2       // Networking
    },
    "Educação": {
        reels: 5,           // Короткие образовательные видео
        carrossel: 12,      // Максимум для детального объяснения
        postEstatico: 4,    // Инфографика
        stories: 7,         // Дополнительные советы
        liveCollab: 2       // Образовательные сессии
    },
    "Engajamento": {
        reels: 8,           // Развлекательный и вовлекающий контент
        carrossel: 6,       // Интерактивные слайды
        postEstatico: 4,    // Визуально привлекательный контент
        stories: 10,        // Максимум интерактивности (опросы, вопросы)
        liveCollab: 2       // Прямое взаимодействие
    }
};

/**
 * Автоматически распределяет форматы на основе выбранных целей
 * Приоритет отдается первой цели в списке
 */
export function autoDistributeFormats(
    goals: ContentGoal[],
    totalPublications: number = 30
): FormatCounts {
    if (goals.length === 0) {
        // Если цели не выбраны, возвращаем равномерное распределение
        return {
            reels: 6,
            carrossel: 6,
            postEstatico: 6,
            stories: 10,
            liveCollab: 2
        };
    }

    // Берем правило для первой (приоритетной) цели
    const primaryGoal = goals[0];
    const baseDistribution = distributionRules[primaryGoal];

    // Если выбрана только одна цель, возвращаем базовое распределение
    if (goals.length === 1) {
        return scaleDistribution(baseDistribution, totalPublications);
    }

    // Если выбрано несколько целей, смешиваем распределения
    // 70% - первая цель, 30% - остальные цели поровну
    const secondaryGoals = goals.slice(1);
    const secondaryWeight = 0.3 / secondaryGoals.length;

    const mixedDistribution: FormatDistributionRule = {
        reels: Math.round(baseDistribution.reels * 0.7 +
            secondaryGoals.reduce((sum, goal) => sum + distributionRules[goal].reels * secondaryWeight, 0)),
        carrossel: Math.round(baseDistribution.carrossel * 0.7 +
            secondaryGoals.reduce((sum, goal) => sum + distributionRules[goal].carrossel * secondaryWeight, 0)),
        postEstatico: Math.round(baseDistribution.postEstatico * 0.7 +
            secondaryGoals.reduce((sum, goal) => sum + distributionRules[goal].postEstatico * secondaryWeight, 0)),
        stories: Math.round(baseDistribution.stories * 0.7 +
            secondaryGoals.reduce((sum, goal) => sum + distributionRules[goal].stories * secondaryWeight, 0)),
        liveCollab: Math.round(baseDistribution.liveCollab * 0.7 +
            secondaryGoals.reduce((sum, goal) => sum + distributionRules[goal].liveCollab * secondaryWeight, 0))
    };

    return scaleDistribution(mixedDistribution, totalPublications);
}

/**
 * Масштабирует распределение под нужное количество публикаций
 */
function scaleDistribution(
    distribution: FormatDistributionRule,
    targetTotal: number
): FormatCounts {
    const currentTotal = Object.values(distribution).reduce((sum, val) => sum + val, 0);
    const scale = targetTotal / currentTotal;

    const scaled = {
        reels: Math.round(distribution.reels * scale),
        carrossel: Math.round(distribution.carrossel * scale),
        postEstatico: Math.round(distribution.postEstatico * scale),
        stories: Math.round(distribution.stories * scale),
        liveCollab: Math.round(distribution.liveCollab * scale)
    };

    // Корректируем округление, чтобы сумма была точно равна targetTotal
    const scaledTotal = Object.values(scaled).reduce((sum, val) => sum + val, 0);
    const difference = targetTotal - scaledTotal;

    if (difference !== 0) {
        // Добавляем/убираем разницу к наибольшему значению
        const entries = Object.entries(scaled) as [keyof FormatCounts, number][];
        const maxKey = entries.reduce((max, [key, val]) =>
            val > scaled[max] ? key : max,
            'reels' as keyof FormatCounts
        );

        scaled[maxKey] += difference;
    }

    return scaled;
}

/**
 * Вычисляет общее количество публикаций из FormatCounts
 */
export function getTotalPublications(counts: FormatCounts): number {
    return counts.reels + counts.carrossel + counts.postEstatico +
        counts.stories + counts.liveCollab;
}

/**
 * Возвращает описание формата для UI
 */
export function getFormatDescription(format: keyof FormatCounts): string {
    const descriptions: Record<keyof FormatCounts, string> = {
        reels: "Vídeo dinâmico para alcance e análise de dor",
        carrossel: "Slides educacionais para autoridade",
        postEstatico: "Imagem fixa para branding",
        stories: "Atualizações sequenciais para conversão",
        liveCollab: "Networking e confiança em tempo real"
    };

    return descriptions[format];
}

/**
 * Возвращает название формата на португальском
 */
export function getFormatLabel(format: keyof FormatCounts): string {
    const labels: Record<keyof FormatCounts, string> = {
        reels: "Reels",
        carrossel: "Carrossel",
        postEstatico: "Post Estático",
        stories: "Stories",
        liveCollab: "Live/Collab"
    };

    return labels[format];
}
