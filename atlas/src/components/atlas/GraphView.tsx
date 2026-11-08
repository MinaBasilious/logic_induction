"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationNodeDatum,
} from "d3-force";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ZoomIn, ZoomOut, Maximize2, ArrowUpRight } from "lucide-react";
import { enriched, moduleById, modules, downstreamClosure, upstreamClosure } from "@/lib/atlas";

interface GNode extends SimulationNodeDatum {
  full: string;
  name: string;
  module: string;
  kind: string;
  r: number;
}
interface GLink {
  source: string | GNode;
  target: string | GNode;
}

const W = 1000;
const H = 680;

export function GraphView({ onOpenBrowse }: { onOpenBrowse: (full: string) => void }) {
  const [, setTick] = useState(0);
  const [ready, setReady] = useState(false);
  const [renderNodes, setRenderNodes] = useState<GNode[]>([]);
  const [renderLinks, setRenderLinks] = useState<GLink[]>([]);
  const simRef = useRef<Simulation<GNode, GLink> | null>(null);
  const nodesRef = useRef<GNode[]>([]);
  const linksRef = useRef<GLink[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ node?: GNode; panning?: boolean; sx: number; sy: number } | null>(null);

  // fit the whole graph into the viewport (timers + reset button)
  const fitView = useCallback(() => {
    const ns = nodesRef.current;
    if (!ns.length || ns.some((n) => n.x === undefined)) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const n of ns) {
      minX = Math.min(minX, n.x! - n.r); maxX = Math.max(maxX, n.x! + n.r);
      minY = Math.min(minY, n.y! - n.r); maxY = Math.max(maxY, n.y! + n.r);
    }
    const bw = Math.max(60, maxX - minX);
    const bh = Math.max(60, maxY - minY);
    const z = Math.min(2.2, Math.max(0.4, Math.min((W * 0.92) / bw, (H * 0.88) / bh)));
    setZoom(z);
    setPan({ x: W / 2 - ((minX + maxX) / 2) * z, y: H / 2 - ((minY + maxY) / 2) * z });
  }, []);

  // ---- build + run simulation once ----
  useEffect(() => {
    const downstream = new Map<string, number>();
    for (const d of enriched) {
      for (const dep of d.deps) downstream.set(dep, (downstream.get(dep) ?? 0) + 1);
    }
    const nodes: GNode[] = enriched.map((d) => ({
      full: d.full,
      name: d.name,
      module: d.module,
      kind: d.kind,
      r: 4 + Math.min(9, Math.sqrt(downstream.get(d.full) ?? 0) * 2.4),
    }));
    const ids = new Set(nodes.map((n) => n.full));
    const links: GLink[] = [];
    const seen = new Set<string>();
    for (const d of enriched) {
      for (const dep of d.deps) {
        if (!ids.has(dep) || !ids.has(d.full)) continue;
        const key = `${dep}→${d.full}`;
        if (seen.has(key)) continue;
        seen.add(key);
        links.push({ source: dep, target: d.full });
      }
    }
    nodesRef.current = nodes;
    linksRef.current = links;

    const timers = [setTimeout(fitView, 1800), setTimeout(fitView, 3500), setTimeout(fitView, 6000)];

    const sim = forceSimulation<GNode, GLink>(nodes)
      .force(
        "link",
        forceLink<GNode, GLink>(links).id((n) => n.full).distance(46).strength(0.35),
      )
      .force("charge", forceManyBody().strength(-95))
      .force("center", forceCenter(0, 0).strength(0.06))
      .force("collide", forceCollide<GNode>().radius((n) => n.r + 4))
      .force("x", forceX(0).strength(0.03))
      .force("y", forceY(0).strength(0.05));
    sim.on("tick", () => {
      nodesRef.current = sim.nodes();
      setRenderNodes([...sim.nodes()]);
      setReady(true);
      setTick((t) => t + 1);
    });
    simRef.current = sim;
    return () => {
      timers.forEach(clearTimeout);
      sim.stop();
      simRef.current = null;
    };
  }, [fitView]);

  // ---- wheel zoom (non-passive) ----
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.min(3.2, Math.max(0.35, z * (e.deltaY > 0 ? 0.9 : 1.1))));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const ups = useMemo(() => (selected ? upstreamClosure(selected) : new Set<string>()), [selected]);
  const downs = useMemo(() => (selected ? downstreamClosure(selected) : new Set<string>()), [selected]);
  const q = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!q) return new Set<string>();
    return new Set(
      enriched
        .filter((d) => d.name.toLowerCase().includes(q) || (d.informal?.ref ?? "").toLowerCase().includes(q))
        .map((d) => d.full),
    );
  }, [q]);

  const nodeState = (n: GNode): "sel" | "up" | "down" | "match" | "dim" | "idle" => {
    if (selected === n.full) return "sel";
    if (selected) {
      if (ups.has(n.full)) return "up";
      if (downs.has(n.full)) return "down";
      return "dim";
    }
    if (matches.size > 0) return matches.has(n.full) ? "match" : "dim";
    return "idle";
  };

  const toSimCoords = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const sx = ((clientX - rect.left) / rect.width) * W;
    const sy = ((clientY - rect.top) / rect.height) * H;
    return { x: (sx - pan.x) / zoom, y: (sy - pan.y) / zoom };
  };

  const onNodePointerDown = (e: React.PointerEvent, n: GNode) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { node: n, sx: e.clientX, sy: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.node) {
      const p = toSimCoords(e.clientX, e.clientY);
      drag.node.fx = p.x;
      drag.node.fy = p.y;
      simRef.current?.alphaTarget(0.18).restart();
    } else if (drag.panning) {
      setPan((p) => ({ x: p.x + (e.clientX - drag.sx), y: p.y + (e.clientY - drag.sy) }));
      dragRef.current = { panning: true, sx: e.clientX, sy: e.clientY };
    }
  };
  const onPointerUp = () => {
    const drag = dragRef.current;
    if (drag?.node) {
      drag.node.fx = null;
      drag.node.fy = null;
      simRef.current?.alphaTarget(0);
    }
    dragRef.current = null;
  };

  const selDecl = selected ? enriched.find((d) => d.full === selected) : null;

  return (
    <div className="relative rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
      {/* toolbar */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 w-64">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
            placeholder="Highlight in graph…"
            className="pl-8 h-9 bg-slate-950/80 border-slate-800 text-slate-200 placeholder:text-slate-600 backdrop-blur"
            aria-label="Highlight nodes"
          />
        </div>
        {selDecl && (
          <div className="rounded-lg border border-emerald-500/30 bg-slate-950/90 backdrop-blur p-3 space-y-2">
            <div className="font-mono text-[13px] text-emerald-300 break-all">{selDecl.name}</div>
            <div className="text-[11.5px] text-slate-500">{moduleById.get(selDecl.module)?.label}</div>
            <div className="text-[12px] text-slate-400">
              needs <span className="text-slate-200">{ups.size}</span> · used by{" "}
              <span className="text-slate-200">{downs.size}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full h-7 text-[12px] border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
              onClick={() => onOpenBrowse(selected!)}
            >
              Open in Browse <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* legend */}
      <div className="absolute bottom-3 left-3 z-10 rounded-lg border border-slate-800 bg-slate-950/85 backdrop-blur px-3 py-2 max-w-[290px]">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {modules.map((m) => (
            <span key={m.id} className="inline-flex items-center gap-1.5 text-[10.5px] text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
              {m.label}
            </span>
          ))}
        </div>
        <p className="mt-1.5 text-[10.5px] text-slate-600 leading-snug">
          Click a node: <span className="text-emerald-400">emerald</span> = what it needs,{" "}
          <span className="text-amber-400">amber</span> = what uses it. Drag to rearrange, scroll
          to zoom.
        </p>
      </div>

      {/* zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
        <Button size="icon" variant="outline" aria-label="Zoom in" className="h-8 w-8 border-slate-800 bg-slate-950/80" onClick={() => setZoom((z) => Math.min(3.2, z * 1.2))}>
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="outline" aria-label="Zoom out" className="h-8 w-8 border-slate-800 bg-slate-950/80" onClick={() => setZoom((z) => Math.max(0.35, z / 1.2))}>
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="outline" aria-label="Reset view" className="h-8 w-8 border-slate-800 bg-slate-950/80" onClick={fitView}>
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-[68vh] min-h-[420px] touch-none select-none cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          dragRef.current = { panning: true, sx: e.clientX, sy: e.clientY };
          setSelected(null);
          setQuery("");
        }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {/* links */}
          {renderLinks.map((l, i) => {
            const s = l.source as GNode;
            const t = l.target as GNode;
            if (!s?.x || !t?.x) return null;
            let active = false;
            if (selected) {
              active =
                s.full === selected ||
                t.full === selected ||
                (ups.has(s.full) && ups.has(t.full)) ||
                (downs.has(s.full) && downs.has(t.full));
            }
            return (
              <line
                key={i}
                x1={s.x}
                y1={s.y}
                x2={t.x}
                y2={t.y}
                stroke={active ? "#34d399" : "#334155"}
                strokeWidth={active ? 1.1 : 0.5}
                opacity={selected ? (active ? 0.9 : 0.06) : 0.18}
              />
            );
          })}
          {/* nodes */}
          {renderNodes.map((n) => {
            if (n.x === undefined) return null;
            const st = nodeState(n);
            const color = moduleById.get(n.module)?.color ?? "#94a3b8";
            const opacity = st === "dim" ? 0.18 : 1;
            const showLabel =
              hovered === n.full ||
              st === "sel" ||
              st === "up" ||
              st === "down" ||
              st === "match" ||
              n.r > 8;
            return (
              <g
                key={n.full}
                transform={`translate(${n.x},${n.y})`}
                opacity={opacity}
                onPointerDown={(e) => onNodePointerDown(e, n)}
                onPointerEnter={() => setHovered(n.full)}
                onPointerLeave={() => setHovered(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(n.full === selected ? null : n.full);
                }}
                className="cursor-pointer"
              >
                {(st === "sel" || st === "match") && (
                  <circle r={n.r + 5} fill="none" stroke={st === "sel" ? "#34d399" : "#fbbf24"} strokeWidth={1.4} strokeDasharray={st === "match" ? "3 2" : undefined} opacity={0.9} />
                )}
                <circle r={n.r} fill={color} fillOpacity={st === "idle" ? 0.85 : 1} stroke={st === "up" ? "#34d399" : st === "down" ? "#fbbf24" : "transparent"} strokeWidth={1.6} />
                {showLabel && (
                  <text
                    y={n.r + 11}
                    textAnchor="middle"
                    fontSize={9.5}
                    className="font-mono"
                    fill={st === "sel" ? "#6ee7b7" : st === "dim" ? "#475569" : "#94a3b8"}
                  >
                    {n.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-slate-600 text-sm italic">loading proof graph…</p>
        </div>
      )}
    </div>
  );
}
