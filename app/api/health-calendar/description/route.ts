import { NextResponse } from 'next/server';
import { generateHealthEventDescription } from '@/lib/llm/health-parser';

export async function POST(req: Request) {
    try {
        const { eventName } = await req.json();

        if (!eventName) {
            return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
        }

        const description = await generateHealthEventDescription(eventName);

        return NextResponse.json({ description });
    } catch (error) {
        console.error('API Error generating description:', error);
        return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
    }
}
