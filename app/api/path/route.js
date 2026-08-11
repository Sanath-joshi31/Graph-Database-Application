import { NextResponse } from 'next/server';
import { calculateLearningPath } from '@/lib/services/pathService.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { roleId, userSkillIds = [] } = body || {};

    if (!roleId) {
      return NextResponse.json({ error: 'Missing required field: roleId' }, { status: 400 });
    }

    const pathResult = await calculateLearningPath(roleId, userSkillIds);
    return NextResponse.json(pathResult);
  } catch (error) {
    console.error('[API Path Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to compute learning path' }, { status: 500 });
  }
}
