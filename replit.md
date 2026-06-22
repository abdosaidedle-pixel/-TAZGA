# TAZGA Jewelry

منصة مجوهرات فاخرة متكاملة لعلامة تازجا — واجهة متجر فاخرة مع لوحة تحكم إدارية كاملة وباكند احترافي.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/tazga-jewelry run dev` — run the storefront (port 26170)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/db/src/schema/` — Drizzle schema files (one per entity)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/tazga-jewelry/src/pages/` — Frontend pages
- `artifacts/tazga-jewelry/src/pages/admin/` — Admin dashboard pages
- `artifacts/tazga-jewelry/src/components/` — Shared UI components
- `lib/api-client-react/src/generated/` — Generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — Generated Zod schemas (do not edit)

## Architecture decisions

- Contract-first: OpenAPI spec drives all codegen (hooks + Zod validation)
- Session-based cart/wishlist using X-Session-Id header (no auth required)
- Admin dashboard at `/admin/*` uses a separate layout with collapsible sidebar
- Bilingual (Arabic/English) — Arabic is primary language, RTL-aware
- Ultra dark luxury theme (#050505 bg) with rose gold / copper / soft gold accents
- All product images stored as URL arrays in PostgreSQL text[] columns

## Product

TAZGA Jewelry — منصة e-commerce للمجوهرات الفاخرة المصنوعة يدوياً بالمصر:

**واجهة المتجر:**
- صفحة رئيسية سينمائية مع قسم hero فاخر
- تصفح المنتجات مع فلاتر (الفئة، المجموعة، السعر، الخامة)
- صفحة تفاصيل المنتج مع معرض الصور والتقييمات
- صفحات المجموعات والتراث
- عربة التسوق والمفضلة والدفع

**لوحة التحكم الإدارية (/admin):**
- إحصائيات لوحة القيادة (مبيعات، طلبات، عملاء، منتجات)
- إدارة المنتجات (إضافة / تعديل / حذف)
- إدارة الطلبات مع تحديث الحالة
- إدارة المجموعات، الفئات، التقييمات، البنرات، النشرة البريدية

## User preferences

- اللغة العربية هي اللغة الأساسية للواجهة
- تصميم مظلم فاخر دائماً (لا يوجد وضع فاتح)
- الألوان: Rose Gold #C48A6A, Copper #B87333, Soft Gold #D4AF37

## Gotchas

- Cart and wishlist use `X-Session-Id` header for session tracking (no auth required)
- Run codegen after every OpenAPI spec change before using types
- `pnpm --filter @workspace/db run push` after any schema change
- Admin routes are placeholder-ready — add new admin pages in `artifacts/tazga-jewelry/src/pages/admin/`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
