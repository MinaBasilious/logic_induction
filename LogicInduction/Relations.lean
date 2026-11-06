import LogicInduction.Set

namespace LogicInduction
open Set
variable {X : Type}

/-- Notes: σ ⊆ ρ for binary relations. -/
def RelSub (σ ρ : X → X → Prop) : Prop := ∀ x y, σ x y → ρ x y

/-- Notes: relative product ρ|σ. -/
def relProd (ρ σ : X → X → Prop) : X → X → Prop :=
  fun x z => ∃ y, ρ x y ∧ σ y z

/-- Notes: Rρ, the range of ρ. -/
def RelRange (ρ : X → X → Prop) : Set X := fun y => ∃ x, ρ x y

/-- Notes: Dρ, the domain of ρ. -/
def RelDomain (ρ : X → X → Prop) : Set X := fun x => ∃ y, ρ x y

/-- Notes: the field Fρ = Dρ ∪ Rρ. -/
def Field (ρ : X → X → Prop) : Set X :=
  fun x => x ∈ RelDomain ρ ∨ x ∈ RelRange ρ

/-- Notes: I_A. -/
def IdOn (A : Set X) : X → X → Prop := fun x y => (x = y) ∧ (A x)

/-- Notes: ρ^n, with ρ^0 = I_{Fρ} and ρ^(n+1) = ρ^n | ρ. -/
def relPow (ρ : X → X → Prop) : Nat → X → X → Prop
  | 0 => IdOn (Field ρ)
  | n+1 => relProd (relPow ρ n) ρ

/-- Notes: ρ* = ⋃ ρ^n over n ≥ 0. -/
def relStar (ρ : X → X → Prop) : X → X → Prop :=
  fun x y => ∃ n, relPow ρ n x y

/-- Notes: ρ⁺ = ⋃ ρ^n over n ≥ 1. -/
def relPlus (ρ : X → X → Prop) : X → X → Prop :=
  fun x y => ∃ n, relPow ρ (n+1) x y

/-- Notes: ρ is transitive. -/
def TransRel (ρ : X → X → Prop) : Prop := ∀ x y z, ρ x y → ρ y z → ρ x z

/-- Notes: ρ is a function (a single-valued relation). -/
def IsFun (ρ : X → X → Prop) : Prop := ∀ x y z, ρ x y → ρ x z → y = z

theorem trans_iff_relProd_sub (ρ : X → X → Prop) :
    TransRel ρ ↔ RelSub (relProd ρ ρ) ρ := by
  constructor
  · intro h x z hxz
    obtain ⟨y, hx, hz⟩ := hxz
    exact h x y z hx hz
  · intro h x y z hxy hyz
    apply h
    exists y


theorem isFun_relProd {ρ σ : X → X → Prop}
    (hρ : IsFun ρ) (hσ : IsFun σ) : IsFun (relProd ρ σ) := by
  intro x y z hxy hxz
  obtain ⟨k,hx1, hy⟩ := hxy
  obtain ⟨l, hx2, hz⟩ := hxz
  have h : k = l := hρ x k l hx1 hx2
  apply hσ k y z
  · assumption
  · rw[h]; assumption

theorem sigma_fun_on_range {ρ σ : X → X → Prop}
    (h : IsFun (relProd ρ σ)) :
    ∀ y, (∃ x, ρ x y) → ∀ z w, σ y z → σ y w → z = w := by
  intro y hxy z w hyz hyw
  obtain ⟨x, hxy⟩ := hxy
  apply h x z w
  · exists y
  · exists y

theorem relProd_assoc_iff (ρ σ τ : X → X → Prop) (x w : X) :
    relProd (relProd ρ σ) τ x w ↔ relProd ρ (relProd σ τ) x w := by
  unfold relProd
  constructor
  · intro ⟨y, hy1, hy2⟩
    obtain ⟨z, hz1, hz2⟩ := hy1
    exists z
    constructor
    · assumption
    · exists y
  · intro ⟨y, hy1, hy2⟩
    obtain ⟨z, hz1, hz2⟩ := hy2
    exists z
    constructor
    · exists y
    · assumption

theorem relProd_assoc (ρ σ τ : X → X → Prop) :
    relProd (relProd ρ σ) τ = relProd ρ (relProd σ τ) := by
  ext x w
  exact relProd_assoc_iff ρ σ τ x w

