const { Product, Order } = require('../models/models');
const ApiError = require('../error/ApiError');
const { idOf, pick, listRecords } = require('./common');
const allowed = ['name', 'description', 'category', 'price', 'is_available', 'image_url'];

class ProductController {
  async getAll(req, res) {
    return listRecords(req, res, { model: Product, searchable: ['name', 'description'], filterable: ['category', 'is_available'], sortable: ['id', 'name', 'price', 'category', 'created_at'] });
  }
  async getOne(req, res) {
    const product = await Product.findByPk(idOf(req.params.id));
    if (!product) throw ApiError.notFound('Товар не найден');
    return res.json(product);
  }
  async exists(req, res) {
    const count = await Product.count({ where: { id: idOf(req.params.id) } });
    return res.json({ exists: count > 0 });
  }
  async create(req, res) {
    const product = await Product.create(pick(req.body, allowed));
    return res.status(201).json(product);
  }
  async update(req, res) {
    const product = await Product.findByPk(idOf(req.params.id));
    if (!product) throw ApiError.notFound('Товар не найден');
    const data = pick(req.body, allowed);
    if (!Object.keys(data).length) throw ApiError.badRequest('Нет полей для изменения');
    await product.update(data);
    return res.json(product);
  }
  async remove(req, res) {
    const product = await Product.findByPk(idOf(req.params.id));
    if (!product) throw ApiError.notFound('Товар не найден');
    if (await Order.count({ where: { product_id: product.id } })) throw ApiError.conflict('Нельзя удалить товар, который используется в заказах');
    await product.destroy();
    return res.json({ deleted: true, id: product.id });
  }
}
module.exports = new ProductController();
