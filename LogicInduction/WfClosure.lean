import LogicInduction.Relations
import LogicInduction.WellFounded

namespace LogicInduction
open Set

variable {X : Type}

theorem wf_of_wf_relPlus {ρ : X → X → Prop} (h : WF (relPlus ρ)) : WF ρ := by
  intro B hB
  have ⟨x, _, hx⟩ := h B hB
  exists x
  constructor
  · assumption
  · have : (predR ρ x) ⊆ (predR (relPlus ρ) x) := by
      intro y hy
      exists 0, y
      constructor
      · constructor
        · rfl
        · left; exists x
      · exact hy
    apply ext; intro a
    constructor
    · intro ha
      rw[← hx]
      constructor
      · apply this; exact ha.1
      · exact ha.2
    · intro _; contradiction

theorem not_wf_of_not_wf_relPlus {ρ : X → X → Prop} (h : ¬ WF (relPlus ρ)) :
    ¬ WF ρ := by
  obtain ⟨a, ha⟩ := not_wf_imp_desc h
  let A : Set X := fun x =>
    x ∈ RelDomain (relPlus ρ) ∧ ∃ n, relStar ρ (a (n+1)) x ∧ relStar ρ x (a n)
  have hne : ∃ x, x ∈ A := by
    exists (a 1)
    constructor
    · exists (a 0)
      exact ha 0
    · exists 1
      constructor
      · apply relPlus_imp_relStar
        exact ha 1
      · exists 0
        constructor
        · rfl
        · have ⟨k, l, _,_⟩:= ha 1
          right
          exists l
  have hstep : ∀ x, x ∈ A → ∃ y, y ∈ A ∧ ρ y x := by
    intro x ⟨hx, n, h1, h2⟩
    obtain ⟨k, hk⟩ := h1
    cases k with
    | zero =>
      have ⟨h, _⟩ := hk
      subst h
      obtain ⟨u, hu1, hu2⟩ := (relPlus_remark3 (ha (n+1))).1
      exists u
      constructor
      · constructor
        · exists (a (n+1))
          exact relSub_relPlus ρ u (a (n+1)) hu2
        · exists (n+1)
          exact ⟨hu1, relSub_relStar ρ u (a (n+1)) hu2⟩
      · exact hu2
    | succ m =>
      have ⟨y, hk1, hk2⟩ := hk
      exists y
      constructor
      · constructor
        · exists x, 0, y
          constructor
          · constructor
            · rfl
            · left
              exists x
          · assumption
        · exists n
          constructor
          · exists m
          · obtain ⟨l, hl⟩ := h2
            exists (l + 1)
            rw[Nat.add_comm, relPow_add ρ 1 l]
            exists x
            constructor
            · rw[relPow_one]; assumption
            · assumption
      · assumption
  exact not_wf_of_closed_set hne hstep

theorem claim_star_I {ρ : X → X → Prop} (h : ¬ WF (relPlus ρ)) :
    ¬ WF ρ := by
  obtain ⟨a, ha⟩ := not_wf_imp_desc h
  let B : Set X := fun x => ∃ k, relStar ρ (a k) x
  have hne : ∃ x, x ∈ B := by
    exists (a 0), 0, 0
    constructor
    · rfl
    · right
      have ⟨k, y, hk1, hk2⟩ := ha 0
      exists y
  have hstep : ∀ x, x ∈ B → ∃ y, y ∈ B ∧ ρ y x := by
    intro x hx
    obtain ⟨k, n, hn1⟩:= hx
    cases n with
    | zero =>
      obtain⟨h, haa⟩ := hn1
      have ⟨l, y, hk⟩ := ha k
      rw[← h]
      exists y
      constructor
      · exists (k + 1)
        exists l
        exact hk.1
      · exact hk.2
    | succ n =>
      obtain⟨w, hw⟩ := hn1
      exists w
      constructor
      · exists k, n
        exact hw.1
      · exact hw.2
  exact not_wf_of_closed_set hne hstep

theorem claim_star_II {ρ : X → X → Prop} (h : ¬ WF (relPlus ρ)) : ¬ WF ρ := by
  obtain ⟨C, hCne, hC⟩ := not_wf_imp_closed_set h
  let E : Set X := fun x => ∃ c, c ∈ C ∧ relStar ρ c x
  have hEne : ∃ x, x ∈ E := by
    obtain ⟨c, hc⟩ := hCne
    have ⟨c', hc'1, hc'2⟩ := hC c hc
    exists c, c'
    constructor
    · assumption
    · apply relPlus_imp_relStar
      assumption
  have hE : ∀ y, y ∈ E → ∃ u, u ∈ E ∧ ρ u y := by
    intro y ⟨c, hc1, hcy⟩
    obtain ⟨c', hc'1, hc'2⟩ := hC c hc1
    have h3 : relPlus ρ c' y :=
      remark2_iii ρ .plus .star (Or.inl trivial) c' c y hc'2 hcy
    obtain ⟨u, hu1, hu2⟩ := (relPlus_remark3 h3).1
    exact ⟨u, ⟨c', hc'1, hu1⟩, hu2⟩
  exact not_wf_of_closed_set hEne hE

theorem wf_relPlus_iff (ρ : X → X → Prop) : WF ρ ↔ WF (relPlus ρ) := by
  constructor
  · exact fun p => Classical.byContradiction fun q => not_wf_of_not_wf_relPlus q p
  · exact wf_of_wf_relPlus

end LogicInduction