theorem relProd_not_comm :
    ¬ ∀ ρ σ : Nat → Nat → Prop, relProd ρ σ = relProd σ ρ := by
  simp
  let ρ : Nat → Nat → Prop := fun n m ↦ n = 0 ∧ m = 1
  let σ : Nat → Nat → Prop := fun n m ↦ n = 1 ∧ m = 2
  have h1 : relProd ρ σ 0 2 := ⟨1, ⟨rfl, rfl⟩, ⟨rfl, rfl⟩⟩
  have h2 : ¬ relProd σ ρ 0 2 := by intro h; obtain ⟨k, hk1, hk2⟩ := h; have := (hk1.1); contradiction
  exists ρ, σ
  intro h
  apply h2
  rwa[← h]

theorem relProd_idOn_field {ρ : X → X → Prop} (m : Nat) :
    relProd (relPow ρ m) (IdOn (Field ρ)) = relPow ρ m := by
  ext x y
  constructor
  · intro ⟨z, hz1, hz2⟩
    obtain ⟨hy1, hy2⟩ := hz2
    rwa[← hy1]
  · intro h
    exists y
    constructor
    · assumption
    · constructor
      · rfl
      · cases m
        · obtain ⟨h1, h2⟩ := h
          rwa[← h1]
        · rename_i n
          obtain ⟨k, h1, h2⟩ := h
          right
          exists k



theorem relPow_add (ρ : X → X → Prop) (m n : Nat) :
    relPow ρ (m + n) = relProd (relPow ρ m) (relPow ρ n) := by
  induction n with
  | zero => exact (relProd_idOn_field m).symm
  | succ n hn =>
    ext x y
    constructor
    · intro ⟨z, hz1, hz2⟩
      have : m.add n = m + n := rfl
      rw[this, hn] at hz1
      obtain ⟨w, hw1, hw2⟩ := hz1
      exists w
      constructor
      · assumption
      · exists z
    · intro ⟨z, hz1, hz2⟩
      obtain ⟨w, hw1, hw2⟩ := hz2
      exists w
      constructor
      · have : m.add n = m + n := rfl
        rw[this, hn]
        exists z
      · assumption

theorem relSub_relPlus (ρ : X → X → Prop) : RelSub ρ (relPlus ρ) := by
  intro x y hxy
  exists 0, x
  exact ⟨⟨rfl,Or.inl ⟨y, hxy⟩⟩, hxy⟩

theorem relPlus_trans (ρ : X → X → Prop) : TransRel (relPlus ρ) := by
  intro x y z ⟨n, hxy⟩ ⟨m, hyz⟩
  exists (n + m + 1)
  have : n + m + 1 + 1 = (n + 1) + (m + 1):= by omega
  rw[this]
  rw[relPow_add ρ (n + 1) (m + 1)]
  exists y

theorem relSub_relPow_succ {ρ σ : X → X → Prop}
    (hρσ : RelSub ρ σ) (hσ : TransRel σ) (n : Nat) :
    RelSub (relPow ρ (n+1)) σ := by
  induction n with
  | zero =>
    intro x y ⟨z, ⟨h, hx1⟩, hz2⟩
    rw[← h] at hz2
    exact hρσ x y hz2
  | succ n hn =>
    intro x y ⟨z, hx1, hz2⟩
    have hxz := hn x z hx1
    have hzy := hρσ z y hz2
    exact hσ x z y hxz hzy

theorem relPlus_least {ρ σ : X → X → Prop}
    (hρσ : RelSub ρ σ) (hσ : TransRel σ) : RelSub (relPlus ρ) σ := by
  intro x y ⟨n, hxy⟩
  exact relSub_relPow_succ hρσ hσ n x y hxy

/-- Notes: σ is reflexive on A. -/
def ReflOn (A : Set X) (σ : X → X → Prop) : Prop := ∀ x, (x ∈ A) → σ x x

theorem reflOn_relStar (ρ : X → X → Prop) : ReflOn (Field ρ) (relStar ρ) := by
  intro _ _
  exists 0

theorem relSub_relStar (ρ : X → X → Prop) : RelSub ρ (relStar ρ) := by
  intro x y hxy
  exists 1, x
  constructor
  · constructor
    · rfl
    · left
      exists y
  · assumption

theorem relStar_trans (ρ : X → X → Prop) : TransRel (relStar ρ) := by
  intro x y z ⟨n, hxy⟩ ⟨m, hyz⟩
  exists (n + m)
  rw[relPow_add ρ n m]
  exists y

theorem relStar_least {ρ σ : X → X → Prop}
    (hρσ : RelSub ρ σ) (hσ : TransRel σ) (hrefl : ReflOn (Field ρ) σ) :
    RelSub (relStar ρ) σ := by
  intro x y ⟨n, hxy⟩
  cases n with
  | zero =>
    obtain ⟨h, hx⟩ := hxy
    rw[h]
    apply hrefl
    rwa[← h]
  | succ k =>
    have := relSub_relPow_succ hρσ hσ k x y hxy
    assumption


