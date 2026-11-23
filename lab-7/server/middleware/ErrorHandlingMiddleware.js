const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError, DatabaseError } = require('sequelize');
const ApiError = require('../error/ApiError');
module.exports = (error, req, res, next) => {
  if (error instanceof ApiError) return res.status(error.status).json({ message: error.message });
  if (error instanceof UniqueConstraintError) return res.status(409).json({ message: 'Запись с таким уникальным значением уже существует' });
  if (error instanceof ForeignKeyConstraintError) return res.status(409).json({ message: 'Операция нарушает связь между таблицами' });
  if (error instanceof ValidationError) return res.status(400).json({ message: error.errors.map(e => e.message).join('; ') });
  if (error instanceof DatabaseError) { console.error(error); return res.status(400).json({ message: 'Ошибка данных или структуры таблицы' }); }
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) return res.status(400).json({ message: 'Некорректный JSON' });
  console.error(error);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
};
