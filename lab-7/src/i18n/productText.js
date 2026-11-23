import i18n from './index';

const productTranslations = {
    "1": {
        "original": "Super Healthy School Lunches",
        "name": "Полезные школьные обеды",
        "description": "Пять свежеприготовленных обедов на всю учебную неделю: горячее блюдо и три полезных перекуса.",
        "ingredients": "Меню недели, овощи, фрукты и полезные перекусы."
    },
    "2": {
        "original": "Half Week Lunches",
        "name": "Обеды на половину недели",
        "description": "Три школьных обеда с доставкой в выбранные дни.",
        "ingredients": "Горячее основное блюдо, сезонные овощи и три перекуса."
    },
    "3": {
        "original": "Vegetarian Lunch",
        "name": "Вегетарианский обед",
        "description": "Сбалансированный школьный обед без мяса.",
        "ingredients": "Овощи, крупы и растительные белки."
    },
    "4": {
        "original": "Fresh Fruit Lunch",
        "name": "Обед со свежими фруктами",
        "description": "Яркий обед с сезонными фруктами.",
        "ingredients": "Свежие фрукты, овощи и полезное основное блюдо."
    },
    "5": {
        "original": "Sandwich Lunch",
        "name": "Обед с сэндвичем",
        "description": "Готовый ланч-бокс для насыщенных школьных дней.",
        "ingredients": "Сэндвич, фрукты, овощи и перекусы."
    },
    "6": {
        "original": "Pasta Lunch",
        "name": "Обед с пастой",
        "description": "Тёплая паста с питательным гарниром.",
        "ingredients": "Паста, овощи и фрукты."
    }
};
const categoryKeys = { 'Weekly plans': 'weeklyPlans', 'Vegetarian': 'vegetarian', 'Lunch boxes': 'lunchBoxes', 'lunch_box': 'lunchBoxes', 'weekly_plan': 'weeklyPlans', 'vegetarian': 'vegetarian' };
export function localizeCategory(category, t) {
    return categoryKeys[category] ? t(categoryKeys[category]) : category;
}
export function localizeProduct(product, language = i18n.language) {
    const record = productTranslations[String(product.id)];
    if (language !== 'ru' || !record || record.original !== product.name) return product;
    return { ...product, name: record.name, description: record.description, ingredients: record.ingredients };
}
