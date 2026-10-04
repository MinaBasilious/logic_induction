# logic_induction

A Lean 4 formalization of the exercises in "Induction: Well-founded relations and generalized induction", lecture notes by Prof. Mohamed Amer for a logic course at Cairo University.

The project has no dependencies, not even Mathlib. It defines its own `Set` and the few operations it needs, so that the statements stay close to the notes.

## Contents

- `LogicInduction/Set.lean`: sets as predicates, membership, subset, intersection, difference, `univ`, `range`, and `predR`, which is the notes' `ρ[x]`.
- `LogicInduction/indN.lean`: Section 1. Peano-like structures and the equivalence of the two induction principles on `N`.
- `LogicInduction/WellFounded.lean`: Section 2. Well-founded relations, the principle of ρ,A-induction, and the equivalence theorem.
- `docs/Logic_Induction.pdf`: my written proof of Section 1, which the Lean code follows.

Each theorem carries a comment with its number in the notes where it has one.

## Progress

- [x] Peano-like structures and Theorem 1.5 (the two forms of induction on `N` are equivalent)
- [x] Well-founded relations and the principle of ρ,A-induction
- [x] Equivalence of well-foundedness, ρ,A-induction, and no infinite descending sequence
- [x] ρ is well founded iff it is well founded on Rρ
- [x] ρ,A-induction holds for every A iff it holds for Rρ
- [ ] The successor relation on `N` is well founded
- [ ] If σ ⊆ ρ and ρ is well founded, then σ is well founded
- [ ] Relative product, powers, and transitive closure
- [ ] ρ is well founded iff ρ⁺ is
- [ ] Well-orderings

## Building

Install Lean through [elan](https://github.com/leanprover/elan). The toolchain version is pinned in `lean-toolchain`.

```
lake build
```

No network access is needed after elan has fetched the toolchain.

## Source

The statements follow the notes by Prof. Mohamed Amer, which are not included in this repository. The proofs and any mistakes in them are mine.

## License

MIT. See [MIT License](./LICENSE).