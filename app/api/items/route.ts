
import { NextRequest, NextResponse } from 'next/server';
import { getContentPlanItems } from '@/lib/pocketbase-service';
import { ApiErrorResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '100');

        // Вызываем сервис без generationId, чтобы получить все элементы
        const result = await getContentPlanItems(undefined, page, perPage);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error fetching all content plan items:', error);

        return NextResponse.json<ApiErrorResponse>(
            {
                error: {
                    message: error.message || 'Failed to fetch content plan items',
                    code: 'FETCH_ERROR',
                },
            },
            { status: 500 }
        );
    }
}
