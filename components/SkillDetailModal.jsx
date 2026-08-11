'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Layers,
  BookOpen,
  FolderGit2,
  Briefcase,
  GitFork,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function SkillDetailModal({ skillId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!skillId) return;
    setLoading(true);
    fetch(`/api/skills?id=${skillId}`)
      .then(res => res.json())
      .then(res => setData(res.skill))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [skillId]);

  if (!skillId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Skill Graph Inspector</h3>
              <p className="text-xs text-slate-400 font-mono">Entity ID: {skillId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <span className="text-xs font-mono">Traversing CognoDB neighborhood graph...</span>
            </div>
          ) : !data ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              Skill details could not be loaded.
            </div>
          ) : (
            <>
              {/* Skill Basic Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-white">{data.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-950 border border-indigo-700 text-indigo-300">
                    {data.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300">
                    {data.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                  {data.description}
                </p>
              </div>

              {/* Multi-Hop Prerequisite Hierarchy */}
              {data.multiHopPrerequisites && data.multiHopPrerequisites.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
                    <GitFork className="w-3.5 h-3.5 text-indigo-400 -rotate-45" />
                    Multi-Hop Prerequisite Chain ([:REQUIRES*1..4])
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    {data.multiHopPrerequisites.map((pre, idx) => (
                      <div key={pre.id} className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-xs font-medium">
                          {pre.name}
                        </span>
                        {idx < data.multiHopPrerequisites.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Neighborhood Entities */}
              {data.neighborhood && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Required by Roles */}
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    <h5 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Required By Roles
                    </h5>
                    {data.neighborhood.requiredByRoles?.length === 0 ? (
                      <span className="text-xs text-slate-500 italic">None</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {data.neighborhood.requiredByRoles.map(r => (
                          <span
                            key={r.id}
                            className="px-2 py-1 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs"
                          >
                            {r.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Learning Resources */}
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    <h5 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Taught By Resources
                    </h5>
                    {data.neighborhood.learningResources?.length === 0 ? (
                      <span className="text-xs text-slate-500 italic">None</span>
                    ) : (
                      <div className="space-y-1.5">
                        {data.neighborhood.learningResources.map(res => (
                          <div
                            key={res.id}
                            className="text-xs text-slate-300 truncate hover:text-indigo-300"
                          >
                            • {res.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
