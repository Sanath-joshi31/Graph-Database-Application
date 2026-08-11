'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Search, ChevronRight, Loader2, GitFork } from 'lucide-react';
import SkillDetailModal from '@/components/SkillDetailModal';

export default function SkillsDirectoryPage() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [selectedSkillId, setSelectedSkillId] = useState(null);

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(res => {
        setSkills(res.skills || []);
        setCategories(res.categories || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = skills.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || s.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Skills Directory</h1>
        <p className="text-xs text-slate-400 mt-1">Browse all tech competencies registered in the CognoDB property graph.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1">
          <button
            onClick={() => setSelectedCat('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium ${selectedCat === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap ${selectedCat === c.name ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          <span className="text-xs font-mono">Loading skills graph...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(skill => (
            <div
              key={skill.id}
              onClick={() => setSelectedSkillId(skill.id)}
              className="glass-card p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-indigo-500/50 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60">
                    {skill.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{skill.difficulty}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {skill.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5 -rotate-45" /> View Neighborhood
                </span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSkillId && (
        <SkillDetailModal skillId={selectedSkillId} onClose={() => setSelectedSkillId(null)} />
      )}
    </div>
  );
}
