// Informal content for WellFounded, SuccWF and WfClosure modules.

import type { InformalEntry } from "./set-indN";

export const informalWF: Record<string, InformalEntry> = {
  // ---------------- WellFounded module ----------------
  "LogicInduction.InfDesc": {
    ref: "Def 2.1",
    level: "full",
    text: "Definition 2.1 (Infinite descending ρ-sequence). a is called an infinite descending ρ-sequence if it is an infinite sequence such that\n\n  ∀ n ∈ ℕ. (a(n+1) ρ a(n)).\n\nEach term is ρ-related to its predecessor, so walking along the sequence descends forever.",
  },
  "LogicInduction.WF": {
    ref: "Def 2.5",
    level: "full",
    text: "Definition 2.5 (Well Founded). We call a relation ρ well founded if for every B ≠ ∅\n\n  ∃ x ∈ B. (ρ[x] ∩ B = ∅).\n\nEvery nonempty set B has an element x whose ρ-predecessors inside B are none — an ρ-minimal element of B.",
  },
  "LogicInduction.IndPrinciple": {
    ref: "Def 2.6",
    level: "full",
    text: "Definition 2.6 (Principle of ρ, A-induction). For a set A, the principle of ρ, A-induction is: for every B ⊆ A\n\n  [ ∀ x ∈ A. (ρ[x] ∩ A ⊆ B → x ∈ B) ] → B = A.\n\nA subset B of A that contains every x of A whose ρ-predecessors in A are already in B must be all of A.",
  },
  "LogicInduction.exists_mem_sdiff": {
    ref: "Lemma 2.7",
    level: "full",
    text: "Lemma 2.7. If B ⊆ A and B ≠ A, then A \\ B ≠ ∅.\n\nProof. Suppose A \\ B = ∅. Take x ∈ A. If x ∉ B then x ∈ A \\ B, which is impossible, so x ∈ B. Hence A ⊆ B, and with B ⊆ A we get B = A, a contradiction.",
  },
  "LogicInduction.inter_subset_of_disjoint_sdiff": {
    ref: "Lemma 2.8",
    level: "full",
    text: "Lemma 2.8. If C ∩ (A \\ B) = ∅ then C ∩ A ⊆ B.\n\nProof. Take x ∈ C ∩ A. If x ∉ B then x ∈ C ∩ (A \\ B), contradicting the hypothesis. So x ∈ B.",
  },
  "LogicInduction.wf_imp_ind": {
    ref: "Thm 2.9 (i)→(ii)",
    level: "full",
    text: "Theorem 2.9, (i) → (ii). Assume (i). Let A be a set and B ⊆ A with\n\n  ∀ x ∈ A. (ρ[x] ∩ A ⊆ B → x ∈ B)   (3)\n\nSuppose B ≠ A. By Lemma 2.7, A \\ B ≠ ∅, so (i) gives y ∈ A \\ B with ρ[y] ∩ (A \\ B) = ∅. By Lemma 2.8, ρ[y] ∩ A ⊆ B. Then (3) applied to y ∈ A gives y ∈ B, contradicting y ∉ B. So B = A.",
  },
  "LogicInduction.range_nonempty": {
    ref: "Thm 2.3",
    level: "full",
    text: "Theorem 2.3. Let X be a set and a : ℕ → X. Then Range a ≠ ∅.\n\nProof. It is enough to prove ∃ x ∈ X. (x ∈ Range a). Take x = a₀; then ∃ n ∈ ℕ. (a n = x) holds with n = 0. So x ∈ Range a.",
  },
  "LogicInduction.pred_inter_range_nonempty": {
    ref: "Thm 2.4",
    level: "full",
    text: "Theorem 2.4. Let a be an infinite descending ρ-sequence. Then\n\n  ∀ x ∈ Range a. (ρ[x] ∩ Range a ≠ ∅).\n\nProof. Take arbitrary x ∈ Range a; then ∃ n. (a n = x); take such an n and call it n′, i.e. x = a(n′). Since ∀ n. (a(n+1) ρ a n), apply it at n′: a(n′+1) ρ x. Let y := a(n′+1). Is y ∈ Range a? Yes: ∃ n. (a n = y) holds with n = n′ + 1. Is y ∈ ρ[x]? Yes: y ρ x by (a(n′+1)) ρ (a(n′) = x). Thus y ∈ ρ[x] ∩ Range a, so it is not empty.",
  },
  "LogicInduction.pred_inter_range_ne_empty": {
    ref: "Thm 2.4",
    level: "sketch",
    text: "Repackaging of Theorem 2.4 as a nonemptiness-of-intersection statement: every point of the range of a descending sequence has a ρ-predecessor inside the range, so that predecessor set intersected with the range is nonempty.",
  },
  "LogicInduction.ind_imp_no_desc": {
    ref: "Thm 2.9 (ii)→(iii)",
    level: "full",
    text: "Theorem 2.9, (ii) → (iii). Assume (ii) and suppose a is an infinite descending ρ-sequence. Let A = Range a and B = ∅. Then B ⊆ A. We check (3): take x ∈ A with ρ[x] ∩ A ⊆ ∅. Then ρ[x] ∩ A = ∅, which contradicts Theorem 2.4 on Range a. So the implication in (3) holds vacuously. By (ii), ∅ = Range a, but Range a ≠ ∅, a contradiction.",
  },
  "LogicInduction.not_wf_imp_closed_set": {
    ref: "Thm 2.9 (iii)→(i)",
    level: "sketch",
    text: "First half of the contrapositive for (iii) → (i): if ρ is not well founded, some nonempty B has an element without minimal predecessor — i.e. for every x ∈ B the set ρ[x] ∩ B is nonempty. Classically unfold ¬WF, negate the existence of a minimal point, and convert ¬∃ into ∃ for each x.",
  },
  "LogicInduction.not_wf_of_closed_set": {
    ref: "Thm 2.9 (iii)→(i)",
    level: "sketch",
    text: "Second half of the contrapositive: a nonempty B in which every x has a ρ-predecessor back in B witnesses ¬WF directly — the ρ-minimal element that WF demands for B cannot exist, since any candidate has a predecessor inside B.",
  },
  "LogicInduction.exists_step": {
    ref: "Thm 2.9 (iii)→(i)",
    level: "sketch",
    text: "From 'every x ∈ B has a predecessor in B' build an actual step function f : B → B with f(x) ρ x, using the axiom of choice. This is the only essential use of choice in the descent direction: it turns a pointwise existence into a single selecting function.",
  },
  "LogicInduction.iter": {
    level: "definition",
    text: "The iterate of a function: iter f x₀ 0 = x₀, iter f x₀ (n+1) = f (iter f x₀ n). Used to unfold the chosen step function into an infinite sequence.",
  },
  "LogicInduction.not_wf_imp_desc": {
    ref: "Thm 2.9 (iii)→(i)",
    level: "full",
    text: "Theorem 2.9, (iii) → (i), contrapositive. Assume ρ is not well founded. Then there is B ≠ ∅ such that ∀ x ∈ B. (ρ[x] ∩ B ≠ ∅). So every x ∈ B has some y ∈ B with y ρ x. By the axiom of choice there is f : B → B with f(x) ρ x for all x ∈ B. Pick x₀ ∈ B (B is not empty) and define a : ℕ → B by recursion: a₀ = x₀, a(n+1) = f(a n). Then a(n+1) = f(a n) ρ a n for every n, so a is an infinite descending ρ-sequence, and (iii) fails.",
  },
  "LogicInduction.not_desc_imp_wf": {
    ref: "Thm 2.9 (iii)→(i)",
    level: "sketch",
    text: "Assembles (iii) → (i): if no infinite descending sequence exists, ρ is well founded — by contradiction, since ¬WF manufactures a descending sequence via the previous lemma.",
  },
  "LogicInduction.wf_equiv": {
    ref: "Thm 2.9",
    level: "full",
    text: "Theorem 2.9. The following are equivalent for a relation ρ:\n(i) ρ is well founded;\n(ii) for every A, the principle of ρ, A-induction holds;\n(iii) there is no infinite descending ρ-sequence.\n\nFor the proofs of the three implications see the individual entries: (i) → (ii) via Lemmas 2.7 and 2.8; (ii) → (iii) via Theorems 2.3 and 2.4 applied to Range a; (iii) → (i) via the axiom-of-choice step function and recursion.",
  },
  "LogicInduction.WFOn": {
    ref: "Def 2.10",
    level: "full",
    text: "Definition 2.10. We say ρ is well founded on A if for every nonempty B ⊆ A\n\n  ∃ x ∈ B. (ρ[x] ∩ B = ∅).\n\nWell-foundedness relativised to a set: minimal elements are demanded only inside subsets of A.",
  },
  "LogicInduction.predR_eq_empty_of_not_mem_range": {
    level: "sketch",
    text: "If x is not in the range of ρ then ρ[x] = ∅: any predecessor y of x would witness x ∈ Rρ. Contrapositive glue used in Proposition 2.11.",
  },
  "LogicInduction.wf_iff_wfOn_range": {
    ref: "Prop 2.11",
    level: "full",
    text: "Proposition 2.11. Let Rρ = { y | ∃ x. (x ρ y) }. Then ρ is well founded iff ρ is well founded on Rρ.\n\nProof. (⇒) A nonempty B ⊆ Rρ is in particular a nonempty set, so well-foundedness of ρ applies to it directly.\n(⇐) Let B ≠ ∅. We split into two cases.\nCase 1: some x ∈ B has x ∉ Rρ. Then ρ[x] = ∅: if y ∈ ρ[x] then y ρ x, so x ∈ Rρ. Hence ρ[x] ∩ B = ∅.\nCase 2: every x ∈ B lies in Rρ. Then B ⊆ Rρ is nonempty, and the hypothesis gives the required x ∈ B.",
  },
  "LogicInduction.ind_range_imp_wfOn": {
    ref: "Prop 2.12",
    level: "sketch",
    text: "Core computation of Proposition 2.12: ρ,Rρ-induction implies ρ is well founded on Rρ. For a nonempty B ⊆ Rρ with no minimal element, apply induction to C = Rρ \\ B: the induction step shows any x whose predecessors in Rρ avoid B must itself avoid B (otherwise a predecessor inside B exists, contradicting minimality), so C = Rρ, leaving B empty — contradiction.",
  },
  "LogicInduction.ind_iff_ind_range": {
    ref: "Prop 2.12",
    level: "full",
    text: "Proposition 2.12. For every A the principle of ρ, A-induction holds iff the principle of ρ, Rρ-induction holds.\n\nProof. (⇒) Take A = Rρ.\n(⇐) By Theorem 2.9 and Proposition 2.11 it is enough to show that ρ is well founded on Rρ. Let B ⊆ Rρ be nonempty and suppose no x ∈ B has ρ[x] ∩ B = ∅. Put C = Rρ \\ B. We apply ρ,Rρ-induction to C.\nTake x ∈ Rρ with ρ[x] ∩ Rρ ⊆ C. We show x ∈ C, which needs x ∉ B. Suppose x ∈ B. By assumption ρ[x] ∩ B ≠ ∅, so there is y ∈ ρ[x] ∩ B. Since B ⊆ Rρ, we get y ∈ ρ[x] ∩ Rρ ⊆ C, so y ∉ B, a contradiction.\nBy induction C = Rρ. Take x ∈ B. Then x ∈ Rρ = C, so x ∉ B, a contradiction. Hence ρ is well founded on Rρ.",
  },
  "LogicInduction.wf_of_sub": {
    level: "sketch",
    text: "Downward closure: if σ ⊆ ρ and ρ is well founded then σ is well founded. A σ-minimal element of B is found by taking the ρ-minimal element that WF ρ provides for B; its σ-predecessors would be ρ-predecessors, and σ ⊆ ρ keeps them inside the empty intersection.",
  },
  "LogicInduction.ind_imp_no_desc'": {
    ref: "Thm 2.9 (ii)→(iii)",
    level: "sketch",
    text: "Alternative arrangement of (ii) → (iii): same argument as the main proof, written with A := Range a as a local definition and the range forced equal to univ through the induction hypothesis. Kept as a second reading of the same proof.",
  },

  // ---------------- SuccWF module ----------------
  "LogicInduction.z_not_mem_range": {
    level: "sketch",
    text: "The zero of a Peano-Like structure is not in the range of the successor relation: if z = S k then S k = z contradicts (PL4).",
  },
  "LogicInduction.eq_of_mem_predR_succ": {
    level: "sketch",
    text: "Predecessors of a successor are unique: if k ∈ S[S n] then S k = S n, so k = n by injectivity (PL3). The successor relation is a function when read backwards.",
  },
  "LogicInduction.succ_ind_range": {
    level: "sketch",
    text: "Assuming ordinary induction (I) — the explicit hypothesis hind : prop11 M in Lean — the principle of S,R_S-induction holds. Reduce to ordinary induction: given B ⊆ R_S closed under predecessors, the set C = { n | S n ∈ B } contains 0 (0 ∉ R_S by (PL4), so the premise at 0 is vacuous) and is closed under S (the only S-predecessor of S(S n) is S n by (PL3)); Prop 1.3 makes C everything, and any element of R_S is some S n, which then lies in B.",
  },
  "LogicInduction.succ_wf": {
    level: "sketch",
    text: "Assuming ordinary induction (I), the successor relation of a Peano-Like structure is well founded: combine the previous theorem with Proposition 2.12 — induction for every A follows from induction on the range, and Theorem 2.9 turns induction into well-foundedness. For the concrete ℕ the hypothesis is discharged by natPeano_ind.",
  },

  // ---------------- WfClosure module ----------------
  "LogicInduction.wf_of_wf_relPlus": {
    level: "sketch",
    text: "If ρ⁺ is well founded then ρ is: every ρ-step is a ρ⁺-step, so a ρ⁺-minimal element of B has no ρ-predecessors either — the predecessor set only shrinks when passing from ρ to its positive closure.",
  },
  "LogicInduction.not_wf_of_not_wf_relPlus": {
    level: "sketch",
    text: "Claim (⋆), first proof. If ρ⁺ is not well founded, build a closed set for ρ from the descending ρ⁺-sequence a: take A = { x | x ∈ D(ρ⁺), x is between a(n+1) and a n via stars }. Every element of A has a ρ-predecessor inside A: if the star-part of x is trivial, split the ρ⁺-step of a(n+1) with Remark 3; otherwise shorten the star by one ρ-step. Proposition-style lemma not_wf_of_closed_set then yields ¬WF ρ.",
  },
  "LogicInduction.claim_star_I": {
    level: "sketch",
    text: "Claim (⋆), proof via descending sequences. From a descending ρ⁺-sequence a, consider B = { x | x is star-reachable from some a k }. B is nonempty and every x ∈ B has a ρ-predecessor in B: if x = a k exactly, the ρ⁺-step out of a k splits into a ρ-step into B; otherwise shorten the star witness. Hence ¬WF ρ.",
  },
  "LogicInduction.claim_star_II": {
    level: "sketch",
    text: "Claim (⋆), proof via closed sets. ¬WF(ρ⁺) gives a nonempty C with every x ∈ C having a ρ⁺-predecessor in C. Let E = { x | some c ∈ C is star-reachable to x }. E is nonempty (take c ∈ C and its ρ⁺-predecessor) and closed under ρ: a ρ⁺-predecessor c′ of c satisfies ρ⁺ c′ y for y ∈ E by Remark 2 (iii), and Remark 3 splits ρ⁺ c′ y into ρ u y with c′ ρ* u, so u ∈ E and ρ u y. Thus ¬WF ρ.",
  },
  "LogicInduction.wf_relPlus_iff": {
    level: "sketch",
    text: "ρ is well founded iff ρ⁺ is. The ← direction is Claim (⋆) (three proofs kept: the notes' main proof — repaired — plus two alternatives), the → direction the easy shrinking of predecessor sets; combined classically into an equivalence.",
  },
};
