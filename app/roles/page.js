'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, Briefcase, ChevronRight, Loader2 } from 'lucide-react';

export default function RolesDirectoryPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/roles')
      .then(r => r.json())
      .then(res => setRoles(res.roles || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Career Roles Directory</h1>
        <p className="text-xs text-slate-400 mt-1">Explore target tech roles and their required Cypher graph skills.</p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          <span className="text-xs font-mono">Loading roles...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map(role => (
            <Link
              key={role.id}
              href={`/roles/${role.id}`}
              className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {role.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-indigo-400">
                  {role.requiredSkillIds?.length || 0} Required Skills
                </span>
                <span className="text-slate-400 group-hover:text-white flex items-center gap-1">
                  View Role Graph <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
