# UI Rules

## Components

- Компоненты должны быть простыми
- Один компонент = одна ответственность
- Не смешивать layout и business logic

---

## Sections

- Секции — это крупные блоки страницы
- Секции не принимают визуальные пропсы

### Example

// ❌ bad
<Hero title="Hello" />

// ✅ good
<Hero />

---

## Props

- Не передавать статические данные через props
- Props только если данные динамические

### Example

// ❌ bad
<Card title="Product" />

// ✅ good
<Card />

---

## Styling

- Использовать только Tailwind
- Не использовать inline styles

---

## Layout

- Не использовать margin для layout
- Использовать flex / grid + gap

### Example

// ❌ bad
<div className="mb-8">

// ✅ good
<div className="flex flex-col gap-8">