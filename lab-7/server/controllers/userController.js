const { User, Order } = require('../models/models');
const ApiError = require('../error/ApiError');
const { idOf, pick, listRecords } = require('./common');
const allowed = ['full_name', 'email', 'phone', 'role', 'avatar_url'];

class UserController {
  async getAll(req, res) {
    return listRecords(req, res, { model: User, searchable: ['full_name', 'email', 'phone'], filterable: ['role'], sortable: ['id', 'full_name', 'email', 'role', 'created_at'] });
  }
  async getOne(req, res) {
    const user = await User.findByPk(idOf(req.params.id));
    if (!user) throw ApiError.notFound('Пользователь не найден');
    return res.json(user);
  }
  async exists(req, res) {
    const count = await User.count({ where: { id: idOf(req.params.id) } });
    return res.json({ exists: count > 0 });
  }
  async create(req, res) {
    const user = await User.create(pick(req.body, allowed));
    return res.status(201).json(user);
  }
  async update(req, res) {
    const user = await User.findByPk(idOf(req.params.id));
    if (!user) throw ApiError.notFound('Пользователь не найден');
    const data = pick(req.body, allowed);
    if (!Object.keys(data).length) throw ApiError.badRequest('Нет полей для изменения');
    await user.update(data);
    return res.json(user);
  }
  async remove(req, res) {
    const user = await User.findByPk(idOf(req.params.id));
    if (!user) throw ApiError.notFound('Пользователь не найден');
    if (await Order.count({ where: { user_id: user.id } })) throw ApiError.conflict('Нельзя удалить пользователя со связанными заказами');
    await user.destroy();
    return res.json({ deleted: true, id: user.id });
  }
}
module.exports = new UserController();
