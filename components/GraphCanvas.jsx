'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Layers,
  Briefcase,
  BookOpen,
  FolderGit2,
  GitFork,
  Search,
} from 'lucide-react';

const NODE_COLORS = {
  Skill: { bg: '#3b82f6', border: '#60a5fa', text: '#ffffff', icon: Layers },
  Role: { bg: '#8b5cf6', border: '#a78bfa', text: '#ffffff', icon: Briefcase },
  Resource: { bg: '#10b981', border: '#34d399', text: '#ffffff', icon: BookOpen },
  Project: { bg: '#06b6d4', border: '#22d3ee', text: '#ffffff', icon: FolderGit2 },
  Category: { bg: '#475569', border: '#64748b', text: '#ffffff', icon: GitFork },
};

export default function GraphCanvas({ graphData, onSelectNode }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!graphData || !graphData.nodes) {
    return (
      <div className="glass-panel h-96 rounded-2xl flex items-center justify-center text-slate-500 text-sm font-mono">
        Loading Graph Visualization Canvas...
      </div>
    );
  }

  const { nodes, edges } = graphData;

  // Filter nodes
  const filteredNodes = nodes.filter(n => {
    const matchesType = activeFilter === 'ALL' || n.type === activeFilter;
    const matchesSearch =
      !searchQuery ||
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const nodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));

  // Compute neat grid/circle layout positioning for graph nodes
  const nodePositions = {};
  const skillNodes = filteredNodes.filter(n => n.type === 'Skill');
  const roleNodes = filteredNodes.filter(n => n.type === 'Role');
  const resourceNodes = filteredNodes.filter(n => n.type === 'Resource');
  const projectNodes = filteredNodes.filter(n => n.type === 'Project');
  const categoryNodes = filteredNodes.filter(n => n.type === 'Category');

  // Layout columns: Category -> Skills -> Roles -> Resources -> Projects
  const columns = [
    { type: 'Category', items: categoryNodes, x: 80 },
    { type: 'Skill', items: skillNodes, x: 320 },
    { type: 'Role', items: roleNodes, x: 620 },
    { type: 'Resource', items: resourceNodes, x: 880 },
    { type: 'Project', items: projectNodes, x: 1140 },
  ];

  columns.forEach(col => {
    col.items.forEach((node, idx) => {
      const spacing = col.items.length > 1 ? 580 / Math.max(col.items.length - 1, 1) : 300;
      const y = 80 + idx * Math.min(spacing, 70);
      nodePositions[node.id] = { x: col.x, y };
    });
  });

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden relative flex flex-col h-[700px]">
      {/* Canvas Top Bar Controls */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <GitFork className="w-4 h-4 -rotate-45" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Interactive Graph Canvas</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              {filteredNodes.length} Nodes • {filteredEdges.length} Relationships
            </p>
          </div>
        </div>

        {/* Search & Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search graph..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-36 sm:w-48"
            />
          </div>

          {['ALL', 'Skill', 'Role', 'Resource', 'Project'].map(type => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeFilter === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
            className="p-1 text-slate-400 hover:text-white rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-slate-400 font-mono w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(1.6, z + 0.15))}
            className="p-1 text-slate-400 hover:text-white rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 text-slate-400 hover:text-white rounded ml-1"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main SVG Graph Canvas View */}
      <div className="flex-1 relative overflow-auto bg-slate-950/90 cursor-grab active:cursor-grabbing">
        <svg
          className="w-[1300px] h-[750px] transition-transform duration-200 origin-top-left"
          style={{ transform: `scale(${zoom})` }}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
            </marker>
          </defs>

          {/* Render Graph Edges */}
          {filteredEdges.map(edge => {
            const srcPos = nodePositions[edge.source];
            const tgtPos = nodePositions[edge.target];
            if (!srcPos || !tgtPos) return null;

            const isHovered =
              hoveredNode && (hoveredNode.id === edge.source || hoveredNode.id === edge.target);

            return (
              <g key={edge.id}>
                <line
                  x1={srcPos.x}
                  y1={srcPos.y}
                  x2={tgtPos.x}
                  y2={tgtPos.y}
                  stroke={isHovered ? '#818cf8' : '#334155'}
                  strokeWidth={isHovered ? 2.5 : 1.2}
                  strokeDasharray={edge.type === 'PREREQUISITE' ? '4,4' : 'none'}
                  markerEnd="url(#arrow)"
                />
              </g>
            );
          })}

          {/* Render Graph Nodes */}
          {filteredNodes.map(node => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const config = NODE_COLORS[node.type] || NODE_COLORS.Skill;
            const Icon = config.icon;
            const isHovered = hoveredNode?.id === node.id;
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => {
                  setSelectedNode(node);
                  if (onSelectNode) onSelectNode(node);
                }}
              >
                {/* Glow ring on hover */}
                {(isHovered || isSelected) && (
                  <circle
                    r="24"
                    fill="none"
                    stroke={config.border}
                    strokeWidth="3"
                    className="animate-pulse"
                    opacity="0.8"
                  />
                )}

                {/* Node circle */}
                <circle
                  r="18"
                  fill={config.bg}
                  stroke={config.border}
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-110"
                />

                {/* Node Label */}
                <text
                  x="26"
                  y="4"
                  fill="#f8fafc"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  {node.label.length > 24 ? `${node.label.substring(0, 22)}...` : node.label}
                </text>
                <text
                  x="26"
                  y="18"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  :{node.type}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Sidebar overlay */}
      {selectedNode && (
        <div className="absolute right-4 bottom-4 w-80 glass-panel p-4 rounded-2xl border border-indigo-500/40 shadow-2xl z-20 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              :{selectedNode.type}
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <h4 className="text-sm font-bold text-white mb-1">{selectedNode.label}</h4>
          {selectedNode.data?.description && (
            <p className="text-xs text-slate-300 line-clamp-3 mb-3 leading-relaxed">
              {selectedNode.data.description}
            </p>
          )}

          {selectedNode.type === 'Skill' && (
            <button
              onClick={() => onSelectNode && onSelectNode(selectedNode)}
              className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <GitFork className="w-3.5 h-3.5 -rotate-45" /> Full Neighborhood
            </button>
          )}
        </div>
      )}
    </div>
  );
}
