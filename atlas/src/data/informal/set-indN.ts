// Informal (pen-and-paper) content for the Set and indN modules.
// `full` entries are transcribed from docs/Logic_Induction.pdf;
// `sketch` entries summarise the Lean proof in plain language.
// When a LaTeX source file becomes available, regenerate this layer from it.

export type InformalLevel = "full" | "sketch" | "definition";

export interface InformalEntry {
  /** Reference into the lecture notes / proof sheet, e.g. "Thm 1.5". */
  ref?: string;
  level: InformalLevel;
  text: string;
}

export const informalSetIndN: Record<string, InformalEntry> = {
  // ---------------- Set module ----------------
  "LogicInduction.Set": {
    level: "definition",
    text: "A set over a type α is modelled directly as a predicate: a Set α is a function α → Prop, and a belongs to s exactly when s a holds. Two sets are equal when they agree on every element (extensionality).",
  },
  "LogicInduction.Set.mem": {
    level: "definition",
    text: "Membership: a ∈ s is defined to be the proposition s a — the set's predicate applied to a. The generic ∈ notation is wired up by a Membership typeclass instance on Set α, so a ∈ s elaborates to mem s a and set membership never clashes with the ambient library.",
  },
  "LogicInduction.Set.range": {
    ref: "Def 2.2",
    level: "full",
    text: "Let a : ℕ → X be a sequence. The range of a is the set A ⊆ X given by A = { x ∈ X | ∃ n ∈ ℕ. (a n = x) }, written Range a. So x ∈ Range a exactly when some term of the sequence equals x.",
  },
  "LogicInduction.Set.univ": {
    level: "definition",
    text: "The universal set: every element belongs to it. It plays the role of the ambient space ℕ in the induction statements, where B = ℕ is the conclusion.",
  },
  "LogicInduction.Set.mem_univ": {
    level: "sketch",
    text: "Every a belongs to univ by the definition of univ as the constantly-true predicate; the proof is the trivial True introduction.",
  },
  "LogicInduction.Set.ext": {
    level: "sketch",
    text: "If s and t have the same elements — ∀ a, a ∈ s ↔ a ∈ t — then the underlying predicates agree pointwise, and by function extensionality together with propositional extensionality s = t.",
  },
  "LogicInduction.Set.mem_inter_iff": {
    level: "sketch",
    text: "Membership in the intersection s ∩ t holds exactly when a ∈ s and a ∈ t; this is true by definition, since the intersection is built as the pointwise conjunction of the two predicates.",
  },
  "LogicInduction.Set.predR": {
    level: "definition",
    text: "For a relation ρ and a point x, predR ρ x is the set of ρ-predecessors of x, written ρ[x] in the notes: y ∈ ρ[x] iff y ρ x. This is the central notion around which well-foundedness and the induction principle are phrased.",
  },
  "LogicInduction.Set.mem_predR": {
    level: "sketch",
    text: "y ∈ predR ρ x unfolds to ρ y x by the definition of predR; the lemma records this so the simplifier can keep statements about ρ[x] in relation form.",
  },
  "LogicInduction.Set.mem_sdiff_iff": {
    level: "sketch",
    text: "a ∈ s \\ t iff a ∈ s and a ∉ t, again a definitional unfolding: the difference is the pointwise conjunction of membership in s with negated membership in t.",
  },
  "LogicInduction.Set.subset_antisymm": {
    level: "sketch",
    text: "If s ⊆ t and t ⊆ s then s = t: apply extensionality; for each a the two inclusions give a ∈ s ↔ a ∈ t, pairing forward and backward directions.",
  },
  "LogicInduction.Set.nothing_empty": {
    level: "sketch",
    text: "No element belongs to the empty set: a ∈ ∅ is the proposition False, so from a ∈ ∅ we may conclude anything — in particular the contradiction needed to close the goal.",
  },
  "LogicInduction.Set.empty_subset": {
    level: "sketch",
    text: "The empty set is a subset of every set: given a ∈ ∅ we have False, from which a ∈ s follows vacuously.",
  },
  "LogicInduction.Set.empty_inter": {
    level: "sketch",
    text: "∅ ∩ s = ∅ by antisymmetry: every element of the intersection is in ∅ (its first conjunct), which is impossible; the reverse inclusion is the empty subset lemma.",
  },
  "LogicInduction.Set.exists_mem_of_ne_empty": {
    level: "sketch",
    text: "If s ≠ ∅ then some x ∈ s. Classically: assume no x belongs to s; then every x has a ∈ s ↔ False, so s = ∅ by extensionality, contradicting the hypothesis. This is the only place set theory leans on classical logic.",
  },
  "LogicInduction.Set.sdiff_subset": {
    level: "sketch",
    text: "s \\ r ⊆ s: membership in the difference carries its first conjunct, membership in s.",
  },

  // ---------------- indN module ----------------
  "LogicInduction.PeanoLike": {
    ref: "Def 1.1",
    level: "full",
    text: "A structure (N, S_N, 0_N) is called Peano-Like when:\n(PL0) N is a set;\n(PL1) 0_N ∈ N;\n(PL2) S_N : N → N;\n(PL3) S_N is injective;\n(PL4) ∀ n ∈ N. S_N(n) ≠ 0_N;\n(PL5) ∀ n ∈ N. n = 0_N ∨ ∃ k ∈ N. S_N(k) = n.\nWe write n + 1 := S_N(n). Nothing in (PL0)–(PL5) says that induction holds: the conatural numbers ℕ ∪ {∞} with S(∞) = ∞ satisfy all six conditions and violate both induction propositions below. Everything in this section is therefore proved for an arbitrary Peano-Like structure. The proof of Theorem 1.5 uses (PL5) in the → direction (splitting n into the cases n = 0 and n = S k) and (PL3), (PL4) in the ← direction.",
  },
  "LogicInduction.l1": {
    ref: "Lemma 1.6",
    level: "full",
    text: "Lemma 1.6 (Reduction). Let X be a set and φ₁, φ₂, ψ predicates on X with ∀ x ∈ X. (φ₁(x) ↔ φ₂(x)). Then ∀ x. (φ₁(x) → ψ(x)) ↔ ∀ x. (φ₂(x) → ψ(x)).\n\nProof. For →, assume the left side and take x with φ₂(x). Then φ₁(x) by the assumed equivalence, so ψ(x). The ← direction is the same with φ₁ and φ₂ exchanged.",
  },
  "LogicInduction.Rel": {
    level: "definition",
    text: "The successor relation on a Peano-Like structure: k Rel n iff S k = n. It is the relation whose predecessors of n are exactly the k with S k = n — a single predecessor, by injectivity.",
  },
  "LogicInduction.prop11": {
    ref: "Prop 1.3",
    level: "full",
    text: "Proposition 1.3. For every B ⊆ N:\n\n  [ 0 ∈ B ∧ ∀ n ∈ N. (n ∈ B → n + 1 ∈ B) ] → B = N.\n\nThis is ordinary induction phrased with the zero case and the successor step.",
  },
  "LogicInduction.prop12": {
    ref: "Prop 1.4",
    level: "full",
    text: "Proposition 1.4. For every B ⊆ N:\n\n  [ ∀ n ∈ N. (S[n] ⊆ B → n ∈ B) ] → B = N.\n\nThis is predecessor induction: a set containing every n whose predecessors it already contains must be everything. Here S[n] = { k | S k = n } is the ρ[x]-style predecessor set for the successor relation.",
  },
  "LogicInduction.thm13": {
    ref: "Thm 1.5",
    level: "full",
    text: "Theorem 1.5. Prop 1.3 ↔ Prop 1.4.\n\nProof. Apply Lemma 1.6 with X = P(N), x = B, ψ(B) := (B = N), φ₁(B) := 0 ∈ B ∧ ∀ n. (n ∈ B → n + 1 ∈ B), φ₂(B) := ∀ n. (S[n] ⊆ B → n ∈ B). Since ψ is the same on both sides, it is enough to show φ₁(B) ↔ φ₂(B) for every B ⊆ N.\n\nTake arbitrary B ⊆ N.\n\nFirstly, φ₁(B) → φ₂(B). Assume 0 ∈ B ∧ ∀ n. (n ∈ B → n + 1 ∈ B) (1). W.T.S. ∀ n. (S[n] ⊆ B → n ∈ B). Take n with S[n] ⊆ B; we must show n ∈ B. By (PL5), either n = 0 or n = S k.\nCase n = 0: by the left side of (1), 0 ∈ B.\nCase n = S k: then k ∈ S[n], and S[n] ⊆ B gives k ∈ B. By the right side of (1), k + 1 ∈ B. But k + 1 = S k = n, so n ∈ B.\n\nSecondly, φ₂(B) → φ₁(B). Assume ∀ n. (S[n] ⊆ B → n ∈ B) (2). W.T.S. 0 ∈ B ∧ ∀ n. (n ∈ B → n + 1 ∈ B).\n0 ∈ B? By (PL4), no k has S k = 0, so S[0] = ∅ ⊆ B. By (2), 0 ∈ B.\n∀ n. (n ∈ B → n + 1 ∈ B)? Take n ∈ B. By (2) applied to n + 1 it suffices to show S[n + 1] ⊆ B. Take k ∈ S[n + 1]; then S k = n + 1 = S n, so k = n by (PL3), and n ∈ B. Hence S[n + 1] ⊆ B.\n\nSo φ₁(B) ↔ φ₂(B) for every B, and Lemma 1.6 gives the theorem.",
  },
  "LogicInduction.recursion_unique": {
    level: "sketch",
    text: "Uniqueness half of the recursion theorem, assuming ordinary induction (I) — the explicit hypothesis hind : prop11 M in Lean: if γ and δ both satisfy γ(0) = a, γ(n+1) = β(n, γ n) (and likewise for δ) on a Peano-Like structure, then γ = δ. The set B = { k | γ k = δ k } contains 0 and is closed under S, so ordinary induction (prop11) forces B = univ, i.e. γ and δ agree everywhere; function extensionality finishes. Existence is the recursion theorem itself, taken as given; in Lean it is replaced by definitions through pattern matching on Nat.",
  },
};
