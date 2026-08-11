'use client';

import { useState, useEffect } from 'react';
import { Database, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function DbStatusBadge() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data.database);
    } catch (err) {
      setHealth({ isConnected: false, error: 'API unreachable' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
        <span>Checking DB...</span>
      </div>
    );
  }

  const isConnected = health?.isConnected;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
        isConnected
          ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
          : 'bg-amber-950/50 border-amber-500/30 text-amber-300'
      }`}
      title={health?.error || health?.databaseInfo || 'Database Status'}
    >
      <Database className="w-3.5 h-3.5" />
      <span className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`}
        />
        {isConnected ? 'CognoDB Active' : 'Mock Graph Mode'}
      </span>
      <button
        onClick={fetchHealth}
        className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
        title="Refresh connectivity"
      >
        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
