import { MOCK_ROLES } from '../cognodb/mockData.js';
import { getRoleSkillsQuery } from '../cognodb/queries.js';

export async function getAllRoles() {
  return MOCK_ROLES;
}

export async function getRoleById(roleId) {
  const role = MOCK_ROLES.find(r => r.id === roleId);
  if (!role) return null;

  const requiredSkills = await getRoleSkillsQuery(roleId);
  return {
    ...role,
    requiredSkills,
  };
}
