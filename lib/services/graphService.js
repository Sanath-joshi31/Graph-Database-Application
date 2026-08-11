import {
  MOCK_CATEGORIES,
  MOCK_SKILLS,
  MOCK_ROLES,
  MOCK_RESOURCES,
  MOCK_PROJECTS,
  MOCK_PREREQUISITES,
} from '../cognodb/mockData.js';
import { getGraphNeighborhoodQuery } from '../cognodb/queries.js';

/**
 * Format full interactive graph for graph visualization view
 * @param {string[]} highlightSkillIds - Optional skill IDs to mark as active/known
 * @param {string} highlightRoleId - Optional target role ID to highlight
 */
export async function getFullGraphData(highlightSkillIds = [], highlightRoleId = '') {
  const nodes = [];
  const edges = [];

  // Add Category nodes
  MOCK_CATEGORIES.forEach(cat => {
    nodes.push({
      id: cat.id,
      label: cat.name,
      type: 'Category',
      data: cat,
    });
  });

  // Add Skill nodes
  MOCK_SKILLS.forEach(skill => {
    const isUserSkill = highlightSkillIds.includes(skill.id);
    const cat = MOCK_CATEGORIES.find(c => c.id === skill.categoryId);
    nodes.push({
      id: skill.id,
      label: skill.name,
      type: 'Skill',
      data: {
        ...skill,
        category: cat ? cat.name : 'General',
        isUserSkill,
      },
    });

    // BELONGS_TO edge
    if (skill.categoryId) {
      edges.push({
        id: `e-${skill.id}-belongs-${skill.categoryId}`,
        source: skill.id,
        target: skill.categoryId,
        label: 'BELONGS_TO',
        type: 'BELONGS_TO',
      });
    }
  });

  // Add Prerequisite Edges (Skill REQUIRES Skill)
  MOCK_PREREQUISITES.forEach(p => {
    edges.push({
      id: `e-${p.skillId}-requires-${p.prereqId}`,
      source: p.skillId,
      target: p.prereqId,
      label: 'REQUIRES',
      type: 'PREREQUISITE',
    });
  });

  // Add Role nodes & REQUIRES edges
  MOCK_ROLES.forEach(role => {
    const isTargetRole = role.id === highlightRoleId;
    nodes.push({
      id: role.id,
      label: role.name,
      type: 'Role',
      data: { ...role, isTargetRole },
    });

    role.requiredSkillIds.forEach(sId => {
      edges.push({
        id: `e-${role.id}-requires-${sId}`,
        source: role.id,
        target: sId,
        label: 'REQUIRES',
        type: 'ROLE_REQUIRES',
      });
    });
  });

  // Add Resource nodes & TEACHES edges
  MOCK_RESOURCES.forEach(res => {
    nodes.push({
      id: res.id,
      label: res.title,
      type: 'Resource',
      data: res,
    });
    if (res.teachesSkillId) {
      edges.push({
        id: `e-${res.id}-teaches-${res.teachesSkillId}`,
        source: res.id,
        target: res.teachesSkillId,
        label: 'TEACHES',
        type: 'TEACHES',
      });
    }
  });

  // Add Project nodes & PRACTICES edges
  MOCK_PROJECTS.forEach(proj => {
    nodes.push({
      id: proj.id,
      label: proj.title,
      type: 'Project',
      data: proj,
    });

    proj.practicesSkillIds.forEach(sId => {
      edges.push({
        id: `e-${proj.id}-practices-${sId}`,
        source: proj.id,
        target: sId,
        label: 'PRACTICES',
        type: 'PRACTICES',
      });
    });
  });

  return { nodes, edges };
}

/**
 * Get 1-hop graph neighborhood for a specific skill node
 */
export async function getSkillNeighborhood(skillId) {
  return await getGraphNeighborhoodQuery(skillId);
}
