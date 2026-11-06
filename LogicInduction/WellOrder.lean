import LogicInduction.Set
import LogicInduction.Relations
import LogicInduction.WellFounded

namespace LogicInduction
open Set

variable {X : Type}

def IrreflRel (ρ : X → X → Prop) : Prop := ∀ x, ¬ ρ x x

def StrictPO (ρ : X → X → Prop) : Prop := IrreflRel ρ ∧ TransRel ρ

/-- x is a smallest element of B for ρ. -/
def Smallest (ρ : X → X → Prop) (B : Set X) (x : X) : Prop :=
  x ∈ B ∧ ∀ y, y ∈ B → x = y ∨ ρ x y

def WellOrder (ρ : X → X → Prop) : Prop :=
  ∀ B : Set X, B ⊆ Field ρ → (∃ x, x ∈ B) → ∃ x, Smallest ρ B x

theorem range_sub_field (ρ : X → X → Prop) : RelRange ρ ⊆ Field ρ := by
  intro x ⟨y, hx⟩
  right
  exists y

theorem wo_imp_wfOn_field {ρ : X → X → Prop} (hs : StrictPO ρ) (hw : WellOrder ρ) :
    WFOn ρ (Field ρ) := by
  intro B h hB
  have ⟨x, hx1, hx2⟩ := hw B h hB
  exists x
  constructor
  · assumption
  · apply ext
    intro y
    constructor
    · intro ⟨hy1, hy2⟩
      have := hx2 y hy2
      cases this
      · rename_i hh
        have hy1' : ρ y x := hy1
        rw[hh] at hy1'
        have := hs.1 y hy1'
        contradiction
      . rename_i hh
        have hy1' : ρ y x := hy1
        have hxx : ρ x x := hs.2 x y x hh hy1'
        have := hs.1 x hxx
        contradiction
    · intro _
      contradiction

theorem wo_imp_wf {ρ : X → X → Prop} (hs : StrictPO ρ) (hw : WellOrder ρ) :
    WF ρ := by
  apply (wf_iff_wfOn_range ρ).2
  intro B h Bh
  have : B ⊆ Field ρ := fun b hh => (range_sub_field ρ b) (h b hh)
  exact wo_imp_wfOn_field hs hw B this Bh

/-- Notes: ρ is linear (any two elements are comparable). -/
def LinearRel (ρ : X → X → Prop) : Prop := ∀ x y, x = y ∨ ρ x y ∨ ρ y x

theorem wf_imp_wo {ρ : X → X → Prop} (hl : LinearRel ρ) (hw : WF ρ) :
    WellOrder ρ := by
  intro B Bh Bh'
  have ⟨x, hx1, hx2⟩ := hw B Bh'
  exists x
  constructor
  · assumption
  · intro y hy
    cases hl x y
    · left; assumption
    · rename_i h
      cases h
      · right; assumption
      · rename_i h; have : y ∈ predR ρ x ∩ B := ⟨h, hy⟩
        rw[hx2] at this
        contradiction

theorem not_wf_imp_wo :
    ¬ ∀ ρ : Nat → Nat → Prop, StrictPO ρ → WF ρ → WellOrder ρ := by
  intro h
  let ρ : Nat → Nat → Prop := fun x y => x = 0 ∧ (y = 1 ∨ y = 2)
  have h1 : StrictPO ρ := by
    constructor
    · intro x ⟨hx1, hx2⟩
      cases hx2
      · omega
      · omega
    · intro x y z ⟨hxy1, _⟩  ⟨_, hyz2⟩
      constructor
      · assumption
      · assumption
  have h2 : WF ρ := by
    intro B ⟨x, hx⟩
    by_cases h : 0 ∈ B
    · exists 0
      constructor
      · assumption
      · apply ext; intro y
        constructor
        · intro ⟨⟨hy1, hy2⟩, hy3⟩
          cases hy2; omega; omega
        · intro _; contradiction
    · exists x
      constructor
      · assumption
      · apply ext; intro y
        constructor
        · intro ⟨⟨hy1, hy2⟩, hy3⟩
          rw[hy1] at hy3
          contradiction
        · intro _; contradiction
  have h3 : ¬(WellOrder ρ) := by
    intro h
    let B : Set Nat := fun x => x = 1 ∨ x = 2
    have Bh : B ⊆ Field ρ := by
      intro x hx
      right
      exists 0
    have Bh' : ∃x, x ∈ B := ⟨1, Or.inl rfl⟩
    have ⟨x, ⟨hx1, hx2⟩⟩ := h B Bh Bh'
    cases hx1
    · have := hx2 2 (Or.inr rfl)
      cases this
      · omega
      · omega
    · have := hx2 1 (Or.inl rfl)
      cases this
      · omega
      · omega
  exact h3 (h ρ h1 h2)

theorem wo_iff_wf {ρ : X → X → Prop} (hs : StrictPO ρ) (hl : LinearRel ρ) :
    WellOrder ρ ↔ WF ρ :=
  ⟨wo_imp_wf hs, wf_imp_wo hl⟩


end LogicInduction
