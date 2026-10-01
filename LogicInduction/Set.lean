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

def univ : Set α := fun _ => True

theorem mem_univ (a : α) : a ∈ (univ : Set α) := trivial

theorem ext {s t : Set α} (h : ∀ a, a ∈ s ↔ a ∈ t) : s = t :=
  funext fun a => propext (h a)

theorem mem_inter_iff {s t : Set α} {a : α} : a ∈ s ∩ t ↔ a ∈ s ∧ a ∈ t :=
  Iff.rfl

/-- `predR R x` is the set of `R`-predecessors of `x`, written `ρ[x]` in the sheet. -/
def predR {X : Type} (R : X → X → Prop) (x : X) : Set X := fun y => R y x

theorem mem_predR {X : Type} {R : X → X → Prop} {x y : X} :
    y ∈ predR R x ↔ R y x := Iff.rfl

end Set
end LogicInduction
