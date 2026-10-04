namespace LogicInduction

def Set (α : Type) : Type := α → Prop

namespace Set

variable {α : Type}

/-- `mem a s` says `a` belongs to `s`. -/
def mem (a : α) (s : Set α) : Prop := s a

scoped infix:50 " ∈ " => mem

instance : HasSubset (Set α) := ⟨fun s t => ∀ a, a ∈ s → a ∈ t⟩
instance : EmptyCollection (Set α) := ⟨fun _ => False⟩
instance : Inter (Set α) := ⟨fun s t a => a ∈ s ∧ a ∈ t⟩
instance : SDiff (Set α) := ⟨fun s t a => a ∈ s ∧ ¬ a ∈ t⟩

def range (f : Nat → α) : Set α := fun a => ∃ n, f n = a

def univ : Set α := fun _ => True

@[simp]theorem mem_univ (a : α) : a ∈ (univ : Set α) := trivial

theorem ext {s t : Set α} (h : ∀ a, a ∈ s ↔ a ∈ t) : s = t :=
  funext fun a => propext (h a)

@[simp]theorem mem_inter_iff {s t : Set α} {a : α} : a ∈ s ∩ t ↔ a ∈ s ∧ a ∈ t :=
  Iff.rfl

/-- `predR R x` is the set of `R`-predecessors of `x`, written `ρ[x]` in the sheet. -/
def predR {X : Type} (R : X → X → Prop) (x : X) : Set X := fun y => R y x

@[simp]theorem mem_predR {X : Type} {R : X → X → Prop} {x y : X} :
    y ∈ predR R x ↔ R y x := Iff.rfl

@[simp]theorem mem_sdiff_iff {s t : Set α} {a : α} : a ∈ s \ t ↔ a ∈ s ∧ ¬ a ∈ t := Iff.rfl

theorem subset_antisymm {s t : Set α} (h1 : s ⊆ t) (h2 : t ⊆ s) : s = t :=
  ext fun a => ⟨fun ha => h1 a ha, fun ha => h2 a ha⟩

@[simp]theorem nothing_empty {x : α} : ¬ x ∈ (∅ : Set α) := fun h => h

@[simp]theorem empty_subset {s : Set α} : ∅ ⊆ s := fun _ h => h.elim

@[simp]theorem empty_inter {s : Set α} : ∅ ∩ s = ∅ := ext fun _ => ⟨fun ha => ha.1, fun ha => (nothing_empty ha).elim⟩

@[simp]theorem exists_mem_of_ne_empty {s : Set α} : (s ≠ ∅) → ∃ x, x ∈ s := fun h => (Classical.byContradiction (fun nh => h (ext (fun a => ⟨fun hh => (nh (Exists.intro a hh)).elim, fun hh => (nothing_empty hh).elim⟩))))

@[simp]theorem sdiff_subset {s r : Set α} : s \ r ⊆ s := fun _ h => h.1

end Set
end LogicInduction
