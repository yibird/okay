# AGENTS.md

## Project Overview

This project is a TypeScript-based single-package utility library.

The package exposes multiple public entry points:

- `@zhouchengfeng/okay` - framework-agnostic utility functions
- `@zhouchengfeng/okay/vue` - Vue-specific utilities and composables
- `@zhouchengfeng/okay/react` - React-specific utilities and hooks

Framework-agnostic modules under `src` must not depend on Vue, React, browser-specific APIs, or framework-specific implementations unless explicitly required. Framework-specific code belongs under `src/vue` or `src/react`.

The primary goal of this project is to provide:

- Excellent developer experience
- Strong type inference
- High runtime performance
- Small bundle size
- Long-term maintainability

---

## Technology Stack

### Language

- TypeScript

Always maximize type safety and type inference.

Avoid unnecessary type assertions (`as`).

Avoid `any`.

Prefer:

```ts
unknown
generic constraints
conditional types
mapped types
infer
```

when appropriate.

---

### Build System

- tsdown

Optimize for:

- bundle size
- tree shaking
- build performance

Avoid introducing dependencies unless they provide clear value.

Always consider the impact on bundle size.

---

### Testing

#### Unit Tests

- Vitest

Every public utility function should have tests.

Test:

- happy paths
- edge cases
- invalid inputs
- type-level behavior when applicable

---

#### Benchmarks

- Mitata

Performance-sensitive utilities should include benchmarks.

Examples:

- deepClone
- merge
- debounce
- throttle
- memoize
- equality checks
- collection operations

Benchmark before and after significant optimizations.

Never assume performance improvements without measurement.

---

# Design Principles

## Design Before Implementation

Always design before coding.

For new features or utilities:

1. Clarify the use case
2. Define API design
3. Evaluate naming
4. Consider extensibility
5. Consider performance
6. Implement
7. Test
8. Benchmark if necessary

Do not jump directly into implementation.

---

## Maintainability First

Performance is important.

Maintainability is equally important.

Avoid micro-optimizations that significantly reduce readability or extensibility unless benchmark results justify them.

Prefer solutions that balance:

- readability
- maintainability
- performance

---

## Framework Independence

When implementing functionality:

Prefer placing framework-agnostic logic in common `src` modules.

Only place code in `src/vue` or `src/react` when framework integration is required.

Avoid duplicating business logic across framework entry points.

Shared logic should live in framework-agnostic modules.

---

## Functional Programming

Prefer functional programming styles.

Favor:

- pure functions
- immutable data
- composition
- stateless implementations

Avoid:

- hidden side effects
- global mutable state
- unnecessary classes

Use classes only when they provide clear architectural value.

---

## API Design

APIs should be:

- predictable
- composable
- type-safe
- easy to discover

Favor small focused utilities over large multi-purpose functions.

Avoid excessive configuration objects unless necessary.

Prefer:

```ts
pick(obj, keys)
```

over:

```ts
pick({
  object: obj,
  keys,
})
```

when readability is not harmed.

---

## Naming Conventions

Naming should follow mainstream utility libraries.

Reference:

- lodash
- remeda
- radash
- es-toolkit

Names should be:

- semantic
- concise
- predictable

Avoid:

```ts
getObjectPropertiesAndValues()
```

Prefer:

```ts
entries()
```

Avoid abbreviations that reduce readability.

Avoid names that are overly verbose.

---

## TypeScript Guidelines

Maximize type inference.

Users should rarely need to specify generic parameters manually.

Prefer:

```ts
const result = groupBy(items, (item) => item.type)
```

over APIs that require explicit generic arguments.

Preserve literal types whenever possible.

Avoid type designs that significantly slow TypeScript compilation unless necessary.

---

## Performance Guidelines

Performance-sensitive code should:

- minimize allocations
- avoid unnecessary object creation
- avoid unnecessary array copies
- avoid repeated computations

Consider:

- time complexity
- memory usage
- garbage collection pressure

Do not sacrifice maintainability for insignificant gains.

Benchmark before introducing complex optimizations.

---

## Tree Shaking

All utilities should be tree-shakable.

Avoid patterns that negatively impact tree shaking.

Prefer:

```ts
export function debounce() {}
export function throttle() {}
```

Avoid monolithic exports that force users to import unnecessary code.

---

## Dependencies

Prefer native implementations.

Before adding a dependency:

1. Evaluate bundle size impact
2. Evaluate maintenance cost
3. Evaluate long-term stability

Avoid dependencies for trivial functionality.

---

## Documentation

Public APIs should include:

- purpose
- parameters
- return value
- examples when necessary

Documentation should explain intent, not repeat code.

---

## Pull Request Checklist

Before completing any task:

- API design reviewed
- Naming reviewed
- Types reviewed
- Tests added
- Benchmarks added if applicable
- Tree shaking preserved
- Bundle size impact considered
- Framework independence considered
- Documentation updated
- Edge cases covered

---

## Decision Priority

When trade-offs are required, follow this order:

1. Correctness
2. Type Safety
3. Maintainability
4. Developer Experience
5. Performance
6. Bundle Size

Never sacrifice correctness for performance.
