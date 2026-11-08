import rawTheorems from "@/data/theorems.json";
import { informal, type InformalEntry } from "@/data/informal";

// ---------- raw shapes ----------
export interface Decl {
  full: string;
  name: string;
  kind: "theorem" | "def" | "structure" | "inductive" | "instance";
  module: string;
  sig: string;
  body: string;
  doc: string | null;
  notes: string | null;
  deps: string[];
  axioms: string[] | null;
  line: number;
}

export const decls = rawTheorems as Decl[];

/** Instances are typeclass plumbing; keep them out of the UI. */
export const visible = decls.filter((d) => d.kind !== "instance");
export const byFull = new Map(decls.map((d) => [d.full, d]));

export interface ModuleInfo {
  id: string;
  label: string;
  blurb: string;
  color: string;
  text: string; // tailwind-friendly text color
  bg: string; // chip background
  border: string;
}

export const modules: ModuleInfo[] = [
  {
    id: "Set",
    label: "Set",
    blurb: "Sets as predicates, membership, ρ[x]",
    color: "#5eead4",
    text: "text-teal-300",
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
  },
  {
    id: "IndN",
    label: "Peano / IndN",
    blurb: "Peano-like structures, Thm 1.5",
    color: "#a3e635",
    text: "text-lime-300",
    bg: "bg-lime-500/10",
    border: "border-lime-500/30",
  },
  {
    id: "Relations",
    label: "Relations",
    blurb: "ρ|σ, powers, ρ⁺, ρ*",
    color: "#fbbf24",
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  {
    id: "WellFounded",
    label: "WellFounded",
    blurb: "WF, ρ,A-induction, Thm 2.9",
    color: "#34d399",
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  {
    id: "SuccWF",
    label: "SuccWF",
    blurb: "The successor relation is well founded",
    color: "#22d3ee",
    text: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
  },
  {
    id: "WfClosure",
    label: "WfClosure",
    blurb: "ρ well founded iff ρ⁺ is",
    color: "#4ade80",
    text: "text-green-300",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
  },
  {
    id: "NatOrder",
    label: "NatOrder",
    blurb: "≤ = S*, < = S⁺, strong induction",
    color: "#f472b6",
    text: "text-pink-300",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
  },
  {
    id: "WellOrder",
    label: "WellOrder",
    blurb: "Well orderings ↔ well-foundedness",
    color: "#c084fc",
    text: "text-purple-300",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
];

export const moduleById = new Map(modules.map((m) => [m.id, m]));

// ---------- informal layer ----------
export interface AugmentedDecl extends Decl {
  informal?: InformalEntry;
  /** non-standard axiom names (empty for the vast majority) */
  exoticAxioms: string[];
  /** true when informal text is a full transcription from the proof sheet */
  isFullProof: boolean;
}

const STANDARD_AXIOMS = new Set(["propext", "Classical.choice", "Quot.sound", "funext"]);

export const enriched: AugmentedDecl[] = visible.map((d) => {
  const inf = informal[d.full];
  return {
    ...d,
    informal: inf,
    exoticAxioms: (d.axioms ?? []).filter((a) => !STANDARD_AXIOMS.has(a)),
    isFullProof: inf?.level === "full",
  };
});

export const enrichedByFull = new Map(enriched.map((d) => [d.full, d]));

// ---------- dependency helpers ----------
const FULL_ADMITTED = new Set(["propext", "Classical.choice", "Quot.sound", "funext"]);

/** upstream dependency set: everything `full` needs (transitive, itself excluded) */
export function upstreamClosure(full: string): Set<string> {
  const seen = new Set<string>();
  const stack = [full];
  while (stack.length) {
    const cur = byFull.get(stack.pop()!);
    if (!cur) continue;
    for (const dep of cur.deps) {
      if (!seen.has(dep)) {
        seen.add(dep);
        stack.push(dep);
      }
    }
  }
  seen.delete(full);
  return seen;
}

/** downstream dependents: who uses `full` (transitively) */
export function downstreamClosure(full: string): Set<string> {
  const dependents = new Map<string, string[]>();
  for (const d of decls) for (const dep of d.deps) push(dependents, dep, d.full);
  const seen = new Set<string>();
  const stack = [full];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const t of dependents.get(cur) ?? []) {
      if (!seen.has(t)) {
        seen.add(t);
        stack.push(t);
      }
    }
  }
  seen.delete(full);
  return seen;
}

function push<K, V>(m: Map<K, V[]>, k: K, v: V) {
  const arr = m.get(k);
  if (arr) arr.push(v);
  else m.set(k, [v]);
}

// ---------- stats ----------
const theorems = enriched.filter((d) => d.kind === "theorem");
const allAxioms = new Set<string>();
for (const d of decls) for (const a of d.axioms ?? []) allAxioms.add(a);

export const stats = {
  declarations: enriched.length,
  theorems: theorems.length,
  definitions: enriched.filter((d) => d.kind !== "theorem").length,
  modules: modules.length,
  edges: decls.reduce((n, d) => n + d.deps.length, 0),
  fullProofs: enriched.filter((d) => d.isFullProof).length,
  axioms: [...allAxioms].sort(),
  axiomsShown: [...allAxioms].filter((a) => FULL_ADMITTED.has(a)).sort(),
  sorryFree: enriched.every((d) => !(d.axioms ?? []).includes("sorryAx")),
};

// ---------- search ----------
export function searchDecls(
  query: string,
  moduleId: string | null,
  kind: "all" | "theorem" | "def",
): AugmentedDecl[] {
  const q = query.trim().toLowerCase();
  return enriched
    .filter((d) => (moduleId ? d.module === moduleId : true))
    .filter((d) => (kind === "all" ? true : kind === "theorem" ? d.kind === "theorem" : d.kind !== "theorem"))
    .filter((d) => {
      if (!q) return true;
      const hay = [
        d.name,
        d.sig,
        d.doc ?? "",
        d.informal?.ref ?? "",
        d.informal?.text ?? "",
        moduleById.get(d.module)?.label ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((t) => hay.includes(t));
    })
    .sort((a, b) => {
      const mo = modules.findIndex((m) => m.id === a.module) - modules.findIndex((m) => m.id === b.module);
      if (mo !== 0) return mo;
      return a.line - b.line;
    });
}

/** Human statement: strip binder clutter from the signature for display. */
export function prettySig(d: AugmentedDecl): string {
  return d.sig
    .replace(/^@\[[^\]]*\]\s*/, "")
    .replace(/^(theorem|def|structure|inductive|abbrev)\s+/, "")
    .trim();
}
