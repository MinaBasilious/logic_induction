// Informal content for the Relations module (relative product, powers, closures).

import type { InformalEntry } from "./set-indN";

export const informalRelations: Record<string, InformalEntry> = {
  "LogicInduction.RelSub": {
    level: "definition",
    text: "σ ⊆ ρ for binary relations: every σ-step is also a ρ-step, pointwise on both arguments.",
  },
  "LogicInduction.relProd": {
    level: "definition",
    text: "The relative product ρ|σ: x (ρ|σ) z iff there is an intermediate y with x ρ y and y σ z. It is composition of relations — travel from x to z by first using ρ, then σ.",
  },
  "LogicInduction.RelRange": {
    level: "definition",
    text: "Rρ, the range of ρ: all y that appear as a target, i.e. y ∈ Rρ iff some x satisfies x ρ y.",
  },
  "LogicInduction.RelDomain": {
    level: "definition",
    text: "Dρ, the domain of ρ: all x that appear as a source, i.e. x ∈ Dρ iff some y satisfies x ρ y.",
  },
  "LogicInduction.Field": {
    level: "definition",
    text: "The field Fρ = Dρ ∪ Rρ: all elements that occur on either side of the relation.",
  },
  "LogicInduction.IdOn": {
    level: "definition",
    text: "The identity relation I_A on a set A: x I_A y iff x = y and x ∈ A. Restricted identity, used as the neutral element for the relative product.",
  },
  "LogicInduction.relPow": {
    level: "definition",
    text: "Powers of a relation: ρ⁰ = I_{Fρ} (identity on the field), ρ^(n+1) = ρⁿ|ρ. So x ρⁿ y iff y is reachable from x in exactly n ρ-steps.",
  },
  "LogicInduction.relStar": {
    level: "definition",
    text: "The reflexive transitive closure ρ* = ⋃_{n ≥ 0} ρⁿ: x ρ* y iff y is reachable from x in some number of ρ-steps, possibly zero.",
  },
  "LogicInduction.relPlus": {
    level: "definition",
    text: "The transitive closure ρ⁺ = ⋃_{n ≥ 1} ρⁿ: x ρ⁺ y iff y is reachable from x in at least one ρ-step.",
  },
  "LogicInduction.TransRel": {
    level: "definition",
    text: "ρ is transitive: x ρ y and y ρ z imply x ρ z.",
  },
  "LogicInduction.IsFun": {
    level: "definition",
    text: "ρ is a function (single-valued relation): any two ρ-steps out of the same source land on the same target.",
  },
  "LogicInduction.trans_iff_relProd_sub": {
    level: "sketch",
    text: "ρ is transitive iff ρ|ρ ⊆ ρ: unpack both sides — a composite step via some y factors exactly as two chained steps, so the two statements are the same assertion in different notation.",
  },
  "LogicInduction.isFun_relProd": {
    level: "sketch",
    text: "The composite of two single-valued relations is single-valued: from x (ρ|σ) y and x (ρ|σ) z, the ρ-parts force the two intermediate points to coincide (ρ is a function), and then the σ-parts force y = z.",
  },
  "LogicInduction.sigma_fun_on_range": {
    level: "sketch",
    text: "Converse restriction of the previous lemma: if the composite ρ|σ is a function and ρ actually reaches y from somewhere, then σ is single-valued at y — two different σ-steps out of y would combine with the same ρ-step into two different composites.",
  },
  "LogicInduction.relProd_assoc_iff": {
    level: "sketch",
    text: "Pointwise associativity: (x (ρ|σ) τ) w holds via some y with x (ρ|σ) y and y τ w; refining the inner step gives a two-level existence that rearranges into x ρ y and y (σ|τ) w. Both directions just re-associate the exists statements.",
  },
  "LogicInduction.relProd_assoc": {
    level: "sketch",
    text: "As an equality of relations: (ρ|σ)|τ = ρ|(σ|τ), obtained from the pointwise version by extensionality.",
  },
  "LogicInduction.relProd_not_comm": {
    level: "sketch",
    text: "The relative product is not commutative. Counterexample on ℕ: take ρ = {(0,1)} and σ = {(1,2)} as graphs. Then 0 (ρ|σ) 2 holds, but 0 (σ|ρ) 2 cannot: no pair of σρ runs from 0 to 2 in the other order. So relativisation does not commute in general.",
  },
  "LogicInduction.relProd_idOn_field": {
    level: "sketch",
    text: "The identity on the field acts as a right neutral element: ρᵐ|I_{Fρ} = ρᵐ. Forward: the I-step forces the intermediate point to equal the target, which lies in the field of the ρᵐ-step. Backward: pad the ρᵐ-step with a trivial identity step; for m = 0 the target is in the field by assumption, for m+1 from its ρ-component.",
  },
  "LogicInduction.relPow_add": {
    level: "sketch",
    text: "ρ^(m+n) = ρᵐ|ρⁿ — exponent additivity. Induction on n: the case n = 0 is right-neutrality of the identity on the field; the step concatenates an (m+n)-run followed by one more ρ-step, which is an m-run followed by an (n+1)-run, via the shared intermediate point.",
  },
  "LogicInduction.relSub_relPlus": {
    level: "sketch",
    text: "ρ ⊆ ρ⁺: one ρ-step is a 1-step composite, witnessed with power 1 built as identity followed by the step itself.",
  },
  "LogicInduction.relPlus_trans": {
    level: "sketch",
    text: "ρ⁺ is transitive: an (n+1)-run followed by an (m+1)-run is a run of length (n+1)+(m+1) = n+m+2, split at the meeting point y using ρ^(m+n+1) = ρ^(n+1)|ρ^(m+1).",
  },
  "LogicInduction.relSub_relPow_succ": {
    level: "sketch",
    text: "If ρ ⊆ σ and σ is transitive then every positive power ρ^(n+1) lands inside σ: induction on n — a 1-run is a ρ-step hence a σ-step; an (n+2)-run splits into a σ-path by hypothesis and a final ρ-step, joined by σ's transitivity.",
  },
  "LogicInduction.relPlus_least": {
    level: "sketch",
    text: "ρ⁺ is the least transitive relation above ρ: any transitive σ ⊇ ρ contains every positive power of ρ by the previous lemma, hence contains ρ⁺.",
  },
  "LogicInduction.ReflOn": {
    level: "definition",
    text: "σ is reflexive on A: every x ∈ A satisfies x σ x.",
  },
  "LogicInduction.reflOn_relStar": {
    level: "sketch",
    text: "ρ* is reflexive on the field of ρ: any x in the field is reached from itself by the 0-step power ρ⁰ = I_{Fρ}.",
  },
  "LogicInduction.relSub_relStar": {
    level: "sketch",
    text: "ρ ⊆ ρ*: a single ρ-step is a 1-step composite, padded by the identity on the field at the source.",
  },
  "LogicInduction.relStar_trans": {
    level: "sketch",
    text: "ρ* is transitive: an n-run and an m-run concatenate into an (n+m)-run, using ρ^(n+m) = ρⁿ|ρᵐ with the shared intermediate point y.",
  },
  "LogicInduction.relStar_least": {
    level: "sketch",
    text: "ρ* is the least reflexive-on-field transitive relation above ρ. Given such σ: zero-length runs land in σ by reflexivity on the field, positive runs by the powers lemma; case on the witness length n.",
  },
  "LogicInduction.relPlus_decomp": {
    ref: "Remark 3",
    level: "full",
    text: "Remark 3. If x ρ⁺ y then there is u with x ρ* u and u ρ y: take the last step out of a longest run — an (n+1)-composite x ρⁿ u ρ y exhibits u, with x ρⁿ u an instance of ρ*.",
  },
  "LogicInduction.relPlus_of_relPlus_relStar": {
    level: "sketch",
    text: "ρ⁺ followed by ρ* stays in ρ⁺: an (n+1)-run plus an m-run is an (n+1+m)-run, reindexed as a single positive-length run via ρ^(n+1+m) = ρ^(n+1)|ρᵐ.",
  },
  "LogicInduction.relStar_relProd": {
    level: "sketch",
    text: "ρ*|ρ = ρ⁺: any number of steps then one more is exactly at least one step — forward, strip the star part and keep its length; backward, a positive run of length n+1 is a run of length n followed by the final step.",
  },
  "LogicInduction.relPow_one": {
    level: "sketch",
    text: "ρ¹ = ρ: a one-step composite through identity on the field is just the step itself, since the source of a ρ-step lies in the field.",
  },
  "LogicInduction.relProd_relStar": {
    level: "sketch",
    text: "ρ|ρ* = ρ⁺, the mirror of ρ*|ρ = ρ⁺: one step then finitely many is again a positive-length run; use exponent rearrangement ρ^(1+k) = ρ|ρᵏ and the additivity of powers.",
  },
  "LogicInduction.relStar_relProd_eq_relProd_relStar": {
    level: "sketch",
    text: "The two one-sided absorption identities coincide: ρ*|ρ = ρ|ρ* because both equal ρ⁺.",
  },
  "LogicInduction.relPlus_remark3": {
    ref: "Remark 3",
    level: "sketch",
    text: "Both halves of Remark 3 at once: x ρ⁺ y yields u with x ρ* u and u ρ y (split off the last step), and v with x ρ v and v ρ* y (split off the first step), reading ρ⁺ respectively as ρ*|ρ and ρ|ρ*.",
  },
  "LogicInduction.relPlus_remark3'": {
    ref: "Remark 3",
    level: "sketch",
    text: "Variant of Remark 3 recording that the intermediate points can be chosen inside the domain resp. range of ρ: u is a source of a ρ-step, v a target.",
  },
  "LogicInduction.Exp": {
    level: "definition",
    text: "A tiny syntax type for the closure expressions of the notes' Remark 2: an exponent is a natural number n, or the tokens + (ρ⁺) or * (ρ*).",
  },
  "LogicInduction.relExp": {
    level: "definition",
    text: "The interpretation of the expression syntax: nat n denotes ρⁿ, plus denotes ρ⁺, star denotes ρ*.",
  },
  "LogicInduction.relPlus_imp_relStar": {
    level: "sketch",
    text: "ρ⁺ ⊆ ρ*: a positive run of length n+1 is also a run of length n+1 counted from zero — the star union includes all positive powers.",
  },
  "LogicInduction.remark2_i": {
    ref: "Remark 2",
    level: "sketch",
    text: "Remark 2 (i): every expression α ∈ {ρⁿ, ρ⁺, ρ*} is contained in ρ* — ρⁿ is a term of the star union and ρ⁺ ⊆ ρ*.",
  },
  "LogicInduction.remark2_ii": {
    ref: "Remark 2",
    level: "sketch",
    text: "Remark 2 (ii): composing two expressions in sequence still lands in ρ*: reduce both factors to ρ* by (i) and use transitivity of ρ*.",
  },
  "LogicInduction.Exp.IsPos": {
    level: "definition",
    text: "α is a 'positive' expression — one that guarantees at least one step: a positive natural exponent, or the token +; the token * is not positive.",
  },
  "LogicInduction.relExp_pos": {
    level: "sketch",
    text: "A positive expression denotes a relation contained in some positive power: positive exponent n = k+1 is itself a positive power; + is ρ⁺ by definition; * is excluded by positivity.",
  },
  "LogicInduction.remark2_iii": {
    ref: "Remark 2",
    level: "sketch",
    text: "Remark 2 (iii): if at least one of the two composed expressions is positive, the composite lands in ρ⁺. The positive factor contributes a positive power (previous lemma), the other one some power, and ρ^(m+1+k) = ρ^(m+1)|ρᵏ concatenates them.",
  },
  "LogicInduction.relPow_mem_field": {
    level: "sketch",
    text: "Both endpoints of a ρⁿ-step lie in the field of ρ: induction on n — the 0-step is the identity on the field; a composite step inherits its source from the first factor and its target from the second, which is a ρ-step.",
  },
  "LogicInduction.relPow_succ_mem": {
    level: "sketch",
    text: "A positive power ρ^(n+1) sends domain points to range points: write ρ^(n+1) = ρ|ρⁿ (additivity), read off the source of the ρ-part for the domain and the target for the range.",
  },
  "LogicInduction.domain_relPlus": {
    level: "sketch",
    text: "D(ρ⁺) = Dρ: a positive run starts with a genuine ρ-step so its source is a ρ-source; conversely a single ρ-step is a positive run of length 1.",
  },
  "LogicInduction.range_relPlus": {
    level: "sketch",
    text: "R(ρ⁺) = Rρ: symmetric to the domain statement — a positive run ends with a genuine ρ-step, and a single step is a run.",
  },
  "LogicInduction.domain_relStar": {
    level: "sketch",
    text: "D(ρ*) = Fρ: a run of any length has its source in the field (powers keep both endpoints in the field); conversely every field element is reached from itself by the 0-run.",
  },
  "LogicInduction.range_relStar": {
    level: "sketch",
    text: "R(ρ*) = Fρ: mirror of the domain statement — targets of runs lie in the field, and every field element reaches itself by the 0-run.",
  },
  "LogicInduction.mem_field_iff": {
    level: "sketch",
    text: "Unfolds membership in the field as the expected disjunction x ∈ Dρ ∨ x ∈ Rρ; true by definition.",
  },
  "LogicInduction.field_relPlus": {
    level: "sketch",
    text: "F(ρ⁺) = Fρ: the field is the union of domain and range, both preserved under taking the positive closure.",
  },
  "LogicInduction.field_relStar": {
    level: "sketch",
    text: "F(ρ*) = Fρ: domain and range of ρ* both equal Fρ, so their union is unchanged.",
  },
};
