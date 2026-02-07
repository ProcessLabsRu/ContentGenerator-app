import { NextResponse } from 'next/server';
import { getDatabaseConfig } from '@/lib/config';
import { checkPocketBaseConnection } from '@/lib/pocketbase-service';

export async function GET() {
  try {
    // Use getDatabaseConfig instead of getValidatedConfig to avoid throwing during build
    const config = getDatabaseConfig();
    let databaseStatus: 'connected' | 'disconnected' | 'not_configured' = 'not_configured';

    // Check if configuration is actually set
    // For PocketBase, we just need the URL
    const hasConfig = !!config.pocketbase?.url;

    if (!hasConfig) {
      return NextResponse.json({
        status: 'error',
        database: 'not_configured',
        provider: config.provider,
        message: 'Database configuration not found. Please set POCKETBASE_URL.',
        timestamp: new Date().toISOString(),
      }, {
        status: 503,
      });
    }

    try {
      // Test PocketBase connection
      const isConnected = await checkPocketBaseConnection();
      databaseStatus = isConnected ? 'connected' : 'disconnected';
    } catch (error: any) {
      // Connection test failed - database is disconnected
      databaseStatus = 'disconnected';
      console.error('Database connection test failed:', error.message);
    }

    const status = databaseStatus === 'connected' ? 'ok' : 'error';

    return NextResponse.json({
      status,
      database: databaseStatus,
      provider: config.provider,
      timestamp: new Date().toISOString(),
    }, {
      status: status === 'ok' ? 200 : 503,
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    }, {
      status: 503,
    });
  }
}

