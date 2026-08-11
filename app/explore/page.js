'use client';

import { useState, useEffect } from 'react';
import { GitFork, Loader2 } from 'lucide-react';
import GraphCanvas from '@/components/GraphCanvas';
import SkillDetailModal from '@/components/SkillDetailModal';

export default function ExplorePage() {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inspectorSkillId, setInspectorSkillId] = useState(null);

  useEffect(() => {
    async function loadGraph() {
      setLoading(true);
      try {
        const res = await fetch('/api/graph');
        const data = await res.json();
        setGraphData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGraph();
  }, []);

  const handleSelectNode = node => {
    if (node.type === 'Skill') {
      setInspectorSkillId(node.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-xs font-mono text-indigo-300 mb-2">
            <GitFork className="w-3.5 h-3.5 -rotate-45" /> CognoDB Cypher Explorer
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Interactive Graph Visualization
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore property graph nodes, relationships, prerequisite links, learning materials, and career roles.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel h-[500px] rounded-3xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <span className="text-xs font-mono text-slate-400">Loading graph schema & nodes...</span>
        </div>
      ) : (
        <GraphCanvas graphData={graphData} onSelectNode={handleSelectNode} />
      )}

      {/* Inspector Modal */}
      {inspectorSkillId && (
        <SkillDetailModal
          skillId={inspectorSkillId}
          onClose={() => setInspectorSkillId(null)}
        />
      )}
    </div>
  );
}
