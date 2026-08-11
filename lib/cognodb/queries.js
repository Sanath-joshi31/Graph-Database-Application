import { runQuery, getDriver } from './client.js';
import {
  MOCK_CATEGORIES,
  MOCK_SKILLS,
  MOCK_ROLES,
  MOCK_RESOURCES,
  MOCK_PROJECTS,
  MOCK_PREREQUISITES,
} from './mockData.js';

/**
 * Check if CognoDB live driver is active
 */
function isCognoDbActive() {
  return !!getDriver();
}

/**
 * Helper: Find all multi-hop prerequisites for a given skill id up to maxDepth hops
 */
function findMockMultiHopPrerequisites(skillId, currentDepth = 1, maxDepth = 4, visited = new Set()) {
  const result = [];
  if (currentDepth > maxDepth || visited.has(skillId)) return result;
  visited.add(skillId);

  // Find direct prereqs: skillId REQUIRES prereqId
  const directPrereqIds = MOCK_PREREQUISITES
    .filter(p => p.skillId === skillId)
    .map(p => p.prereqId);

  for (const pId of directPrereqIds) {
    const prereqSkill = MOCK_SKILLS.find(s => s.id === pId);
    if (prereqSkill) {
      const category = MOCK_CATEGORIES.find(c => c.id === prereqSkill.categoryId);
      result.push({
        ...prereqSkill,
        category: category ? category.name : 'General',
        hopDistance: currentDepth,
      });

      // Recurse deeper
      const deepPrereqs = findMockMultiHopPrerequisites(pId, currentDepth + 1, maxDepth, visited);
      result.push(...deepPrereqs);
    }
  }

  return result;
}

// ============================================================================
// QUERY A: All skills required by a role
// ============================================================================
export async function getRoleSkillsQuery(roleId) {
  if (isCognoDbActive()) {
    try {
      const cypher = `
        MATCH (r:Role {id: $roleId})-[:REQUIRES]->(s:Skill)
        OPTIONAL MATCH (s)-[:BELONGS_TO]->(c:Category)
        RETURN s.id AS id, 
               s.name AS name, 
               s.description AS description, 
               s.difficulty AS difficulty,
               c.name AS category
        ORDER BY s.name
      `;
      const result = await runQuery(cypher, { roleId });
      return result.records.map(record => ({
        id: record.get('id'),
        name: record.get('name'),
        description: record.get('description'),
        difficulty: record.get('difficulty'),
        category: record.get('category') || 'General',
      }));
    } catch (err) {
      console.warn('[CognoDB Query A Error - Fallback to Mock]:', err.message);
    }
  }

  // Mock Fallback
  const role = MOCK_ROLES.find(r => r.id === roleId);
  if (!role) return [];

  return MOCK_SKILLS
    .filter(s => role.requiredSkillIds.includes(s.id))
    .map(s => {
      const cat = MOCK_CATEGORIES.find(c => c.id === s.categoryId);
      return {
        id: s.id,
        name: s.name,
        description: s.description,
        difficulty: s.difficulty,
        category: cat ? cat.name : 'General',
      };
    });
}

// ============================================================================
// QUERY B: Multi-hop prerequisite traversal (2+ hops deep Cypher query)
// ============================================================================
export async function getSkillPrerequisitesQuery(skillId, maxHops = 4) {
  if (isCognoDbActive()) {
    try {
      const cypher = `
        MATCH path = (target:Skill {id: $skillId})-[:REQUIRES*1..4]->(prereq:Skill)
        UNWIND nodes(path) AS n
        WITH DISTINCT n
        WHERE n.id <> $skillId
        OPTIONAL MATCH (n)-[:BELONGS_TO]->(c:Category)
        RETURN n.id AS id, 
               n.name AS name, 
               n.description AS description, 
               n.difficulty AS difficulty,
               c.name AS category
      `;
      const result = await runQuery(cypher, { skillId });
      return result.records.map(record => ({
        id: record.get('id'),
        name: record.get('name'),
        description: record.get('description'),
        difficulty: record.get('difficulty'),
        category: record.get('category') || 'General',
      }));
    } catch (err) {
      console.warn('[CognoDB Query B Error - Fallback to Mock]:', err.message);
    }
  }

  // Mock Fallback Multi-hop traversal
  return findMockMultiHopPrerequisites(skillId, 1, maxHops);
}

