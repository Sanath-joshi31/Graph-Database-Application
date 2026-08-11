import { NextResponse } from 'next/server';
import { getFullGraphData, getSkillNeighborhood } from '@/lib/services/graphService.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get('skillId');
    const roleId = searchParams.get('roleId') || '';
    const userSkillsParam = searchParams.get('userSkills') || '';
    const userSkills = userSkillsParam ? userSkillsParam.split(',') : [];

    if (skillId) {
      const neighborhood = await getSkillNeighborhood(skillId);
      return NextResponse.json({ neighborhood });
    }

    const graphData = await getFullGraphData(userSkills, roleId);
    return NextResponse.json(graphData);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to fetch graph data' }, { status: 500 });
  }
}
