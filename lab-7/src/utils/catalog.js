// The original card components expect image; Sequelize stores image_url.
export function normalizeCatalogProduct(record) {
    return {
        ...record,
        id: String(record.id),
        image: record.image_url || '/images/SuperheroLunch.png',
        ingredients: record.ingredients || '',
        category: record.category,
        price: Number(record.price)
    };
}
export const categoryLabels = {
    lunch_box: 'lunchBoxes',
    weekly_plan: 'weeklyPlans',
    vegetarian: 'vegetarian'
};
