# Лабораторная работа №7 — The Superhero Box (PERN)

Проект продолжает сайт предыдущих лабораторных. Стек: **PostgreSQL + Sequelize 6 + Express 4 + React 19 + Axios + Node.js**. Предметная область: школьные обеды; три связанных сущности — пользователи, товары, заказы (один заказ = один вид товара, несколько единиц). Индивидуальный вариант пока не учитывается.

## Архитектура и путь данных

```
React (Vite :5173) → Axios /api → прокси Vite → Express (:5000)
                                              ↓
                                         Controller
                                              ↓
                                         Sequelize ORM
                                              ↓
                                        PostgreSQL :5432
```

Клиент общается с Express посредством Axios; `useState` и `useEffect` управляют локальным состоянием и загрузкой данных без Redux. Источник истины — PostgreSQL. Все страницы `/catalog`, `/products`, `/users`, `/orders` работают с одной базой. Избранное и корзина временно хранят свои значения в состоянии React, а товарные карточки берутся из PostgreSQL. Маршрут `/server` перенаправлен на интерфейс пользователей PostgreSQL для совместимости со ссылками ЛР6.

## Структура

- `server/index.js` — Express, CORS, проверка PostgreSQL, `sequelize.sync()` и запуск
- `server/db.js` — подключение к БД через переменные окружения
- `server/models/models.js` — Sequelize `User`, `Product`, `Order`, связи и валидаторы
- `server/controllers/userController.js` — контроллер пользователей (CRUD)
- `server/controllers/productController.js` — контроллер товаров (CRUD)
- `server/controllers/orderController.js` — контроллер заказов (CRUD и контроль связей)
- `server/controllers/common.js` — общие функции проверки параметров, пагинации, поиска и сортировки
- `server/routes/userRouter.js`, `productRouter.js`, `orderRouter.js` — три отдельных роутера
- `server/routes/index.js` — объединение трёх роутеров
- `server/middleware/ErrorHandlingMiddleware.js` — ошибки 400/404/409/500
- `server/seed.js` — первоначальное заполнение **55** записями, не удаляет существующие
- `src/http/index.js`, `src/http/entityAPI.js` — Axios
- `src/App.jsx` — `useState`/`useEffect` и Axios для каталога
- `src/pages/DatabasePage.jsx` — `useState` и Axios для управления таблицами (без Redux)
- `src/pages/DatabasePage.jsx` — форма, таблица, фильтры, сортировка, пагинация, подробности с фото
- `postman/Lab7_Pern.postman_collection.json` — набор тестов Postman

## Подготовка PostgreSQL

1. Проверьте, что служба PostgreSQL запущена (обычно порт `5432`).
2. В pgAdmin создайте **пустую** базу данных `superhero_box_lab7` (не таблицы).
3. **ВНИМАНИЕ:** если вы уже вручную создали таблицы в этой базе, то обычный `sequelize.sync()` не изменит их. Типы и ограничения должны полностью совпадать с моделями. Безопасный вариант — создать **другую пустую БД** `superhero_box_lab7_pern` и прописать её в `.env`. Не запускайте `sync({force:true})` или `sync({alter:true})` на базе, где есть важные данные.
4. В папке `server` скопируйте `.env.example` в `.env`, затем заполните `DB_PASSWORD` и, при необходимости, `DB_NAME`, `DB_USER`, `DB_HOST`, `DB_PORT`.
5. Файлы `.env` и `node_modules` не следует помещать в GitHub.

### Запуск (три звена)

В терминале 1, из `lab-7/server`:

```bash
npm install
npm run dev
```

В терминале 2, из `lab-7`:

```bash
npm install
npm run dev
```

Откройте `http://localhost:5173`. Проверка API: `http://localhost:5000/api/health`. Для первого заполнения (в другом терминале, из `server`) выполните:

```bash
npm run seed
```

**Seed создаёт 15 пользователей, 15 товаров, 25 заказов = 55 записей**, если все три таблицы пустые. Если хотя бы одна уже содержит данные, заполнение пропускается без изменения существующих записей. Повторный seed не создаёт дубликатов. Число записей можно проверить через страницы приложения или запросы GET `/api/users`, `/api/products`, `/api/orders`.

## Структура БД

- `users`: `id BIGINT`, `full_name VARCHAR(120)`, `email VARCHAR(255) UNIQUE`, `phone`, `role ENUM`, `avatar_url`, `created_at`.
- `products`: `id BIGINT`, `name VARCHAR(160)`, `description`, `category ENUM`, `price DOUBLE PRECISION`, `is_available`, `image_url`, `created_at`.
- `orders`: `id BIGINT`, `user_id BIGINT FK`, `product_id BIGINT FK`, `quantity INTEGER`, `unit_price DOUBLE PRECISION`, `status ENUM`, `delivery_date DATE`, `delivery_address`, `note`, `created_at`.

`User.hasMany(Order)` / `Order.belongsTo(User)` и `Product.hasMany(Order)` / `Order.belongsTo(Product)`. Удаление связанного пользователя или товара блокируется ответом 409. Для цен использован `DOUBLE` согласно выбранной учебной модели; для финансовой системы предпочтительнее `DECIMAL(10,2)`.

## REST API для всех сущностей

`type` = `users` / `products` / `orders`.

| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/health` | Проверка БД |
| GET | `/api/:type` | Список с пагинацией, поиском, фильтрацией, сортировкой |
| GET | `/api/:type/:id` | Детали по ID (для заказов с User и Product) |
| GET | `/api/:type/:id/exists` | Проверка существования |
| POST | `/api/:type` | Создать запись (201) |
| PUT | `/api/:type/:id` | Обновить запись |
| DELETE | `/api/:type/:id` | Удалить запись (или 409 при наличии зависимых заказов) |

### Параметры GET `/api/:type`

- `page=1`, `limit=10` (не более 100); результат `{ items, total, page, limit, pages }`.
- `sortBy=id`, `sortDir=asc|desc`, разрешённые поля перечислены в `controllers/userController.js`, `productController.js`, `orderController.js`.
- `search=...` — регистронезависимый поиск по нескольким строковым полям с помощью Sequelize `Op.iLike`.
- `searchFields=full_name,email` — выбор нескольких разрешённых полей поиска; если не указано, поиск идёт по всем разрешённым полям.
- фильтры можно комбинировать: для пользователей `role`; для товаров `category`, `is_available`; для заказов `status`, `user_id`, `product_id`.

Примеры:

```text
GET /api/users?page=1&limit=5&search=student&searchFields=email,full_name&role=customer&sortBy=full_name&sortDir=desc
GET /api/products?category=vegetarian&is_available=true&sortBy=price&sortDir=asc
GET /api/orders?status=new&user_id=1&sortBy=delivery_date&sortDir=desc
GET /api/products/1/exists
```

Пример POST пользователя:

```json
{"full_name":"Проверочный пользователь","email":"test-new@example.com","phone":"+375291234567","role":"customer","avatar_url":"https://i.pravatar.cc/150?img=5"}
```

Пример POST продукта:

```json
{"name":"Суперобед","description":"Полезный обед","category":"lunch_box","price":12.5,"is_available":true,"image_url":"/images/SuperheroLunch.png"}
```

Пример POST заказа (id пользователя и товара должны существовать):

```json
{"user_id":1,"product_id":1,"quantity":2,"unit_price":12.5,"status":"new","delivery_date":"2026-12-15","delivery_address":"Минск, ул. Учебная, 1","note":"Без орехов"}
```

Все POST/PUT проходят валидацию Sequelize. Состояния формы проверяются также на клиенте. При ошибке сервер возвращает `{ "message": "..." }` и статус 400, 404, 409 или 500. Удаление срабатывает только после `window.confirm()`.

## Тестовые сценарии Postman

Импортируйте `postman/Lab7_Pern.postman_collection.json`, установите `baseUrl=http://localhost:5000`. В коллекции предусмотрены:

1. Health (200).
2. Списки каждой сущности с пагинацией, сортировкой, поиском и несколькими фильтрами (200).
3. Получение деталей и exists (200), отсутствие ID (404).
4. Создание пользователя, проверка уникальности email (201, 409).
5. Изменение и удаление созданного тестового пользователя (200).
6. Создание товара, изменение и удаление товара (201/200).
7. Создание заказа и блокировка удаления используемого пользователя/товара (201/409).
8. Удаление заказа, затем удаление пользователя и товара (200).
9. Некорректные параметры (`page=abc`, `sortBy=unknown`) → 400.
10. Неполные поля / отрицательная цена / несуществующий FK → 400.

В коллекции id новых записей сохраняются в переменные и используются в последующих запросах. Запускайте тесты в указанном порядке; позитивные сценарии требуют работающего сервера и подготовленной БД.

## Фото и сведения

`avatar_url` пользователей и `image_url` товаров принимают веб-адрес или локальный путь. В деталях записи отображается изображение; в деталях заказа — информация и изображение связанного товара. Демонстрационные изображения с внешних сервисов требуют доступа к интернету; при необходимости замените на собственные адреса.

## GitHub / резервная копия

Создайте отдельный репозиторий ЛР7. Достаточно разместить в репозитории `server/seed.js` — по условиям задания это допустимая альтернатива резервной копии. Пароль из `.env` в GitHub не публикуйте. Для реального бэкапа можно воспользоваться `pg_dump`.

## Проверки и ограничения

Исходный синтаксис серверных JS-файлов проверен `node --check`, JSON-пакеты/коллекция проверены. В текущей среде нет доступных установленных npm-зависимостей и PostgreSQL-сервера; поэтому фактический запуск PERN и тесты Postman здесь не выполнены. Выполните `npm install` и тестирование на своём компьютере и сообщите ошибки, если появятся.


## Каталог из PostgreSQL и локальные изображения

Страница `/catalog`, карточки главной страницы, избранное и корзина используют **один каталог товаров из PostgreSQL**. `App.jsx` запрашивает REST API `/api/products` через Axios (до 100 товаров за запрос). `App.jsx` сохраняет в избранном/корзине идентификаторы записей базы. Обновление каталога после добавления, редактирования или удаления происходит через API; локальный файл `public/data/products.json` больше не является источником каталога.

В `products.image_url` можно указать локальный путь `/images/Lunch2.png`, `/images/SuperheroLunch.png` и др.; сам файл положить в `public/images`. В проект добавлена новая тематическая фотография `/images/SuperheroLunch.png`. В форме добавления товара в каталоге и форме на `/products` доступны такие пути. Для существующей базы с внешними фото Picsum **однократно** выполните в папке `server`: `npm run images:local`. Команда обновит только адреса с `https://picsum.photos/`, остальные записи сохранит. Для новой пустой базы достаточно `npm run seed`: все новые товары получат локальные пути.

**Проверка**: измените название или `image_url` на странице `/products`, вернитесь в `/catalog`: карточка покажет новые данные. Удаление товара, связанного с заказом, сервер правильно запретит (HTTP 409). Изображения доступны через Vite на `http://localhost:5173/images/SuperheroLunch.png`. Без запущенного Express/PostgreSQL каталог показывает ошибку, а не старые JSON-данные.