/-- Notes, Remark 3: x ρ⁺ y gives u with x ρ* u and u ρ y. -/
theorem relPlus_decomp {ρ : X → X → Prop} {x y : X} (h : relPlus ρ x y) :
    ∃ u, relStar ρ x u ∧ ρ u y := by
  obtain ⟨n, w, hn⟩ := h
  exists w
  constructor
  · exists n; exact hn.1
  · exact hn.2

theorem relPlus_of_relPlus_relStar {ρ : X → X → Prop} {x y z : X}
    (h1 : relPlus ρ x y) (h2 : relStar ρ y z) : relPlus ρ x z := by
  obtain ⟨n, hn⟩ := h1
  obtain ⟨m, hm⟩ := h2
  have h := relPow_add ρ (n + 1) m
  exists (n + m)
  have : n + m + 1 = n + 1 + m := by omega
  rw[this, h]
  exists y

theorem relStar_relProd (ρ : X → X → Prop) :
    relProd (relStar ρ) ρ = relPlus ρ := by
  ext x y
  constructor
  · intro ⟨z, ⟨k, _⟩, _⟩
    exists k, z
  · intro ⟨k, ⟨z, _, _⟩⟩
    exists z
    constructor
    · exists k
    · assumption


theorem relPow_one (ρ : X → X → Prop) : relPow ρ 1 = ρ := by
  ext x y
  constructor
  · intro ⟨z, ⟨h, _⟩, _⟩
    rwa[h]
  · intro h
    exists x
    constructor
    · constructor
      · rfl
      · left; exists y
    · assumption

theorem relProd_relStar (ρ : X → X → Prop) :
    relProd ρ (relStar ρ) = relPlus ρ := by
  ext x y
  constructor
  · intro ⟨z, hz1, k, hk⟩
    have : relPow ρ (k + 1) x y := by
      rw[Nat.add_comm, relPow_add ρ 1 k]
      exists z
      constructor
      · rwa[relPow_one ρ]
      · assumption
    exists k
  · intro ⟨k, z, hkxz, hzy⟩
    have : relPow ρ (k + 1) x y := by
      exists z
    rw[Nat.add_comm, relPow_add ρ 1 k] at this
    obtain ⟨w, ⟨v, ⟨h, hv⟩, hv2⟩, hkwy⟩ := this
    exists w
    constructor
    · rwa[h]
    · exists k

theorem relStar_relProd_eq_relProd_relStar (ρ : X → X → Prop) :
    relProd (relStar ρ) ρ = relProd ρ (relStar ρ) := by
  rw [relStar_relProd, relProd_relStar]


theorem relPlus_remark3 {ρ : X → X → Prop} {x y : X} (h : relPlus ρ x y) :
    (∃ u, relStar ρ x u ∧ ρ u y) ∧ (∃ v, ρ x v ∧ relStar ρ v y) := by
  constructor
  · rw[← relStar_relProd ρ] at h
    obtain ⟨u, hu⟩ := h
    exists u
  · rw[← relProd_relStar ρ] at h
    obtain ⟨v, hv⟩ := h
    exists v

theorem relPlus_remark3' {ρ : X → X → Prop} {x y : X} (h : relPlus ρ x y) :
    (∃ u, u ∈ RelDomain ρ ∧ relStar ρ x u ∧ ρ u y) ∧
    (∃ v, v ∈ RelRange ρ ∧ ρ x v ∧ relStar ρ v y) := by
  constructor
  · rw[← relStar_relProd ρ] at h
    obtain ⟨u, hu⟩ := h
    exists u
    constructor
    · exists y; exact hu.2
    · assumption
  · rw[← relProd_relStar ρ] at h
    obtain ⟨v, hv⟩ := h
    exists v
    constructor
    · exists x; exact hv.1
    · assumption

inductive Exp where
  | nat (n : Nat)
  | plus
  | star

def relExp (ρ : X → X → Prop) : Exp → X → X → Prop
  | .nat n => relPow ρ n
  | .plus => relPlus ρ
  | .star => relStar ρ

theorem relPlus_imp_relStar {ρ : X → X → Prop} {x y : X}
    (h : relPlus ρ x y) : relStar ρ x y := by
  obtain ⟨k, hk⟩ := h
  exists (k + 1)

theorem remark2_i (ρ : X → X → Prop) (α : Exp) (x y : X) :
    relExp ρ α x y → relStar ρ x y := by
  cases α with
  | nat n =>
    intro _
    exists n
  | plus =>
    intro h
    exact relPlus_imp_relStar h
  | star => intro _; assumption