// ============================================================================
// QUERY C: Missing skills analysis for user skills vs target role
// ============================================================================
export async function getMissingSkillsQuery(roleId, userSkillIds = []) {
  if (isCognoDbActive()) {
    try {
      const cypher = `
        MATCH (r:Role {id: $roleId})-[:REQUIRES]->(req:Skill)
        WHERE NOT req.id IN $userSkillIds
        OPTIONAL MATCH (req)-[:BELONGS_TO]->(c:Category)
        RETURN req.id AS id, 
               req.name AS name, 
               req.description AS description, 
               req.difficulty AS difficulty,
               c.name AS category
        ORDER BY req.difficulty, req.name
      `;
      const result = await runQuery(cypher, { roleId, userSkillIds });
      return result.records.map(record => ({
        id: record.get('id'),
        name: record.get('name'),
        description: record.get('description'),
        difficulty: record.get('difficulty'),
        category: record.get('category') || 'General',
      }));
    } catch (err) {
      console.warn('[CognoDB Query C Error - Fallback to Mock]:', err.message);
    }
  }

  // Mock Fallback
  const role = MOCK_ROLES.find(r => r.id === roleId);
  if (!role) return [];

  const missingIds = role.requiredSkillIds.filter(id => !userSkillIds.includes(id));
  return MOCK_SKILLS
    .filter(s => missingIds.includes(s.id))
    .map(s => {
      const cat = MOCK_CATEGORIES.find(c => c.id === s.categoryId);
      return {
        id: s.id,
        name: s.name,
        description: s.description,
        difficulty: s.difficulty,
        category: cat ? cat.name : 'General',
      };
    });
}

// ============================================================================
// QUERY D: Learning resources & practice projects for skills
// ============================================================================
export async function getResourcesAndProjectsQuery(skillIds = []) {
  if (!skillIds.length) return {};

  if (isCognoDbActive()) {
    try {
      const cypher = `
        MATCH (s:Skill) WHERE s.id IN $skillIds
        OPTIONAL MATCH (res:Resource)-[:TEACHES]->(s)
        OPTIONAL MATCH (proj:Project)-[:PRACTICES]->(s)
        RETURN s.id AS skillId,
               collect(DISTINCT {
                 id: res.id, title: res.title, type: res.type, url: res.url, difficulty: res.difficulty
               }) AS resources,
               collect(DISTINCT {
                 id: proj.id, title: proj.title, description: proj.description, difficulty: proj.difficulty
               }) AS projects
      `;
      const result = await runQuery(cypher, { skillIds });
      const mapped = {};
      result.records.forEach(record => {
        const sId = record.get('skillId');
        mapped[sId] = {
          resources: (record.get('resources') || []).filter(r => r.id),
          projects: (record.get('projects') || []).filter(p => p.id),
        };
      });
      return mapped;
    } catch (err) {
      console.warn('[CognoDB Query D Error - Fallback to Mock]:', err.message);
    }
  }

  // Mock Fallback
  const mapped = {};
  for (const sId of skillIds) {
    const resources = MOCK_RESOURCES.filter(r => r.teachesSkillId === sId);
    const projects = MOCK_PROJECTS.filter(p => p.practicesSkillIds.includes(sId));
    mapped[sId] = { resources, projects };
  }
  return mapped;
}

// ============================================================================
// QUERY E: Graph Neighborhood Exploration (1-hop neighborhood)
// ============================================================================
export async function getGraphNeighborhoodQuery(skillId) {
  if (isCognoDbActive()) {
    try {
      const cypher = `
        MATCH (center:Skill {id: $skillId})
        OPTIONAL MATCH (center)-[:REQUIRES]->(prereq:Skill)
        OPTIONAL MATCH (dependent:Skill)-[:REQUIRES]->(center)
        OPTIONAL MATCH (role:Role)-[:REQUIRES]->(center)
        OPTIONAL MATCH (resource:Resource)-[:TEACHES]->(center)
        OPTIONAL MATCH (project:Project)-[:PRACTICES]->(center)
        OPTIONAL MATCH (center)-[:BELONGS_TO]->(cat:Category)
        RETURN center,
               collect(DISTINCT prereq) AS prerequisites,
               collect(DISTINCT dependent) AS dependentSkills,
               collect(DISTINCT role) AS requiredByRoles,
               collect(DISTINCT resource) AS learningResources,
               collect(DISTINCT project) AS practiceProjects,
               cat AS category
      `;
      const result = await runQuery(cypher, { skillId });
      if (result.records.length > 0) {
        const rec = result.records[0];
        const centerNode = rec.get('center').properties;
        const catNode = rec.get('category')?.properties;
        return {
          skill: { ...centerNode, category: catNode?.name || 'General' },
          prerequisites: (rec.get('prerequisites') || []).map(n => n.properties),
          dependentSkills: (rec.get('dependentSkills') || []).map(n => n.properties),
          requiredByRoles: (rec.get('requiredByRoles') || []).map(n => n.properties),
          learningResources: (rec.get('learningResources') || []).map(n => n.properties),
          practiceProjects: (rec.get('practiceProjects') || []).map(n => n.properties),
        };
      }
    } catch (err) {
      console.warn('[CognoDB Query E Error - Fallback to Mock]:', err.message);
    }
  }

  // Mock Fallback
  const skill = MOCK_SKILLS.find(s => s.id === skillId);
  if (!skill) return null;

  const cat = MOCK_CATEGORIES.find(c => c.id === skill.categoryId);

  // Prerequisites (skills skillId REQUIRES)
  const prereqIds = MOCK_PREREQUISITES.filter(p => p.skillId === skillId).map(p => p.prereqId);
  const prerequisites = MOCK_SKILLS.filter(s => prereqIds.includes(s.id));

  // Dependents (skills that REQUIRE skillId)
  const dependentIds = MOCK_PREREQUISITES.filter(p => p.prereqId === skillId).map(p => p.skillId);
  const dependentSkills = MOCK_SKILLS.filter(s => dependentIds.includes(s.id));

  // Roles that REQUIRE skillId
  const requiredByRoles = MOCK_ROLES.filter(r => r.requiredSkillIds.includes(skillId));

  // Resources that teach skillId
  const learningResources = MOCK_RESOURCES.filter(r => r.teachesSkillId === skillId);

  // Projects that practice skillId
  const practiceProjects = MOCK_PROJECTS.filter(p => p.practicesSkillIds.includes(skillId));

  return {
    skill: { ...skill, category: cat ? cat.name : 'General' },
    prerequisites,
    dependentSkills,
    requiredByRoles,
    learningResources,
    practiceProjects,
  };
}

