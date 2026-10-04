import LogicInduction.Set
namespace LogicInduction
open Set

variable {X : Type}

/-- Notes: `a` is an infinite descending ρ-sequence. -/
@[simp]def InfDesc (ρ : X → X → Prop) (a : Nat → X) : Prop :=
  ∀ n, ρ (a (n+1)) (a n)

/-- Notes: ρ is well founded. -/
@[simp]def WF (ρ : X → X → Prop) : Prop :=
  ∀ B : Set X, (∃ x, x ∈ B) → ∃ x, x ∈ B ∧ predR ρ x ∩ B = ∅

/-- Notes: the principle of ρ,A-induction. -/
@[simp]def IndPrinciple (ρ : X → X → Prop) (A : Set X) : Prop :=
  ∀ B : Set X, B ⊆ A →
    (∀ x, x ∈ A → (predR ρ x ∩ A ⊆ B → x ∈ B)) → B = A

/-- Step 1 toward (i) → (ii). -/
theorem exists_mem_sdiff {A B : Set X} (hsub : B ⊆ A) (hne : B ≠ A) :
    ∃ x, x ∈ A \ B := by
  by_cases hex : ∃ x, x ∈ A \ B
  · exact hex
  · exfalso
    apply hne
    apply subset_antisymm
    · intro x
      exact hsub x
    · intro x
      intro hx
      by_cases h' : x ∈ B
      · exact h'
      · have : ∃ x, x ∈ A \ B := ⟨x, ⟨hx, h'⟩⟩
        contradiction

theorem inter_subset_of_disjoint_sdiff {A B C : Set X} (h : C ∩ (A \ B) = ∅) : (C ∩ A) ⊆ B := by
  intro x hx
  obtain ⟨hx1, hx2⟩ := hx
  by_cases h' : x ∈ B
  · exact h'
  · have h'' : x ∈ A \ B := ⟨hx2, h'⟩
    have h''' : x ∈ C ∩ (A \ B) := ⟨hx1, h''⟩
    rw[h] at h'''
    contradiction

/-- (i) → (ii) -/
theorem wf_imp_ind {ρ : X → X → Prop} (hwf : WF ρ) (A : Set X) :
    IndPrinciple ρ A := by
  intro B hsub hpred
  apply Classical.byContradiction
  intro hBnA
  have hext : ∃ x, x ∈ (A \ B) := exists_mem_sdiff hsub hBnA
  have h := hwf (A \ B) hext
  obtain ⟨x, hx, h⟩ := h
  have hsub : predR ρ x ∩ A ⊆ B := by
    apply inter_subset_of_disjoint_sdiff
    assumption
  obtain ⟨hx1, hx2⟩ := hx
  specialize hpred x hx1 hsub
  contradiction

theorem range_nonempty (a : Nat → X) : ∃ x, x ∈ range a := by exact ⟨a 0, 0, rfl⟩

theorem pred_inter_range_nonempty {ρ : X → X → Prop} {a : Nat → X}
    (hd : InfDesc ρ a) :
    ∀ x, x ∈ range a → ∃ y, y ∈ predR ρ x ∩ range a := by
  intro x hx
  obtain ⟨n, hn⟩ := hx
  have hpred : ρ (a (n+1)) (a n) := hd n
  have hmem : a (n+1) ∈ range a := ⟨n+1, rfl⟩
  rw[hn] at hpred
  exact ⟨a (n+1), ⟨hpred, hmem⟩⟩

theorem pred_inter_range_ne_empty {ρ : X → X → Prop} {a : Nat → X}
    (hd : InfDesc ρ a) :
    ∀ x, x ∈ range a → predR ρ x ∩ range a ≠ ∅ := by
  intro x hx hxx
  obtain ⟨y, hy⟩ := pred_inter_range_nonempty hd x hx
  rw [hxx] at hy
  exact nothing_empty hy

