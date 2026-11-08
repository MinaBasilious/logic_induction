"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { visible } from "@/lib/atlas";

const KEYWORDS = new Set([
  "theorem", "def", "structure", "inductive", "instance", "abbrev", "axiom",
  "namespace", "end", "variable", "variables", "open", "import", "scoped",
  "by", "fun", "have", "intro", "intros", "apply", "exact", "rw", "rwa",
  "simp", "omega", "obtain", "rcases", "cases", "match", "induction",
  "constructor", "exists", "ext", "unfold", "show", "let", "refine", "assume",
  "left", "right", "contradiction", "exfalso", "specialize", "revert",
  "subst", "admit", "sorry", "funext", "rename_i", "with", "from", "at",
  "in", "where", "class", "deriving", "example", "protected", "private",
  "noncomputable", "partial", "mutual", "next", "focus", "use",
  "True", "False", "Prop", "Type", "Nat", "Or", "And",
  "Not", "Iff", "Exists", "Eq", "Classical", "Function",
]);

const nameToFull = new Map(visible.map((d) => [d.name, d.full]));

type Tok = { text: string; cls?: string; name?: string };

function tokenize(code: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  const push = (text: string, cls?: string, name?: string) => {
    if (text) toks.push({ text, cls, name });
  };
  while (i < code.length) {
    const rest = code.slice(i);
    const cm = rest.match(/^(\/--[\s\S]*?-\/|\/-\s[\s\S]*?\s-\/|--[^\n]*)/);
    if (cm) {
      push(cm[0], "text-slate-500 italic");
      i += cm[0].length;
      continue;
    }
    const sm = rest.match(/^"(?:[^"\\]|\\.)*"/);
    if (sm) {
      push(sm[0], "text-amber-300/90");
      i += sm[0].length;
      continue;
    }
    const am = rest.match(/^@\[[^\]]*\]/);
    if (am) {
      push(am[0], "text-fuchsia-300/80");
      i += am[0].length;
      continue;
    }
    const im = rest.match(/^[A-Za-z_][A-Za-z0-9_'!?]*/);
    if (im) {
      const word = im[0];
      if (KEYWORDS.has(word)) {
        push(word, "text-emerald-400");
      } else if (nameToFull.has(word)) {
        push(word, "underline decoration-teal-500/50 decoration-dotted underline-offset-4 cursor-pointer hover:text-teal-200", nameToFull.get(word));
      } else {
        push(word);
      }
      i += word.length;
      continue;
    }
    const nm = rest.match(/^[0-9]+/);
    if (nm) {
      push(nm[0], "text-orange-300/90");
      i += nm[0].length;
      continue;
    }
    const pm = rest.match(/^[^A-Za-z0-9_@"]+|^[@]/);
    if (pm) {
      push(pm[0], pm[0].trim() ? "text-slate-400" : undefined);
      i += pm[0].length;
      continue;
    }
    push(rest[0]);
    i += 1;
  }
  return toks;
}

export function LeanCode({
  code,
  onNameClick,
  maxHeight = "60vh",
  label = "Lean proof",
}: {
  code: string;
  onNameClick?: (full: string) => void;
  maxHeight?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const toks = useMemo(() => tokenize(code), [code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-[oklch(0.13_0.01_185)] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800/70 bg-white/[0.02]">
        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
          {label}
        </span>
        <button
          onClick={copy}
          aria-label="Copy Lean code"
          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-300 transition-colors min-h-[24px] px-1"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className="atlas-scroll overflow-auto p-3 text-[12.5px] leading-relaxed font-mono text-slate-300"
        style={{ maxHeight }}
      >
        <code>
          {toks.map((t, k) =>
            t.name ? (
              <button
                key={k}
                className={t.cls}
                title={t.name}
                onClick={() => t.name && onNameClick?.(t.name)}
              >
                {t.text}
              </button>
            ) : (
              <span key={k} className={t.cls}>
                {t.text}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