// ============================================================================
// QUERY F: Full Learning Path Computation Query
// ============================================================================
export async function getLearningPathNodesQuery(roleId, userSkillIds = []) {
  if (isCognoDbActive()) {
    try {
      const cypher = `
        MATCH (r:Role {id: $roleId})-[:REQUIRES]->(targetSkill:Skill)
        OPTIONAL MATCH path = (targetSkill)-[:REQUIRES*0..4]->(prereqSkill:Skill)
        WITH DISTINCT prereqSkill, targetSkill, r
        WHERE NOT prereqSkill.id IN $userSkillIds
        OPTIONAL MATCH (prereqSkill)-[:REQUIRES]->(directPre:Skill)
        OPTIONAL MATCH (res:Resource)-[:TEACHES]->(prereqSkill)
        OPTIONAL MATCH (proj:Project)-[:PRACTICES]->(prereqSkill)
        RETURN prereqSkill.id AS id,
               prereqSkill.name AS name,
               prereqSkill.description AS description,
               prereqSkill.difficulty AS difficulty,
               collect(DISTINCT directPre.id) AS directPrerequisiteIds,
               collect(DISTINCT {
                 id: res.id, title: res.title, type: res.type, url: res.url, difficulty: res.difficulty
               }) AS resources,
               collect(DISTINCT {
                 id: proj.id, title: proj.title, description: proj.description, difficulty: proj.difficulty
               }) AS projects
      `;
      const result = await runQuery(cypher, { roleId, userSkillIds });
      return result.records.map(record => ({
        id: record.get('id'),
        name: record.get('name'),
        description: record.get('description'),
        difficulty: record.get('difficulty'),
        directPrerequisiteIds: (record.get('directPrerequisiteIds') || []).filter(Boolean),
        resources: (record.get('resources') || []).filter(r => r.id),
        projects: (record.get('projects') || []).filter(p => p.id),
      }));
    } catch (err) {
      console.warn('[CognoDB Query F Error - Fallback to Mock]:', err.message);
    }
  }

  // Mock Fallback Computation
  const role = MOCK_ROLES.find(r => r.id === roleId);
  if (!role) return [];

  // Find all required skills for role
  const allNeededSkillIds = new Set();
  const queue = [...role.requiredSkillIds];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!allNeededSkillIds.has(currentId)) {
      allNeededSkillIds.add(currentId);
      const prereqs = MOCK_PREREQUISITES.filter(p => p.skillId === currentId).map(p => p.prereqId);
      queue.push(...prereqs);
    }
  }

  // Filter out skills user already possesses
  const missingSkillIds = Array.from(allNeededSkillIds).filter(id => !userSkillIds.includes(id));

  return missingSkillIds.map(id => {
    const skill = MOCK_SKILLS.find(s => s.id === id);
    const directPrereqs = MOCK_PREREQUISITES.filter(p => p.skillId === id).map(p => p.prereqId);
    const resources = MOCK_RESOURCES.filter(r => r.teachesSkillId === id);
    const projects = MOCK_PROJECTS.filter(p => p.practicesSkillIds.includes(id));

    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      difficulty: skill.difficulty,
      directPrerequisiteIds: directPrereqs,
      resources,
      projects,
    };
  });
}