/-- (ii) → (iii) -/
theorem ind_imp_no_desc {ρ : X → X → Prop}
    (h : ∀ A : Set X, IndPrinciple ρ A) : ¬ ∃ a, InfDesc ρ a := by
  intro hex
  obtain ⟨a, ha⟩ := hex
  have hstep : ∀ x, x ∈ range a → predR ρ x ∩ range a ⊆ ∅ → x ∈ ∅ := by
    intro x hx hsub
    exfalso
    exact pred_inter_range_ne_empty ha x hx (subset_antisymm hsub empty_subset)
  have heq : ∅ = range a := h (range a) ∅ empty_subset hstep
  obtain ⟨x, hx⟩ := range_nonempty a
  rw [← heq] at hx
  exact nothing_empty hx

theorem ind_imp_no_desc' {ρ : X → X → Prop}
    (h : ∀ A : Set X, IndPrinciple ρ A) : ¬ ∃ a, InfDesc ρ a := by
  intro hex
  obtain ⟨a, ha⟩ := hex
  let A := range a
  specialize h A
  simp[InfDesc] at ha
  have hstep : ∀ x, x ∈ A → (predR ρ x ∩ A ⊆ ∅ → x ∈ ∅) := by
    intro x hx hsub
    exfalso
    apply pred_inter_range_ne_empty ha x hx
    apply subset_antisymm
    · assumption
    · exact empty_subset
  have hh := (h ∅ (empty_subset) hstep)
  have h' := range_nonempty a
  have : range a = A := rfl
  rw[this, ← hh] at h'
  obtain ⟨x, hx⟩ := h'
  apply nothing_empty
  assumption

/-- ¬ WF gives a nonempty B in which every element has a ρ-predecessor in B. -/
theorem not_wf_imp_closed_set {ρ : X → X → Prop} (h : ¬ WF ρ) :
    ∃ B : Set X, (∃ x, x ∈ B) ∧ ∀ x, x ∈ B → ∃ y, y ∈ B ∧ ρ y x := by
  simp[WF] at h
  obtain ⟨B, h⟩ := h
  exists B
  obtain ⟨h1, h2⟩ := h
  constructor
  · exact h1
  · intro x hx
    specialize h2 x hx
    have hh : (predR ρ x ∩ B ≠ ∅) → (∃y, y ∈  predR ρ x ∩ B) := by
      intro hh1
      by_cases H : ∃ y, y ∈ predR ρ x ∩ B
      · assumption
      · simp at H
        have : (predR ρ x ∩ B) = ∅ := by apply ext; simp; assumption
        rw[this]
        contradiction
    specialize hh h2
    obtain ⟨y, hy1, hy2⟩ := hh
    exists y


