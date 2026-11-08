"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ExternalLink, FileText, Github, GraduationCap } from "lucide-react";
import { modules, stats } from "@/lib/atlas";

export function AboutView() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-emerald-400" />
          About this atlas
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-300 prose-math">
          This site presents <span className="text-emerald-300">logic_induction</span>, a Lean 4
          formalization of the exercises in <em>“Induction: Well-founded relations and generalized
          induction”</em>, lecture notes by Prof. Mohamed Amer for a logic course at Cairo
          University. Every exercise was proved twice: once with pen and paper, and once in Lean 4 —
          with no dependencies, not even Mathlib, defining its own <code className="font-mono text-[13px] text-amber-200">Set</code> and
          the few operations it needs. The informal proofs on this site are transcriptions from the
          author&apos;s written proof sheet; the Lean proofs are the exact machine-checked sources.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="https://github.com/MinaBasilious/logic_induction"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-[13px] text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
          >
            <Github className="h-3.5 w-3.5" /> GitHub repository <ExternalLink className="h-3 w-3" />
          </a>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-[13px] text-slate-400">
            <FileText className="h-3.5 w-3.5" /> docs/Logic_Induction.pdf — written proofs
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-[13px] text-slate-400">
            MIT License
          </span>
        </div>
      </section>

      <section className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-6">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-400" />
          Authorship
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-slate-300 prose-math">
          <span className="text-amber-200">The Lean formalization is entirely human work.</span>{" "}
          Every definition, theorem and proof in the eight modules was designed, written and
          verified by Mina Basilious; the machine only checked it (<code className="font-mono text-[12.5px] text-emerald-300">lake build</code>{" "}
          and the <code className="font-mono text-[12.5px] text-emerald-300">#print axioms</code> audit).
        </p>
        <p className="mt-3 text-[14.5px] leading-relaxed text-slate-300 prose-math">
          <span className="text-amber-200">This Proof Atlas was built with AI assistance</span>{" "}
          (Z.ai): the parsing pipeline, the informal proof transcriptions from the written proof
          sheet, and the website itself. It is a presentation layer over the human-written,
          machine-checked mathematics — no mathematical statement or proof on this site originates
          from AI.
        </p>
      </section>

      <section className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-6">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          Verification status
        </h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {[
            ["Toolchain", "Lean v4.35.0 (pinned)"],
            ["Build", "lake build — 0 errors, 0 warnings"],
            ["Declarations", `${stats.declarations} (${stats.theorems} theorems)`],
            ["Dependency edges", String(stats.edges)],
            ["sorry / admit", "none anywhere in the project"],
            ["Axioms", stats.axiomsShown.join(", ")],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-slate-800 bg-slate-950/40 px-3.5 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-slate-500">{k}</div>
              <div className="text-[13.5px] text-slate-200 mt-0.5">{v}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13.5px] text-slate-400 leading-relaxed">
          Every declaration was audited with <code className="font-mono text-[12px] text-emerald-300">#print axioms</code>{" "}
          — all 127 depend only on the standard axioms {stats.axioms.join(", ")}. The classical results
          (well-foundedness equivalences, descent via the axiom of choice) use{" "}
          <code className="font-mono text-[12px] text-emerald-300">Classical.choice</code>; the purely
          algebraic lemmas about relative products do not.
        </p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold text-slate-100">The eight modules</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {modules.map((m) => (
            <div key={m.id} className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/40 px-3.5 py-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full shrink-0" style={{ background: m.color }} />
              <div>
                <div className="text-[13.5px] font-mono text-slate-200">LogicInduction.{m.id}</div>
                <div className="text-[12.5px] text-slate-500 mt-0.5">{m.blurb}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold text-slate-100">How the pairing works</h2>
        <div className="mt-3 space-y-3 text-[14px] text-slate-300 leading-relaxed">
          <p className="prose-math">
            Each Lean declaration carries one of three informal layers: a{" "}
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">full</Badge>{" "}
            transcription from the proof sheet (used for the theorems the sheet covers — Theorem 1.5,
            Theorem 2.9 and their supporting lemmas), a{" "}
            <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">sketch</Badge>{" "}
            distilled from the machine-checked proof, or a{" "}
            <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">definition</Badge>{" "}
            note for the basic objects.
          </p>
          <p className="prose-math">
            The dependency graph is built by scanning every proof body for references to other
            declarations of the library — so edges are exactly what the Lean proofs actually use,
            not an approximation. Dotted teal identifiers inside any Lean proof are clickable and
            jump to that declaration.
          </p>
        </div>
      </section>
    </div>
  );
}
