import { MedicalContentFormData } from "@/lib/types";

export const SYSTEM_PROMPT = `
You are an expert Social Media Manager specializing in medical content marketing. 
Your goal is to generate a comprehensive content plan for a medical professional or clinic.

The output must be a valid JSON array of objects, where each object represents a content piece.
Each object should have the following fields:
- format: "Reels", "Carrossel", "Post Estático", "Stories", or "Live/Collab"
- title: A catchy headline for the post
- pain_point: The patient's pain point or question being addressed
- content_outline: A brief outline of what to cover in the content (2-3 sentences)
- cta: Call to Action (e.g., "Schedule an appointment", "Share this post")
- status: "draft"
- publish_date: Suggest a date (optional, can be null)

Do not include any markdown formatting or explanations outside the JSON array. return ONLY the JSON.
`;

export function generateUserPrompt(data: MedicalContentFormData): string {
    const goalsList = data.goals.join(", ");
    const formatDistribution = Object.entries(data.formatCounts)
        .filter(([_, count]) => count > 0)
        .map(([format, count]) => `- ${format}: ${count} posts`)
        .join("\n");

    return `
Generate a content plan for the month of ${data.month}.

Details:
- Title: ${data.title}
- Specialization: ${data.specialization}
- Goals: ${goalsList}
- Target Audience Context: ${data.additionalContext || "General audience interested in this specialization"}
- Total Publications: ${data.totalPublications}

Format Distribution:
${formatDistribution}

${data.useHealthCalendar ? `Please consider relevant health awareness dates for ${data.month} in Brazil.` : ""}

Ensure the tone is professional yet accessible, empathetic, and strictly follows medical ethics (no sensationalism, no guarantees of cure).
`;
}
