# Strapi -> Next.js revalidation guide

Этот документ описывает, как подключить инвалидацию кеша Next.js через webhook из Strapi.

## 1) Что уже добавлено в проект

Создан endpoint:

- `app/api/revalidate/route.ts`

Он:

- проверяет секрет (`REVALIDATE_SECRET`);
- принимает payload от Strapi;
- вызывает `revalidateTag(...)` и `revalidatePath(...)`;
- возвращает JSON с перечнем инвалидаций.

## 2) Переменные окружения

Добавьте в `.env.local`:

```bash
REVALIDATE_SECRET=your-long-random-secret
```

Важно:

- значение должно быть одинаковым в Next.js и в настройке webhook в Strapi;
- не публиковать этот секрет в публичных переменных (`NEXT_PUBLIC_*`).

## 3) Настройка webhook в Strapi

В админке Strapi:

1. `Settings` -> `Webhooks` -> `Create new webhook`.
2. URL:
   - локально: `http://localhost:3000/api/revalidate`
   - прод: `https://your-domain.com/api/revalidate`
3. Events (минимально):
   - `entry.create`
   - `entry.update`
   - `entry.delete`
   - `entry.publish` (если используете Draft & Publish)
   - `entry.unpublish` (если используете Draft & Publish)
4. Header:
   - `x-revalidate-secret: your-long-random-secret`

Дополнительно endpoint поддерживает `Authorization: Bearer <secret>` и `?secret=<secret>`,
но рекомендуется использовать `x-revalidate-secret`.

## 4) Как endpoint решает, что обновлять

Текущая логика:

- если модель похожа на category:
  - `revalidateTag("categories")`
  - `revalidateTag("products:list")`
- если модель похожа на product:
  - `revalidateTag("products:list")`
  - если есть `entry.documentId | entry.slug | entry.id`:
    - `revalidateTag("product:<id>")`
    - `revalidatePath("/product/<id>")`
- всегда:
  - `revalidatePath("/")`
  - `revalidatePath("/catalog")`

Если модель не распознана, endpoint делает fallback:

- `revalidateTag("products:list")`
- `revalidatePath("/")`
- `revalidatePath("/catalog")`

## 5) Важный момент про теги

`revalidateTag` эффективно работает только если ваши data-функции действительно кешируются с этими же тегами.

Пример целевых тегов:

- `categories`
- `products:list`
- `product:<documentId>`

## 6) Как связать с вашими data-функциями позже

В проекте сейчас данные берутся через Apollo (`entities/repository/fetchData.tsx`).
Когда будете готовы, оберните ключевые функции через `unstable_cache` с тегами:

- `fetchCategories` -> tag `categories`
- `fetchAllProducts` / `fetchProductsByCategory` -> tag `products:list` (+ optional filter tags)
- `fetchProductBySlug(slug)` -> tag `product:${slug}`

Тогда webhook начнет делать точечную инвалидацию без полного прогрева страниц.

## 7) Проверка вручную (без Strapi)

Проверить endpoint можно через curl:

```bash
curl -X POST "http://localhost:3000/api/revalidate" \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: your-long-random-secret" \
  -d "{\"event\":\"entry.publish\",\"model\":\"api::product.product\",\"entry\":{\"documentId\":\"abc123\"}}"
```

Ожидаемый ответ:

- `ok: true`
- список `revalidatedTags`
- список `revalidatedPaths`

## 8) Рекомендации по запуску в проде

- Держите endpoint под секретом (только secret-based access).
- Ограничьте источник вызовов (если есть возможность на инфраструктуре).
- Логируйте ошибки webhook (401/400/500).
- Проверьте, что Strapi отправляет события именно на публичный URL прода.

## 9) Типичные проблемы

1. `401 Unauthorized`
   - секрет в Strapi не совпадает с `REVALIDATE_SECRET`.

2. `500 Missing REVALIDATE_SECRET`
   - переменная не задана в окружении Next.js.

3. Данные не обновляются после `ok: true`
   - в data-функциях пока нет `unstable_cache` + matching tags;
   - работает только path-based revalidation (`/`, `/catalog`, `/product/...`).