theorem remark2_ii (ρ : X → X → Prop) (α β : Exp) (x y z : X) :
    relExp ρ α x y → relExp ρ β y z → relStar ρ x z := by
  intro hα hβ
  have hα := remark2_i ρ α x y hα
  have hβ  := remark2_i ρ β y z hβ
  exact relStar_trans ρ x y z hα hβ

/-- α is in ℕ⁺ ∪ {+}. -/
def Exp.IsPos : Exp → Prop
  | .nat n => 0 < n
  | .plus => True
  | .star => False

theorem relExp_pos {ρ : X → X → Prop} {α : Exp} (hα : α.IsPos) {x y : X}
    (h : relExp ρ α x y) : ∃ m, relPow ρ (m + 1) x y := by
  cases α with
  | nat n =>
    cases n with
    | zero => contradiction
    | succ k =>
      exists k
  | plus =>
    obtain ⟨k, hk⟩ := h
    exists k
  | star => contradiction

theorem remark2_iii (ρ : X → X → Prop) (α β : Exp)
    (hab : α.IsPos ∨ β.IsPos) (x y z : X) :
    relExp ρ α x y → relExp ρ β y z → relPlus ρ x z := by
  intro hα hβ
  rcases hab with hpα | hpβ
  · have ⟨m, hm⟩:= relExp_pos hpα hα
    have ⟨k, hk⟩:= remark2_i ρ β y z hβ
    exists (m + k)
    have hidx : m + k + 1 = (m + 1) + k := by omega
    rw [hidx, relPow_add]
    exists y
  · have ⟨m, hm⟩:= relExp_pos hpβ hβ
    have ⟨k, hk⟩:= remark2_i ρ α x y hα
    exists (k + m)
    rw[Nat.add_assoc, relPow_add]
    exists y

theorem relPow_mem_field {ρ : X → X → Prop} {n : Nat} {x y : X}
    (h : relPow ρ n x y) : x ∈ Field ρ ∧ y ∈ Field ρ := by
  revert x y
  induction n with
  | zero =>
    intro x y h
    obtain ⟨h, hh⟩ := h
    constructor
    · assumption
    · rw[← h]
      assumption
  | succ k hk =>
    intro x y ⟨z, hkxz, _⟩
    constructor
    · have ⟨_, _⟩:= hk hkxz
      assumption
    · right; exists z

theorem relPow_succ_mem {ρ : X → X → Prop} {n : Nat} {x y : X}
    (h : relPow ρ (n + 1) x y) : x ∈ RelDomain ρ ∧ y ∈ RelRange ρ := by
  constructor
  · rw[Nat.add_comm, relPow_add] at h
    obtain ⟨z, hxz, _⟩ := h
    rw[relPow_one] at hxz
    exists z
  · obtain ⟨z, _, _⟩ := h
    exists z

theorem domain_relPlus (ρ : X → X → Prop) : RelDomain (relPlus ρ) = RelDomain ρ := by
  apply ext
  intro x
  constructor
  · intro ⟨y, k, hk⟩
    exact (relPow_succ_mem hk).1
  · intro ⟨y, hxy⟩
    exists y, 0
    rwa[relPow_one]

theorem range_relPlus (ρ : X → X → Prop) : RelRange (relPlus ρ) = RelRange ρ := by
  apply ext
  intro y
  constructor
  · intro ⟨x, k, hk⟩
    exact (relPow_succ_mem hk).2
  · intro ⟨x, hxy⟩
    exists x, 0
    rwa[relPow_one]

theorem domain_relStar (ρ : X → X → Prop) : RelDomain (relStar ρ) = Field ρ := by
  apply ext
  intro x
  constructor
  · intro ⟨y, k, hk⟩
    exact (relPow_mem_field hk).1
  · intro h
    exists x, 0

theorem range_relStar (ρ : X → X → Prop) : RelRange (relStar ρ) = Field ρ := by
  apply ext
  intro y
  constructor
  · intro ⟨x, k, hk⟩
    exact (relPow_mem_field hk).2
  · intro h
    exists y, 0

theorem mem_field_iff (ρ : X → X → Prop) (x : X) :
    x ∈ Field ρ ↔ x ∈ RelDomain ρ ∨ x ∈ RelRange ρ := Iff.rfl

theorem field_relPlus (ρ : X → X → Prop) : Field (relPlus ρ) = Field ρ := by
  apply ext
  intro x
  rw[mem_field_iff (relPlus ρ), mem_field_iff ρ, domain_relPlus, range_relPlus]

theorem field_relStar (ρ : X → X → Prop) : Field (relStar ρ) = Field ρ := by
  apply ext
  intro x
  rw[mem_field_iff (relStar ρ), domain_relStar, range_relStar, or_self]

end LogicInduction
