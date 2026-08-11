import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/cognodb/client.js';

export async function GET() {
  try {
    const health = await checkDatabaseHealth();
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: health,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Internal health check failure',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
