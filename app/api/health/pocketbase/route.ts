import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { checkPocketBaseConnection, getPocketBaseUrl } from '@/lib/pocketbase-service';

/**
 * Health check endpoint for PocketBase connection
 * GET /api/health/pocketbase
 */
export async function GET() {
    try {
        const isConnected = await checkPocketBaseConnection();
        const url = getPocketBaseUrl();

        if (isConnected) {
            return NextResponse.json({
                status: 'ok',
                provider: 'pocketbase',
                url,
                message: 'PocketBase connection is healthy',
            });
        } else {
            return NextResponse.json(
                {
                    status: 'error',
                    provider: 'pocketbase',
                    url,
                    message: 'Failed to connect to PocketBase',
                },
                { status: 503 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            {
                status: 'error',
                provider: 'pocketbase',
                message: error.message || 'Unknown error',
            },
            { status: 500 }
        );
    }
}
