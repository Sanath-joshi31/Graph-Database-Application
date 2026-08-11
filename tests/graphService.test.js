import test from 'node:test';
import assert from 'node:assert/strict';
import { getFullGraphData, getSkillNeighborhood } from '../lib/services/graphService.js';

test('getFullGraphData produces valid nodes and edges graph structure', async () => {
  const data = await getFullGraphData(['javascript'], 'frontend-engineer');
  
  assert.ok(Array.isArray(data.nodes), 'data.nodes must be an array');
  assert.ok(Array.isArray(data.edges), 'data.edges must be an array');
  assert.ok(data.nodes.length > 5, 'Should return categories, skills, roles, resources, projects');
  assert.ok(data.edges.length > 5, 'Should return typed relationships');

  const nodeTypes = new Set(data.nodes.map(n => n.type));
  assert.ok(nodeTypes.has('Skill'), 'Must contain Skill nodes');
  assert.ok(nodeTypes.has('Role'), 'Must contain Role nodes');
  assert.ok(nodeTypes.has('Resource'), 'Must contain Resource nodes');
  assert.ok(nodeTypes.has('Project'), 'Must contain Project nodes');
});

test('getSkillNeighborhood fetches 1-hop connected graph neighborhood for React', async () => {
  const result = await getSkillNeighborhood('react');

  assert.ok(result !== null);
  assert.equal(result.skill.id, 'react');
  assert.ok(Array.isArray(result.prerequisites));
  assert.ok(Array.isArray(result.learningResources));
  assert.ok(Array.isArray(result.practiceProjects));
});
