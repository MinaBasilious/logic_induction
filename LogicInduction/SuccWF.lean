import LogicInduction.IndN
import LogicInduction.WellFounded
namespace LogicInduction
open Set

variable {N : Type} (M : PeanoLike N)

theorem z_not_mem_range : ¬ M.z ∈ RelRange (Rel M) := by
  intro h
  obtain ⟨k, hk⟩ := h
  have := M.h2 k
  simp[Rel] at hk
  contradiction

theorem eq_of_mem_predR_succ (n : N) :
    ∀ k, k ∈ predR (Rel M) (M.S n) → k = n := by
  intro k hk
  simp[Rel] at hk
  apply M.h1
  assumption

/-- Notes: the principle of S,R_S-induction holds. -/
theorem succ_ind_range (hind : prop11 M) :
    IndPrinciple (Rel M) (RelRange (Rel M)) := by
  intro B BR Bh
  apply ext
  intro a
  constructor
  · exact BR a
  · intro ha
    have key : ∀ m, (m ∈ RelRange (Rel M) → m ∈ B) → M.S m ∈ B := by
      intro m hm
      apply Bh
      exists m
      intro k hk
      obtain⟨hk1, hk2⟩ := hk
      have := eq_of_mem_predR_succ M m k hk1
      rw[this]
      apply hm
      rw[← this]
      assumption
    let C : Set N := fun n ↦ M.S n ∈ B
    have h := hind C
    have hh : (M.z ∈ C ∧ ∀ (n : N), n ∈ C → M.S n ∈ C) := by
      constructor
      · apply key
        intro h
        have := z_not_mem_range M h
        contradiction
      · intro n hn
        apply key
        intro hn'
        assumption
    have hC := h hh
    obtain⟨k, hk⟩ := ha
    simp[Rel] at hk
    rw[← hk]
    have : k ∈ C := by rw[hC]; trivial
    assumption


/-- Notes: S is well founded. -/
theorem succ_wf (hind : prop11 M) : WF (Rel M) := by
  have := ind_range_imp_wfOn (succ_ind_range M hind)
  exact (wf_iff_wfOn_range (Rel M)).2 this

end LogicInduction
