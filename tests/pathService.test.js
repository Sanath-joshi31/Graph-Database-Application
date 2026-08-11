import test from 'node:test';
import assert from 'node:assert/strict';
import { computeLearningSequence, calculateLearningPath } from '../lib/services/pathService.js';

test('computeLearningSequence sorts skills topologically without cycle deadlocks', () => {
  const mockNodes = [
    { id: 'react', directPrerequisiteIds: ['javascript', 'html-css'] },
    { id: 'javascript', directPrerequisiteIds: ['prog-fund'] },
    { id: 'html-css', directPrerequisiteIds: ['prog-fund'] },
    { id: 'testing-frontend', directPrerequisiteIds: ['react', 'typescript'] },
    { id: 'typescript', directPrerequisiteIds: ['javascript'] },
  ];

  const userSkillIds = ['prog-fund']; // User already knows Programming Fundamentals

  const stages = computeLearningSequence(mockNodes, userSkillIds);

  assert.equal(Array.isArray(stages), true);
  assert.ok(stages.length >= 2, 'Should create at least 2 sequential learning stages');

  // First stage should contain skills whose prerequisites are already satisfied by user (javascript & html-css)
  const stage1Ids = stages[0].map(n => n.id);
  assert.ok(stage1Ids.includes('javascript') || stage1Ids.includes('html-css'));

  // React & TypeScript should appear in subsequent stages after javascript
  const stage2Ids = (stages[1] || []).map(n => n.id);
  assert.ok(stage2Ids.includes('react') || stage2Ids.includes('typescript'));
});

test('calculateLearningPath returns structured result for Frontend Engineer', async () => {
  const result = await calculateLearningPath('frontend-engineer', ['prog-fund', 'git', 'html-css', 'javascript']);

  assert.equal(result.roleId, 'frontend-engineer');
  assert.equal(typeof result.totalRequiredCount, 'number');
  assert.ok(result.totalRequiredCount > 0);
  assert.equal(typeof result.matchedCount, 'number');
  assert.equal(typeof result.missingCount, 'number');
  assert.ok(Array.isArray(result.stages));
});
