import { getRoleSkillsQuery, getLearningPathNodesQuery } from '../cognodb/queries.js';

/**
 * Topologically sort skills based on prerequisite dependencies
 * @param {Array<{ id: string, directPrerequisiteIds: string[] }>} skillNodes
 * @param {string[]} userSkillIds
 * @returns {Array<Array<any>>} Array of stages/levels of skills to learn in sequence
 */
export function computeLearningSequence(skillNodes, userSkillIds = []) {
  const nodeMap = new Map();
  skillNodes.forEach(node => nodeMap.set(node.id, { ...node, inDegree: 0, children: [] }));

  // Set up dependency edges among missing skills
  skillNodes.forEach(node => {
    const current = nodeMap.get(node.id);
    (node.directPrerequisiteIds || []).forEach(prereqId => {
      // Only count dependencies on skills that are also in the missing nodes list (not already known)
      if (nodeMap.has(prereqId) && !userSkillIds.includes(prereqId)) {
        current.inDegree += 1;
        const prereqNode = nodeMap.get(prereqId);
        prereqNode.children.push(node.id);
      }
    });
  });

  const stages = [];
  let remainingNodes = Array.from(nodeMap.values());

  while (remainingNodes.length > 0) {
    // Skills with zero remaining prerequisite dependencies can be learned next
    const currentStage = remainingNodes.filter(n => n.inDegree === 0);

    if (currentStage.length === 0) {
      // Fallback for cyclic dependencies (if any exist)
      stages.push(remainingNodes);
      break;
    }

    stages.push(currentStage);

    // Remove current stage nodes and decrement inDegree of dependent children
    const stageIds = new Set(currentStage.map(n => n.id));
    remainingNodes = remainingNodes.filter(n => !stageIds.has(n.id));

    currentStage.forEach(node => {
      node.children.forEach(childId => {
        const child = nodeMap.get(childId);
        if (child && child.inDegree > 0) {
          child.inDegree -= 1;
        }
      });
    });
  }

  return stages;
}

/**
 * Main path service method: Generate career learning path
 * @param {string} roleId - Target career role ID
 * @param {string[]} userSkillIds - Array of skill IDs user currently possesses
 */
export async function calculateLearningPath(roleId, userSkillIds = []) {
  // Fetch all role required skills
  const requiredSkills = await getRoleSkillsQuery(roleId);
  const requiredSkillIds = requiredSkills.map(s => s.id);

  // Compute matched vs missing skills
  const matchedSkills = requiredSkills.filter(s => userSkillIds.includes(s.id));
  
  // Fetch missing skills and their transitive graph prerequisites
  const pathNodes = await getLearningPathNodesQuery(roleId, userSkillIds);

  // Order skills topologically into step-by-step learning stages
  const stages = computeLearningSequence(pathNodes, userSkillIds);

  return {
    roleId,
    totalRequiredCount: requiredSkills.length,
    matchedCount: matchedSkills.length,
    missingCount: pathNodes.length,
    matchedSkills,
    pathNodes,
    stages, // Array of arrays: [[Step 1 Skills], [Step 2 Skills], ...]
  };
}
