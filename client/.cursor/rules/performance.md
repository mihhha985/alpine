
## Golden Rule

Если агент сомневается:
- выбрать самое простое решение
- не добавлять новые абстракции
- не усложнять код

## Rendering

- Не создавать лишние re-renders
- Не использовать useEffect без причины

---

## Images

- Использовать next/image

### Example

// ❌ bad
<img src="/img.png" />

// ✅ good
<Image src="/img.png" />