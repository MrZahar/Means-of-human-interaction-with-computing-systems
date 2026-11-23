# 15 фотографий для товаров The Superhero Box

В каталоге используется `products.image_url` из PostgreSQL, например `/images/Lunch2.png`.
Файлы находятся в `public/images/` (корень React-проекта).

## Соответствие товаров и файлов

| Товар | image_url | Источник |
|---|---|---|
| Superhero Chicken Box | `/images/SuperheroChickenBox.png` | Сгенерировано |
| Vegetable Rainbow Box | `/images/VegetableRainbowBox.png` | Сгенерировано |
| Healthy Pasta Lunch | `/images/pasta.png` | Существовало в проекте |
| Turkey Sandwich Set | `/images/sandwich.png` | Существовало в проекте |
| Fresh Fruit Combo | `/images/fruit-lunch.png` | Существовало в проекте |
| Veggie Power Plate | `/images/vegetarian-lunch.png` | Существовало в проекте |
| Five Lunches Plan | `/images/FiveLunchesPlan.png` | Сгенерировано |
| Three Lunches Plan | `/images/ThreeLunchesPlan.png` | Сгенерировано |
| Rice and Chicken | `/images/RiceAndChicken.png` | Сгенерировано |
| Vegetarian Pasta | `/images/VegetarianPasta.png` | Сгенерировано |
| School Lunch Classic | `/images/lunch.png` | Существовало в проекте |
| Energy Lunch Box | `/images/SuperheroLunch.png` | Существовало в проекте |
| Garden Salad Set | `/images/GardenSaladSet.png` | Сгенерировано |
| Cheese and Veggie Box | `/images/CheeseVeggieBox.png` | Сгенерировано |
| Camp Lunch Special | `/images/Lunch2.png` | Существовало в проекте |

Если база пустая: `cd server`, `npm run seed` (создаст тестовые данные).
Если база уже заполнена тестовыми товарами: `cd server`, `npm run images:local` (обновит `image_url` товаров с перечисленными названиями; остальные данные сохранятся).
Проверить картинки можно по адресу `http://localhost:5173/images/SuperheroChickenBox.png` после запуска React.

Примечание: наборы на 3/5 дней показаны как подборка порционных обедов на одной фотографии.
