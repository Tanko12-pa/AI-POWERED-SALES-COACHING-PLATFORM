import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SoftwareTool } from './SalesSoftwareDirectory';
import { Sparkles, Maximize2, RotateCcw, Star, ExternalLink, Sliders, Info, Filter } from 'lucide-react';

interface SalesToolsD3ChartProps {
  tools: SoftwareTool[];
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
  onSelectTool: (tool: SoftwareTool) => void;
  isDarkMode?: boolean;
  aiMatchScores?: Record<string, number>;
  showEfficiencyThreshold?: boolean;
  onToggleEfficiencyThreshold?: () => void;
  showOnlyAiMatches?: boolean;
  onToggleShowOnlyAiMatches?: () => void;
}

export const SalesToolsD3Chart: React.FC<SalesToolsD3ChartProps> = ({
  tools,
  favorites,
  onToggleFavorite,
  onSelectTool,
  isDarkMode = false,
  aiMatchScores = {},
  showEfficiencyThreshold = true,
  onToggleEfficiencyThreshold,
  showOnlyAiMatches = false,
  onToggleShowOnlyAiMatches
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [hoveredTool, setHoveredTool] = useState<SoftwareTool | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('all');
  const [localEfficiencyThreshold, setLocalEfficiencyThreshold] = useState<boolean>(true);
  const [localOnlyAiMatches, setLocalOnlyAiMatches] = useState<boolean>(false);

  const activeEfficiencyThreshold = onToggleEfficiencyThreshold ? showEfficiencyThreshold : localEfficiencyThreshold;
  const activeOnlyAiMatches = onToggleShowOnlyAiMatches ? showOnlyAiMatches : localOnlyAiMatches;

  const toggleEfficiency = () => {
    if (onToggleEfficiencyThreshold) {
      onToggleEfficiencyThreshold();
    } else {
      setLocalEfficiencyThreshold((prev) => !prev);
    }
  };

  const toggleAiMatchesOnly = () => {
    if (onToggleShowOnlyAiMatches) {
      onToggleShowOnlyAiMatches();
    } else {
      setLocalOnlyAiMatches((prev) => !prev);
    }
  };

  // Category Color Palette
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI Conversation Intelligence':
        return '#3b82f6'; // Blue
      case 'Sales Training & Readiness':
        return '#10b981'; // Emerald
      case 'Sales Performance & Gamification':
        return '#f59e0b'; // Amber
      case 'Real-Time Sales Assistance':
        return '#ec4899'; // Pink
      case 'CRM & Revenue Intelligence':
        return '#8b5cf6'; // Purple
      case 'Sales Coaching for Salesforce':
        return '#06b6d4'; // Cyan
      default:
        return '#800000'; // Maroon
    }
  };

  // ResizeObserver for full responsiveness
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect && entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Helper to calculate median
  const calculateMedian = (arr: number[]): number => {
    if (arr.length === 0) return 5;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Get container dimensions
    const width = Math.max(containerWidth, 320);
    const height = 500;
    const margin = { top: 50, right: 40, bottom: 60, left: 60 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Compute dynamic median ease-of-use and cost tier scores from dataset
    const easeScores = tools.map((t) => t.easeOfUse || 7.5);
    const costScores = tools.map((t) => t.costTier || 5.0);
    const medianEase = calculateMedian(easeScores);
    const medianCost = calculateMedian(costScores);

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width).attr('height', height);

    // Add CSS Keyframes for pulsing ring animation
    svg.append('defs').html(`
      <style>
        @keyframes pulse-ring-glow {
          0% {
            r: 18px;
            stroke-opacity: 0.9;
            stroke-width: 3px;
          }
          50% {
            r: 32px;
            stroke-opacity: 0.4;
            stroke-width: 2px;
          }
          100% {
            r: 18px;
            stroke-opacity: 0.9;
            stroke-width: 3px;
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring-glow 2.2s ease-in-out infinite;
        }
      </style>
    `);

    // Root Group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    // Ease of Use: X Axis (Range 5.5 to 9.5)
    const xScale = d3.scaleLinear().domain([5.5, 9.5]).range([0, innerWidth]);

    // Cost Tier: Y Axis (Range 1 to 10 - inverted so High Cost is top)
    const yScale = d3.scaleLinear().domain([1, 10]).range([innerHeight, 0]);

    // Market Share Radius Scale (Square Root scale for accurate circle area perception)
    const radiusScale = d3.scaleSqrt().domain([5, 100]).range([8, 24]);

    // Color definitions for dark / light
    const gridColor = isDarkMode ? '#334155' : '#cbd5e1';
    const textColor = isDarkMode ? '#94a3b8' : '#64748b';

    // 1. Calculate Quadrant Boundaries using Median Scores
    const midX = xScale(medianEase);
    const midY = yScale(medianCost);

    const quadGroup = g.append('g').attr('class', 'quadrants');

    // Quadrant Definitions according to user specification
    const quadrantsData = [
      {
        id: 'costly-risks',
        x: 0,
        y: 0,
        w: midX,
        h: midY,
        label: '⚠️ Costly Risks',
        sublabel: `High Cost (> ${medianCost.toFixed(1)}) / Lower Ease (< ${medianEase.toFixed(1)})`,
        color: isDarkMode ? 'rgba(239, 68, 68, 0.08)' : 'rgba(254, 226, 226, 0.45)'
      },
      {
        id: 'strategic-investments',
        x: midX,
        y: 0,
        w: Math.max(0, innerWidth - midX),
        h: midY,
        label: '🚀 Strategic Investments',
        sublabel: `High Cost (> ${medianCost.toFixed(1)}) / High Ease (≥ ${medianEase.toFixed(1)})`,
        color: isDarkMode ? 'rgba(59, 130, 246, 0.08)' : 'rgba(219, 234, 254, 0.45)'
      },
      {
        id: 'efficient-solutions',
        x: 0,
        y: midY,
        w: midX,
        h: Math.max(0, innerHeight - midY),
        label: '⚡ Efficient Solutions',
        sublabel: `Lower Cost (≤ ${medianCost.toFixed(1)}) / Lower Ease (< ${medianEase.toFixed(1)})`,
        color: isDarkMode ? 'rgba(168, 85, 247, 0.08)' : 'rgba(243, 232, 255, 0.45)'
      },
      {
        id: 'low-hanging-fruit',
        x: midX,
        y: midY,
        w: Math.max(0, innerWidth - midX),
        h: Math.max(0, innerHeight - midY),
        label: '🍏 Low-Hanging Fruit (Sweet Spot)',
        sublabel: `Lower Cost (≤ ${medianCost.toFixed(1)}) / High Ease (≥ ${medianEase.toFixed(1)})`,
        color: isDarkMode ? 'rgba(16, 185, 129, 0.10)' : 'rgba(209, 250, 229, 0.55)'
      }
    ];

    quadrantsData.forEach((q) => {
      quadGroup
        .append('rect')
        .attr('x', q.x)
        .attr('y', q.y)
        .attr('width', q.w)
        .attr('height', q.h)
        .attr('fill', q.color)
        .attr('rx', 8)
        .attr('stroke', gridColor)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '4,4');

      const labelG = quadGroup.append('g');
      labelG
        .append('text')
        .attr('x', q.x + 12)
        .attr('y', q.y + 20)
        .attr('fill', isDarkMode ? '#e2e8f0' : '#1e293b')
        .attr('font-size', '11px')
        .attr('font-weight', '900')
        .text(q.label);

      labelG
        .append('text')
        .attr('x', q.x + 12)
        .attr('y', q.y + 33)
        .attr('fill', textColor)
        .attr('font-size', '9px')
        .attr('font-weight', '600')
        .attr('opacity', 0.85)
        .text(q.sublabel);
    });

    // Draw Interactive Median Crosshair Quadrant Boundary Lines
    const boundaryG = g.append('g').attr('class', 'median-boundaries');

    // Vertical Median Line (Ease of Use)
    boundaryG
      .append('line')
      .attr('x1', midX)
      .attr('y1', 0)
      .attr('x2', midX)
      .attr('y2', innerHeight)
      .attr('stroke', '#800000')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,4');

    // Horizontal Median Line (Cost Tier)
    boundaryG
      .append('line')
      .attr('x1', 0)
      .attr('y1', midY)
      .attr('x2', innerWidth)
      .attr('y2', midY)
      .attr('stroke', '#800000')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,4');

    // Boundary Intersection Badge
    const boundaryBadge = boundaryG
      .append('g')
      .attr('transform', `translate(${midX},${midY})`);

    boundaryBadge
      .append('circle')
      .attr('r', 10)
      .attr('fill', '#800000')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    boundaryBadge
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#ffffff')
      .attr('font-size', '9px')
      .attr('font-weight', '900')
      .text('M');

    // Median Labels near axis boundaries
    boundaryG
      .append('text')
      .attr('x', midX + 6)
      .attr('y', innerHeight - 6)
      .attr('fill', '#800000')
      .attr('font-size', '9px')
      .attr('font-weight', '900')
      .text(`Median Ease: ${medianEase.toFixed(1)}`);

    boundaryG
      .append('text')
      .attr('x', 6)
      .attr('y', midY - 6)
      .attr('fill', '#800000')
      .attr('font-size', '9px')
      .attr('font-weight', '900')
      .text(`Median Cost Tier: ${medianCost.toFixed(1)}`);

    // 2. Draw Efficiency Threshold Line if enabled
    if (activeEfficiencyThreshold) {
      const frontierPoints: [number, number][] = [
        [xScale(5.5), yScale(3.0)],
        [xScale(6.8), yScale(4.5)],
        [xScale(8.0), yScale(6.2)],
        [xScale(9.5), yScale(8.4)]
      ];

      const lineGenerator = d3.line().curve(d3.curveMonotoneX);
      const pathD = lineGenerator(frontierPoints) || '';

      const areaPoints: string = [
        `${xScale(5.5)},${yScale(3.0)}`,
        `${xScale(6.8)},${yScale(4.5)}`,
        `${xScale(8.0)},${yScale(6.2)}`,
        `${xScale(9.5)},${yScale(8.4)}`,
        `${xScale(9.5)},${yScale(1.0)}`,
        `${xScale(5.5)},${yScale(1.0)}`
      ].join(' ');

      // Add Gradient definition for Efficiency Zone
      const defs = svg.append('defs');
      const grad = defs.append('linearGradient')
        .attr('id', 'efficiency-gradient')
        .attr('x1', '0%').attr('y1', '100%')
        .attr('x2', '100%').attr('y2', '0%');
      grad.append('stop').attr('offset', '0%').attr('stop-color', '#10b981');
      grad.append('stop').attr('offset', '100%').attr('stop-color', '#A8C66C');

      g.append('polygon')
        .attr('points', areaPoints)
        .attr('fill', 'url(#efficiency-gradient)')
        .attr('opacity', 0.12);

      // Frontier Threshold Line
      g.append('path')
        .attr('d', pathD)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '6,4');

      // Label on the Threshold Line
      g.append('text')
        .attr('x', xScale(7.5))
        .attr('y', yScale(5.6) - 10)
        .attr('fill', '#10b981')
        .attr('font-size', '10px')
        .attr('font-weight', '900')
        .attr('transform', `rotate(-28, ${xScale(7.5)}, ${yScale(5.6) - 10})`)
        .text('⚡ High ROI Efficiency Frontier →');
    }

    // 3. Draw Axes
    const xAxis = d3.axisBottom(xScale).ticks(8).tickFormat((d) => `${d}/10`);
    const yAxis = d3.axisLeft(yScale).ticks(8).tickFormat((d) => {
      const val = Number(d);
      if (val <= 3) return 'Low ($)';
      if (val <= 7) return 'Mid ($$)';
      return 'High ($$$)';
    });

    const xAxisG = g
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisG.selectAll('text').attr('fill', textColor).attr('font-size', '11px');
    xAxisG.selectAll('line, path').attr('stroke', gridColor);

    const yAxisG = g.append('g').attr('class', 'y-axis').call(yAxis);
    yAxisG.selectAll('text').attr('fill', textColor).attr('font-size', '11px');
    yAxisG.selectAll('line, path').attr('stroke', gridColor);

    // Axis Titles
    svg
      .append('text')
      .attr('x', margin.left + innerWidth / 2)
      .attr('y', height - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', isDarkMode ? '#f8fafc' : '#0f172a')
      .attr('font-size', '12px')
      .attr('font-weight', '800')
      .text('Ease of Use Score → (Higher = Easier Adoption)');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(margin.top + innerHeight / 2))
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('fill', isDarkMode ? '#f8fafc' : '#0f172a')
      .attr('font-size', '12px')
      .attr('font-weight', '800')
      .text('Cost / Investment Tier → (Higher = Enterprise Price)');

    // 4. Identify Top 3 AI Matches for animation & dimming
    const sortedByAiMatch = [...tools].sort((a, b) => {
      const scoreA = aiMatchScores[a.id] || 0;
      const scoreB = aiMatchScores[b.id] || 0;
      return scoreB - scoreA;
    });

    const top3Tools = sortedByAiMatch.slice(0, 3);
    const top3Ids = new Set(top3Tools.map((t) => t.id));

    // 5. Filter tools based on quadrant & AI match selection if active
    const visibleTools = tools.filter((tool) => {
      const ease = tool.easeOfUse || 7.5;
      const cost = tool.costTier || 5;

      if (selectedQuadrant === 'low-hanging-fruit') return ease >= medianEase && cost <= medianCost;
      if (selectedQuadrant === 'strategic') return ease >= medianEase && cost > medianCost;
      if (selectedQuadrant === 'costly-risks') return ease < medianEase && cost > medianCost;
      if (selectedQuadrant === 'efficient-solutions') return ease < medianEase && cost <= medianCost;
      return true;
    });

    // Render Empty State if no tools match
    if (visibleTools.length === 0) {
      const emptyG = g
        .append('g')
        .attr('transform', `translate(${innerWidth / 2},${innerHeight / 2})`);

      emptyG
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', isDarkMode ? '#f8fafc' : '#1e293b')
        .attr('font-size', '14px')
        .attr('font-weight', '800')
        .text('No sales software tools match your current filter selection');

      emptyG
        .append('text')
        .attr('y', 22)
        .attr('text-anchor', 'middle')
        .attr('fill', isDarkMode ? '#94a3b8' : '#64748b')
        .attr('font-size', '12px')
        .text('Try resetting your quadrant or AI Match filters to view matching platforms.');

      return;
    }

    // 6. Draw Plot Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');

    visibleTools.forEach((tool) => {
      const xPos = xScale(tool.easeOfUse || 7.5);
      const yPos = yScale(tool.costTier || 5);
      const isFav = favorites.includes(tool.id);
      const color = getCategoryColor(tool.category);
      const matchScore = aiMatchScores[tool.id] || 65;
      
      const isTop3Match = top3Ids.has(tool.id);
      const rankIndex = top3Tools.findIndex((t) => t.id === tool.id) + 1;

      // Bubble radius mapped directly to Market Share
      const baseRadius = radiusScale(tool.marketShare || 25);
      const nodeRadius = isFav ? baseRadius + 2 : baseRadius;

      // Determine Opacity based on active AI Match filter mode
      // If activeOnlyAiMatches is enabled, dim non-top3 tools to 0.18 and animate top 3
      let opacity = 1.0;
      if (activeOnlyAiMatches) {
        opacity = isTop3Match ? 1.0 : 0.18;
      }

      const nodeG = nodeGroup
        .append('g')
        .attr('class', 'node-item')
        .attr('transform', `translate(${xPos},${yPos})`)
        .style('cursor', 'pointer')
        .style('opacity', opacity)
        .style('transition', 'opacity 350ms cubic-bezier(0.4, 0, 0.2, 1)');

      // Top 3 Recommended Match Animated Pulsing Halo Ring & Rank Badge
      if (isTop3Match && (activeOnlyAiMatches || matchScore >= 80)) {
        // Animated Pulse Ring
        nodeG
          .append('circle')
          .attr('class', 'animate-pulse-ring')
          .attr('r', nodeRadius + 10)
          .attr('fill', 'none')
          .attr('stroke', rankIndex === 1 ? '#10b981' : rankIndex === 2 ? '#3b82f6' : '#a855f7');

        // Glowing Outer Border
        nodeG
          .append('circle')
          .attr('r', nodeRadius + 5)
          .attr('fill', 'none')
          .attr('stroke', rankIndex === 1 ? '#10b981' : rankIndex === 2 ? '#3b82f6' : '#a855f7')
          .attr('stroke-width', 2.5)
          .attr('stroke-dasharray', '5,3');

        // Top Match Rank Badge above Node
        const badgeWidth = rankIndex === 1 ? 58 : 46;
        const badgeG = nodeG.append('g').attr('transform', `translate(0, ${-nodeRadius - 16})`);

        badgeG
          .append('rect')
          .attr('x', -badgeWidth / 2)
          .attr('y', -7)
          .attr('width', badgeWidth)
          .attr('height', 14)
          .attr('rx', 7)
          .attr('fill', rankIndex === 1 ? '#10b981' : rankIndex === 2 ? '#3b82f6' : '#a855f7');

        badgeG
          .append('text')
          .attr('x', 0)
          .attr('y', 3)
          .attr('text-anchor', 'middle')
          .attr('fill', '#ffffff')
          .attr('font-size', '8px')
          .attr('font-weight', '900')
          .text(rankIndex === 1 ? `🥇 #1 MATCH` : rankIndex === 2 ? `🥈 #2 MATCH` : `🥉 #3 MATCH`);
      }

      // Pulse ring for favorited tools
      if (isFav) {
        nodeG
          .append('circle')
          .attr('r', nodeRadius + 3)
          .attr('fill', 'none')
          .attr('stroke', '#eab308')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '3,3');
      }

      // Main Circle (Bubble size mapped to Market Share)
      const circle = nodeG
        .append('circle')
        .attr('r', nodeRadius)
        .attr('fill', color)
        .attr('stroke', isDarkMode ? '#0f172a' : '#ffffff')
        .attr('stroke-width', 2.5);

      // Number inside circle
      nodeG
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', '#ffffff')
        .attr('font-size', nodeRadius > 14 ? '11px' : '9px')
        .attr('font-weight', '900')
        .attr('pointer-events', 'none')
        .text(tool.number);

      // Tool Name Label below node
      nodeG
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('y', nodeRadius + 14)
        .attr('fill', isDarkMode ? '#e2e8f0' : '#1e293b')
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .attr('pointer-events', 'none')
        .text(tool.name.length > 15 ? `${tool.name.slice(0, 13)}…` : tool.name);

      // Mouse Interactions
      nodeG
        .on('mouseenter', (event) => {
          circle
            .transition()
            .duration(150)
            .attr('r', nodeRadius + 5)
            .attr('stroke', '#A8C66C')
            .attr('stroke-width', 3.5);

          const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
          setHoveredTool(tool);
          setTooltipPos({ x: mouseX, y: mouseY });
        })
        .on('mouseleave', () => {
          circle
            .transition()
            .duration(150)
            .attr('r', nodeRadius)
            .attr('stroke', isDarkMode ? '#0f172a' : '#ffffff')
            .attr('stroke-width', 2.5);

          setHoveredTool(null);
          setTooltipPos(null);
        })
        .on('click', () => {
          onSelectTool(tool);
        });
    });

  }, [tools, favorites, isDarkMode, selectedQuadrant, containerWidth, aiMatchScores, activeEfficiencyThreshold, activeOnlyAiMatches]);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#800000] dark:text-red-400" />
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight flex items-center gap-2">
              <span>Interactive Strategic Matrix (D3 Scatter Plot)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#800000] text-white font-bold">
                {tools.length} Tools
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <strong>Bubble size = Market Share</strong>. Interactive median crosshairs divide tools into 4 strategic quadrants.
          </p>
        </div>

        {/* Quadrant & Strategic Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={toggleEfficiency}
            className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeEfficiencyThreshold
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
            title="Overlay efficiency frontier line separating high-ROI tools"
          >
            <span>⚡ Efficiency Frontier</span>
            <span className={`text-[10px] px-1 rounded ${activeEfficiencyThreshold ? 'bg-emerald-800 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
              {activeEfficiencyThreshold ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={toggleAiMatchesOnly}
            className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeOnlyAiMatches
                ? 'bg-gradient-to-r from-[#A8C66C] to-emerald-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
            title="Highlight top 3 AI profile matches and dim non-relevant tools"
          >
            <span>🎯 Top 3 AI Matches Mode</span>
            <span className={`text-[10px] px-1 rounded ${activeOnlyAiMatches ? 'bg-emerald-950 text-white font-black' : 'bg-slate-200 dark:bg-slate-700'}`}>
              {activeOnlyAiMatches ? 'ACTIVE' : 'OFF'}
            </span>
          </button>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />

          {/* Median Quadrant Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setSelectedQuadrant('all')}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                selectedQuadrant === 'all'
                  ? 'bg-[#800000] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedQuadrant('low-hanging-fruit')}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                selectedQuadrant === 'low-hanging-fruit'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400'
              }`}
              title="High Ease, Lower Cost (Sweet Spot)"
            >
              🍏 Low-Hanging Fruit
            </button>
            <button
              onClick={() => setSelectedQuadrant('strategic')}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                selectedQuadrant === 'strategic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400'
              }`}
              title="High Ease, High Cost"
            >
              🚀 Strategic
            </button>
            <button
              onClick={() => setSelectedQuadrant('efficient-solutions')}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                selectedQuadrant === 'efficient-solutions'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-400'
              }`}
              title="Lower Ease, Lower Cost"
            >
              ⚡ Efficient
            </button>
            <button
              onClick={() => setSelectedQuadrant('costly-risks')}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                selectedQuadrant === 'costly-risks'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 dark:bg-slate-800 text-red-700 dark:text-red-400'
              }`}
              title="Lower Ease, High Cost"
            >
              ⚠️ Costly Risks
            </button>
          </div>
        </div>
      </div>

      {/* D3 Chart Canvas Container */}
      <div ref={containerRef} className="relative w-full overflow-hidden rounded-xl bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-2">
        <svg ref={svgRef} className="w-full h-[500px] block" />

        {/* Floating Tooltip */}
        {hoveredTool && tooltipPos && (
          <div
            style={{
              left: `${Math.min(tooltipPos.x + 15, containerWidth - 290)}px`,
              top: `${Math.max(tooltipPos.y - 140, 20)}px`
            }}
            className="absolute z-30 w-72 p-4 rounded-xl bg-slate-900/95 text-white shadow-2xl border-2 border-[#A8C66C] backdrop-blur-md pointer-events-auto transition-all animate-in fade-in duration-150 space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#800000] text-white">
                    #{hoveredTool.number} {hoveredTool.category}
                  </span>
                  {aiMatchScores[hoveredTool.id] && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                      🎯 {aiMatchScores[hoveredTool.id]}% Match
                    </span>
                  )}
                </div>
                <h4 className="font-extrabold text-sm text-white mt-1">
                  {hoveredTool.name}
                </h4>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(hoveredTool.id);
                }}
                className={`p-1.5 rounded-lg border transition-all ${
                  favorites.includes(hoveredTool.id)
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
                title={favorites.includes(hoveredTool.id) ? 'Remove from saved' : 'Save tool'}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300 line-clamp-2">
              {hoveredTool.description}
            </p>

            <div className="grid grid-cols-3 gap-1.5 text-[10px] pt-1 border-t border-white/10">
              <div className="p-1.5 rounded bg-white/5">
                <span className="text-slate-400 block">Ease of Use</span>
                <strong className="text-emerald-400 text-xs">{hoveredTool.easeOfUse || 7.5} / 10</strong>
              </div>
              <div className="p-1.5 rounded bg-white/5">
                <span className="text-slate-400 block">Cost Tier</span>
                <strong className="text-amber-400 text-xs">Tier {hoveredTool.costTier || 5}</strong>
              </div>
              <div className="p-1.5 rounded bg-white/5">
                <span className="text-slate-400 block">Market Share</span>
                <strong className="text-cyan-400 text-xs">{hoveredTool.marketShare || 25}%</strong>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <a
                href={hoveredTool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] text-[#A8C66C] hover:underline flex items-center gap-1 font-bold"
              >
                <span>{hoveredTool.websiteName}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => onSelectTool(hoveredTool)}
                className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-[#A8C66C] text-slate-950 hover:bg-[#b8d67c]"
              >
                Inspect Platform →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dimension Legend Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-3 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
        {/* Bubble Size Dimension */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <span className="font-extrabold text-slate-800 dark:text-slate-200 shrink-0">Bubble Size:</span>
          <div className="flex items-center gap-2 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
              <span>Niche (15%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-400 inline-block" />
              <span>Mid (50%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-slate-400 inline-block" />
              <span>Leader (95%)</span>
            </div>
          </div>
        </div>

        {/* Efficiency Threshold Legend */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <span className="font-extrabold text-slate-800 dark:text-slate-200 shrink-0">Frontier Line:</span>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-6 h-0.5 bg-emerald-500 border-b-2 border-dashed border-emerald-500 inline-block" />
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">High-ROI Efficiency Frontier</span>
          </div>
        </div>

        {/* AI Match Halo Legend */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <span className="font-extrabold text-slate-800 dark:text-slate-200 shrink-0">AI Profile Match:</span>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-4 h-4 rounded-full border-2 border-dashed border-emerald-500 bg-emerald-500/20 inline-block" />
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">🎯 Halo Ring = &gt;75% Match</span>
          </div>
        </div>
      </div>
    </div>
  );
};

