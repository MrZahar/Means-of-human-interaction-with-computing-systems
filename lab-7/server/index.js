require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
require('./models/models');
const router = require('./routes');
const handleError = require('./middleware/ErrorHandlingMiddleware');
const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '64kb' }));
app.get('/api/health', async (req, res, next) => {
  try { await sequelize.authenticate(); res.json({ ok: true, database: 'postgresql' }); }
  catch (error) { next(error); }
});
app.use('/api', router);
app.use((req, res, next) => next(new (require('./error/ApiError'))(404, 'Маршрут не найден')));
app.use(handleError);
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // создаёт отсутствующие таблицы; не удаляет данные
    const port = Number(process.env.PORT || 5000);
    app.listen(port, () => console.log(`PERN API: http://localhost:${port}/api/health`));
  } catch (error) {
    console.error('Не удалось подключиться к PostgreSQL:', error.message);
    process.exitCode = 1;
  }
}
if (require.main === module) start();
module.exports = { app, start };
