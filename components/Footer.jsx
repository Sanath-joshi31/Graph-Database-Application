import { GitFork, Database, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800/60">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <GitFork className="w-4 h-4 text-white -rotate-45" />
              </div>
              <span className="text-base font-bold text-white">PathGraph</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discover the shortest path from what you know to what you want to become. Powered by CognoDB openCypher multi-hop graph traversal engine.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              Graph Data Model
            </h4>
            <ul className="text-xs text-slate-400 space-y-1.5 font-mono">
              <li>(:User)-[:HAS_SKILL]-&gt;(:Skill)</li>
              <li>(:Role)-[:REQUIRES]-&gt;(:Skill)</li>
              <li>(:Skill)-[:REQUIRES*1..4]-&gt;(:Skill)</li>
              <li>(:Resource)-[:TEACHES]-&gt;(:Skill)</li>
              <li>(:Project)-[:PRACTICES]-&gt;(:Skill)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              CognoDB Bolt Protocol
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Communicates over Neo4j Bolt 5.0 protocol using parameterized Cypher queries with strict multi-hop pattern matching.
            </p>
            <span className="inline-block px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
              bolt+s://... (Port 7687)
            </span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PathGraph Application. Wexa AI Engineering Assignment.</p>
          <p className="font-mono">CognoDB Managed Cloud Database</p>
        </div>
      </div>
    </footer>
  );
}
