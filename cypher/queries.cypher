// ============================================================================
// PathGraph — Mandatory Parameterized Cypher Queries for CognoDB
// ============================================================================

// ----------------------------------------------------------------------------
// QUERY A: All skills directly required by a career role
// ----------------------------------------------------------------------------
// Purpose: Fetch all skills tied to a target role.
// Parameters: { roleId: "frontend-engineer" }
MATCH (r:Role {id: $roleId})-[:REQUIRES]->(s:Skill)
OPTIONAL MATCH (s)-[:BELONGS_TO]->(c:Category)
RETURN s.id AS id, 
       s.name AS name, 
       s.description AS description, 
       s.difficulty AS difficulty,
       c.name AS category
ORDER BY s.name;


// ----------------------------------------------------------------------------
// QUERY B: Multi-Hop Prerequisite Graph Traversal
// ----------------------------------------------------------------------------
// Purpose: Given a target skill, traverse up to 4 hops deep to find all
// recursive prerequisites required before learning this skill.
// Parameters: { skillId: "react" }
MATCH path = (target:Skill {id: $skillId})-[:REQUIRES*1..4]->(prereq:Skill)
UNWIND nodes(path) AS n
WITH DISTINCT n
OPTIONAL MATCH (n)-[:BELONGS_TO]->(c:Category)
RETURN n.id AS id, 
       n.name AS name, 
       n.description AS description, 
       n.difficulty AS difficulty,
       c.name AS category;


// ----------------------------------------------------------------------------
// QUERY C: Missing Skills Analysis for a User & Target Role
// ----------------------------------------------------------------------------
// Purpose: Compare the required skills for $roleId against the skills already 
// acquired by the user ($userSkillIds), graph-native set difference.
// Parameters: { roleId: "frontend-engineer", userSkillIds: ["prog-fund", "git", "html-css", "javascript"] }
MATCH (r:Role {id: $roleId})-[:REQUIRES]->(req:Skill)
WHERE NOT req.id IN $userSkillIds
OPTIONAL MATCH (req)-[:BELONGS_TO]->(c:Category)
RETURN req.id AS id, 
       req.name AS name, 
       req.description AS description, 
       req.difficulty AS difficulty,
       c.name AS category
ORDER BY req.difficulty, req.name;


// ----------------------------------------------------------------------------
// QUERY D: Learning Resources & Practice Projects for Missing Skills
// ----------------------------------------------------------------------------
// Purpose: Discover learning materials (books, courses) and practice projects
// connected directly to missing skills.
// Parameters: { skillIds: ["typescript", "react", "testing-frontend"] }
MATCH (s:Skill) WHERE s.id IN $skillIds
OPTIONAL MATCH (res:Resource)-[:TEACHES]->(s)
OPTIONAL MATCH (proj:Project)-[:PRACTICES]->(s)
RETURN s.id AS skillId,
       collect(DISTINCT {
         id: res.id, title: res.title, type: res.type, url: res.url, difficulty: res.difficulty
       }) AS resources,
       collect(DISTINCT {
         id: proj.id, title: proj.title, description: proj.description, difficulty: proj.difficulty
       }) AS projects;


// ----------------------------------------------------------------------------
// QUERY E: Graph Neighborhood Exploration
// ----------------------------------------------------------------------------
// Purpose: Fetch all immediate nodes connected to a selected node (up to 1-hop)
// across all relationship types (prerequisites, dependent skills, roles, resources, projects).
// Parameters: { skillId: "react" }
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
       cat AS category;


// ----------------------------------------------------------------------------
// QUERY F: Graph Learning Path Computation & Topological Sequence
// ----------------------------------------------------------------------------
// Purpose: Find all skills required by $roleId (and their transitive prerequisite trees),
// filter out already known skills ($userSkillIds), and return graph paths so the
// service layer can compute the shortest dependency-ordered learning path.
// Parameters: { roleId: "frontend-engineer", userSkillIds: ["prog-fund", "git", "html-css"] }
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
       collect(DISTINCT res) AS resources,
       collect(DISTINCT proj) AS projects;
