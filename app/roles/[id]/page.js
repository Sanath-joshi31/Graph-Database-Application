'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Briefcase, ArrowLeft, Layers, Sparkles, Loader2, GitFork } from 'lucide-react';
import SkillDetailModal from '@/components/SkillDetailModal';

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkillId, setSelectedSkillId] = useState(null);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/roles?id=${params.id}`)
      .then(r => r.json())
      .then(res => setRole(res.role))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <span className="text-xs font-mono text-slate-400">Loading career role specs...</span>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="text-center py-20 text-slate-400">
        Role not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Roles
      </button>

      {/* Role Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-purple-500/20 relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-purple-400">Career Role Specification</span>
              <h1 className="text-3xl font-extrabold text-white mt-0.5">{role.name}</h1>
              <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">{role.description}</p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/?role=${role.id}`)}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Build Path For This Role
          </button>
        </div>
      </div>

      {/* Required Skills Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" /> Required Skills in Property Graph ({role.requiredSkills?.length || 0})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {role.requiredSkills?.map(s => (
            <div
              key={s.id}
              onClick={() => setSelectedSkillId(s.id)}
              className="glass-card p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-indigo-500/50 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-indigo-300 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800">
                    {s.category || 'General'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{s.difficulty}</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {s.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 text-xs text-indigo-400 font-medium flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5 -rotate-45" /> Explore Prerequisites
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedSkillId && (
        <SkillDetailModal skillId={selectedSkillId} onClose={() => setSelectedSkillId(null)} />
      )}
    </div>
  );
}
