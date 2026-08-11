import { NextResponse } from 'next/server';
import { getAllSkills, getAllCategories, getSkillById } from '@/lib/services/skillService.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const skill = await getSkillById(id);
      if (!skill) {
        return NextResponse.json({ error: `Skill with ID '${id}' not found` }, { status: 404 });
      }
      return NextResponse.json({ skill });
    }

    const skills = await getAllSkills();
    const categories = await getAllCategories();
    return NextResponse.json({ skills, categories });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to fetch skills' }, { status: 500 });
  }
}
