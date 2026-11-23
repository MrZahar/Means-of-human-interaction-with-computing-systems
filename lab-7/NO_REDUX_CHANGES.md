# ЛР7 — отдельные контроллеры и роутеры, без Redux

## Структура Express

- `server/controllers/userController.js` — `getAll`, `getOne`, `exists`, `create`, `update`, `remove` для User.
- `server/controllers/productController.js` — аналогичные методы для Product.
- `server/controllers/orderController.js` — аналогичные методы для Order с проверкой ссылок на User и Product.
- `server/controllers/common.js` — только общие служебные функции (валидация ID, полей, поиск, фильтры и пагинация).
- `server/routes/userRouter.js`, `productRouter.js`, `orderRouter.js` — отдельные маршруты HTTP GET/POST/PUT/DELETE.
- `server/routes/index.js` — подключение трёх роутеров под `/users`, `/products`, `/orders`; `server/index.js` добавляет `/api`.

## React без Redux

- Из `package.json` удалены `react-redux` и `@reduxjs/toolkit`.
- Папка `src/store` и старые неиспользуемые страницы на Redux удалены.
- В `src/main.jsx` удалён `<Provider store={store}>`.
- В `src/App.jsx` каталог загружается по Axios через `fetchEntities('products')`, данные, загрузка и ошибка хранятся в `useState`; обновление инициирует `refreshCatalog()`.
- В `src/pages/DatabasePage.jsx` данные, форма, ошибки, пагинация, сортировка и фильтрация обрабатываются в `useState`, операции выполняются непосредственно через `fetchEntities`, `fetchEntity`, `saveEntity`, `deleteEntity`.
- `src/http/index.js` и `src/http/entityAPI.js` сохраняют Axios как единый HTTP-клиент.
- API остаётся совместимым с предыдущим архивом и базой PostgreSQL, повторный `seed` не требуется.

## Запуск

1. Проверить `server/.env`: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`.
2. Терминал 1: `cd server`, `npm install`, `npm run dev`.
3. Терминал 2: из корня `lab-7`: `npm install`, `npm run dev`.
4. Проверить `/api/health`, `/catalog`, `/products`, `/users`, `/orders`.
5. При уже заполненной базе **не выполнять** `npm run seed` повторно: существующие записи остаются.

### Проверка на защите

Показать `server/routes/productRouter.js` → `server/controllers/productController.js` → `server/models/models.js`, затем `src/http/entityAPI.js` → `src/pages/DatabasePage.jsx`. Проиллюстрировать обновлением названия товара на `/products` и повторной загрузкой `/catalog`.
