import LogicInduction.IndN
import LogicInduction.SuccWF
import LogicInduction.WfClosure

namespace LogicInduction
open Set Nat

def natPeano : PeanoLike Nat where
  z := 0
  S := Nat.succ
  h1 := by intro x y hxy; apply Nat.succ_inj.1; assumption
  h2 := Nat.succ_ne_zero
  h3 := by intro n; cases n with | zero => left; rfl | succ n => right; exists n

theorem natPeano_ind : prop11 natPeano := by
  intro B hB
  apply ext
  intro n
  constructor
  · intro hn
    trivial
  · intro hn
    induction n with
    | zero => exact hB.1
    | succ n hnn => exact hB.2 n (hnn hn)

/-- ρ^n for the successor relation is "add n". -/
theorem relPow_nat (n x y : Nat) :
    relPow (Rel natPeano) n x y ↔ x + n = y := by
  constructor
  · revert x y
    induction n with
    | zero =>
      intro x y hxy
      obtain ⟨h, hh⟩ := hxy
      omega
    | succ n hn =>
      intro x y hxy
      obtain ⟨k, hk1, hk2⟩ := hxy
      have := hn x k hk1
      have hk2' : Nat.succ k = y := hk2
      omega
  · revert x y
    induction n with
    | zero =>
      intro x y hxy
      constructor
      · omega
      · left; exists (Nat.succ x)
    | succ k hk =>
      intro x y hxy
      rw[← hxy]
      exists (x + k)
      constructor
      · apply hk
        rfl
      · trivial

theorem relStar_nat (x y : Nat) : relStar (Rel natPeano) x y ↔ x ≤ y := by
  constructor
  · intro ⟨k, hk⟩
    have := (relPow_nat k x y).1 hk
    omega
  · intro h
    have ⟨k, hk⟩ := Nat.le.dest h
    exists k
    exact (relPow_nat k x y).2 hk

theorem relPlus_nat (x y : Nat) : relPlus (Rel natPeano) x y ↔ x < y := by
  constructor
  · intro ⟨k, l, hkl, hly⟩
    have := (relPow_nat k x l).1 hkl
    have : (x + k).succ = l.succ := by omega
    have hyl : y = l.succ := by exact hly.symm
    omega
  · intro hxy
    have : ∃k : Nat, x.succ + k = y := by exact Nat.le.dest hxy
    obtain ⟨k, hk⟩ := this
    have : x + k.succ = y := by omega
    have := (relPow_nat k.succ x y).2 this
    exists k

/-- The sheet's corollary: `<` is well founded. -/
theorem lt_wf : WF (fun x y : Nat => x < y) := by
  have : relPlus (Rel natPeano) = (fun x y : Nat => x < y) := by
    ext x y
    exact relPlus_nat x y
  rw[← this]
  apply (wf_relPlus_iff (Rel natPeano)).mp ?_
  exact  succ_wf natPeano natPeano_ind

/-- Course of values induction. -/
theorem course_of_values (B : Set Nat)
    (h : ∀ n, (∀ k, k < n → k ∈ B) → n ∈ B) : B = univ := by
  have := (wf_equiv (fun x y : Nat => x < y)).1.1 lt_wf univ
  apply this
  intro n Bn
  trivial
  intro n _ hn
  have := h n
  apply this; intro k hk
  exact hn k ⟨hk, trivial⟩

end LogicInduction
