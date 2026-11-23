# Каталог The Superhero Box из PostgreSQL

Теперь `/catalog`, товарные карточки главной страницы, `/favorites` и `/cart` работают с одним массивом из PostgreSQL через `GET /api/products` (Axios и `useState`/`useEffect` в `App.jsx`). Ранее данные читались из `public/data/products.json`.

## Изображения

Указывайте в поле `products.image_url` путь **от корня сайта** (без `public`):

- `/images/SuperheroLunch.png` — новая сгенерированная тематическая фотография (включена в архив);
- `/images/Lunch2.png`;
- `/images/vegetarian-lunch.png`;
- `/images/fruit-lunch.png`;
- `/images/sandwich.png`;
- `/images/pasta.png`;
- `/images/lunch.png`.

При необходимости поместите собственный PNG в `public/images`, например `public/images/LunchNew.png`, и укажите в форме `/products` строку `/images/LunchNew.png`.

### Если `npm run seed` уже выполнялась

Сохраните текущие записи. В папке `server` выполните:

```bash
npm run images:local
```

Команда заменяет **только** старые ссылки `https://picsum.photos/...`; все другие URL и остальные поля товаров остаются нетронутыми. Новые `npm run seed` сразу создают локальные пути.

### Проверка

1. Запустите PostgreSQL, сервер Express и Vite.
2. В браузере проверьте `http://localhost:5173/images/SuperheroLunch.png`.
3. На странице `/products` измените название, цену или `image_url` товара и сохраните.
4. Перейдите на `/catalog` — карточка загрузит новые данные из PostgreSQL. Это же действует для подборки товаров на главной, избранного и корзины.
5. Если сервер не работает, каталог показывает ошибку, **не переключаясь обратно на локальный JSON**.
6. При попытке удалить товар, связанный с заказом, сервер вернёт конфликт (409); карточка покажет текст ошибки.

**Внимание:** существующие избранное и корзина пока находятся в состоянии React, а не в PostgreSQL. Это не мешает получать сведения о товарах из БД.
