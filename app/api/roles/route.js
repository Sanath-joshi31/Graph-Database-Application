import { NextResponse } from 'next/server';
import { getAllRoles, getRoleById } from '@/lib/services/roleService.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const role = await getRoleById(id);
      if (!role) {
        return NextResponse.json({ error: `Role with ID '${id}' not found` }, { status: 404 });
      }
      return NextResponse.json({ role });
    }

    const roles = await getAllRoles();
    return NextResponse.json({ roles });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to fetch roles' }, { status: 500 });
  }
}
