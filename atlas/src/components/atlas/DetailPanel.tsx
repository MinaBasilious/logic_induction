"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Code2, FileText, Link2, ListTree, ShieldCheck, X } from "lucide-react";
import { LeanCode } from "./LeanCode";
import {
  enrichedByFull,
  downstreamClosure,
  moduleById,
  prettySig,
  upstreamClosure,
  type AugmentedDecl,
} from "@/lib/atlas";

function InformalText({ text }: { text: string }) {
  const paras = text.split(/\n\n+/);
  return (
    <div>
      {paras.map((p, i) => (
        <p key={i} className="prose-math text-[15px] text-slate-200 whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  );
}

function DepChips({
  ids,
  label,
  onNavigate,
  empty,
}: {
  ids: string[];
  label: string;
  onNavigate: (full: string) => void;
  empty: string;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-1.5">
        {label}
      </div>
      {ids.length === 0 ? (
        <p className="text-[13px] text-slate-600 italic">{empty}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {ids.map((id) => {
            const d = enrichedByFull.get(id);
            if (!d) return null;
            const m = moduleById.get(d.module);
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[12px] font-mono transition-colors min-h-[26px] ${m?.bg} ${m?.border} ${m?.text} hover:brightness-125`}
              >
                {d.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DetailPanel({
  decl,
  onNavigate,
  onClose,
}: {
  decl: AugmentedDecl;
  onNavigate: (full: string) => void;
  onClose?: () => void;
}) {
  const [showLean, setShowLean] = useState(false);
  const m = moduleById.get(decl.module);
  const inf = decl.informal;
  const ups = upstreamClosure(decl.full);
  const downs = downstreamClosure(decl.full);
  const directDeps = decl.deps.filter((x) => enrichedByFull.has(x));
  const directUses = declsUsing(decl.full);

  return (
    <ScrollArea className="h-full atlas-scroll">
      <div className="p-5 space-y-5">
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-mono text-xl font-semibold text-emerald-300 break-all">
                {decl.name}
              </h2>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wide text-slate-400 border-slate-700">
                {decl.kind}
              </Badge>
              {inf?.ref && (
                <Badge className={`text-[11px] border ${m?.bg} ${m?.border} ${m?.text} bg-opacity-20`}>
                  <Link2 className="h-3 w-3 mr-1" />
                  {inf.ref}
                </Badge>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[12px] text-slate-500">
              <span className={`rounded px-1.5 py-0.5 ${m?.bg} ${m?.text}`}>{m?.label}</span>
              <span>· {decl.module}.lean:{decl.line}</span>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close details" className="shrink-0 lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* statement */}
        <div className="rounded-lg border border-slate-800 bg-white/[0.02] p-3">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-1.5">
            Statement
          </div>
          <pre className="font-mono text-[12.5px] text-slate-300 whitespace-pre-wrap break-words leading-relaxed">
            {prettySig(decl)}
          </pre>
        </div>

        {/* axiom badge */}
        {decl.kind === "theorem" && (
          <div className="flex items-center gap-2 text-[12px]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            {decl.exoticAxioms.length === 0 ? (
              <span className="text-slate-400">
                Machine-checked with standard axioms only
                {decl.axioms && decl.axioms.length > 0 && (
                  <span className="text-slate-600">
                    {" "}({decl.axioms.join(", ") || "none"})
                  </span>
                )}
              </span>
            ) : (
              <span className="text-amber-300">uses: {decl.exoticAxioms.join(", ")}</span>
            )}
          </div>
        )}

        <Separator className="bg-slate-800/70" />

        {/* informal + lean */}
        <div className={showLean ? "grid gap-4 lg:grid-cols-2" : ""}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                {inf?.level === "definition" ? "What it says" : "Informal proof"}
              </span>
              {inf && (
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    inf.level === "full"
                      ? "border-emerald-500/40 text-emerald-300"
                      : "border-slate-700 text-slate-400"
                  }`}
                >
                  {inf.level === "full"
                    ? "from the proof sheet"
                    : inf.level === "sketch"
                      ? "sketch"
                      : "definition"}
                </Badge>
              )}
            </div>
            {inf ? (
              <InformalText text={inf.text} />
            ) : (
              <p className="text-slate-500 italic text-sm">No informal text yet.</p>
            )}
          </div>

          {showLean && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                  Lean proof
                </span>
              </div>
              <LeanCode code={decl.body || decl.sig} onNameClick={onNavigate} />
            </div>
          )}
        </div>

        {/* toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLean((v) => !v)}
          className="border-slate-700 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/40"
        >
          <Code2 className="h-3.5 w-3.5 mr-1.5" />
          {showLean ? "Hide Lean proof" : "Show Lean proof"}
        </Button>

        <Separator className="bg-slate-800/70" />

        {/* dependencies */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <ListTree className="h-3.5 w-3.5" />
            <span>
              Transitively needs{" "}
              <span className="text-slate-300 font-medium">{ups.size}</span> declarations · used by{" "}
              <span className="text-slate-300 font-medium">{downs.size}</span>
            </span>
          </div>
          <DepChips
            ids={directDeps}
            label={`Builds on (${directDeps.length})`}
            onNavigate={onNavigate}
            empty="Foundation declaration — built on nothing."
          />
          <DepChips
            ids={directUses}
            label={`Used directly by (${directUses.length})`}
            onNavigate={onNavigate}
            empty="Nothing builds on this yet."
          />
        </div>
      </div>
    </ScrollArea>
  );
}

function declsUsing(full: string): string[] {
  const users = new Set<string>();
  for (const d of enrichedByFull.values()) {
    if (d.deps.includes(full)) users.add(d.full);
  }
  return [...users];
}
