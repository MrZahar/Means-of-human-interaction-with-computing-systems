require('dotenv').config();
const sequelize = require('./db');
const { Product } = require('./models/models');

const imagesByName = {
  'Superhero Chicken Box': '/images/SuperheroChickenBox.png',
  'Vegetable Rainbow Box': '/images/VegetableRainbowBox.png',
  'Healthy Pasta Lunch': '/images/pasta.png',
  'Turkey Sandwich Set': '/images/sandwich.png',
  'Fresh Fruit Combo': '/images/fruit-lunch.png',
  'Veggie Power Plate': '/images/vegetarian-lunch.png',
  'Five Lunches Plan': '/images/FiveLunchesPlan.png',
  'Three Lunches Plan': '/images/ThreeLunchesPlan.png',
  'Rice and Chicken': '/images/RiceAndChicken.png',
  'Vegetarian Pasta': '/images/VegetarianPasta.png',
  'School Lunch Classic': '/images/lunch.png',
  'Energy Lunch Box': '/images/SuperheroLunch.png',
  'Garden Salad Set': '/images/GardenSaladSet.png',
  'Cheese and Veggie Box': '/images/CheeseVeggieBox.png',
  'Camp Lunch Special': '/images/Lunch2.png'
};
// Обновляем только известные тестовые товары, не трогая свои фотографии других товаров.
async function update() {
  try {
    await sequelize.authenticate();
    const products = await Product.findAll();
    let updated = 0;
    for (const product of products) {
      const path = imagesByName[product.name];
      if (path && product.image_url !== path) {
        await product.update({ image_url: path });
        updated++;
      }
    }
    console.log(`Обновлены фотографии ${updated} товаров из тестового набора (всего сопоставлено ${Object.keys(imagesByName).length}).`);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}
update();
