# Data & Props Rules

## Static Data

- Статические данные хранить рядом с компонентом

### Example

// ❌ bad
<Hero title="Best App" />

// ✅ good
const HERO_DATA = {
  title: "Best App"
}

<Hero />

---

## Dynamic Data

- Данные передаются только если:
  - приходят с сервера
  - меняются

### Example

// ✅ good
<ProductGrid products={products} />

---

## Types

- any запрещён
- использовать inferred types

// ❌ bad
const data: any = {}

// ✅ good
const data = { name: "test" }