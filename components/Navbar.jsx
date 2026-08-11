'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GitFork, Compass, Map, Layers, Award } from 'lucide-react';
import DbStatusBadge from './DbStatusBadge';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: Compass },
    { name: 'Graph Explorer', href: '/explore', icon: GitFork },
    { name: 'Skills Library', href: '/skills', icon: Layers },
    { name: 'Career Roles', href: '/roles', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GitFork className="w-5 h-5 text-white transform -rotate-45" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              PathGraph
            </span>
            <span className="block text-[10px] text-slate-400 font-mono -mt-1 tracking-wider uppercase">
              CognoDB Engine
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/60">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Database Status Badge */}
        <div className="flex items-center gap-3">
          <DbStatusBadge />
        </div>
      </div>
    </header>
  );
}
