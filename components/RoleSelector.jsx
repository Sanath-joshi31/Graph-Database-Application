'use client';

import { Check, Target, Briefcase, ChevronRight } from 'lucide-react';

export default function RoleSelector({ roles = [], selectedRoleId = '', onSelectRole }) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-mono">
            2
          </span>
          Select Your Target Role
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Choose the career goal you want to work towards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {roles.map(role => {
          const isSelected = selectedRoleId === role.id;
          return (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`group cursor-pointer p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-600/15 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {role.name}
                    </h3>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs ${
                      isSelected
                        ? 'bg-indigo-500 text-white border-indigo-400'
                        : 'border-slate-700 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {role.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                <span className="font-mono text-indigo-400">
                  {role.requiredSkillIds?.length || 0} Core Skills
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-slate-500 group-hover:text-slate-300">
                  Select <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
