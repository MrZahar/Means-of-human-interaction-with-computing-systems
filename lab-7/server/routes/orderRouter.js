const router = require('express').Router();
const controller = require('../controllers/orderController');
// Express 4: перевод ошибок из async-контроллеров в middleware.
const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.get('/', asyncRoute(controller.getAll));
router.get('/:id/exists', asyncRoute(controller.exists));
router.get('/:id', asyncRoute(controller.getOne));
router.post('/', asyncRoute(controller.create));
router.put('/:id', asyncRoute(controller.update));
router.delete('/:id', asyncRoute(controller.remove));
module.exports = router;
