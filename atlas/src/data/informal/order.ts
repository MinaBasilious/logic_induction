// Informal content for NatOrder and WellOrder modules.

import type { InformalEntry } from "./set-indN";

export const informalOrder: Record<string, InformalEntry> = {
  // ---------------- NatOrder module ----------------
  "LogicInduction.natPeano": {
    level: "definition",
    text: "The concrete Peano-Like structure on the Lean type ℕ: zero is 0, successor is Nat.succ, with injectivity, non-successor and predecessor-cases taken from the standard library. It anchors the abstract development to actual natural numbers.",
  },
  "LogicInduction.natPeano_ind": {
    level: "sketch",
    text: "Ordinary induction (Prop 1.3) holds for the concrete structure: a B containing 0 and closed under Nat.succ is everything — by the library's built-in induction principle on ℕ.",
  },
  "LogicInduction.relPow_nat": {
    level: "sketch",
    text: "For the successor relation, powers are translations: x Sⁿ y iff x + n = y. Forward by induction on n peeling one successor at a time; backward by writing x + (k+1) = (x + k) + 1 and stepping once more.",
  },
  "LogicInduction.relStar_nat": {
    level: "sketch",
    text: "The reflexive transitive closure of the successor relation is ≤: x S* y iff x ≤ y, via Sⁿ = 'add n' and x + n = y for some n.",
  },
  "LogicInduction.relPlus_nat": {
    level: "sketch",
    text: "The positive closure of the successor relation is <: x S⁺ y iff x < y — a positive run of length n+1 is x + (n+1) = y, i.e. x < y, and conversely x < y = x + (k+1) is a run of length k+1.",
  },
  "LogicInduction.lt_wf": {
    level: "sketch",
    text: "The sheet's corollary: < is well founded on ℕ. Since < = S⁺ (previous lemma) and S is well founded (succ_wf), the closure theorem wf_relPlus_iff gives WF of <.",
  },
  "LogicInduction.course_of_values": {
    level: "sketch",
    text: "Course-of-values (strong) induction on ℕ: a set B closed under 'take n whenever all k < n are in B' is everything. Read < as the relation in Theorem 2.9's induction principle instantiated with A = univ; the predecessor side condition is exactly the strong-induction hypothesis.",
  },

  // ---------------- WellOrder module ----------------
  "LogicInduction.IrreflRel": {
    level: "definition",
    text: "ρ is irreflexive: no element is ρ-related to itself.",
  },
  "LogicInduction.StrictPO": {
    level: "definition",
    text: "ρ is a strict partial order: irreflexive and transitive.",
  },
  "LogicInduction.Smallest": {
    level: "definition",
    text: "x is a smallest element of B for ρ: x ∈ B and every y ∈ B is either equal to x or satisfies x ρ y — nothing in B lies strictly below x.",
  },
  "LogicInduction.WellOrder": {
    level: "definition",
    text: "ρ is a well ordering: every nonempty B ⊆ Fρ has a ρ-smallest element. Note B ranges over subsets of the field, so the definition ignores elements untouched by ρ.",
  },
  "LogicInduction.range_sub_field": {
    level: "sketch",
    text: "Rρ ⊆ Fρ: a range point is on the right side of some ρ-step, hence in the field. Bookkeeping used to transfer well-foundedness on the range to the field formulation.",
  },
  "LogicInduction.wo_imp_wfOn_field": {
    level: "sketch",
    text: "A strict partial order that well orders its field is well founded on the field. The smallest element x of B cannot have a predecessor in B: if y ρ x with y ∈ B then comparability gives y = x (violating irreflexivity through y ρ x = y ρ y) or x ρ y (violating transitivity with y ρ x to produce x ρ x). So x is ρ-minimal in B.",
  },
  "LogicInduction.wo_imp_wf": {
    level: "sketch",
    text: "A well ordering (of a strict partial order) is well founded: reduce WF to WF on the range via Proposition 2.11, and the range sits inside the field where the previous theorem applies.",
  },
  "LogicInduction.LinearRel": {
    level: "definition",
    text: "ρ is linear: any two elements are comparable — x = y, or x ρ y, or y ρ x.",
  },
  "LogicInduction.wf_imp_wo": {
    level: "sketch",
    text: "A well-founded linear relation well orders every nonempty B: take the ρ-minimal x that WF provides; any y ∈ B is comparable to x, and y ρ x would put y in ρ[x] ∩ B = ∅, so x = y or x ρ y — x is smallest.",
  },
  "LogicInduction.not_wf_imp_wo": {
    level: "sketch",
    text: "Linearity cannot be dropped from the converse. Counterexample on ℕ: ρ = {(0,1), (0,2)}. It is a strict partial order (irreflexive, transitive vacuously: no second step ever composes) and well founded (0 or an element untouched by ρ is always minimal), but B = {1, 2} has no smallest element: 1 and 2 are incomparable. So WF does not imply WellOrder without linearity.",
  },
  "LogicInduction.wo_iff_wf": {
    level: "sketch",
    text: "The sheet's final equivalence, for a strict partial order: ρ is a well ordering iff ρ is well founded — with linearity assumed on both sides, combining the two directions above. The counterexample shows where linearity is essential.",
  },
};
