'use client';

import { useState, useEffect } from 'react';
import { GitFork, Sparkles, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import SkillSelector from '@/components/SkillSelector';
import RoleSelector from '@/components/RoleSelector';
import LearningPathView from '@/components/LearningPathView';

export default function Home() {
  const [skills, setSkills] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState(['prog-fund', 'git', 'html-css', 'javascript']);
  const [selectedRoleId, setSelectedRoleId] = useState('frontend-engineer');

  const [loading, setLoading] = useState(true);
  const [buildingPath, setBuildingPath] = useState(false);
  const [pathData, setPathData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch initial skills and roles
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const [skillsRes, rolesRes] = await Promise.all([
          fetch('/api/skills').then(r => r.json()),
          fetch('/api/roles').then(r => r.json()),
        ]);

        setSkills(skillsRes.skills || []);
        setRoles(rolesRes.roles || []);
      } catch (err) {
        console.error(err);
        setError('Failed to connect to graph database services.');
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Compute learning path via API
  const handleBuildPath = async () => {
    if (!selectedRoleId) return;
    setBuildingPath(true);
    setError(null);

    try {
      const res = await fetch('/api/path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleId: selectedRoleId,
          userSkillIds: selectedSkillIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to compute path');

      setPathData(data);

      // Scroll smoothly to path view
      setTimeout(() => {
        const pathEl = document.getElementById('learning-path-section');
        if (pathEl) pathEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error executing graph traversal query');
    } finally {
      setBuildingPath(false);
    }
  };

  const currentRole = roles.find(r => r.id === selectedRoleId);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-10 sm:py-16 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-indigo-300 mb-6 shadow-inner">
          <GitFork className="w-4 h-4 text-indigo-400 -rotate-45" />
          <span>Powered by CognoDB openCypher Graph Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Discover the shortest path from{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            what you know
          </span>{' '}
          to what you want to become.
        </h1>

        <p className="text-base sm:text-lg text-slate-400 mt-5 max-w-2xl mx-auto leading-relaxed">
          PathGraph traverses multi-hop prerequisite dependencies, missing skill gaps, and learning resources across your career graph in milliseconds.
        </p>
      </section>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <span className="text-xs font-mono text-slate-400">Loading graph skills & roles directory...</span>
        </div>
      ) : (
        <>
          {/* Step 1 & Step 2 Selection Form */}
          <div className="space-y-6">
            <SkillSelector
              skills={skills}
              selectedSkillIds={selectedSkillIds}
              onChange={setSelectedSkillIds}
            />

            <RoleSelector
              roles={roles}
              selectedRoleId={selectedRoleId}
              onSelectRole={setSelectedRoleId}
            />

            {/* Build Path CTA */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={handleBuildPath}
                disabled={buildingPath || !selectedRoleId}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {buildingPath ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Traversing Cypher Graph...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
                    <span>Build My Learning Path</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center font-mono">
              ⚠️ {error}
            </div>
          )}

          {/* Learning Path Results Section */}
          {pathData && currentRole && (
            <div id="learning-path-section" className="pt-8">
              <LearningPathView
                pathData={pathData}
                targetRole={currentRole}
                userSkills={selectedSkillIds}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
