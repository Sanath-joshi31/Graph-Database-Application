'use client';

import { useState } from 'react';
import { Check, Search, Sparkles, X } from 'lucide-react';

export default function SkillSelector({ skills = [], selectedSkillIds = [], onChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Extract unique categories
  const categories = ['ALL', ...Array.from(new Set(skills.map(s => s.category).filter(Boolean)))];

  const filteredSkills = skills.filter(skill => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || skill.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const toggleSkill = skillId => {
    if (selectedSkillIds.includes(skillId)) {
      onChange(selectedSkillIds.filter(id => id !== skillId));
    } else {
      onChange([...selectedSkillIds, skillId]);
    }
  };

  const applyPreset = presetType => {
    let presetSkillIds = [];
    if (presetType === 'web') {
      presetSkillIds = ['prog-fund', 'git', 'html-css', 'javascript'];
    } else if (presetType === 'data') {
      presetSkillIds = ['prog-fund', 'git', 'python'];
    } else if (presetType === 'devops') {
      presetSkillIds = ['prog-fund', 'git', 'linux'];
    } else if (presetType === 'clear') {
      presetSkillIds = [];
    }
    onChange(presetSkillIds);
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-mono">
              1
            </span>
            Select Your Current Skills
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose what you already know ({selectedSkillIds.length} skills selected)
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-mono text-[11px] mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('web')}
            className="px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 hover:bg-indigo-900/80 transition-colors"
          >
            Web Starter
          </button>
          <button
            type="button"
            onClick={() => applyPreset('data')}
            className="px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-800/60 text-purple-300 hover:bg-purple-900/80 transition-colors"
          >
            Data Starter
          </button>
          <button
            type="button"
            onClick={() => applyPreset('devops')}
            className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/80 transition-colors"
          >
            DevOps Starter
          </button>
          {selectedSkillIds.length > 0 && (
            <button
              type="button"
              onClick={() => applyPreset('clear')}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Tag Cloud */}
      <div className="flex flex-wrap gap-2.5 max-h-64 overflow-y-auto p-1 pr-2">
        {filteredSkills.map(skill => {
          const isSelected = selectedSkillIds.includes(skill.id);
          return (
            <button
              key={skill.id}
              type="button"
              onClick={() => toggleSkill(skill.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all transform active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                  : 'bg-slate-900/90 border border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${
                  isSelected
                    ? 'bg-white text-indigo-600 border-white font-bold'
                    : 'border-slate-700 bg-slate-950 text-transparent'
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>{skill.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  skill.difficulty === 'Beginner'
                    ? 'bg-emerald-950/80 text-emerald-400'
                    : skill.difficulty === 'Intermediate'
                    ? 'bg-blue-950/80 text-blue-400'
                    : 'bg-amber-950/80 text-amber-400'
                }`}
              >
                {skill.difficulty}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
