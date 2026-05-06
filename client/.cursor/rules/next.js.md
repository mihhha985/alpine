# Next.js Rules

## Server Components (Default)

- Все компоненты server по умолчанию

### Example

// ❌ bad
"use client"
export default function Page() {}

// ✅ good
export default async function Page() {}

---

## Client Components

- Использовать только если нужен:
  - useState
  - события
  - browser API

---

## Data Fetching

- Только на сервере

### Example

// ❌ bad
useEffect(() => {
 fetch('/api/data')
}, [])

// ✅ good
const data = await fetchData()

---

## Metadata

- Каждая страница должна иметь metadata

### Example

export const metadata = {
  title: "Page",
  description: "..."
}

---

## Routing

- Использовать App Router
- Группировать маршруты через (group)

---

## Links

// ❌ bad
<a href="/about">

// ✅ good
<Link href="/about">

## Page File Rules

- Файл `page.tsx` должен экспортировать только страницу согласно правилам роутинга Next.js.
- В `page.tsx` запрещено создавать дополнительные компоненты, функции JSX-разметки и локальные UI-блоки.
- Допустим только:
  - default export страницы
  - metadata / generateMetadata
  - server data fetching
  - импорт компонентов
  - композиция страницы из готовых блоков

---

## Component Placement

- Все визуальные компоненты страницы выносить в:
  - `/components`
  - `/components/ui`

- Крупные секции страницы:
  - `/components`

- Базовые UI элементы:
  - `/components/ui`

---

## Example: Catalog Page

// ❌ bad
function Header() {
  return <header>Menu</header>
}

function CatalogGrid() {
  return <section>Products</section>
}

function Footer() {
  return <footer>Footer</footer>
}

export default function Page() {

  return (
    <>
      <Header />
      <CatalogGrid />
      <Footer />
    </>
  )
}

---

## Correct Structure

app/catalog/page.tsx

import SiteHeader from "@/components/siteHeader"
import CatalogSection from "@/components/catalogSection"
import SiteFooter from "@/components/siteFooter"

export default function Page() {
  return (
    <>
      <SiteHeader />
      <CatalogSection />
      <SiteFooter />
    </>
  )
}

---

## File Structure

components/
  siteHeader.tsx
  catalogSection.tsx
  siteFooter.tsx

components/ui/
  button.tsx
  input.tsx
  badge.tsx

---

## Forbidden Inside page.tsx

- Header component
- Footer component
- ProductCard component
- CatalogGrid component
- Inline JSX sections
- Local reusable UI blocks

---

## Golden Rule

`page.tsx` = только сборка страницы из готовых компонентов и получение данных через ServerActions.