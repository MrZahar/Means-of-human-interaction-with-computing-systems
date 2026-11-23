require('dotenv').config();
const sequelize = require('./db');
const { User, Product, Order } = require('./models/models');
const categories = ['lunch_box', 'weekly_plan', 'vegetarian'];
const imagePaths = ['/images/SuperheroChickenBox.png', '/images/VegetableRainbowBox.png', '/images/pasta.png', '/images/sandwich.png', '/images/fruit-lunch.png', '/images/vegetarian-lunch.png', '/images/FiveLunchesPlan.png', '/images/ThreeLunchesPlan.png', '/images/RiceAndChicken.png', '/images/VegetarianPasta.png', '/images/lunch.png', '/images/SuperheroLunch.png', '/images/GardenSaladSet.png', '/images/CheeseVeggieBox.png', '/images/Lunch2.png'];
const titles = [
  'Superhero Chicken Box', 'Vegetable Rainbow Box', 'Healthy Pasta Lunch',
  'Turkey Sandwich Set', 'Fresh Fruit Combo', 'Veggie Power Plate',
  'Five Lunches Plan', 'Three Lunches Plan', 'Rice and Chicken',
  'Vegetarian Pasta', 'School Lunch Classic', 'Energy Lunch Box',
  'Garden Salad Set', 'Cheese and Veggie Box', 'Camp Lunch Special'
];
async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    const existing = await Promise.all([User.count(), Product.count(), Order.count()]);
    if (existing.some(Boolean)) {
      console.log('Заполнение пропущено: база уже содержит записи. Существующие данные не удалены.');
      return;
    }
    const users = await User.bulkCreate(Array.from({ length: 15 }, (_, i) => ({
      full_name: `Пользователь ${i + 1}`,
      email: `student${i + 1}@example.com`, phone: `+37529100${String(i + 1).padStart(4, '0')}`,
      role: i % 5 === 0 ? 'manager' : 'customer', avatar_url: `https://i.pravatar.cc/150?img=${i + 1}`
    })), { validate: true });
    const products = await Product.bulkCreate(titles.map((name, i) => ({
      name, description: `Свежий школьный обед №${i + 1}`,
      category: categories[i % 3], price: 8.5 + i * 1.25,
      image_url: imagePaths[i]
    })), { validate: true });
    const orders = [];
    for (let i = 0; i < 25; i++) {
      const product = products[i % products.length];
      orders.push({ user_id: users[i % users.length].id, product_id: product.id,
        quantity: 1 + (i % 4), unit_price: product.price,
        status: ['new', 'processing', 'completed', 'cancelled'][i % 4],
        delivery_date: `2026-12-${String(1 + i % 25).padStart(2,'0')}`,
        delivery_address: `Минск, улица Учебная, ${i + 1}`, note: i % 3 === 0 ? 'Без орехов' : '' });
    }
    await Order.bulkCreate(orders, { validate: true });
    console.log('База заполнена: 15 пользователей + 15 товаров + 25 заказов = 55 записей.');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { await sequelize.close(); }
}
seed();