/-- A step function on B choosing a predecessor. -/
theorem exists_step {ρ : X → X → Prop} {B : Set X}
    (hB : ∀ x, x ∈ B → ∃ y, y ∈ B ∧ ρ y x) :
    ∃ f : {x // x ∈ B} → {x // x ∈ B}, ∀ x, ρ (f x).1 x.1 := by
  let ρ' : {x // x ∈ B} → {x // x ∈ B} → Prop := fun x y => ρ y.1 x.1
  have : (∃ f : {x // x ∈ B} → {x // x ∈ B}, ∀ (x : { x // x ∈ B }), ρ (f x).1 x.1) = (∃ f : {x // x ∈ B} → {x // x ∈ B}, ∀ (x : { x // x ∈ B }), ρ' x (f x)) := by rfl
  rw[this]
  apply Classical.axiomOfChoice
  intro x
  let h := hB x.1 x.2
  obtain ⟨y, hy1, hy2⟩ := h
  exists ⟨y, hy1⟩

def iter {α : Type} (f : α → α) (x₀ : α) : Nat → α
  | 0 => x₀
  | n+1 => f (iter f x₀ n)

/-- (iii) → (i), contrapositive form -/
theorem not_wf_imp_desc {ρ : X → X → Prop} (h : ¬ WF ρ) :
    ∃ a, InfDesc ρ a := by
  let hh := (not_wf_imp_closed_set h)
  obtain ⟨B, Bx, hh⟩ := hh
  let h1 := exists_step hh
  obtain ⟨f, fh⟩ := h1
  obtain ⟨x₀, hx₀⟩ := Bx
  let a' : Nat → { x // x ∈ B } := iter f ⟨x₀, hx₀⟩
  let a := fun n => (a' n).1
  exists a
  intro n
  exact fh (a' n)

/-- (iii) → (i) -/
theorem not_desc_imp_wf {ρ : X → X → Prop} : (¬ ∃ a, InfDesc ρ a) → WF ρ := by
  intro h
  apply Classical.byContradiction
  intro hh
  have h' := not_wf_imp_desc hh
  contradiction

/-- Theorem: the following are equivalent for a relation ρ. -/
theorem wf_equiv (ρ : X → X → Prop) :
    (WF ρ ↔ ∀ A, IndPrinciple ρ A) ∧ (WF ρ ↔ ¬ ∃ a, InfDesc ρ a) := by
  constructor
  · constructor
    · exact wf_imp_ind
    · exact fun h => not_desc_imp_wf (ind_imp_no_desc h)
  · constructor
    · exact fun h => ind_imp_no_desc (wf_imp_ind h)
    · exact not_desc_imp_wf

/-- Notes: Rρ, the range of ρ. -/
def RelRange (ρ : X → X → Prop) : Set X := fun y => ∃ x, ρ x y

/-- Notes: ρ is w.f. on A. -/
def WFOn (ρ : X → X → Prop) (A : Set X) : Prop :=
  ∀ B : Set X, B ⊆ A → (∃ x, x ∈ B) → ∃ x, x ∈ B ∧ predR ρ x ∩ B = ∅

theorem predR_eq_empty_of_not_mem_range {ρ : X → X → Prop} {x : X}
    (h : ¬ x ∈ RelRange ρ) : predR ρ x = ∅ := by
  apply ext
  intro a
  constructor
  · intro h'
    exfalso
    apply h
    exists a
  · intro _
    contradiction

theorem wf_iff_wfOn_range (ρ : X → X → Prop) : WF ρ ↔ WFOn ρ (RelRange ρ) := by
  constructor
  · intro h
    intro B _
    exact h B
  · intro h B
    by_cases hout : ∃ x, x ∈ B ∧ ¬ x ∈ RelRange ρ
    · intro hh
      obtain ⟨x, hx1, hx2⟩ := hout
      exists x
      constructor
      · assumption
      · have h := predR_eq_empty_of_not_mem_range hx2
        rw[h]
        simp
    · simp at hout
      have h' := h B hout
      assumption

theorem ind_range_imp_wfOn {ρ : X → X → Prop} :
    IndPrinciple ρ (RelRange ρ) → WFOn ρ (RelRange ρ) := by
  intro h B hB hne
  apply Classical.byContradiction
  intro hno
  have hstep : ∀ x, x ∈ RelRange ρ →
    predR ρ x ∩ RelRange ρ ⊆ RelRange ρ \ B → x ∈ RelRange ρ \ B := by
    intro x Rx hx
    by_cases h' : x ∈ B
    · have hne' : predR ρ x ∩ B ≠ ∅ := fun hempty => hno ⟨x, h', hempty⟩
      obtain ⟨y, hy1, hy2⟩ := exists_mem_of_ne_empty hne'
      have hyR := hB y hy2
      have hhh := hx y ⟨hy1, hyR⟩
      exfalso
      exact hhh.2 hy2
    · exact ⟨Rx, h'⟩
  have heq : RelRange ρ \ B = RelRange ρ := h (RelRange ρ \ B) sdiff_subset hstep
  obtain ⟨x, hx⟩ := hne
  have hn := hB x hx
  exact (heq ▸ hn).2 hx


theorem ind_iff_ind_range (ρ : X → X → Prop) :
    (∀ A, IndPrinciple ρ A) ↔ IndPrinciple ρ (RelRange ρ) := by
  constructor
  · intro h
    exact h (RelRange ρ)
  · intro h
    apply (wf_equiv ρ).1.1
    apply (wf_iff_wfOn_range ρ).2
    apply ind_range_imp_wfOn
    assumption


end LogicInduction
