// ==========================================
// PathGraph - CognoDB Cypher Schema Constraints & Indexes
// ==========================================

// Node Uniqueness Constraints
CREATE CONSTRAINT skill_id_unique IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT role_id_unique IF NOT EXISTS FOR (r:Role) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT resource_id_unique IF NOT EXISTS FOR (res:Resource) REQUIRE res.id IS UNIQUE;
CREATE CONSTRAINT project_id_unique IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT category_id_unique IF NOT EXISTS FOR (c:Category) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;

// Node Property Indexes for fast lookup
CREATE INDEX skill_name_idx IF NOT EXISTS FOR (s:Skill) ON (s.name);
CREATE INDEX role_name_idx IF NOT EXISTS FOR (r:Role) ON (r.name);
