const { User, Product, Order } = require('../models/models');
const ApiError = require('../error/ApiError');
const { idOf, pick, listRecords } = require('./common');
const allowed = ['user_id', 'product_id', 'quantity', 'unit_price', 'status', 'delivery_date', 'delivery_address', 'note'];
const include = [
  { model: User, attributes: ['id', 'full_name', 'email'] },
  { model: Product, attributes: ['id', 'name', 'image_url'] }
];

class OrderController {
  async getAll(req, res) {
    return listRecords(req, res, { model: Order, searchable: ['delivery_address', 'note'], filterable: ['status', 'user_id', 'product_id'], sortable: ['id', 'status', 'quantity', 'unit_price', 'delivery_date', 'created_at'], include });
  }
  async getOne(req, res) {
    const order = await Order.findByPk(idOf(req.params.id), { include });
    if (!order) throw ApiError.notFound('Заказ не найден');
    return res.json(order);
  }
  async exists(req, res) {
    const count = await Order.count({ where: { id: idOf(req.params.id) } });
    return res.json({ exists: count > 0 });
  }
  async create(req, res) {
    const data = pick(req.body, allowed);
    if (!data.user_id || !(await User.findByPk(data.user_id))) throw ApiError.badRequest('Пользователь не найден');
    const product = data.product_id ? await Product.findByPk(data.product_id) : null;
    if (!product) throw ApiError.badRequest('Товар не найден');
    if (!product.is_available) throw ApiError.badRequest('Товар недоступен');
    if (data.unit_price == null) data.unit_price = product.price;
    const order = await Order.create(data);
    return res.status(201).json(await Order.findByPk(order.id, { include }));
  }
  async update(req, res) {
    const order = await Order.findByPk(idOf(req.params.id));
    if (!order) throw ApiError.notFound('Заказ не найден');
    const data = pick(req.body, allowed);
    if (!Object.keys(data).length) throw ApiError.badRequest('Нет полей для изменения');
    if (!(await User.findByPk(data.user_id ?? order.user_id))) throw ApiError.badRequest('Пользователь не найден');
    if (!(await Product.findByPk(data.product_id ?? order.product_id))) throw ApiError.badRequest('Товар не найден');
    await order.update(data);
    return res.json(await Order.findByPk(order.id, { include }));
  }
  async remove(req, res) {
    const order = await Order.findByPk(idOf(req.params.id));
    if (!order) throw ApiError.notFound('Заказ не найден');
    await order.destroy();
    return res.json({ deleted: true, id: order.id });
  }
}
module.exports = new OrderController();
