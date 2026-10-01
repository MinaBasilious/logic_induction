import LogicInduction.Set
namespace LogicInduction

structure PeanoLike (A : Type) where
  z  : A
  S  : A → A
  h1 : Function.Injective S
  h2 : ∀ x, S x ≠ z
  h3 : ∀ x, x = z ∨ ∃ k, S k = x

variable {N : Type}(M : PeanoLike N)

open Set PeanoLike

theorem l1 {X : Type} {P1 P2 Q : X → Prop} (h : ∀ x, P1 x ↔ P2 x) :
    (∀ x, (P1 x → Q x)) ↔ (∀ x, (P2 x → Q x)) := by
    constructor
    · intro h1 x
      rw[← h x]
      exact h1 x
    · intro h1 x
      rw[h x]
      exact h1 x

def Rel : N → N → Prop := fun k n => M.S k = n

def prop11 : Prop :=
  ∀ B : Set N, (M.z ∈ B ∧ ∀ n, (n ∈ B → M.S n ∈ B)) → B = univ

def prop12 : Prop :=
  ∀ B : Set N, (∀ n, (predR (Rel M) n ⊆ B → n ∈ B)) → B = univ

theorem thm13 : prop11 M ↔ prop12 M := by
  apply l1
  intro B
  unfold predR Rel
  constructor
  · intro h n hh
    let h3 := M.h3
    specialize h3 n
    cases h3 with
    | inl hhh =>
      rw[hhh]
      exact h.1
    | inr hhh =>
      obtain ⟨k, hk⟩ := hhh
      rw[← hk]
      apply h.2 k
      apply hh
      exact hk
  · intro h
    constructor
    · apply h
      intro k hk
      let h2 := M.h2
      specialize h2 k
      contradiction
    · intro n bn
      apply (h (M.S n))
      intro k hk
      let h1 := M.h1
      have hh : M.S k = M.S n := hk
      have : k = n := h1 hk
      rwa[this]

end LogicInduction
