const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const requiredText = (max) => ({ type: DataTypes.STRING(max), allowNull: false, validate: { notEmpty: true, notNull: true, notBlank(value) { if (!value || !String(value).trim()) throw new Error('Поле не может быть пустым'); } } });
const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  full_name: requiredText(120),
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true, notEmpty: true } },
  phone: { type: DataTypes.STRING(30), allowNull: true },
  role: { type: DataTypes.ENUM('customer', 'manager'), allowNull: false, defaultValue: 'customer' },
  avatar_url: { type: DataTypes.TEXT, allowNull: true, validate: { isUrlOrEmpty(value) { if (value && !/^https?:\/\//i.test(value) && !value.startsWith('/')) throw new Error('Некорректный адрес фотографии'); } } },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { tableName: 'users' });
const Product = sequelize.define('Product', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: requiredText(160),
  description: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
  category: { type: DataTypes.ENUM('lunch_box', 'weekly_plan', 'vegetarian'), allowNull: false },
  price: { type: DataTypes.DOUBLE, allowNull: false, validate: { isFloat: true, min: 0.01 } },
  is_available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  image_url: { type: DataTypes.TEXT, allowNull: true, validate: { isUrlOrEmpty(value) { if (value && !/^https?:\/\//i.test(value) && !value.startsWith('/')) throw new Error('Некорректный адрес фотографии'); } } },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { tableName: 'products' });
const Order = sequelize.define('Order', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  product_id: { type: DataTypes.BIGINT, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, isInt: true } },
  unit_price: { type: DataTypes.DOUBLE, allowNull: false, validate: { isFloat: true, min: 0.01 } },
  status: { type: DataTypes.ENUM('new', 'processing', 'completed', 'cancelled'), allowNull: false, defaultValue: 'new' },
  delivery_date: { type: DataTypes.DATEONLY, allowNull: false, validate: { isDate: true } },
  delivery_address: requiredText(500),
  note: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { tableName: 'orders' });
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'RESTRICT' });
Order.belongsTo(User, { foreignKey: 'user_id' });
Product.hasMany(Order, { foreignKey: 'product_id', onDelete: 'RESTRICT' });
Order.belongsTo(Product, { foreignKey: 'product_id' });
module.exports = { User, Product, Order };
