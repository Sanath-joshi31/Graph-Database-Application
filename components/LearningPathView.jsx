'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  BookOpen,
  FolderGit2,
  GitFork,
  Sparkles,
  Award,
  Layers,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import SkillDetailModal from './SkillDetailModal';

export default function LearningPathView({ pathData, targetRole, userSkills = [] }) {
  const [selectedSkillId, setSelectedSkillId] = useState(null);

  if (!pathData || !targetRole) return null;

  const { totalRequiredCount, matchedCount, missingCount, matchedSkills, stages } = pathData;
  const progressPercent = Math.round((matchedCount / (totalRequiredCount || 1)) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Progress Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-xs text-indigo-300 font-mono mb-3">
              <Award className="w-3.5 h-3.5" /> Target Goal: {targetRole.name}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Your Personalized Graph Learning Roadmap
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {targetRole.description}
            </p>
          </div>

          {/* Progress Ring / Gauge */}
          <div className="flex items-center gap-5 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-bold text-white">{progressPercent}%</span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Role Match Summary</div>
              <div className="text-sm font-semibold text-white mt-0.5">
                <span className="text-emerald-400 font-bold">{matchedCount}</span> of {totalRequiredCount} skills possessed
              </div>
              <div className="text-xs text-indigo-400 font-medium mt-1">
                {missingCount} skills left to master
              </div>
            </div>
          </div>
        </div>

        {/* User Current Skills Pills */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mr-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Acquired Skills ({matchedSkills.length}):
          </span>
          {matchedSkills.length === 0 ? (
            <span className="text-xs text-slate-500 italic">No skills selected yet</span>
          ) : (
            matchedSkills.map(s => (
              <span
                key={s.id}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium flex items-center gap-1"
              >
                {s.name}
              </span>
            ))
          )}
        </div>
      </div>

      {/* 2. Visual Multi-hop Step Sequence Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Step-by-Step Learning Progression
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Ordered by graph dependency topology
          </span>
        </div>

        {stages.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center border border-emerald-500/30">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white">You already possess all required skills!</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Congratulations! Your current skill set meets or exceeds all prerequisites for {targetRole.name}.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {stages.map((stageSkills, stageIndex) => (
              <div
                key={stageIndex}
                className="relative pl-6 sm:pl-8 border-l-2 border-indigo-500/40 pb-2 last:pb-0"
              >
                {/* Stage Badge Node */}
                <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-indigo-500 text-indigo-300 flex items-center justify-center text-xs font-bold font-mono shadow-md">
                  {stageIndex + 1}
                </div>

                <div className="mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                    Stage {stageIndex + 1}: {stageIndex === 0 ? 'Foundational Prerequisites' : stageIndex === stages.length - 1 ? 'Target Competencies' : 'Intermediate Mastery'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stageSkills.map(skill => (
                    <div
                      key={skill.id}
                      className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-base font-bold text-white hover:text-indigo-300 transition-colors">
                            {skill.name}
                          </h4>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-mono shrink-0 ${
                              skill.difficulty === 'Beginner'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                                : skill.difficulty === 'Intermediate'
                                ? 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                                : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                            }`}
                          >
                            {skill.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                          {skill.description}
                        </p>

                        {/* Learning Resources */}
                        {skill.resources && skill.resources.length > 0 && (
                          <div className="mb-3 space-y-1.5">
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 font-mono">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Learning Material:
                            </span>
                            {skill.resources.map(res => (
                              <a
                                key={res.id}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-indigo-300 transition-colors flex items-center justify-between group"
                              >
                                <span className="truncate pr-2">{res.title}</span>
                                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Practice Projects */}
                        {skill.projects && skill.projects.length > 0 && (
                          <div className="mb-4 space-y-1.5">
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 font-mono">
                              <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" /> Practice Project:
                            </span>
                            {skill.projects.map(proj => (
                              <div
                                key={proj.id}
                                className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300"
                              >
                                <div className="font-medium text-slate-200">{proj.title}</div>
                                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                  {proj.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setSelectedSkillId(skill.id)}
                          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                        >
                          <GitFork className="w-3.5 h-3.5 -rotate-45" /> Explore Graph Neighborhood
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkillId && (
        <SkillDetailModal
          skillId={selectedSkillId}
          onClose={() => setSelectedSkillId(null)}
        />
      )}
    </div>
  );
}
