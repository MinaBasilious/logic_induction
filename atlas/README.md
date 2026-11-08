# Proof Atlas

An interactive companion to the `logic_induction` Lean 4 formalization: every
declaration shown three ways —

- **its informal, pen-and-paper proof** (transcribed from `docs/Logic_Induction.pdf`),
- **the exact Lean 4 source**, machine-checked and audited with `#print axioms`,
- **its position in the proof dependency tree** (what it needs, what uses it),

across the eight modules of the library (127 declarations, 92 theorems).

## Authorship

- **The Lean formalization is entirely human work.** Every definition, theorem
  and proof in `LogicInduction/` was designed, written and verified by
  Mina Basilious, formalizing lecture notes by Prof. Mohamed Amer (Cairo
  University). The machine only checked it: `lake build`, and an axiom audit
  showing every declaration depends only on the standard axioms
  (`propext`, `Classical.choice`, `Quot.sound`).
- **This Proof Atlas was built with AI assistance.** The parsing
  pipeline, the informal proof transcriptions, and the website itself were
  produced with the help of an AI assistant, working from the repository's own
  Lean sources and the author's written proof sheet. It is a presentation
  layer over the human-written, machine-checked mathematics — no mathematical
  statement or proof shown here originates from AI.

The atlas is regenerated from the Lean sources: declarations, statements and
dependency edges are parsed directly out of `LogicInduction/*.lean`, so the
site always mirrors the code.

## Run it locally

```bash
cd atlas
npm install        # or: bun install
npm run dev        # http://localhost:3000
```

No Lean toolchain is needed to run the site — the dependency data
(`src/data/theorems.json`) is pre-generated. To regenerate it after changing
the Lean sources, the statements and dependency edges are extracted from the
module files; the informal proof layer lives in `src/data/informal/`.

## Deploy (GitHub Pages)

If I am not stupid, you be able to access this site on MinaBasilious.

## License

MIT, same as the main project.
