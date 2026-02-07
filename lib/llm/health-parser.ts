import { createLLMClient } from './index';

export interface ScrapedHealthEvent {
    month: string;
    date: string;
    eventName: string;
    description: string;
}

export interface CleanedHealthEvent {
    eventName: string;
    description: string;
    date: string;
    month: string;
    type: 'day' | 'month';
}

const PARSER_SYSTEM_PROMPT = `
You are a expert Brazilian health data specialist. You will receive a JSON array of scraped health awareness events from the Brazilian Ministry of Health website.
The data is EXTREMELY MESSY: it contains snippets of HTML tags, raw links, internal GUIDs (like "internal-guid..."), and broken attributes (like 'link" href="..."').

Your mission is to perform high-quality normalization:
1. Strip ALL HTML artifacts. If an event name looks like a piece of code, a link, or contains "href", "target", "guid", "style", extract only the HUMAN-READABLE text or discard the garbage.
2. Fix event names: Extract the core name (e.g., "Dia do Alzheimer" instead of a link to an Alzheimer article).
3. Enhance descriptions: If the description is empty but the event is well-known (like "Setembro Amarelo"), provide a concise 1-sentence description in Portuguese.
4. Clean up "internal-guid" and similar artifacts: They are technical noise and MUST be removed.
5. Everything MUST be in Brazilian Portuguese.
6. Format the date: Keep it as originally provided (e.g. "01/09" or "August").
7. Month: Maintain the original month name.
8. Type Identification: Identify if the event is a whole-month campaign (e.g., "Outubro Rosa", "Novembro Azul") or a specific day.

Output MUST be a valid JSON array of objects with fields: "eventName", "description", "originalDate", "month", "eventCharacteristic".
Field "eventCharacteristic" MUST be "month" if the event covers the whole month (campaign), or "day" if it has a specific day or a range of days.
Do not include any notes, markdown, or text outside the JSON.
`;

export async function parseHealthEventsAI(events: ScrapedHealthEvent[]): Promise<CleanedHealthEvent[]> {
    if (events.length === 0) return [];

    const BATCH_SIZE = 20;
    const allCleaned: CleanedHealthEvent[] = [];
    const client = createLLMClient();

    for (let i = 0; i < events.length; i += BATCH_SIZE) {
        const batch = events.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} events)`);

        try {
            const prompt = `Clean and normalize these Brazilian health events: ${JSON.stringify(batch)}`;

            const response = await client.generate([
                { role: 'system', content: PARSER_SYSTEM_PROMPT + "\nIMPORTANT: Provide a concise (1-2 sentences) description for EVERY event. Do not leave description empty." },
                { role: 'user', content: prompt }
            ]);

            const cleanContent = response.content.replace(/```json\n?|\n?```/g, '').trim();
            const parsed = JSON.parse(cleanContent);

            if (Array.isArray(parsed)) {
                allCleaned.push(...parsed.map(item => ({
                    eventName: item.eventName || '',
                    description: item.description || '',
                    date: item.originalDate || '',
                    month: item.month || '',
                    type: (item.eventCharacteristic === 'month' ? 'month' : 'day') as 'day' | 'month'
                })));
                continue; // Success for this batch
            }
        } catch (error) {
            console.error(`Error in batch ${i}:`, error);
        }

        // Fallback for this specific batch if it failed
        allCleaned.push(...batch.map(e => {
            const clean = (text: string) => text
                .replace(/<[^>]*>?/g, '')
                .replace(/&[a-z0-9]+;/gi, ' ')
                .replace(/href\s*=\s*"[^"]*"/gi, '')
                .replace(/target\s*=\s*"[^"]*"/gi, '')
                .replace(/internal-guid-[a-z0-9-]+/gi, '')
                .replace(/\s+/g, ' ')
                .trim();

            return {
                eventName: clean(e.eventName),
                description: clean(e.description) || "-",
                date: e.date,
                month: e.month,
                type: (e.date && e.date.includes('/') ? 'day' : 'month') as 'day' | 'month'
            };
        }));
    }

    return allCleaned;
}
export async function generateHealthEventDescription(eventName: string): Promise<string> {
    if (!eventName) return "";

    try {
        const client = createLLMClient();
        const prompt = `Provide a very concise (1-2 sentences) description in Brazilian Portuguese for the health awareness event: "${eventName}". Focus on its importance/purpose. Return ONLY the text, no quotes or additional formatting.`;

        const response = await client.generate([
            { role: 'system', content: 'You are a helpful Brazilian health specialist assistant.' },
            { role: 'user', content: prompt }
        ]);

        return response.content.trim().replace(/^"|"$/g, '');
    } catch (error) {
        console.error('Error generating event description:', error);
        return "";
    }
}
