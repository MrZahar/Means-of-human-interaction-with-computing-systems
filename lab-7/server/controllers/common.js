// Общие служебные функции. CRUD каждой сущности реализован в отдельном контроллере.
const { Op } = require('sequelize');
const ApiError = require('../error/ApiError');

function idOf(raw) {
  if (!/^[1-9]\d*$/.test(String(raw)) || !Number.isSafeInteger(Number(raw))) {
    throw ApiError.badRequest('ID должен быть положительным целым числом');
  }
  return raw;
}
function pick(data, allowed) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw ApiError.badRequest('Ожидается JSON-объект');
  const result = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(data, key)) result[key] = data[key];
  }
  return result;
}
function numericQuery(raw, name, min, max) {
  if (raw === undefined) return null;
  if (!/^[0-9]+$/.test(String(raw))) throw ApiError.badRequest(`Некорректный параметр ${name}`);
  const value = Number(raw);
  if (value < min || value > max) throw ApiError.badRequest(`Параметр ${name} должен быть от ${min} до ${max}`);
  return value;
}
async function listRecords(req, res, { model, searchable, filterable, sortable, include = [] }) {
  const page = numericQuery(req.query.page, 'page', 1, 1000000) ?? 1;
  const limit = numericQuery(req.query.limit, 'limit', 1, 100) ?? 10;
  const sortBy = req.query.sortBy || 'id';
  const sortDir = String(req.query.sortDir || 'asc').toUpperCase();
  if (!sortable.includes(sortBy)) throw ApiError.badRequest('Недопустимое поле сортировки');
  if (!['ASC', 'DESC'].includes(sortDir)) throw ApiError.badRequest('Недопустимое направление сортировки');
  const where = {};
  for (const field of filterable) {
    if (req.query[field] === undefined || req.query[field] === '') continue;
    if (field === 'is_available') {
      if (!['true', 'false'].includes(req.query[field])) throw ApiError.badRequest('is_available должно быть true или false');
      where[field] = req.query[field] === 'true';
    } else where[field] = req.query[field];
  }
  if (req.query.search && String(req.query.search).trim()) {
    const columns = String(req.query.searchFields || searchable.join(',')).split(',').map(x => x.trim()).filter(Boolean);
    if (!columns.length || columns.some(x => !searchable.includes(x))) throw ApiError.badRequest('Недопустимые поля поиска');
    const text = String(req.query.search).trim().slice(0, 120);
    where[Op.or] = columns.map(column => ({ [column]: { [Op.iLike]: `%${text.replace(/[\\%_]/g, char => '\\' + char)}%` } }));
  }
  const { rows, count } = await model.findAndCountAll({
    where, include, order: [[sortBy, sortDir], ['id', 'ASC']], limit, offset: (page - 1) * limit, distinct: true
  });
  return res.json({ items: rows, total: count, page, limit, pages: Math.ceil(count / limit) });
}
module.exports = { idOf, pick, listRecords };
