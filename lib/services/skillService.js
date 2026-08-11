import { MOCK_SKILLS, MOCK_CATEGORIES } from '../cognodb/mockData.js';
import { getSkillPrerequisitesQuery, getGraphNeighborhoodQuery } from '../cognodb/queries.js';

export async function getAllSkills() {
  return MOCK_SKILLS.map(s => {
    const cat = MOCK_CATEGORIES.find(c => c.id === s.categoryId);
    return {
      ...s,
      category: cat ? cat.name : 'General',
    };
  });
}

export async function getAllCategories() {
  return MOCK_CATEGORIES;
}

export async function getSkillById(skillId) {
  const neighborhood = await getGraphNeighborhoodQuery(skillId);
  if (!neighborhood) return null;

  const multiHopPrereqs = await getSkillPrerequisitesQuery(skillId, 4);

  return {
    ...neighborhood.skill,
    neighborhood,
    multiHopPrerequisites: multiHopPrereqs,
  };
}
