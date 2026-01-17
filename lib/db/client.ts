import { Pool, PoolClient } from 'pg';
import { getValidatedConfig } from '../config';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const config = getValidatedConfig();
    
    if (config.provider !== 'direct') {
      throw new Error('Direct database access is only available when DATABASE_PROVIDER=direct');
    }

    if (!config.direct) {
      throw new Error('Direct database configuration is missing');
    }

    const poolConfig: {
      connectionString?: string;
      host?: string;
      port?: number;
      database?: string;
      user?: string;
      password?: string;
      ssl?: boolean | { rejectUnauthorized: boolean };
      max?: number;
      idleTimeoutMillis?: number;
      connectionTimeoutMillis?: number;
    } = {};

    if (config.direct.connectionString) {
      poolConfig.connectionString = config.direct.connectionString;
    } else {
      poolConfig.host = config.direct.host;
      poolConfig.port = config.direct.port;
      poolConfig.database = config.direct.database;
      poolConfig.user = config.direct.user;
      poolConfig.password = config.direct.password;
    }

    // SSL configuration
    if (config.direct.ssl) {
      poolConfig.ssl = {
        rejectUnauthorized: false, // Adjust based on your certificate setup
      };
    }

    // Connection pool settings
    poolConfig.max = 20; // Maximum number of clients in the pool
    poolConfig.idleTimeoutMillis = 30000; // Close idle clients after 30 seconds
    poolConfig.connectionTimeoutMillis = 2000; // Return an error after 2 seconds if connection could not be established

    pool = new Pool(poolConfig);

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
}

export async function testConnection(): Promise<boolean> {
  try {
    const client = await getPool().connect();
    await client.query('SELECT NOW()');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Helper function for transactions
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

