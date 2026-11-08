"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, SquareLibrary } from "lucide-react";
import { DetailPanel } from "./DetailPanel";
import {
  enriched,
  moduleById,
  modules,
  searchDecls,
  type AugmentedDecl,
} from "@/lib/atlas";

function ResultRow({
  d,
  active,
  onSelect,
}: {
  d: AugmentedDecl;
  active: boolean;
  onSelect: () => void;
}) {
  const m = moduleById.get(d.module);
  const kindDot =
    d.kind === "theorem" ? "bg-emerald-400" : d.kind === "def" ? "bg-amber-400" : "bg-purple-400";
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors min-h-[44px] ${
        active
          ? "border-emerald-500/40 bg-emerald-500/[0.07]"
          : "border-transparent hover:bg-white/[0.03]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${kindDot}`} />
        <span className="font-mono text-[13.5px] text-slate-200 truncate">{d.name}</span>
        {d.informal?.level === "full" && (
          <span className="ml-auto shrink-0 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] px-1.5 py-0.5">
            proof sheet
          </span>
        )}
      </div>
      <div className="mt-0.5 pl-3.5 flex items-center gap-1.5 text-[11.5px] text-slate-500 truncate">
        <span className={`rounded px-1 ${m?.bg} ${m?.text}`}>{m?.label}</span>
        {d.informal?.ref && <span>· {d.informal.ref}</span>}
      </div>
    </button>
  );
}

export function BrowseView({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (full: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [kind, setKind] = useState<"all" | "theorem" | "def">("all");

  const results = useMemo(() => searchDecls(query, moduleId, kind), [query, moduleId, kind]);
  const selectedDecl = selected ? enriched.find((d) => d.full === selected) ?? null : null;

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-4 items-start">
      {/* list column */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm lg:h-[calc(100vh-230px)] lg:sticky lg:top-4 flex flex-col overflow-hidden">
        <div className="p-3 space-y-2.5 border-b border-slate-800/70">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search theorems, proofs, topics…"
              className="pl-8 bg-white/[0.03] border-slate-800 text-slate-200 placeholder:text-slate-600"
              aria-label="Search theorems"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "theorem", "def"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`rounded-md px-2.5 py-1 text-[12px] border transition-colors min-h-[28px] ${
                  kind === k
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                    : "border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                {k === "all" ? "All" : k === "theorem" ? "Theorems" : "Definitions"}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setModuleId(null)}
              className={`rounded-md px-2 py-1 text-[11.5px] border transition-colors min-h-[26px] ${
                moduleId === null
                  ? "border-slate-500 text-slate-200 bg-white/5"
                  : "border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
            >
              <SquareLibrary className="h-3 w-3 inline mr-1 -mt-0.5" />
              All modules
            </button>
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setModuleId(moduleId === m.id ? null : m.id)}
                className={`rounded-md px-2 py-1 text-[11.5px] border transition-colors min-h-[26px] ${
                  moduleId === m.id
                    ? `${m.border} ${m.bg} ${m.text}`
                    : "border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-[11.5px] text-slate-600">
            {results.length} of {enriched.length} declarations
          </p>
        </div>
        <div className="atlas-scroll overflow-y-auto p-2 space-y-0.5 flex-1 lg:max-h-none max-h-[55vh]">
          {results.map((d) => (
            <ResultRow
              key={d.full}
              d={d}
              active={d.full === selected}
              onSelect={() => onSelect(d.full)}
            />
          ))}
          {results.length === 0 && (
            <p className="text-center text-slate-600 text-sm py-10 italic">
              Nothing matches “{query}”.
            </p>
          )}
        </div>
      </div>

      {/* detail column */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm lg:h-[calc(100vh-230px)] lg:sticky lg:top-4 overflow-hidden hidden lg:block">
        {selectedDecl ? (
          <DetailPanel decl={selectedDecl} onNavigate={(f) => onSelect(f)} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 gap-3">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <span className="text-2xl text-emerald-300 font-serif">∎</span>
            </div>
            <h3 className="text-slate-300 font-medium">Select a declaration</h3>
            <p className="text-slate-600 text-sm max-w-xs leading-relaxed">
              Every theorem shows its informal proof from the paper, with the exact Lean
              proof one click away — and clickable dependencies between them.
            </p>
          </div>
        )}
      </div>

      {/* mobile detail */}
      {selectedDecl && (
        <div className="lg:hidden rounded-xl border border-slate-800 bg-slate-900/40 -mt-1 order-last">
          <DetailPanel
            decl={selectedDecl}
            onNavigate={(f) => onSelect(f)}
            onClose={() => onSelect(null)}
          />
        </div>
      )}
    </div>
  );
}
